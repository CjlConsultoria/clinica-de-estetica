'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  AvatarEmpresa, EmpresaInfo, EmpresaNome, EmpresaEmail, EmptyState,
  FormGrid, SectionLabel,
  WizardSteps, WizardStep, WizardStepLine, WizardStepCircle, WizardStepLabel,
  StepSection, WizardNav,
  DetailSection, DetailSectionTitle, InfoGrid, InfoItem, InfoLabel, InfoValue,
  TabRow, Tab,
  InfoBox, CheckboxRow, CheckboxBox, CheckboxLabel,
} from './styles';

type PlanType      = 'Starter' | 'Profissional' | 'Enterprise';
type StatusEmpresa = 'ativo' | 'suspenso' | 'cancelado' | 'trial';

interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  responsavel: string;
  plano: PlanType;
  valor: number;
  status: StatusEmpresa;
  dataInicio: string;
  vencimento: string;
  usuarios: number;
  observacoes: string;
  adminNome: string;
  adminEmail: string;
}

const EMPRESAS_INICIAL: Empresa[] = [
  { id: 'empresa_a', nome: 'Clínica Estética A', email: 'admin@empresa-a.com',  telefone: '(11) 98765-4321', cnpj: '12.345.678/0001-90', responsavel: 'Admin Empresa A', plano: 'Profissional', valor: 297, status: 'ativo',     dataInicio: '01/03/2024', vencimento: '05/03/2025', usuarios: 8,  observacoes: '',                            adminNome: 'Admin Empresa A',  adminEmail: 'admin@empresa-a.com'  },
  { id: 'empresa_b', nome: 'Clínica Estética B', email: 'admin@empresa-b.com',  telefone: '(21) 97654-3210', cnpj: '23.456.789/0001-01', responsavel: 'Admin Empresa B', plano: 'Starter',      valor: 97,  status: 'suspenso',  dataInicio: '15/06/2024', vencimento: '10/01/2025', usuarios: 3,  observacoes: 'Pagamento em atraso.',        adminNome: 'Admin Empresa B',  adminEmail: 'admin@empresa-b.com'  },
  { id: 'empresa_c', nome: 'Studio Beauty C',    email: 'admin@studio-c.com',   telefone: '(31) 96543-2109', cnpj: '34.567.890/0001-12', responsavel: 'Studio Beauty',   plano: 'Enterprise',   valor: 697, status: 'ativo',     dataInicio: '10/01/2024', vencimento: '01/03/2025', usuarios: 22, observacoes: '',                            adminNome: 'Studio Beauty',    adminEmail: 'admin@studio-c.com'   },
  { id: 'empresa_d', nome: 'Clínica Skin D',     email: 'contato@skin-d.com',   telefone: '(11) 95432-1098', cnpj: '45.678.901/0001-23', responsavel: 'Skin D',          plano: 'Starter',      valor: 97,  status: 'cancelado', dataInicio: '05/08/2024', vencimento: '20/02/2025', usuarios: 2,  observacoes: 'Contrato encerrado a pedido.', adminNome: 'Skin D',           adminEmail: 'contato@skin-d.com'   },
  { id: 'empresa_e', nome: 'Espaço Beleza E',    email: 'fin@espacoe.com',      telefone: '(11) 94321-0987', cnpj: '56.789.012/0001-34', responsavel: 'Espaço Beleza',   plano: 'Profissional', valor: 297, status: 'trial',     dataInicio: '20/11/2024', vencimento: '15/03/2025', usuarios: 6,  observacoes: 'Período de avaliação 30 dias.', adminNome: 'Espaço Beleza',   adminEmail: 'fin@espacoe.com'      },
];

const PLANO_VALOR: Record<PlanType, number> = {
  Starter:      97,
  Profissional: 297,
  Enterprise:   697,
};

