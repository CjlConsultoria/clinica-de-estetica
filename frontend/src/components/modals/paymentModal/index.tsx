'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '@/components/ui/button';
import {
  Overlay, Box, Header, HeaderTitle, HeaderSub, CloseBtn,
  FaturaBar, FaturaValor, FaturaDetalhe, Body,
  MethodGrid, MethodCard, MethodIcon,
  QRBox, QRFrame, PixKeyBox, PixKeyText, CopyBtn, PixTimer,
  BoletoBox, BoletoCodeBox, BoletoCode, BoletoInfo,
  CardForm, FieldLabel, FieldInput, FieldRow, ErrorMsg,
  CenterBox, Spinner, CheckCircle,
  Divider, StepLabel, BtnRow,
} from './styles';

// ─── Stripe ───────────────────────────────────────────────────────────────────

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
);

const STRIPE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('sua_chave');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FaturaInfo {
  empresaId:   string;
  empresaNome: string;
  plano:       string;
  valor:       number;
  competencia: string;
  vencimento:  string;
}

interface PaymentModalProps {
  isOpen:    boolean;
  fatura:    FaturaInfo | null;
  onClose:   () => void;
  onSuccess: (method: string) => void;
}

type PayMethod  = 'pix' | 'boleto' | 'credito' | 'debito';
type ModalStep  =
  | 'choose'
  | 'boletoForm'
  | 'pix'
  | 'boleto'
  | 'card'
  | 'processing'
  | 'success'
  | 'error';

interface BoletoForm { name: string; email: string; cpf: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function maskCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// ─── Stripe CardElement appearance ───────────────────────────────────────────

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '14px',
      color: '#1a1a1a',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#bbb' },
    },
    invalid: { color: '#e74c3c' },
  },
};

// ─── StripeCardForm (must be inside <Elements>) ───────────────────────────────

interface CardFormProps {
  clientSecret: string;
  valor:        number;
  method:       PayMethod;
  onSuccess:    () => void;
  onBack:       () => void;
}

