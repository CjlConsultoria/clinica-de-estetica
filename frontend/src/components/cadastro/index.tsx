'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as S from './styles';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

type PlanType = 'Starter' | 'Profissional' | 'Enterprise';

interface CadastroForm {
  nomeEmpresa: string;
  cnpj: string;
  telefoneEmpresa: string;
  nomeResponsavel: string;
  email: string;
  telefoneResponsavel: string;
  senha: string;
  senhaConfirm: string;
  plano: PlanType | '';
  aceitaTermos: boolean;
}

const FORM_INITIAL: CadastroForm = {
  nomeEmpresa: '',
  cnpj: '',
  telefoneEmpresa: '',
  nomeResponsavel: '',
  email: '',
  telefoneResponsavel: '',
  senha: '',
  senhaConfirm: '',
  plano: '',
  aceitaTermos: false,
};

const PLANO_VALOR: Record<PlanType, number> = {
  Starter: 97,
  Profissional: 297,
  Enterprise: 697,
};

const planConfig: Record<PlanType, { color: string; desc: string; popular?: boolean }> = {
  Starter:      { color: '#3b82f6', desc: 'Até 5 usuários' },
  Profissional: { color: '#BBA188', desc: 'Até 15 usuários', popular: true },
  Enterprise:   { color: '#7c3aed', desc: 'Usuários ilimitados' },
};

const STEP_LABELS = ['Empresa', 'Acesso', 'Plano', 'Confirmar'];
const TOTAL_STEPS = 4;