const planoOptions = [
  { value: 'Starter',      label: 'Starter — R$ 97/mês'      },
  { value: 'Profissional', label: 'Profissional — R$ 297/mês' },
  { value: 'Enterprise',   label: 'Enterprise — R$ 697/mês'   },
];

const statusOptions = [
  { value: 'ativo',     label: 'Ativo'     },
  { value: 'trial',     label: 'Trial'     },
  { value: 'suspenso',  label: 'Suspenso'  },
  { value: 'cancelado', label: 'Cancelado' },
];

const statusConfig: Record<StatusEmpresa, { label: string; bg: string; color: string }> = {
  ativo:     { label: 'Ativo',     bg: 'rgba(138,117,96,0.12)',  color: '#8a7560' },
  trial:     { label: 'Trial',     bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  suspenso:  { label: 'Suspenso',  bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  cancelado: { label: 'Cancelado', bg: 'rgba(150,150,150,0.12)', color: '#888'    },
};

const planConfig: Record<PlanType, { bg: string; color: string }> = {
  Starter:      { bg: 'rgba(59,130,246,0.10)',  color: '#3b82f6' },
  Profissional: { bg: 'rgba(187,161,136,0.12)', color: '#BBA188' },
  Enterprise:   { bg: 'rgba(124,58,237,0.10)',  color: '#7c3aed' },
};

const avatarColors      = ['#BBA188', '#8a7560', '#a8906f', '#7c3aed', '#3b82f6', '#3ac9a8'];
const filterStatusList  = ['Todos', 'Ativo', 'Trial', 'Suspenso', 'Cancelado'];
const filterPlanosList  = ['Todos', 'Starter', 'Profissional', 'Enterprise'];
const ITEMS_PER_PAGE    = 8;
const STEP_LABELS       = ['Dados da Empresa', 'Admin da Empresa', 'Plano & Acesso', 'Confirmação'];
const TOTAL_STEPS       = 4;

interface EmpresaForm {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  responsavel: string;
  plano: PlanType | '';
  status: StatusEmpresa;
  observacoes: string;
  adminNome: string;
  adminEmail: string;
  adminTelefone: string;
  adminSenha: string;
  adminSenhaConfirm: string;
  enviarConvite: boolean;
}

const FORM_INITIAL: EmpresaForm = {
  nome: '', email: '', telefone: '', cnpj: '', responsavel: '',
  plano: '', status: 'ativo', observacoes: '',
  adminNome: '', adminEmail: '', adminTelefone: '',
  adminSenha: '', adminSenhaConfirm: '', enviarConvite: true,
};

function getInitials(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function hoje() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function vencimento30() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function Empresas() {
  const { isSuperAdmin } = usePermissions();

  const [empresas,        setEmpresas]        = useState<Empresa[]>(EMPRESAS_INICIAL);
  const [search,          setSearch]          = useState('');
  const [filterSt,        setFilterSt]        = useState('Todos');
  const [filterPl,        setFilterPl]        = useState('Todos');
  const [openDrop,        setOpenDrop]        = useState<string | null>(null);
  const [currentPage,     setCurrentPage]     = useState(1);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [isDetailOpen,    setIsDetailOpen]    = useState(false);
  const [isEditing,       setIsEditing]       = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [form,            setForm]            = useState<EmpresaForm>(FORM_INITIAL);
  const [step,            setStep]            = useState(1);
  const [errors,          setErrors]          = useState<Partial<Record<keyof EmpresaForm, string>>>({});
  const [activeTab,       setActiveTab]       = useState<'lista' | 'suspensas'>('lista');

  if (!isSuperAdmin) return <AccessDenied />;

  const totalEmpresas  = empresas.length;
  const ativas         = empresas.filter(e => e.status === 'ativo').length;
  const trials         = empresas.filter(e => e.status === 'trial').length;
  const suspensosCancl = empresas.filter(e => e.status === 'suspenso' || e.status === 'cancelado').length;
  const totalMRR       = empresas
    .filter(e => e.status === 'ativo' || e.status === 'trial')
    .reduce((acc, e) => acc + e.valor, 0);

  const filtered = empresas.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase()) ||
                        e.responsavel.toLowerCase().includes(search.toLowerCase());
    const matchSt = filterSt === 'Todos' || e.status === filterSt.toLowerCase();
    const matchPl = filterPl === 'Todos' || e.plano === filterPl;
    return matchSearch && matchSt && matchPl;
  });

  const totalPages    = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  function handleSearchChange(v: string) { setSearch(v);   setCurrentPage(1); }
  function handleFilterSt(v: string)     { setFilterSt(v); setCurrentPage(1); setOpenDrop(null); }
  function handleFilterPl(v: string)     { setFilterPl(v); setCurrentPage(1); setOpenDrop(null); }
  function clearFilters()                { setFilterSt('Todos'); setFilterPl('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof EmpresaForm, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validateStep1(): boolean {
    const e: Partial<Record<keyof EmpresaForm, string>> = {};
    if (!form.nome.trim())        e.nome        = 'Nome da empresa é obrigatório';
    if (!form.email.trim())       e.email       = 'E-mail é obrigatório';
    if (!form.telefone.trim())    e.telefone    = 'Telefone é obrigatório';
    if (!form.responsavel.trim()) e.responsavel = 'Nome do responsável é obrigatório';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof EmpresaForm, string>> = {};
    if (!form.adminNome.trim())        e.adminNome        = 'Nome do administrador é obrigatório';
    if (!form.adminEmail.trim())       e.adminEmail       = 'E-mail do administrador é obrigatório';
    if (!form.adminSenha.trim())       e.adminSenha       = 'Senha é obrigatória';
    if (form.adminSenha.length > 0 && form.adminSenha.length < 8) e.adminSenha = 'Senha deve ter no mínimo 8 caracteres';
    if (form.adminSenha !== form.adminSenhaConfirm) e.adminSenhaConfirm = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3(): boolean {
    const e: Partial<Record<keyof EmpresaForm, string>> = {};
    if (!form.plano) e.plano = 'Selecione um plano';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  }

  function prevStep() {
    setErrors({});
    setStep(s => Math.max(s - 1, 1));
  }

  function openNew() {
    setIsEditing(false);
    setSelectedEmpresa(null);
    setForm(FORM_INITIAL);
    setErrors({});
    setStep(1);
    setIsModalOpen(true);
  }

  function openEdit(e: Empresa) {
    setIsEditing(true);
    setSelectedEmpresa(e);
    setForm({
      nome: e.nome, email: e.email, telefone: e.telefone,
      cnpj: e.cnpj, responsavel: e.responsavel,
      plano: e.plano, status: e.status, observacoes: e.observacoes,
      adminNome: e.adminNome, adminEmail: e.adminEmail,
      adminTelefone: '', adminSenha: '', adminSenhaConfirm: '', enviarConvite: false,
    });
    setErrors({});
    setStep(1);
    setIsDetailOpen(false);
    setIsModalOpen(true);
  }

  function openDetail(e: Empresa) {
    setSelectedEmpresa(e);
    setIsDetailOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
    setForm(FORM_INITIAL);
    setErrors({});
    setStep(1);
    setIsEditing(false);
    setSelectedEmpresa(null);
  }

  function handleSave() {
    const planoSelecionado = form.plano as PlanType;
    if (isEditing && selectedEmpresa) {
      setEmpresas(prev => prev.map(e =>
        e.id === selectedEmpresa.id
          ? {
              ...e,
              nome: form.nome, email: form.email, telefone: form.telefone,
              cnpj: form.cnpj, responsavel: form.responsavel,
              plano: planoSelecionado, valor: PLANO_VALOR[planoSelecionado],
              status: form.status, observacoes: form.observacoes,
              adminNome: form.adminNome, adminEmail: form.adminEmail,
            }
          : e
      ));
    } else {
      setEmpresas(prev => [...prev, {
        id: `empresa_${Date.now()}`,
        nome: form.nome, email: form.email, telefone: form.telefone,
        cnpj: form.cnpj, responsavel: form.responsavel,
        plano: planoSelecionado, valor: PLANO_VALOR[planoSelecionado],
        status: form.status, dataInicio: hoje(), vencimento: vencimento30(),
        usuarios: 1, observacoes: form.observacoes,
        adminNome: form.adminNome, adminEmail: form.adminEmail,
      }]);
    }
    handleClose();
  }

  function handleSuspender(e: Empresa) {
    setEmpresas(prev => prev.map(emp => emp.id === e.id ? { ...emp, status: 'suspenso' } : emp));
    setIsDetailOpen(false);
  }

  function handleReativar(e: Empresa) {
    setEmpresas(prev => prev.map(emp => emp.id === e.id ? { ...emp, status: 'ativo' } : emp));
    setIsDetailOpen(false);
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <StepSection>
            <SectionLabel>Dados da Empresa</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Nome da Empresa *" placeholder="Ex: Clínica Estética Silva"
                  value={form.nome} onChange={e => handleChange('nome', e.target.value)}
                  maxLength={80} error={errors.nome} />
              </div>
              <Input label="E-mail Corporativo *" type="email" placeholder="contato@empresa.com"
                value={form.email} onChange={e => handleChange('email', e.target.value)}
                error={errors.email} />
              <Input label="Telefone *" mask="telefone" value={form.telefone}
                inputMode="numeric" maxLength={15}
                onValueChange={v => handleChange('telefone', v)} error={errors.telefone} />
              <Input label="CNPJ" mask="cnpj" value={form.cnpj}
                inputMode="numeric" maxLength={18}
                onValueChange={v => handleChange('cnpj', v)} />
              <Input label="Responsável *" placeholder="Nome do responsável pela conta"
                value={form.responsavel} onChange={e => handleChange('responsavel', e.target.value)}
                maxLength={80} error={errors.responsavel} />
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Observações" placeholder="Anotações internas sobre esta empresa..."
                  value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)}
                  maxLength={300} />
              </div>
            </FormGrid>
          </StepSection>
        );

      case 2:
        return (
          <StepSection>
            <SectionLabel>Admin da Empresa</SectionLabel>
            <InfoBox>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Este usuário receberá o perfil <strong>company_admin</strong> e terá acesso total ao painel da empresa.
            </InfoBox>
            <FormGrid>
              <Input label="Nome Completo *" placeholder="Nome do administrador"
                value={form.adminNome} onChange={e => handleChange('adminNome', e.target.value)}
                maxLength={80} error={errors.adminNome} />
              <Input label="E-mail de Acesso *" type="email" placeholder="admin@empresa.com"
                value={form.adminEmail} onChange={e => handleChange('adminEmail', e.target.value)}
                error={errors.adminEmail} />
              <Input label="Telefone" mask="telefone" value={form.adminTelefone}
                inputMode="numeric" maxLength={15}
                onValueChange={v => handleChange('adminTelefone', v)} />
              <div />
              <Input label="Senha Inicial *" type="password" placeholder="Mínimo 8 caracteres"
                value={form.adminSenha} onChange={e => handleChange('adminSenha', e.target.value)}
                error={errors.adminSenha} />
              <Input label="Confirmar Senha *" type="password" placeholder="Repita a senha"
                value={form.adminSenhaConfirm} onChange={e => handleChange('adminSenhaConfirm', e.target.value)}
                error={errors.adminSenhaConfirm} />
              <div style={{ gridColumn: 'span 2' }}>
                <CheckboxRow onClick={() => handleChange('enviarConvite', !form.enviarConvite)}>
                  <CheckboxBox $checked={form.enviarConvite}>
                    {form.enviarConvite && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </CheckboxBox>
                  <CheckboxLabel>Enviar e-mail de convite com as credenciais de acesso</CheckboxLabel>
                </CheckboxRow>
              </div>
            </FormGrid>
          </StepSection>
        );

      case 3:
        return (
          <StepSection>
            <SectionLabel>Plano e Acesso</SectionLabel>
            <FormGrid>
              <Select label="Plano *" options={planoOptions} placeholder="Selecione o plano..."
                value={form.plano} onChange={v => handleChange('plano', v)} error={errors.plano} />
              <Select label="Status Inicial *" options={statusOptions} placeholder="Selecione..."
                value={form.status} onChange={v => handleChange('status', v as StatusEmpresa)} />

              <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {(['Starter', 'Profissional', 'Enterprise'] as PlanType[]).map(p => (
                  <div key={p} onClick={() => handleChange('plano', p)} style={{
                    border: `1.5px solid ${form.plano === p ? '#BBA188' : '#eee'}`,
                    borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                    background: form.plano === p ? 'rgba(187,161,136,0.07)' : 'white',
                    boxShadow: form.plano === p ? '0 0 0 3px rgba(187,161,136,0.15)' : 'none',
                    transition: 'all 0.18s',
                  }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: planConfig[p].color }}>{p}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a', margin: '6px 0 2px' }}>
                      R$ {PLANO_VALOR[p]}<span style={{ fontSize: '0.65rem', color: '#aaa', fontWeight: 400 }}>/mês</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#aaa' }}>
                      {p === 'Starter'      && 'Até 5 usuários'}
                      {p === 'Profissional' && 'Até 15 usuários'}
                      {p === 'Enterprise'   && 'Usuários ilimitados'}
                    </div>
                  </div>
                ))}
              </div>

              {form.status === 'suspenso' && (
                <div style={{ gridColumn: 'span 2', padding: '10px 14px', borderLeft: '3px solid #ca8a04', borderRadius: 8, color: '#ca8a04', fontSize: '0.82rem', background: 'rgba(234,179,8,0.06)' }}>
                  ⚠ Com status <strong>Suspenso</strong>, a empresa não terá acesso ao sistema até ser reativada.
                </div>
              )}
            </FormGrid>
          </StepSection>
        );

      case 4:
        return (
          <StepSection>
            <SectionLabel>Confirmação</SectionLabel>
            <div style={{ background: '#fdf9f5', borderRadius: 14, padding: 20, border: '1px solid #f0ebe4' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                Resumo do {isEditing ? 'cadastro editado' : 'novo cadastro'}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                Empresa
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
                {([
                  ['Empresa',     form.nome],
                  ['E-mail',      form.email],
                  ['Telefone',    form.telefone],
                  ['CNPJ',        form.cnpj || '—'],
                  ['Responsável', form.responsavel],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.68rem', color: '#bbb' }}>{label}</div>
                    <div style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 14, marginBottom: 10 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                  Admin da Empresa
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 8 }}>
                  {([
                    ['Nome',         form.adminNome],
                    ['E-mail admin', form.adminEmail],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: '0.68rem', color: '#bbb' }}>{label}</div>
                      <div style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.82rem', color: form.enviarConvite ? '#3b82f6' : '#aaa', fontWeight: 500 }}>
                  {form.enviarConvite ? '✓ E-mail de convite será enviado' : '✗ E-mail de convite não será enviado'}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 14 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 10 }}>
                  Plano & Acesso
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                  {([
                    ['Plano',  form.plano || '—'],
                    ['Valor',  form.plano ? `R$ ${PLANO_VALOR[form.plano as PlanType]}/mês` : '—'],
                    ['Status', form.status],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: '0.68rem', color: '#bbb' }}>{label}</div>
                      <div style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              {form.observacoes && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f0ebe4' }}>
                  <div style={{ fontSize: '0.68rem', color: '#bbb', marginBottom: 2 }}>Observações</div>
                  <div style={{ fontSize: '0.82rem', color: '#555' }}>{form.observacoes}</div>
                </div>
              )}
            </div>
          </StepSection>
        );

      default: return null;
    }
  }

  const modalFooter = (
    <WizardNav>
      {step > 1
        ? <Button variant="outline" onClick={prevStep}>← Voltar</Button>
        : <Button variant="outline" onClick={handleClose}>Cancelar</Button>
      }
      {step < TOTAL_STEPS
        ? <Button variant="primary" onClick={nextStep}>Continuar →</Button>
        : <Button variant="primary" onClick={handleSave}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Empresa'}</Button>
      }
    </WizardNav>
  );

  return (
    <Container>
      <Header>
        <Title>Empresas</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={openNew}
        >
          Cadastrar Empresa
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Empresas" value={totalEmpresas} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} />
        <StatCard label="Ativas" value={ativas} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Em Trial" value={trials} color="#3b82f6"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="MRR (Receita Mensal)" value={`R$ ${totalMRR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            type="search" placeholder="Buscar empresa, e-mail ou responsável..."
            value={search} onChange={e => handleSearchChange(e.target.value)}
            autoComplete="off"
          />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'status' ? null : 'status')}>
              <span>{filterSt}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'status' && (
              <DropdownList>
                {filterStatusList.map(s => (
                  <DropdownItem key={s} $active={filterSt === s} onClick={() => handleFilterSt(s)}>{s}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'plano' ? null : 'plano')}>
              <span>{filterPl}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'plano' && (
              <DropdownList>
                {filterPlanosList.map(p => (
                  <DropdownItem key={p} $active={filterPl === p} onClick={() => handleFilterPl(p)}>{p}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterSt !== 'Todos' || filterPl !== 'Todos') && (
            <ClearFilterBtn onClick={clearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
        <TableWrapper style={{ flex: 1 }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="22%">Empresa</Th>
                <Th $width="12%">Responsável</Th>
                <Th $width="10%">Plano</Th>
                <Th $width="10%">Valor</Th>
                <Th $width="9%">Usuários</Th>
                <Th $width="10%">Início</Th>
                <Th $width="10%">Vencimento</Th>
                <Th $width="9%">Status</Th>
                <Th $width="8%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <h3>Nenhuma empresa encontrada</h3>
                    <p>Tente ajustar os filtros ou cadastre uma nova empresa</p>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.map((e, i) => {
                const sc = statusConfig[e.status];
                const pc = planConfig[e.plano];
                return (
                  <Tr key={e.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AvatarEmpresa $color={avatarColors[i % avatarColors.length]}>
                          {getInitials(e.nome)}
                        </AvatarEmpresa>
                        <EmpresaInfo>
                          <EmpresaNome>{e.nome}</EmpresaNome>
                          <EmpresaEmail>{e.email}</EmpresaEmail>
                        </EmpresaInfo>
                      </div>
                    </Td>
                    <Td $muted>{e.responsavel}</Td>
                    <Td><Badge $bg={pc.bg} $color={pc.color}>{e.plano}</Badge></Td>
                    <Td $bold style={{ color: '#BBA188' }}>R$ {e.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Td>
                    <Td $center $muted>{e.usuarios}</Td>
                    <Td $muted>{e.dataInicio}</Td>
                    <Td style={{ color: e.status === 'suspenso' ? '#e74c3c' : '#666', fontSize: '0.82rem' }}>{e.vencimento}</Td>
                    <Td><Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge></Td>
                    <Td>
                      <ActionGroup>
                        <IconBtn title="Ver detalhes" onClick={() => openDetail(e)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </IconBtn>
                        <IconBtn title="Editar" onClick={() => openEdit(e)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </IconBtn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        closeOnOverlayClick={false}
        title="Ficha da Empresa"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                onClick={() => selectedEmpresa && openEdit(selectedEmpresa)}
              >
                Editar
              </Button>
              {selectedEmpresa?.status === 'ativo' || selectedEmpresa?.status === 'trial' ? (
                <Button variant="outline" onClick={() => selectedEmpresa && handleSuspender(selectedEmpresa)}
                  style={{ color: '#ca8a04', borderColor: '#ca8a04' }}>
                  Suspender
                </Button>
              ) : selectedEmpresa?.status === 'suspenso' ? (
                <Button variant="outline" onClick={() => selectedEmpresa && handleReativar(selectedEmpresa)}
                  style={{ color: '#8a7560', borderColor: '#8a7560' }}>
                  Reativar
                </Button>
              ) : null}
            </div>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selectedEmpresa && (() => {
          const sc = statusConfig[selectedEmpresa.status];
          const pc = planConfig[selectedEmpresa.plano];
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0ebe4' }}>
                <AvatarEmpresa $color="#BBA188" style={{ width: 52, height: 52, borderRadius: 14, fontSize: '1rem' }}>
                  {getInitials(selectedEmpresa.nome)}
                </AvatarEmpresa>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{selectedEmpresa.nome}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Badge $bg={pc.bg} $color={pc.color}>{selectedEmpresa.plano}</Badge>
                    <Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge>
                    <Badge $bg="#f0ebe4" $color="#8a7560">{selectedEmpresa.usuarios} usuários</Badge>
                    <Badge $bg="#fdf9f5" $color="#BBA188">R$ {selectedEmpresa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</Badge>
                  </div>
                </div>
              </div>

              {selectedEmpresa.observacoes && (
                <div style={{ padding: '10px 14px', borderLeft: '3px solid #BBA188', borderRadius: 8, color: '#8a7560', fontSize: '0.82rem', background: 'rgba(187,161,136,0.06)', marginBottom: 16 }}>
                  <strong>⚠ Obs: </strong>{selectedEmpresa.observacoes}
                </div>
              )}

              <DetailSection>
                <DetailSectionTitle>Dados da Empresa</DetailSectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>E-mail</InfoLabel>
                    <InfoValue>{selectedEmpresa.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Telefone</InfoLabel>
                    <InfoValue>{selectedEmpresa.telefone}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>CNPJ</InfoLabel>
                    <InfoValue>{selectedEmpresa.cnpj || '—'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Responsável</InfoLabel>
                    <InfoValue>{selectedEmpresa.responsavel}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Data de Início</InfoLabel>
                    <InfoValue>{selectedEmpresa.dataInicio}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Próximo Vencimento</InfoLabel>
                    <InfoValue style={{ color: selectedEmpresa.status === 'suspenso' ? '#e74c3c' : '#1a1a1a' }}>
                      {selectedEmpresa.vencimento}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Plano</InfoLabel>
                    <InfoValue><Badge $bg={pc.bg} $color={pc.color}>{selectedEmpresa.plano}</Badge></InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Valor Mensal</InfoLabel>
                    <InfoValue style={{ fontWeight: 700, color: '#BBA188', fontSize: '1.05rem' }}>
                      R$ {selectedEmpresa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Admin da Empresa</DetailSectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Nome</InfoLabel>
                    <InfoValue>{selectedEmpresa.adminNome}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>E-mail de acesso</InfoLabel>
                    <InfoValue>{selectedEmpresa.adminEmail}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </DetailSection>
            </div>
          );
        })()}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        closeOnOverlayClick={false}
        title={isEditing ? 'Editar Empresa' : 'Cadastrar Empresa'}
        size="lg"
        footer={modalFooter}
      >
        <WizardSteps>
          {STEP_LABELS.map((label, idx) => {
            const num     = idx + 1;
            const done    = num < step;
            const current = num === step;
            return (
              <WizardStep key={num}>
                {idx > 0 && <WizardStepLine $done={done || current} />}
                <WizardStepCircle $done={done} $current={current}>
                  {done
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : num
                  }
                </WizardStepCircle>
                <WizardStepLabel $current={current}>{label}</WizardStepLabel>
              </WizardStep>
            );
          })}
        </WizardSteps>
        {renderStep()}
      </Modal>
    </Container>
  );
}