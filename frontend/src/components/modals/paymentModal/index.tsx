'use client';

import { useState, useEffect } from 'react';
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

type PayMethod = 'pix' | 'boleto' | 'credito' | 'debito';
type ModalStep = 'choose' | 'pix' | 'boleto' | 'card' | 'processing' | 'success';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
  `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function maskCard(v: string)   { return v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim(); }
function maskExpiry(v: string) { return v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{1,2})/, '$1/$2'); }
function maskCvv(v: string)    { return v.replace(/\D/g, '').slice(0, 4); }
function maskCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function gerarLinhaDigitavel(_valor: number, venc: string) {
  return ['10490.75434', '73701.280003', '10000.061234', '5', `0001${venc.replace(/\//g, '')}`].join(' ');
}

function gerarPixPayload(empresaNome: string, valor: number) {
  return `00020126580014br.gov.bcb.pix0136sistema-gestao-estetica@pix.com.br5204000053039865406${valor.toFixed(2)}5802BR5920${empresaNome.slice(0, 20).toUpperCase()}6009SAO PAULO62150511${Date.now().toString().slice(-8)}6304ABCD`;
}

// ─── QR Code (visual) ─────────────────────────────────────────────────────────

function QRCodeSVG({ size = 140 }: { size?: number }) {
  const modules: boolean[][] = [];
  const n = 21;
  let seed = 42;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

  for (let r = 0; r < n; r++) {
    modules[r] = [];
    for (let c = 0; c < n; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
        modules[r][c] = (r === 0 || r === 6 || c === 0 || c === 6) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else {
        modules[r][c] = rand() > 0.5;
      }
    }
  }

  const cs = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {modules.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="#1b1b1b" /> : null
        )
      )}
    </svg>
  );
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const methodConfig: Record<PayMethod, { label: string; color: string }> = {
  pix:     { label: 'PIX',               color: '#00a86b' },
  boleto:  { label: 'Boleto Bancário',   color: '#ca8a04' },
  credito: { label: 'Cartão de Crédito', color: '#3b82f6' },
  debito:  { label: 'Cartão de Débito',  color: '#7c3aed' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentModal({ isOpen, fatura, onClose, onSuccess }: PaymentModalProps) {
  const [step,     setStep]     = useState<ModalStep>('choose');
  const [method,   setMethod]   = useState<PayMethod>('pix');
  const [copied,   setCopied]   = useState(false);
  const [pixTime,  setPixTime]  = useState(900);
  const [cardNum,  setCardNum]  = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvv,      setCvv]      = useState('');
  const [cpf,      setCpf]      = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [cardErrs, setCardErrs] = useState<Record<string, string>>({});

  // PIX countdown
  useEffect(() => {
    if (step !== 'pix') return;
    const t = setInterval(() => setPixTime(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('choose'); setMethod('pix'); setCopied(false); setPixTime(900);
        setCardNum(''); setCardName(''); setExpiry(''); setCvv(''); setCpf('');
        setParcelas('1'); setCardErrs({});
      }, 300);
    }
  }, [isOpen]);

  // ── Guard: renderiza null enquanto fechado ou sem fatura ─────────────────────
  if (!isOpen || !fatura) return null;

  // ── const f resolve o ts(18047): o TypeScript perde o narrowing de 'fatura'
  // dentro de funções async porque a prop pode mudar entre renders. Ao copiar
  // para uma const imutável antes de qualquer função, o compilador sabe que
  // 'f' nunca será null neste escopo — inclusive dentro de handleDownloadBoleto.
  const f = fatura as FaturaInfo;

  const pixPayload = gerarPixPayload(f.empresaNome, f.valor);
  const linhaDigit = gerarLinhaDigitavel(f.valor, f.vencimento);
  const pixMinStr  = `${String(Math.floor(pixTime / 60)).padStart(2, '0')}:${String(pixTime % 60).padStart(2, '0')}`;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleProsseguir() {
    if (method === 'pix')    { setStep('pix');    return; }
    if (method === 'boleto') { setStep('boleto'); return; }
    setStep('card');
  }

  function validateCard(): boolean {
    const errs: Record<string, string> = {};
    if (cardNum.replace(/\s/g, '').length < 16) errs.cardNum  = 'Número inválido';
    if (!cardName.trim())                        errs.cardName = 'Nome obrigatório';
    if (expiry.length < 5)                       errs.expiry   = 'Data inválida';
    if (cvv.length < 3)                          errs.cvv      = 'CVV inválido';
    if (cpf.replace(/\D/g, '').length < 11)      errs.cpf      = 'CPF inválido';
    setCardErrs(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCardPay() {
    if (!validateCard()) return;
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  }

  async function handleDownloadBoleto() {
    try {
      const res = await fetch('/api/pagamentos/boleto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId:      f.empresaId,
          empresaNome:    f.empresaNome,
          plano:          f.plano,
          valor:          f.valor,
          competencia:    f.competencia,
          vencimento:     f.vencimento,
          linhaDigitavel: linhaDigit,
        }),
      });

      if (!res.ok) throw new Error('Resposta inválida do servidor');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `boleto-${f.empresaId}-${f.competencia.replace(/\s/g, '-').toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setTimeout(() => setStep('success'), 500);
    } catch {
      alert('Erro ao gerar boleto. Tente novamente.');
    }
  }

  function handleSimulatePix() {
    setStep('processing');
    setTimeout(() => setStep('success'), 1800);
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

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

          {/* ── Step: choose ── */}
          {step === 'choose' && (
            <>
              <StepLabel>Escolha a forma de pagamento</StepLabel>

              <MethodGrid>
                {(['pix', 'boleto', 'credito', 'debito'] as PayMethod[]).map(m => {
                  const cfg      = methodConfig[m];
                  const isActive = method === m;
                  return (
                    <MethodCard key={m} $active={isActive} $color={cfg.color} onClick={() => setMethod(m)}>
                      <MethodIcon $color={cfg.color} $active={isActive}>
                        {m === 'pix' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.9 1.2a.75.75 0 0 1 .2.1L18.5 7a.75.75 0 0 1 0 1.06L12.1 14.5a.75.75 0 0 1-1.06 0L4.67 8.06A.75.75 0 0 1 4.67 7L11.1 1.3a.75.75 0 0 1 .8-.1zM12 2.56L5.73 7.53 12 13.44l6.27-5.9zM11.9 10.7a.75.75 0 0 1 .2.1l6.4 5.7a.75.75 0 0 1 0 1.06l-6.4 5.7a.75.75 0 0 1-1-.06l-6.4-5.7a.75.75 0 0 1 0-1.06l6.4-5.7a.75.75 0 0 1 .8-.04zm.1 1.36L5.73 17.53 12 22.44l6.27-4.91z" />
                          </svg>
                        )}
                        {m === 'boleto' && (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <line x1="6"  y1="8" x2="6"  y2="16" />
                            <line x1="8"  y1="8" x2="8"  y2="16" />
                            <line x1="11" y1="8" x2="11" y2="16" />
                            <line x1="14" y1="8" x2="14" y2="16" />
                            <line x1="16" y1="8" x2="17" y2="16" />
                            <line x1="18" y1="8" x2="18" y2="16" />
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
                  Aprovação instantânea após o pagamento. QR Code válido por 15 minutos.
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
                  Pagamento processado com segurança.{' '}
                  {method === 'credito' ? 'Parcelamento disponível em até 12x.' : 'Débito aprovado em instantes.'}
                </BoletoInfo>
              )}

              <Divider />

              <Button variant="primary" fullWidth onClick={handleProsseguir}>
                Prosseguir com {methodConfig[method].label}
              </Button>
            </>
          )}

          {/* ── Step: pix ── */}
          {step === 'pix' && (
            <QRBox>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                  Escaneie o QR Code
                </div>
                <div style={{ fontSize: '0.74rem', color: '#888' }}>ou copie o código abaixo</div>
              </div>

              <QRFrame>
                <QRCodeSVG size={140} />
              </QRFrame>

              <PixTimer>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Expira em{' '}
                <strong style={{ color: pixTime < 120 ? '#e74c3c' : '#1a1a1a' }}>{pixMinStr}</strong>
              </PixTimer>

              <PixKeyBox>
                <PixKeyText>{pixPayload.slice(0, 80)}...</PixKeyText>
                <CopyBtn $copied={copied} onClick={() => handleCopy(pixPayload)}>
                  {copied ? '✓ Copiado' : 'Copiar'}
                </CopyBtn>
              </PixKeyBox>

              <div style={{ fontSize: '0.74rem', color: '#888', textAlign: 'center', lineHeight: 1.5 }}>
                Após pagar, o acesso é restaurado em até <strong>5 minutos</strong>
              </div>

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')}>Voltar</Button>
                <Button variant="primary" onClick={handleSimulatePix}>Confirmar pagamento</Button>
              </BtnRow>
            </QRBox>
          )}

          {/* ── Step: boleto ── */}
          {step === 'boleto' && (
            <BoletoBox>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                Linha Digitável
              </div>

              <BoletoCodeBox>
                <BoletoCode>{linhaDigit}</BoletoCode>
                <CopyBtn $copied={copied} onClick={() => handleCopy(linhaDigit)} style={{ marginLeft: 10, flexShrink: 0 }}>
                  {copied ? '✓ Copiado' : 'Copiar'}
                </CopyBtn>
              </BoletoCodeBox>

              <div style={{ background: '#fafafa', borderRadius: 12, padding: '14px 16px', border: '1px solid #f0f0f0' }}>
                {[
                  { label: 'Beneficiário', value: 'Sistema de Gestão Estética LTDA' },
                  { label: 'CNPJ',         value: '12.345.678/0001-90'              },
                  { label: 'Sacado',       value: f.empresaNome                     },
                  { label: 'Valor',        value: fmt(f.valor)                      },
                  { label: 'Vencimento',   value: f.vencimento                      },
                  { label: 'Referência',   value: f.competencia                     },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.78rem' }}>
                    <span style={{ color: '#999' }}>{label}</span>
                    <span style={{ color: '#1a1a1a', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <BoletoInfo>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                O boleto pode ser pago em qualquer banco, lotérica ou app. Compensação em até 3 dias úteis.
              </BoletoInfo>

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')}>Voltar</Button>
                <Button variant="primary" onClick={handleDownloadBoleto}>Baixar Boleto</Button>
              </BtnRow>
            </BoletoBox>
          )}

          {/* ── Step: card ── */}
          {step === 'card' && (
            <CardForm>
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <div style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                  background: method === 'credito' ? 'rgba(59,130,246,0.1)' : 'rgba(124,58,237,0.1)',
                  color:      method === 'credito' ? '#3b82f6'               : '#7c3aed',
                }}>
                  {method === 'credito' ? '💳 Crédito' : '💳 Débito'}
                </div>
              </div>

              <div>
                <FieldLabel>Número do Cartão *</FieldLabel>
                <FieldInput
                  placeholder="0000 0000 0000 0000"
                  value={cardNum}
                  onChange={e => setCardNum(maskCard(e.target.value))}
                  maxLength={19}
                  $error={!!cardErrs.cardNum}
                />
                {cardErrs.cardNum && <ErrorMsg>{cardErrs.cardNum}</ErrorMsg>}
              </div>

              <div>
                <FieldLabel>Nome no Cartão *</FieldLabel>
                <FieldInput
                  placeholder="NOME COMPLETO"
                  value={cardName}
                  onChange={e => setCardName(e.target.value.toUpperCase())}
                  $error={!!cardErrs.cardName}
                />
                {cardErrs.cardName && <ErrorMsg>{cardErrs.cardName}</ErrorMsg>}
              </div>

              <FieldRow>
                <div>
                  <FieldLabel>Validade *</FieldLabel>
                  <FieldInput
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={e => setExpiry(maskExpiry(e.target.value))}
                    maxLength={5}
                    $error={!!cardErrs.expiry}
                  />
                  {cardErrs.expiry && <ErrorMsg>{cardErrs.expiry}</ErrorMsg>}
                </div>
                <div>
                  <FieldLabel>CVV *</FieldLabel>
                  <FieldInput
                    placeholder="000"
                    value={cvv}
                    onChange={e => setCvv(maskCvv(e.target.value))}
                    maxLength={4}
                    type="password"
                    $error={!!cardErrs.cvv}
                  />
                  {cardErrs.cvv && <ErrorMsg>{cardErrs.cvv}</ErrorMsg>}
                </div>
              </FieldRow>

              <div>
                <FieldLabel>CPF do Titular *</FieldLabel>
                <FieldInput
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(maskCpf(e.target.value))}
                  maxLength={14}
                  $error={!!cardErrs.cpf}
                />
                {cardErrs.cpf && <ErrorMsg>{cardErrs.cpf}</ErrorMsg>}
              </div>

              {method === 'credito' && (
                <div>
                  <FieldLabel>Parcelas</FieldLabel>
                  <select
                    value={parcelas}
                    onChange={e => setParcelas(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: '0.88rem', outline: 'none', background: '#fff', cursor: 'pointer' }}
                  >
                    {[1, 2, 3, 6, 12].map(n => (
                      <option key={n} value={n}>
                        {n === 1
                          ? `1x de ${fmt(f.valor)} (sem juros)`
                          : `${n}x de ${fmt(f.valor / n)} (sem juros)`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#f7f7f7', borderRadius: 8, fontSize: '0.72rem', color: '#888' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Pagamento criptografado e seguro · SSL 256-bit
              </div>

              <BtnRow>
                <Button variant="outline" onClick={() => setStep('choose')}>Voltar</Button>
                <Button variant="primary" onClick={handleCardPay}>Pagar {fmt(f.valor)}</Button>
              </BtnRow>
            </CardForm>
          )}

          {/* ── Step: processing ── */}
          {step === 'processing' && (
            <CenterBox>
              <Spinner />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Processando pagamento...</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Aguarde, isso leva apenas alguns segundos</div>
            </CenterBox>
          )}

          {/* ── Step: success ── */}
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
                  ? 'Seu boleto foi gerado e baixado. O acesso será restaurado após a compensação (até 3 dias úteis).'
                  : 'Seu pagamento foi confirmado. O acesso ao sistema será restaurado em até 5 minutos.'}
              </div>

              <div style={{ background: '#f7fdf9', border: '1.5px solid rgba(0,168,107,0.2)', borderRadius: 12, padding: '12px 20px', width: '100%', textAlign: 'center' }}>
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