export default function Cadastro() {
  const router = useRouter();
  const [form, setForm] = useState<CadastroForm>(FORM_INITIAL);
  const [firstError, setFirstError] = useState<Partial<Record<keyof CadastroForm, string>>>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showSenhaConfirm, setShowSenhaConfirm] = useState(false);
  const [autoFilled, setAutoFilled] = useState(true);

  function handleChange(field: keyof CadastroForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    setFirstError({});
  }

  function validateStep1(): boolean {
    if (!form.nomeEmpresa.trim()) {
      setFirstError({ nomeEmpresa: 'Nome da empresa é obrigatório' });
      return false;
    }
    if (!form.cnpj.trim() || form.cnpj.replace(/\D/g, '').length < 14) {
      setFirstError({ cnpj: 'CNPJ inválido ou incompleto' });
      return false;
    }
    if (!form.telefoneEmpresa.trim()) {
      setFirstError({ telefoneEmpresa: 'Telefone é obrigatório' });
      return false;
    }
    setFirstError({});
    return true;
  }

  function validateStep2(): boolean {
    if (!form.nomeResponsavel.trim()) {
      setFirstError({ nomeResponsavel: 'Nome é obrigatório' });
      return false;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFirstError({ email: 'E-mail inválido' });
      return false;
    }
    if (!form.senha || form.senha.length < 8) {
      setFirstError({ senha: 'Senha deve ter pelo menos 8 caracteres' });
      return false;
    }
    if (form.senha !== form.senhaConfirm) {
      setFirstError({ senhaConfirm: 'As senhas não coincidem' });
      return false;
    }
    setFirstError({});
    return true;
  }

  function validateStep3(): boolean {
    if (!form.plano) {
      setFirstError({ plano: 'Selecione um plano para continuar' });
      return false;
    }
    setFirstError({});
    return true;
  }

  function validateStep4(): boolean {
    if (!form.aceitaTermos) {
      setFirstError({ aceitaTermos: 'Você precisa aceitar os termos para continuar' });
      return false;
    }
    setFirstError({});
    return true;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setFirstError({});
    setSaveError(null);
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!validateStep4()) return;
    setSaveError(null);
    setLoading(true);

    try {
      await new Promise(res => setTimeout(res, 1800));
      setSuccess(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  function renderStep() {
    if (success) return null;

    switch (step) {
      case 1:
        return (
          <S.StepSection>
            <S.SectionLabel>Dados da Empresa</S.SectionLabel>
            <S.FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <S.InputOverride data-error={!!firstError.nomeEmpresa || undefined}>
                  <Input
                    label="Nome da Empresa *"
                    id="nomeEmpresa"
                    placeholder="Ex: Clínica Estética Silva"
                    value={form.nomeEmpresa}
                    onChange={e => handleChange('nomeEmpresa', e.target.value)}
                    error={firstError.nomeEmpresa}
                    maxLength={80}
                  />
                </S.InputOverride>
              </div>

              <S.InputOverride data-error={!!firstError.cnpj || undefined}>
                <Input
                  label="CNPJ *"
                  id="cnpj"
                  mask="cnpj"
                  value={form.cnpj}
                  onValueChange={v => handleChange('cnpj', v)}
                  error={firstError.cnpj}
                />
              </S.InputOverride>

              <S.InputOverride data-error={!!firstError.telefoneEmpresa || undefined}>
                <Input
                  label="Telefone *"
                  id="telefoneEmpresa"
                  mask="telefone"
                  value={form.telefoneEmpresa}
                  onValueChange={v => handleChange('telefoneEmpresa', v)}
                  error={firstError.telefoneEmpresa}
                />
              </S.InputOverride>
            </S.FormGrid>
          </S.StepSection>
        );

      case 2:
        return (
          <S.StepSection>
            <S.SectionLabel>Dados de Acesso</S.SectionLabel>
            <S.InfoBox>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Estes dados serão usados para acessar o sistema como <strong>administrador</strong> da empresa.</span>
            </S.InfoBox>
            <S.FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <S.InputOverride data-error={!!firstError.nomeResponsavel || undefined}>
                  <Input
                    label="Nome Completo *"
                    id="nomeResponsavel"
                    placeholder="Seu nome completo"
                    value={form.nomeResponsavel}
                    onChange={e => handleChange('nomeResponsavel', e.target.value)}
                    error={firstError.nomeResponsavel}
                    maxLength={80}
                  />
                </S.InputOverride>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <S.InputOverride data-error={!!firstError.email || undefined}>
                  <Input
                    label="E-mail de Acesso *"
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    error={firstError.email}
                    autoComplete="off"
                    readOnly={autoFilled}
                    onFocus={() => setAutoFilled(false)}
                  />
                </S.InputOverride>
              </div>

              <S.InputOverride data-error={!!firstError.senha || undefined}>
                <Input
                  label="Senha *"
                  id="senha"
                  type={showSenha ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.senha}
                  onChange={e => handleChange('senha', e.target.value)}
                  error={firstError.senha}
                  autoComplete="new-password"
                  readOnly={autoFilled}
                  onFocus={() => setAutoFilled(false)}
                  iconRight={
                    <button type="button" onClick={() => setShowSenha(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BBA188', display: 'flex', alignItems: 'center' }}>
                      {showSenha ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </S.InputOverride>

              <S.InputOverride data-error={!!firstError.senhaConfirm || undefined}>
                <Input
                  label="Confirmar Senha *"
                  id="senhaConfirm"
                  type={showSenhaConfirm ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={form.senhaConfirm}
                  onChange={e => handleChange('senhaConfirm', e.target.value)}
                  error={firstError.senhaConfirm}
                  autoComplete="new-password"
                  readOnly={autoFilled}
                  onFocus={() => setAutoFilled(false)}
                  iconRight={
                    <button type="button" onClick={() => setShowSenhaConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BBA188', display: 'flex', alignItems: 'center' }}>
                      {showSenhaConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </S.InputOverride>
            </S.FormGrid>
          </S.StepSection>
        );

      case 3:
        return (
          <S.StepSection>
            <S.SectionLabel>Escolha seu Plano</S.SectionLabel>
            <S.InfoBox>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Todos os planos incluem <strong>5 dias grátis</strong> de avaliação. Nenhuma cobrança antes do período de teste terminar.</span>
            </S.InfoBox>

            <S.PlansGrid>
              {(['Starter', 'Profissional', 'Enterprise'] as PlanType[]).map(p => {
                const cfg = planConfig[p];
                return (
                  <S.PlanCard
                    key={p}
                    $selected={form.plano === p}
                    $color={cfg.color}
                    onClick={() => handleChange('plano', p)}
                  >
                    {cfg.popular && <S.PlanBadge>Popular</S.PlanBadge>}
                    <S.PlanName $color={cfg.color}>{p}</S.PlanName>
                    <S.PlanPrice>
                      R$ {PLANO_VALOR[p]}<span>/mês</span>
                    </S.PlanPrice>
                    <S.PlanDesc>{cfg.desc}</S.PlanDesc>
                  </S.PlanCard>
                );
              })}
            </S.PlansGrid>

            {firstError.plano && (
              <S.FieldErrorText>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {firstError.plano}
              </S.FieldErrorText>
            )}

            <S.WarningBox>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>
                Após os <strong>5 dias de teste</strong>, o plano selecionado será cobrado automaticamente.
                Você pode cancelar a qualquer momento antes do término.
              </span>
            </S.WarningBox>
          </S.StepSection>
        );

      case 4:
        return (
          <S.StepSection>
            <S.SectionLabel>Confirmar Cadastro</S.SectionLabel>
            <S.ResumoBox>
              <S.ResumoSection>
                <S.ResumoSectionTitle>Empresa</S.ResumoSectionTitle>
                <S.ResumoGrid>
                  {([
                    ['Empresa',  form.nomeEmpresa],
                    ['CNPJ',     form.cnpj || '—'],
                    ['Telefone', form.telefoneEmpresa],
                  ] as [string, string][]).map(([l, v]) => (
                    <S.ResumoItem key={l}>
                      <S.ResumoLabel>{l}</S.ResumoLabel>
                      <S.ResumoValue>{v}</S.ResumoValue>
                    </S.ResumoItem>
                  ))}
                </S.ResumoGrid>
              </S.ResumoSection>

              <S.ResumoSection>
                <S.ResumoSectionTitle>Acesso</S.ResumoSectionTitle>
                <S.ResumoGrid>
                  {([
                    ['Nome',   form.nomeResponsavel],
                    ['E-mail', form.email],
                  ] as [string, string][]).map(([l, v]) => (
                    <S.ResumoItem key={l}>
                      <S.ResumoLabel>{l}</S.ResumoLabel>
                      <S.ResumoValue>{v}</S.ResumoValue>
                    </S.ResumoItem>
                  ))}
                </S.ResumoGrid>
              </S.ResumoSection>

              <S.ResumoSection>
                <S.ResumoSectionTitle>Plano & Cobrança</S.ResumoSectionTitle>
                <S.ResumoGrid>
                  <S.ResumoItem>
                    <S.ResumoLabel>Plano</S.ResumoLabel>
                    <S.ResumoValue style={{ color: planConfig[form.plano as PlanType]?.color }}>
                      {form.plano}
                    </S.ResumoValue>
                  </S.ResumoItem>
                  <S.ResumoItem>
                    <S.ResumoLabel>Valor após trial</S.ResumoLabel>
                    <S.ResumoValue style={{ color: '#BBA188' }}>
                      R$ {form.plano ? PLANO_VALOR[form.plano as PlanType].toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '—'}/mês
                    </S.ResumoValue>
                  </S.ResumoItem>
                  <S.ResumoItem>
                    <S.ResumoLabel>Trial gratuito</S.ResumoLabel>
                    <S.ResumoValue style={{ color: '#60a5fa' }}>5 dias</S.ResumoValue>
                  </S.ResumoItem>
                  <S.ResumoItem>
                    <S.ResumoLabel>Cobrança inicia em</S.ResumoLabel>
                    <S.ResumoValue>
                      {(() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 5);
                        return d.toLocaleDateString('pt-BR');
                      })()}
                    </S.ResumoValue>
                  </S.ResumoItem>
                </S.ResumoGrid>
              </S.ResumoSection>
            </S.ResumoBox>

            {/* Checkbox + inline error — sem expansão de layout */}
            <S.TermosArea>
              <S.CheckboxRow onClick={() => handleChange('aceitaTermos', !form.aceitaTermos)}>
                <S.CheckboxBox $checked={form.aceitaTermos}>
                  {form.aceitaTermos && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </S.CheckboxBox>
                <S.CheckboxLabel>
                  Concordo com os <a onClick={e => e.stopPropagation()}>Termos de Uso</a> e{' '}
                  <a onClick={e => e.stopPropagation()}>Política de Privacidade</a>. Estou ciente de que
                  após os 5 dias de teste serei cobrado conforme o plano escolhido.
                </S.CheckboxLabel>
              </S.CheckboxRow>
              {/* Área reservada para o erro — altura fixa evita reflow */}
              <S.TermosErrorSlot>
                {firstError.aceitaTermos && (
                  <S.FieldErrorText>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {firstError.aceitaTermos}
                  </S.FieldErrorText>
                )}
              </S.TermosErrorSlot>
            </S.TermosArea>
          </S.StepSection>
        );

      default:
        return null;
    }
  }

  if (success) {
    return (
      <S.Container>
        <S.LeftPanel>
          <S.PatternOverlay />
          <S.LeftContent>
            <S.LeftTitle>Bem-vindo à Clínica Estética</S.LeftTitle>
            <S.LeftSubtitle>Seu sistema de gestão profissional, pronto para uso.</S.LeftSubtitle>
            <S.TrialBadge>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              5 dias grátis • sem cartão
            </S.TrialBadge>
          </S.LeftContent>
        </S.LeftPanel>

        <S.RightPanel>
          <S.FormWrapper>
            <S.LogoWrapper>
              <S.LogoImg src="/logocjl.png" alt="Logo Clínica" />
            </S.LogoWrapper>
            <S.SuccessWrapper>
              <S.SuccessIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BBA188" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </S.SuccessIcon>
              <S.SuccessTitle>Conta criada com sucesso!</S.SuccessTitle>
              <S.SuccessText>
                Sua conta foi criada para <strong style={{ color: '#BBA188' }}>{form.nomeEmpresa}</strong>.
                Você tem <strong style={{ color: '#60a5fa' }}>5 dias de acesso gratuito</strong> para
                explorar todas as funcionalidades.
              </S.SuccessText>
              <S.SuccessBadge>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Trial ativo · 5 dias restantes
              </S.SuccessBadge>
              <Button variant="primary" fullWidth onClick={() => router.push('/')}>
                Acessar o sistema
              </Button>
              <S.CheckboxLabel style={{ fontSize: '0.76rem', color: '#555', textAlign: 'center' }}>
                Confira seu e-mail <strong style={{ color: '#9ca3af' }}>{form.email}</strong> para confirmar sua conta.
              </S.CheckboxLabel>
            </S.SuccessWrapper>
          </S.FormWrapper>
        </S.RightPanel>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.LeftPanel>
        <S.PatternOverlay />
        <S.LeftContent>
          <S.LeftTitle>Gerencie sua Clínica com elegância</S.LeftTitle>
          <S.LeftSubtitle>
            Agenda, financeiro, equipe e muito mais — tudo em um só lugar,
            feito para clínicas estéticas.
          </S.LeftSubtitle>
          <S.TrialBadge>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            5 dias grátis · sem cartão de crédito
          </S.TrialBadge>
        </S.LeftContent>
      </S.LeftPanel>

      <S.RightPanel>
        <S.FormWrapper>
          <S.LogoWrapper>
            <S.LogoImg src="/logocjl.png" alt="Logo Clínica" />
          </S.LogoWrapper>

          <S.Title>Criar sua conta</S.Title>
          <S.Subtitle>Comece grátis por 5 dias, sem compromisso</S.Subtitle>

          <S.WizardSteps>
            {STEP_LABELS.map((label, idx) => {
              const num     = idx + 1;
              const done    = num < step;
              const current = num === step;
              return (
                <S.WizardStep key={num}>
                  {idx > 0 && <S.WizardStepLine $done={done || current} />}
                  <S.WizardStepCircle $done={done} $current={current}>
                    {done
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : num
                    }
                  </S.WizardStepCircle>
                  <S.WizardStepLabel $current={current}>{label}</S.WizardStepLabel>
                </S.WizardStep>
              );
            })}
          </S.WizardSteps>

          {renderStep()}

          <S.WizardNav>
            {saveError && <S.SaveErrorBox>{saveError}</S.SaveErrorBox>}
            {step > 1
              ? <Button variant="outline" onClick={prevStep} disabled={loading}>Voltar</Button>
              : <Button variant="outline" onClick={() => router.push('/')} disabled={loading}>Cancelar</Button>
            }
            {step < TOTAL_STEPS
              ? <Button variant="primary" onClick={nextStep}>Continuar</Button>
              : (
                <Button variant="primary" loading={loading} onClick={handleSubmit}>
                  {loading ? 'Criando conta...' : 'Criar conta grátis'}
                </Button>
              )
            }
          </S.WizardNav>

          <S.BackToLogin onClick={() => router.push('/')}>
            Já tem uma conta? <span>Entrar</span>
          </S.BackToLogin>
        </S.FormWrapper>
      </S.RightPanel>
    </S.Container>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}