function StripeCardForm({ clientSecret, valor, method, onSuccess, onBack }: CardFormProps) {
  const stripe   = useStripe();
  const elements = useElements();

  const [name,     setName]     = useState('');
  const [cpf,      setCpf]      = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit() {
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError(null);

    const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement, billing_details: { name } } },
    );

    if (stripeErr) {
      setError(stripeErr.message || 'Erro ao processar o cartão');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess();
    } else {
      setError('Pagamento não concluído. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <CardForm>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <div style={{
          padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
          background: method === 'credito' ? 'rgba(59,130,246,0.1)' : 'rgba(124,58,237,0.1)',
          color:      method === 'credito' ? '#3b82f6' : '#7c3aed',
        }}>
          {method === 'credito' ? '💳 Crédito' : '💳 Débito'}
        </div>
      </div>

      <div>
        <FieldLabel>Nome no Cartão *</FieldLabel>
        <FieldInput
          placeholder="NOME COMPLETO"
          value={name}
          onChange={e => setName(e.target.value.toUpperCase())}
        />
      </div>

      <div>
        <FieldLabel>Dados do Cartão *</FieldLabel>
        <div style={{
          border: '1.5px solid #e8e8e8', borderRadius: 10,
          padding: '12px 14px', background: '#fff', transition: 'border-color 0.2s',
        }}>
          <CardElement options={CARD_STYLE} />
        </div>
      </div>

      <FieldRow>
        <div>
          <FieldLabel>CPF do Titular *</FieldLabel>
          <FieldInput
            placeholder="000.000.000-00"
            value={cpf}
            onChange={e => setCpf(maskCpf(e.target.value))}
            maxLength={14}
          />
        </div>
        {method === 'credito' && (
          <div>
            <FieldLabel>Parcelas</FieldLabel>
            <select
              value={parcelas}
              onChange={e => setParcelas(e.target.value)}
              style={{
                width: '100%', padding: '11px 14px',
                border: '1.5px solid #e8e8e8', borderRadius: 10,
                fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer',
              }}
            >
              {[1, 2, 3, 6, 12].map(n => (
                <option key={n} value={n}>
                  {n === 1
                    ? `1x de ${fmt(valor)} (sem juros)`
                    : `${n}x de ${fmt(valor / n)}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </FieldRow>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 12px', background: '#f7f7f7', borderRadius: 8,
        fontSize: '0.72rem', color: '#888',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Pagamento processado com segurança pelo Stripe · SSL 256-bit
      </div>

      <BtnRow>
        <Button variant="outline" onClick={onBack} disabled={loading}>Voltar</Button>
        <Button variant="primary" loading={loading} onClick={handleSubmit}>
          Pagar {fmt(valor)}
        </Button>
      </BtnRow>
    </CardForm>
  );
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const methodConfig: Record<PayMethod, { label: string; color: string }> = {
  pix:     { label: 'PIX',               color: '#00a86b' },
  boleto:  { label: 'Boleto Bancário',   color: '#ca8a04' },
  credito: { label: 'Cartão de Crédito', color: '#3b82f6' },
  debito:  { label: 'Cartão de Débito',  color: '#7c3aed' },
};

// ─── Component principal ──────────────────────────────────────────────────────

export default function PaymentModal({
  isOpen, fatura, onClose, onSuccess,
}: PaymentModalProps) {
  const [step,          setStep]          = useState<ModalStep>('choose');
  const [method,        setMethod]        = useState<PayMethod>('boleto');
  const [clientSecret,  setClientSecret]  = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [intentError,   setIntentError]   = useState<string | null>(null);

  // PIX
  const [pixQrUrl,   setPixQrUrl]   = useState<string | null>(null);
  const [pixPayload, setPixPayload] = useState('');
  const [pixTime,    setPixTime]    = useState(900);
  const [pixCopied,  setPixCopied]  = useState(false);

  // Boleto
  const [boletoForm,       setBoletoForm]       = useState<BoletoForm>({ name: '', email: '', cpf: '' });
  const [boletoNumber,     setBoletoNumber]     = useState('');
  const [boletoVoucherUrl, setBoletoVoucherUrl] = useState<string | null>(null);
  const [boletoCodeCopied, setBoletoCodeCopied] = useState(false);

  // PIX countdown
  useEffect(() => {
    if (step !== 'pix') return;
    setPixTime(900);
    const t = setInterval(() => setPixTime(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('choose'); setMethod('pix');
        setClientSecret(null); setIntentLoading(false); setIntentError(null);
        setPixQrUrl(null); setPixPayload(''); setPixTime(900); setPixCopied(false);
        setBoletoForm({ name: '', email: '', cpf: '' });
        setBoletoNumber(''); setBoletoVoucherUrl(null); setBoletoCodeCopied(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen || !fatura) return null;
  const f = fatura;

  const pixMinStr = `${String(Math.floor(pixTime / 60)).padStart(2, '0')}:${String(pixTime % 60).padStart(2, '0')}`;

  // ── Criar PaymentIntent ────────────────────────────────────────────────────

  async function createPaymentIntent(extra?: Partial<BoletoForm>) {
    setIntentLoading(true);
    setIntentError(null);

    try {
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:        f.valor,
          paymentMethod: method === 'credito' || method === 'debito' ? 'card' : method,
          empresaNome:   f.empresaNome,
          ...extra,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar pagamento');

      setClientSecret(data.clientSecret);

      if (method === 'pix') {
        // Confirma o PIX diretamente via Stripe.js (sem Elements)
        const stripe = await stripePromise;
        if (stripe && data.clientSecret) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (stripe as any).confirmPixPayment(data.clientSecret, {
            payment_method: { pix: {} },
            return_url: window.location.href,
          });
          if (result.error) throw new Error(result.error.message);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const nextAction = result.paymentIntent?.next_action as any;
          const qr = (nextAction?.pix_display_qr_code ?? nextAction?.display_bank_transfer_instructions) as
            { image_url_png?: string; data?: string } | undefined;
          setPixQrUrl(qr?.image_url_png ?? null);
          setPixPayload(qr?.data ?? '');
        }
        setStep('pix');

      } else if (method === 'boleto') {
        setBoletoNumber(data.boletoNumber ?? '');
        setBoletoVoucherUrl(data.boletoVoucherUrl ?? null);
        setStep('boleto');

      } else {
        setStep('card');
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setIntentError(msg);
    } finally {
      setIntentLoading(false);
    }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleProsseguir() {
    if (method === 'boleto') { setStep('boletoForm'); return; }
    createPaymentIntent();
  }

  function handleCopy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2500);
  }

  function handleCardSuccess() {
    setStep('success');
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Overlay onClick={onClose}>
      <Box onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <Header>
          <HeaderTitle>Pagamento de Assinatura</HeaderTitle>
          <HeaderSub>{f.empresaNome} · Plano {f.plano} · {f.competencia}</HeaderSub>

          <FaturaBar>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>
                VALOR A PAGAR
              </div>
              <FaturaValor>{fmt(f.valor)}</FaturaValor>
            </div>
            <FaturaDetalhe>
              <div>Venc. {f.vencimento}</div>
              <div style={{ marginTop: 2 }}>{f.competencia}</div>
            </FaturaDetalhe>
          </FaturaBar>

          <CloseBtn onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </CloseBtn>
        </Header>

        {/* ── Body ── */}
        <Body>

          {/* ── choose ── */}
          {step === 'choose' && (
            <>
              <StepLabel>Escolha a forma de pagamento</StepLabel>

              <MethodGrid>
                {(['boleto', 'credito', 'debito'] as PayMethod[]).map(m => {
                  const cfg = methodConfig[m];
                  return (
                    <MethodCard key={m} $active={method === m} $color={cfg.color} onClick={() => setMethod(m)}>
                      <MethodIcon $color={cfg.color} $active={method === m}>
                        {m === 'pix' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.9 1.2a.75.75 0 0 1 .2.1L18.5 7a.75.75 0 0 1 0 1.06L12.1 14.5a.75.75 0 0 1-1.06 0L4.67 8.06A.75.75 0 0 1 4.67 7L11.1 1.3a.75.75 0 0 1 .8-.1zM12 2.56L5.73 7.53 12 13.44l6.27-5.9zM11.9 10.7a.75.75 0 0 1 .2.1l6.4 5.7a.75.75 0 0 1 0 1.06l-6.4 5.7a.75.75 0 0 1-1-.06l-6.4-5.7a.75.75 0 0 1 0-1.06l6.4-5.7a.75.75 0 0 1 .8-.04zm.1 1.36L5.73 17.53 12 22.44l6.27-4.91z" />
                          </svg>
                        )}
                        {m === 'boleto' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <line x1="6" y1="8" x2="6" y2="16" /><line x1="8" y1="8" x2="8" y2="16" />
                            <line x1="11" y1="8" x2="11" y2="16" /><line x1="14" y1="8" x2="14" y2="16" />
                            <line x1="16" y1="8" x2="17" y2="16" /><line x1="18" y1="8" x2="18" y2="16" />
                          </svg>
                        )}
                        {(m === 'credito' || m === 'debito') && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="1" y="4" width="22" height="16" rx="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        )}
                      </MethodIcon>
                      {cfg.label}
                    </MethodCard>
                  );
                })}
              </MethodGrid>

              {method === 'pix' && (
                <BoletoInfo style={{ background: 'rgba(0,168,107,0.06)', borderColor: 'rgba(0,168,107,0.2)', color: '#076944' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Aprovação instantânea. QR Code válido por 15 minutos.
                  {!STRIPE_CONFIGURED && ' (Stripe não configurado — modo demonstração)'}
                </BoletoInfo>
              )}
              {method === 'boleto' && (
                <BoletoInfo>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Compensação em até 3 dias úteis. O boleto vence em {f.vencimento}.
                </BoletoInfo>
              )}
              {(method === 'credito' || method === 'debito') && (
                <BoletoInfo style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)', color: '#1d4ed8' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Processado com segurança pelo Stripe.{' '}
                  {method === 'credito' ? 'Parcelamento em até 12x.' : 'Débito aprovado em instantes.'}
                </BoletoInfo>
              )}

              {intentError && (
                <div style={{
                  background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                  borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: '#e74c3c', marginTop: 4,
                }}>
                  {intentError}
                </div>
              )}

              <Divider />

              <Button variant="primary" fullWidth loading={intentLoading} onClick={handleProsseguir}>
                Prosseguir com {methodConfig[method].label}
              </Button>
            </>
          )}

          {/* ── Formulário Boleto ── */}
          {step === 'boletoForm' && (
            <BoletoBox>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                Dados para o Boleto
              </div>
              <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: 16 }}>
                Informe seus dados para gerar o boleto bancário.
              </div>

              <div>
                <FieldLabel>Nome completo *</FieldLabel>
                <FieldInput
                  placeholder="Nome do responsável"
                  value={boletoForm.name}
                  onChange={e => setBoletoForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>E-mail *</FieldLabel>
                <FieldInput
                  placeholder="email@empresa.com.br"
                  type="email"
                  value={boletoForm.email}
                  onChange={e => setBoletoForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>CPF *</FieldLabel>
                <FieldInput
                  placeholder="000.000.000-00"
                  value={boletoForm.cpf}
                  maxLength={14}
                  onChange={e => setBoletoForm(p => ({ ...p, cpf: maskCpf(e.target.value) }))}
                />
              </div>

              {intentError && <ErrorMsg>{intentError}</ErrorMsg>}

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')} disabled={intentLoading}>Voltar</Button>
                <Button variant="primary" loading={intentLoading} onClick={() =>
                  createPaymentIntent({
                    name:  boletoForm.name,
                    email: boletoForm.email,
                    cpf:   boletoForm.cpf,
                  })
                }>
                  Gerar Boleto
                </Button>
              </BtnRow>
            </BoletoBox>
          )}

          {/* ── PIX ── */}
          {step === 'pix' && (
            <QRBox>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                  Escaneie o QR Code PIX
                </div>
                <div style={{ fontSize: '0.74rem', color: '#888' }}>ou copie o código abaixo</div>
              </div>

              <QRFrame>
                {pixQrUrl ? (
                  // QR Code real do Stripe
                  <img src={pixQrUrl} alt="QR Code PIX" width={140} height={140} style={{ borderRadius: 6 }} />
                ) : (
                  // Fallback visual quando Stripe não está configurado
                  <div style={{ width: 140, height: 140, background: '#f5f5f5', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a86b" strokeWidth="1.5">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <line x1="14" y1="14" x2="14" y2="14.01" /><line x1="17" y1="14" x2="17" y2="14.01" />
                      <line x1="20" y1="14" x2="20" y2="14.01" /><line x1="14" y1="17" x2="14" y2="17.01" />
                      <line x1="17" y1="17" x2="17" y2="17.01" /><line x1="20" y1="17" x2="20" y2="17.01" />
                      <line x1="14" y1="20" x2="14" y2="20.01" /><line x1="17" y1="20" x2="17" y2="20.01" />
                      <line x1="20" y1="20" x2="20" y2="20.01" />
                    </svg>
                    <div style={{ fontSize: '0.68rem', color: '#aaa', textAlign: 'center', padding: '0 8px' }}>
                      Configure o Stripe para gerar QR Code real
                    </div>
                  </div>
                )}
              </QRFrame>

              <PixTimer>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Expira em <strong style={{ color: pixTime < 120 ? '#e74c3c' : '#1a1a1a', marginLeft: 3 }}>{pixMinStr}</strong>
              </PixTimer>

              {pixPayload && (
                <PixKeyBox>
                  <PixKeyText>{pixPayload.slice(0, 80)}...</PixKeyText>
                  <CopyBtn $copied={pixCopied} onClick={() => handleCopy(pixPayload, setPixCopied)}>
                    {pixCopied ? '✓ Copiado' : 'Copiar'}
                  </CopyBtn>
                </PixKeyBox>
              )}

              <div style={{ fontSize: '0.74rem', color: '#888', textAlign: 'center', lineHeight: 1.5 }}>
                Após pagar, o acesso é restaurado em até <strong>5 minutos</strong>
              </div>

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')}>Voltar</Button>
                <Button variant="primary" onClick={() => setStep('success')}>Já paguei</Button>
              </BtnRow>
            </QRBox>
          )}

          {/* ── Boleto ── */}
          {step === 'boleto' && (
            <BoletoBox>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                Boleto Gerado
              </div>

              {boletoNumber && (
                <BoletoCodeBox>
                  <BoletoCode>{boletoNumber}</BoletoCode>
                  <CopyBtn
                    $copied={boletoCodeCopied}
                    onClick={() => handleCopy(boletoNumber, setBoletoCodeCopied)}
                    style={{ marginLeft: 10, flexShrink: 0 }}
                  >
                    {boletoCodeCopied ? '✓ Copiado' : 'Copiar'}
                  </CopyBtn>
                </BoletoCodeBox>
              )}

              <div style={{ background: '#fafafa', borderRadius: 12, padding: '14px 16px', border: '1px solid #f0f0f0' }}>
                {[
                  { label: 'Empresa',     value: f.empresaNome     },
                  { label: 'Plano',       value: f.plano           },
                  { label: 'Valor',       value: fmt(f.valor)      },
                  { label: 'Vencimento',  value: f.vencimento      },
                  { label: 'Referência',  value: f.competencia     },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.78rem',
                  }}>
                    <span style={{ color: '#999' }}>{label}</span>
                    <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <BoletoInfo>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Pague em qualquer banco, lotérica ou app. Compensação em até 3 dias úteis.
              </BoletoInfo>

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')}>Voltar</Button>
                {boletoVoucherUrl ? (
                  <Button variant="primary" onClick={() => { window.open(boletoVoucherUrl, '_blank'); setStep('success'); }}>
                    Baixar Boleto
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => setStep('success')}>Concluir</Button>
                )}
              </BtnRow>
            </BoletoBox>
          )}

          {/* ── Card (Stripe Elements) ── */}
          {step === 'card' && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary:     '#BBA188',
                    colorBackground:  '#ffffff',
                    colorText:        '#1a1a1a',
                    colorDanger:      '#e74c3c',
                    fontFamily:       'Inter, system-ui, sans-serif',
                    borderRadius:     '10px',
                  },
                },
              }}
            >
              <StripeCardForm
                clientSecret={clientSecret}
                valor={f.valor}
                method={method}
                onSuccess={handleCardSuccess}
                onBack={() => setStep('choose')}
              />
            </Elements>
          )}

          {/* ── Processing ── */}
          {step === 'processing' && (
            <CenterBox>
              <Spinner />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Processando pagamento...</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Aguarde alguns segundos</div>
            </CenterBox>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <CenterBox>
              <CheckCircle>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </CheckCircle>

              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1a1a1a' }}>Pagamento realizado!</div>

              <div style={{ fontSize: '0.82rem', color: '#888', lineHeight: 1.6, maxWidth: 320 }}>
                {method === 'boleto'
                  ? 'Seu boleto foi gerado. O acesso será restaurado após a compensação (até 3 dias úteis).'
                  : method === 'pix'
                    ? 'PIX confirmado. O acesso ao sistema será restaurado em até 5 minutos.'
                    : 'Seu pagamento foi confirmado via Stripe. O acesso será restaurado em instantes.'}
              </div>

              <div style={{
                background: '#f7fdf9', border: '1.5px solid rgba(0,168,107,0.2)',
                borderRadius: 12, padding: '12px 20px', width: '100%', textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 4 }}>VALOR PAGO</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00a86b' }}>{fmt(f.valor)}</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: 2 }}>{f.empresaNome} · {f.competencia}</div>
              </div>

              <Button variant="primary" fullWidth onClick={() => { onSuccess(method); onClose(); }}>
                Concluir
              </Button>
            </CenterBox>
          )}

        </Body>
      </Box>
    </Overlay>
  );
}
