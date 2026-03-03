'use client';

import { useState, useEffect } from 'react';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { buscarPerfil } from '@/services/profissionalService';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import {
  Container, Header, Title, RoleBadge, Layout,
  SideNav, SideNavSection, SideNavDivider, SideNavItem, NavLabel,
  Content, SectionHeader, SectionTitle, SectionDesc, SectionBadge,
  FormGrid, SubTitle, FieldWrapper, Label, InputField, SelectField, ErrorMsg,
  Btn, IconBtn,
  StatsGrid, StatCard, StatLabel, StatValue,
  AvatarSection, AvatarCircle, ColorPickerRow, ColorDot,
  ToggleGroup, ToggleRow, ToggleTrack, ToggleKnob,
  TableWrapper, Table, Thead, Th, Tr, Td, Pill, ActionGroup,
  InfoBox, DangerZone, DangerTitle, DangerItem, DangerText,
  PermMatrix, PermGroup, PermGroupTitle, PermGrid, PermItem, PermCheck,
  ActivityList, ActivityItem, ActivityDot,
  SaveRow, Overlay, ModalBox, ModalHeader, ModalTitle, ModalBody, ModalFooter,
  Toast, ToastDot,
} from './styles';

const Icons = {
  Overview: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Clinic: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Plans: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Anvisa: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Commission: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  Audit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Camera: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
};

const accentColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#8a7560', '#c9a882', '#e74c3c'];

type NotifKey = 'agendamento' | 'reaplicacao' | 'estoqueBaixo' | 'validade' | 'comissao' | 'relatorio' | 'novaTenant' | 'faturamento';

type Clinic = { id: number; name: string; cnpj: string; plan: string; status: string; users: number; lastAccess: string; };

const INITIAL_CLINICS: Clinic[] = [
  { id: 1, name: 'Clínica Bella Vita',   cnpj: '12.345.678/0001-99', plan: 'Pro',        status: 'ativo',    users: 8,  lastAccess: '20/02/2025' },
  { id: 2, name: 'Studio Ana Rodrigues', cnpj: '98.765.432/0001-11', plan: 'Starter',    status: 'ativo',    users: 3,  lastAccess: '19/02/2025' },
  { id: 3, name: 'Clínica Derma Saúde',  cnpj: '55.123.456/0001-33', plan: 'Enterprise', status: 'ativo',    users: 22, lastAccess: '20/02/2025' },
  { id: 4, name: 'Instituto Skin Care',  cnpj: '77.890.123/0001-55', plan: 'Pro',        status: 'suspenso', users: 6,  lastAccess: '05/01/2025' },
];

const CARGO_PERMS: Record<string, string[]> = {
  'Técnico':         ['Agenda própria', 'Pacientes próprios', 'Prontuário próprio', 'Fotos', 'Consentimentos'],
  'Recepcionista':   ['Agenda geral', 'Pacientes', 'Agendamentos', 'Dashboard'],
  'Financeiro':      ['Financeiro', 'Relatórios financeiros', 'Comissões'],
  'Gerente / Admin': ['Dashboard completo', 'Todos os módulos', 'Equipe', 'Relatórios', 'Configurações'],
};

const LOG_COLORS: Record<number, string> = {
  1: '#BBA188', 2: '#8a7560', 3: '#3a7dc9', 4: '#c9a03a', 5: '#e74c3c',
};

const navSections = [
  { section: 'Plataforma', items: [
    { id: 'plataforma', label: 'Visão Geral',          Icon: Icons.Overview   },
    { id: 'clinicas',   label: 'Clínicas / Tenants',   Icon: Icons.Clinic     },
    { id: 'planos',     label: 'Planos & Faturamento',  Icon: Icons.Plans      },
  ]},
  { section: 'Sistema', items: [
    { id: 'perfil',       label: 'Minha Conta',          Icon: Icons.User       },
    { id: 'notificacoes', label: 'Notificações',          Icon: Icons.Bell       },
    { id: 'anvisa',       label: 'Configurações ANVISA',  Icon: Icons.Anvisa     },
    { id: 'comissoes',    label: 'Regras de Comissão',    Icon: Icons.Commission },
  ]},
  { section: 'Segurança', items: [
    { id: 'permissoes', label: 'Permissões de Cargo', Icon: Icons.Shield },
    { id: 'auditoria',  label: 'Auditoria & Logs',    Icon: Icons.Audit  },
    { id: 'seguranca',  label: 'Segurança',            Icon: Icons.Lock   },
  ]},
];

function Field({ label, type = 'text', placeholder = '', defaultValue = '', value, onChange, error, disabled }: any) {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <InputField
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        $error={!!error}
        disabled={disabled}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </FieldWrapper>
  );
}

function SField({ label, options, value, onChange }: any) {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <SelectField value={value} onChange={(e: any) => onChange?.(e.target.value)}>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </SelectField>
    </FieldWrapper>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <ToggleTrack $on={on} onClick={onToggle}>
      <ToggleKnob $on={on} />
    </ToggleTrack>
  );
}

function Modal({ open, title, children, onClose, footer }: any) {
  if (!open) return null;
  return (
    <Overlay $open={open} onClick={(e: any) => e.target === e.currentTarget && onClose()}>
      <ModalBox>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <IconBtn onClick={onClose}><Icons.X /></IconBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </Overlay>
  );
}

export default function Configuracoes() {
  const allowed = useRoleRedirect({ permission: 'configuracoes.read' });

  // ── Todos os hooks ANTES de qualquer return condicional ──────────────────────

  const [active,      setActive]      = useState('plataforma');
  const [accentColor, setAccentColor] = useState('#BBA188');
  const [toast,       setToast]       = useState('');
  const [toastShow,   setToastShow]   = useState(false);

  const [clinics,        setClinics]        = useState<Clinic[]>(INITIAL_CLINICS);
  const [showNewClinic,  setShowNewClinic]  = useState(false);
  const [showEditClinic, setShowEditClinic] = useState(false);
  const [editClinic,     setEditClinic]     = useState<Clinic | null>(null);
  const [newClinic,      setNewClinic]      = useState({ name: '', cnpj: '', plan: 'Starter' });
  const [clinicErrors,   setClinicErrors]   = useState<Record<string, string>>({});

  const [perms, setPerms] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(Object.entries(CARGO_PERMS).map(([k, v]) => [k, [...v]]))
  );

  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    agendamento: true, reaplicacao: true, estoqueBaixo: true,
    validade: true,    comissao: false,   relatorio: false,
    novaTenant: true,  faturamento: true,
  });

  const [anvisaToggles, setAnvisaToggles] = useState({ lote: true, bloqueio: true, relatorio: false });

  const [secToggles, setSecToggles] = useState({ twoFa: false, timeout: true, alertLogin: true, audit: true, twoFaAdmin: false });

  const [editPlan,     setEditPlan]     = useState<{ name: string; price: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ title: string; msg: string; onConfirm: () => void } | null>(null);
  const [cancelModal,  setCancelModal]  = useState(false);
  const [sucessModal,  setSucessModal]  = useState<{ title: string; message: string } | null>(null);

  const [perfil,       setPerfil]       = useState({ nome: 'Super Administrador', email: 'super.admin@aestheticos.com.br', telefone: '(11) 99999-0000', senha: '', senhaConfirm: '' });
  const [perfilErrors, setPerfilErrors] = useState<Record<string, string>>({});

  const [platform,     setPlatform]     = useState({ nome: 'AestheticOS', dominio: 'app.aestheticos.com.br', email: 'suporte@aestheticos.com.br', telefone: '(11) 99999-0000' });
  const [comissao,     setComissao]     = useState({ botox: '20', preenchimento: '20', bioestimulador: '15', fio: '18', skincare: '25', outros: '20', base: 'bruto', periodicidade: 'mensal' });

  const [isDirty,    setIsDirty]    = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const [platformSnapshot,     setPlatformSnapshot]     = useState({ nome: 'AestheticOS', dominio: 'app.aestheticos.com.br', email: 'suporte@aestheticos.com.br', telefone: '(11) 99999-0000' });
  const [accentColorSnapshot,  setAccentColorSnapshot]  = useState('#BBA188');
  const [perfilSnapshot,       setPerfilSnapshot]       = useState({ nome: 'Super Administrador', email: 'super.admin@aestheticos.com.br', telefone: '(11) 99999-0000', senha: '', senhaConfirm: '' });
  const [notifsSnapshot,       setNotifsSnapshot]       = useState<Record<NotifKey, boolean>>({ agendamento: true, reaplicacao: true, estoqueBaixo: true, validade: true, comissao: false, relatorio: false, novaTenant: true, faturamento: true });
  const [anvisaSnapshot,       setAnvisaSnapshot]       = useState({ lote: true, bloqueio: true, relatorio: false });
  const [comissaoSnapshot,     setComissaoSnapshot]     = useState({ botox: '20', preenchimento: '20', bioestimulador: '15', fio: '18', skincare: '25', outros: '20', base: 'bruto', periodicidade: 'mensal' });
  const [permsSnapshot,        setPermsSnapshot]        = useState<Record<string, string[]>>(() => Object.fromEntries(Object.entries(CARGO_PERMS).map(([k, v]) => [k, [...v]])));
  const [secSnapshot,          setSecSnapshot]          = useState({ twoFa: false, timeout: true, alertLogin: true, audit: true, twoFaAdmin: false });

  useEffect(() => {
    buscarPerfil().then(u => {
      setPerfil(prev => ({ ...prev, nome: u.nome || prev.nome, email: u.email || prev.email, telefone: u.telefone || prev.telefone }));
      setPerfilSnapshot(prev => ({ ...prev, nome: u.nome || prev.nome, email: u.email || prev.email, telefone: u.telefone || prev.telefone }));
    }).catch(() => {});
  }, []);

  // ── Guard condicional APÓS todos os hooks ────────────────────────────────────
  if (!allowed) return null;

  // ── Funções ──────────────────────────────────────────────────────────────────

  function showToast(msg: string) {
    setToast(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 2800);
  }

  function handleNavClick(id: string) {
    if (isDirty) {
      setPendingNav(id);
      setCancelModal(true);
    } else {
      setActive(id);
    }
  }

  function restoreSnapshot() {
    setPlatform({ ...platformSnapshot });
    setAccentColor(accentColorSnapshot);
    setPerfil({ ...perfilSnapshot });
    setNotifs({ ...notifsSnapshot });
    setAnvisaToggles({ ...anvisaSnapshot });
    setComissao({ ...comissaoSnapshot });
    setPerms(Object.fromEntries(Object.entries(permsSnapshot).map(([k, v]) => [k, [...v]])));
    setSecToggles({ ...secSnapshot });
  }

  function commitSnapshot() {
    setPlatformSnapshot({ ...platform });
    setAccentColorSnapshot(accentColor);
    setPerfilSnapshot({ ...perfil });
    setNotifsSnapshot({ ...notifs });
    setAnvisaSnapshot({ ...anvisaToggles });
    setComissaoSnapshot({ ...comissao });
    setPermsSnapshot(Object.fromEntries(Object.entries(perms).map(([k, v]) => [k, [...v]])));
    setSecSnapshot({ ...secToggles });
  }

  function handleCancelConfirm() {
    restoreSnapshot();
    setIsDirty(false);
    setCancelModal(false);
    if (pendingNav) {
      setActive(pendingNav);
      setPendingNav(null);
    }
  }

  function requestSave(title: string, message: string, onConfirm: () => void) {
    setConfirmModal({ title: 'Salvar alterações?', msg: 'Deseja confirmar e salvar todas as alterações realizadas?', onConfirm: () => { setConfirmModal(null); onConfirm(); commitSnapshot(); setIsDirty(false); setSucessModal({ title, message }); } });
  }

  function validateNewClinic() {
    const e: Record<string, string> = {};
    if (!newClinic.name.trim()) e.name = 'Nome é obrigatório';
    if (!newClinic.cnpj.trim()) e.cnpj = 'CNPJ é obrigatório';
    setClinicErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddClinic() {
    if (!validateNewClinic()) return;
    setClinics(prev => [...prev, { id: Date.now(), ...newClinic, status: 'ativo', users: 0, lastAccess: '—' }]);
    setNewClinic({ name: '', cnpj: '', plan: 'Starter' });
    setShowNewClinic(false);
    setSucessModal({ title: 'Clínica cadastrada!', message: 'A nova clínica foi cadastrada com sucesso na plataforma.' });
  }

  function handleEditClinicSave() {
    if (!editClinic) return;
    setClinics(prev => prev.map(c => c.id === editClinic.id ? editClinic : c));
    setShowEditClinic(false);
    setSucessModal({ title: 'Clínica atualizada!', message: 'As informações da clínica foram salvas com sucesso.' });
  }

  function handleToggleStatus(c: Clinic) {
    setClinics(prev => prev.map(p => p.id === c.id ? { ...p, status: p.status === 'ativo' ? 'suspenso' : 'ativo' } : p));
    showToast(c.status === 'ativo' ? 'Clínica suspensa.' : 'Clínica reativada!');
  }

  function handleSavePerfil() {
    const e: Record<string, string> = {};
    if (!perfil.nome.trim()) e.nome = 'Nome obrigatório';
    if (!perfil.email.trim()) e.email = 'E-mail obrigatório';
    if (perfil.senha && perfil.senha !== perfil.senhaConfirm) e.senhaConfirm = 'Senhas não coincidem';
    setPerfilErrors(e);
    if (Object.keys(e).length > 0) return;
    requestSave('Conta atualizada!', 'Suas informações de perfil foram salvas com sucesso.', () => {});
  }

  return (
    <Container>
      <Header>
        <Title>Configurações</Title>
        <RoleBadge>Super Admin</RoleBadge>
      </Header>

      <Layout>
        <SideNav>
          {navSections.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <SideNavDivider />}
              <SideNavSection>{group.section}</SideNavSection>
              {group.items.map(({ id, label, Icon }) => (
                <SideNavItem key={id} $active={active === id} onClick={() => handleNavClick(id)}>
                  <Icon />
                  <NavLabel>{label}</NavLabel>
                </SideNavItem>
              ))}
            </div>
          ))}
        </SideNav>

        <Content>
          {active === 'plataforma' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Visão Geral da Plataforma</SectionTitle>
                  <SectionDesc>Status geral do sistema multi-tenant e configurações globais.</SectionDesc>
                </div>
                <SectionBadge>Ao vivo</SectionBadge>
              </SectionHeader>

              <StatsGrid>
                <StatCard $color="#BBA188"><StatLabel>Clínicas Ativas</StatLabel><StatValue>{clinics.filter(c => c.status === 'ativo').length}</StatValue></StatCard>
                <StatCard $color="#8a7560"><StatLabel>Usuários Totais</StatLabel><StatValue>{clinics.reduce((a, c) => a + c.users, 0)}</StatValue></StatCard>
                <StatCard $color="#a8906f"><StatLabel>Planos Pro+</StatLabel><StatValue>{clinics.filter(c => c.plan !== 'Starter').length}</StatValue></StatCard>
                <StatCard $color="#e74c3c"><StatLabel>Suspensos</StatLabel><StatValue>{clinics.filter(c => c.status === 'suspenso').length}</StatValue></StatCard>
              </StatsGrid>

              <SubTitle>Configurações Globais do Sistema</SubTitle>
              <FormGrid style={{ marginTop: 16 }}>
                <Field label="Nome da Plataforma"  value={platform.nome}     onChange={(e: any) => { setPlatform(p => ({ ...p, nome: e.target.value })); setIsDirty(true); }} />
                <Field label="Domínio Principal"   value={platform.dominio}  onChange={(e: any) => { setPlatform(p => ({ ...p, dominio: e.target.value })); setIsDirty(true); }} />
                <Field label="E-mail de Suporte"   type="email" value={platform.email} onChange={(e: any) => { setPlatform(p => ({ ...p, email: e.target.value })); setIsDirty(true); }} />
                <Field label="Telefone de Suporte" value={platform.telefone} onChange={(e: any) => { setPlatform(p => ({ ...p, telefone: e.target.value })); setIsDirty(true); }} />
              </FormGrid>

              <div style={{ marginTop: 20, padding: '16px 18px', background: '#fafafa', borderRadius: 12, border: '1px solid #f0ebe4' }}>
                <Label>Cor de Destaque Global da Plataforma</Label>
                <ColorPickerRow>
                  {accentColors.map(c => (
                    <ColorDot key={c} $color={c} $selected={accentColor === c} onClick={() => { setAccentColor(c); setIsDirty(true); }} />
                  ))}
                </ColorPickerRow>
              </div>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Configurações salvas!', 'As configurações globais da plataforma foram atualizadas.', () => {})}>Salvar Configurações</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'clinicas' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Clínicas / Tenants</SectionTitle>
                  <SectionDesc>Gerencie todas as clínicas cadastradas na plataforma.</SectionDesc>
                </div>
                <Btn $variant="primary" $size="sm" onClick={() => { setNewClinic({ name: '', cnpj: '', plan: 'Starter' }); setClinicErrors({}); setShowNewClinic(true); }}>
                  <Icons.Plus /> Nova Clínica
                </Btn>
              </SectionHeader>

              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th $w="26%">Clínica</Th>
                      <Th $w="20%">CNPJ</Th>
                      <Th $w="12%">Plano</Th>
                      <Th $w="9%">Usuários</Th>
                      <Th $w="13%">Último Acesso</Th>
                      <Th $w="10%">Status</Th>
                      <Th $w="10%">Ações</Th>
                    </tr>
                  </Thead>
                  <tbody>
                    {clinics.map(c => (
                      <Tr key={c.id}>
                        <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.name}</Td>
                        <Td style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.73rem' }}>{c.cnpj}</Td>
                        <Td>
                          <Pill
                            $bg={c.plan === 'Enterprise' ? '#1b1b1b' : c.plan === 'Pro' ? 'rgba(187,161,136,0.14)' : '#f5f5f5'}
                            $color={c.plan === 'Enterprise' ? '#EBD5B0' : c.plan === 'Pro' ? '#8a7560' : '#888'}
                          >{c.plan}</Pill>
                        </Td>
                        <Td style={{ textAlign: 'center', fontWeight: 600 }}>{c.users}</Td>
                        <Td style={{ color: '#aaa', fontSize: '0.75rem' }}>{c.lastAccess}</Td>
                        <Td>
                          <Pill
                            $bg={c.status === 'ativo' ? 'rgba(138,117,96,0.12)' : 'rgba(231,76,60,0.1)'}
                            $color={c.status === 'ativo' ? '#8a7560' : '#e74c3c'}
                          >{c.status === 'ativo' ? 'Ativo' : 'Suspenso'}</Pill>
                        </Td>
                        <Td>
                          <ActionGroup>
                            <IconBtn title="Editar" onClick={() => { setEditClinic({ ...c }); setShowEditClinic(true); }}>
                              <Icons.Edit />
                            </IconBtn>
                            <IconBtn title={c.status === 'ativo' ? 'Suspender' : 'Reativar'} onClick={() => handleToggleStatus(c)} style={{ color: c.status === 'ativo' ? '#e74c3c' : '#8a7560' }}>
                              <Icons.Lock />
                            </IconBtn>
                          </ActionGroup>
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </div>
          )}

          {active === 'planos' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Planos & Faturamento</SectionTitle>
                  <SectionDesc>Configure os planos disponíveis para as clínicas da plataforma.</SectionDesc>
                </div>
              </SectionHeader>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { name: 'Starter',    price: 'R$ 149', users: '3 usuários',  modules: 'Módulos básicos',  highlight: false },
                  { name: 'Pro',        price: 'R$ 349', users: '10 usuários', modules: 'Todos os módulos', highlight: true  },
                  { name: 'Enterprise', price: 'R$ 749', users: 'Ilimitado',   modules: 'Módulos + API',    highlight: false },
                ].map(plan => (
                  <div key={plan.name} style={{
                    border: plan.highlight ? '2px solid #BBA188' : '1.5px solid #f0ebe4',
                    borderRadius: 14, padding: 22, position: 'relative',
                    background: plan.highlight ? 'linear-gradient(135deg, #fdfaf7, #f9f4ef)' : 'white',
                  }}>
                    {plan.highlight && (
                      <div style={{ position: 'absolute', top: -10, left: 16, background: 'linear-gradient(135deg, #BBA188, #a8906f)', color: 'white', fontSize: '0.64rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                        MAIS POPULAR
                      </div>
                    )}
                    <div style={{ fontFamily: 'var(--font-cabourg-bold), serif', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontFamily: 'var(--font-cabourg-bold), serif', fontSize: '1.6rem', fontWeight: 700, color: '#BBA188', marginBottom: 14 }}>
                      {plan.price}<span style={{ fontSize: '0.75rem', color: '#aaa', fontFamily: 'sans-serif', fontWeight: 400 }}>/mês</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: 5 }}>✓ {plan.users}</div>
                    <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: 18 }}>✓ {plan.modules}</div>
                    <Btn $variant={plan.highlight ? 'primary' : 'outline'} $size="sm" $full onClick={() => setEditPlan({ name: plan.name, price: plan.price })}>
                      Editar Plano
                    </Btn>
                  </div>
                ))}
              </div>

              <SubTitle>Configurações de Faturamento</SubTitle>
              <FormGrid style={{ marginTop: 14 }}>
                <SField label="Gateway de Pagamento" options={[{value:'stripe',label:'Stripe'},{value:'asaas',label:'Asaas'},{value:'pagarme',label:'Pagar.me'}]} />
                <SField label="Período de Trial"     options={[{value:'7',label:'7 dias'},{value:'14',label:'14 dias'},{value:'30',label:'30 dias'}]} />
                <Field label="Moeda"                  defaultValue="BRL — Real Brasileiro" />
                <Field label="Chave de API do Gateway" type="password" placeholder="sk_live_••••••••••••••••" />
              </FormGrid>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Planos salvos!', 'As configurações de planos e faturamento foram atualizadas.', () => {})}>Salvar Configurações de Planos</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'perfil' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Minha Conta</SectionTitle>
                  <SectionDesc>Dados pessoais e credenciais de acesso do Super Admin.</SectionDesc>
                </div>
                <SectionBadge>Super Admin</SectionBadge>
              </SectionHeader>

              <AvatarSection>
                <AvatarCircle $color={accentColor}>SA</AvatarCircle>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem', marginBottom: 3 }}>Super Administrador</div>
                  <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 12 }}>super.admin@aestheticos.com.br · Acesso total ao sistema</div>
                  <Btn $size="sm" onClick={() => showToast('Funcionalidade de foto disponível em breve.')}>
                    <Icons.Camera /> Alterar Foto
                  </Btn>
                </div>
              </AvatarSection>

              <FormGrid>
                <FieldWrapper $span2>
                  <Field label="Nome Completo" value={perfil.nome} onChange={(e: any) => { setPerfil(p => ({ ...p, nome: e.target.value })); setIsDirty(true); }} error={perfilErrors.nome} />
                </FieldWrapper>
                <Field label="E-mail de Acesso"    type="email"    value={perfil.email}        onChange={(e: any) => { setPerfil(p => ({ ...p, email: e.target.value })); setIsDirty(true); }}        error={perfilErrors.email} />
                <Field label="Telefone"                             value={perfil.telefone}     onChange={(e: any) => { setPerfil(p => ({ ...p, telefone: e.target.value })); setIsDirty(true); }} />
                <Field label="Nova Senha"           type="password" placeholder="••••••••"      value={perfil.senha}        onChange={(e: any) => { setPerfil(p => ({ ...p, senha: e.target.value })); setIsDirty(true); }} />
                <Field label="Confirmar Nova Senha" type="password" placeholder="••••••••"      value={perfil.senhaConfirm} onChange={(e: any) => { setPerfil(p => ({ ...p, senhaConfirm: e.target.value })); setIsDirty(true); }} error={perfilErrors.senhaConfirm} />
              </FormGrid>

              <InfoBox $variant="info" style={{ marginTop: 20 }}>
                <Icons.Info />
                Esta conta possui acesso irrestrito a todos os tenants. Recomendamos ativar a autenticação em dois fatores.
              </InfoBox>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={handleSavePerfil}>Atualizar Conta</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'notificacoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Notificações</SectionTitle>
                  <SectionDesc>Configure os alertas que deseja receber como Super Admin.</SectionDesc>
                </div>
              </SectionHeader>

              <SubTitle style={{ marginBottom: 10 }}>Plataforma</SubTitle>
              <ToggleGroup style={{ marginBottom: 24 }}>
                {([
                  { key: 'novaTenant'  as NotifKey, label: 'Nova Clínica Cadastrada',  sub: 'Notificar quando uma nova clínica for criada na plataforma' },
                  { key: 'faturamento' as NotifKey, label: 'Eventos de Faturamento',   sub: 'Alertas de pagamentos, renovações e inadimplências de planos' },
                ]).map(n => (
                  <ToggleRow key={n.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{n.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{n.sub}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onToggle={() => { setNotifs(p => ({ ...p, [n.key]: !p[n.key] })); setIsDirty(true); }} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SubTitle style={{ marginBottom: 10 }}>Sistema por Clínica</SubTitle>
              <ToggleGroup>
                {([
                  { key: 'agendamento'  as NotifKey, label: 'Confirmação de Agendamentos', sub: 'Cópias de confirmações e cancelamentos de todas as clínicas' },
                  { key: 'reaplicacao'  as NotifKey, label: 'Alertas de Reaplicação',      sub: 'Avisar quando pacientes estiverem próximos do prazo' },
                  { key: 'estoqueBaixo' as NotifKey, label: 'Estoque Baixo',               sub: 'Notificar quando produtos atingirem nível crítico' },
                  { key: 'validade'     as NotifKey, label: 'Validade de Produtos',        sub: 'Alertar 30, 15 e 7 dias antes do vencimento de produtos' },
                  { key: 'comissao'     as NotifKey, label: 'Relatório de Comissões',      sub: 'Receber relatório mensal de comissões consolidado' },
                  { key: 'relatorio'    as NotifKey, label: 'Relatório Semanal',           sub: 'Resumo semanal de desempenho da plataforma por e-mail' },
                ]).map(n => (
                  <ToggleRow key={n.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{n.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{n.sub}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onToggle={() => { setNotifs(p => ({ ...p, [n.key]: !p[n.key] })); setIsDirty(true); }} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Notificações salvas!', 'Suas preferências de notificação foram atualizadas.', () => {})}>Salvar Preferências</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'anvisa' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Configurações ANVISA</SectionTitle>
                  <SectionDesc>Parâmetros globais de conformidade ANVISA para todas as clínicas.</SectionDesc>
                </div>
                <SectionBadge>Global</SectionBadge>
              </SectionHeader>

              <InfoBox $variant="warning">
                <Icons.AlertTriangle />
                Estes parâmetros são aplicados globalmente. Cada clínica pode sobrescrever em seu painel de admin.
              </InfoBox>

              <FormGrid>
                <Field label="Dias para alerta de validade (padrão)" type="number" defaultValue="30" onChange={() => setIsDirty(true)} />
                <Field label="Estoque mínimo global (unidades)"      type="number" defaultValue="5"  onChange={() => setIsDirty(true)} />
                <SField label="Unidade de Controle de Lote"    options={[{value:'produto',label:'Por Produto'},{value:'lote',label:'Por Lote'}]} onChange={() => setIsDirty(true)} />
                <SField label="Frequência de Relatório ANVISA" options={[{value:'mensal',label:'Mensal'},{value:'trimestral',label:'Trimestral'}]} onChange={() => setIsDirty(true)} />
              </FormGrid>

              <SubTitle style={{ marginTop: 24, marginBottom: 12 }}>Regras Obrigatórias</SubTitle>
              <ToggleGroup>
                {[
                  { key: 'lote',      label: 'Rastreamento de Lote Obrigatório', sub: 'Exigir número de lote no cadastro de todos os procedimentos' },
                  { key: 'bloqueio',  label: 'Bloqueio de Produto Vencido',      sub: 'Impedir o uso de produtos com validade expirada nos procedimentos' },
                  { key: 'relatorio', label: 'Relatório ANVISA Automático',      sub: 'Gerar e enviar relatório de conformidade automaticamente' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={anvisaToggles[t.key as keyof typeof anvisaToggles]} onToggle={() => { setAnvisaToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] })); setIsDirty(true); }} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('ANVISA salvo!', 'As configurações de conformidade ANVISA foram atualizadas globalmente.', () => {})}>Salvar Configurações ANVISA</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'comissoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Regras de Comissão</SectionTitle>
                  <SectionDesc>Configure os percentuais padrão de comissão por procedimento.</SectionDesc>
                </div>
                <SectionBadge>Padrão Global</SectionBadge>
              </SectionHeader>

              <FormGrid>
                {[
                  { label: 'Toxina Botulínica (%)', key: 'botox'          },
                  { label: 'Preenchimento (%)',      key: 'preenchimento'  },
                  { label: 'Bioestimulador (%)',     key: 'bioestimulador' },
                  { label: 'Fio de PDO (%)',         key: 'fio'            },
                  { label: 'Skincare / Pele (%)',    key: 'skincare'       },
                  { label: 'Outros (%)',             key: 'outros'         },
                ].map(f => (
                  <Field key={f.key} label={f.label} type="number" value={comissao[f.key as keyof typeof comissao]} onChange={(e: any) => { setComissao(p => ({ ...p, [f.key]: e.target.value })); setIsDirty(true); }} />
                ))}
                <SField label="Base de Cálculo"            options={[{value:'bruto',label:'Sobre valor bruto'},{value:'liquido',label:'Sobre valor líquido'}]}                      value={comissao.base}         onChange={(v: string) => { setComissao(p => ({ ...p, base: v })); setIsDirty(true); }} />
                <SField label="Periodicidade do Pagamento" options={[{value:'mensal',label:'Mensal'},{value:'quinzenal',label:'Quinzenal'},{value:'semanal',label:'Semanal'}]} value={comissao.periodicidade} onChange={(v: string) => { setComissao(p => ({ ...p, periodicidade: v })); setIsDirty(true); }} />
              </FormGrid>

              <InfoBox $variant="info" style={{ marginTop: 20 }}>
                <Icons.Info />
                Estes são os valores padrão. Cada admin de clínica pode personalizar os percentuais em seu painel.
              </InfoBox>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Comissões salvas!', 'As regras padrão de comissão foram atualizadas com sucesso.', () => {})}>Salvar Regras Padrão</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'permissoes' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Permissões de Cargo</SectionTitle>
                  <SectionDesc>Ajuste o conjunto padrão de permissões por cargo em toda a plataforma.</SectionDesc>
                </div>
                <SectionBadge>Sistema</SectionBadge>
              </SectionHeader>

              <InfoBox $variant="warning">
                <Icons.AlertTriangle />
                Alterações nas permissões padrão afetam todos os usuários sem permissões personalizadas. Proceda com atenção.
              </InfoBox>

              <PermMatrix>
                {Object.entries(perms).map(([cargo, items]) => (
                  <PermGroup key={cargo}>
                    <PermGroupTitle>{cargo}</PermGroupTitle>
                    <PermGrid>
                      {CARGO_PERMS[cargo].map(perm => {
                        const isActive = items.includes(perm);
                        return (
                          <PermItem key={perm} $active={isActive} onClick={() => { setPerms(p => ({ ...p, [cargo]: isActive ? p[cargo].filter(x => x !== perm) : [...p[cargo], perm] })); setIsDirty(true); }}>
                            <PermCheck $active={isActive}>{isActive && <Icons.Check />}</PermCheck>
                            {perm}
                          </PermItem>
                        );
                      })}
                    </PermGrid>
                  </PermGroup>
                ))}
              </PermMatrix>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Permissões atualizadas!', 'As permissões padrão de cargo foram salvas com sucesso.', () => {})}>Salvar Permissões Padrão</Btn>
              </SaveRow>
            </div>
          )}

          {active === 'auditoria' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Auditoria & Logs</SectionTitle>
                  <SectionDesc>Histórico de todas as ações críticas realizadas na plataforma.</SectionDesc>
                </div>
                <Btn $size="sm" onClick={() => setSucessModal({ title: 'Exportação iniciada!', message: 'O arquivo de logs está sendo gerado e ficará disponível em instantes.' })}>
                  <Icons.Download /> Exportar Logs
                </Btn>
              </SectionHeader>

              <ActivityList>
                {[
                  { id: 1, action: 'Login realizado',                      user: 'Super Admin', time: 'Hoje, 09:14'  },
                  { id: 2, action: 'Clínica "Bella Vita" criada',           user: 'Super Admin', time: 'Ontem, 15:32' },
                  { id: 3, action: 'Plano Pro ativado — tenant #3',         user: 'Sistema',     time: 'Ontem, 11:20' },
                  { id: 4, action: 'Termos de uso atualizados',             user: 'Super Admin', time: '18/02/2025'   },
                  { id: 5, action: 'Usuário suspenso: Instituto Skin Care', user: 'Super Admin', time: '15/01/2025'   },
                ].map(log => (
                  <ActivityItem key={log.id}>
                    <ActivityDot $color={LOG_COLORS[log.id] || '#BBA188'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.83rem', color: '#333', marginBottom: 2 }}>
                        <strong style={{ color: '#1a1a1a' }}>{log.action}</strong>{' — '}por {log.user}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#bbb' }}>
                        <Icons.Clock /> {log.time}
                      </div>
                    </div>
                  </ActivityItem>
                ))}
              </ActivityList>
            </div>
          )}

          {active === 'seguranca' && (
            <div>
              <SectionHeader>
                <div>
                  <SectionTitle>Segurança</SectionTitle>
                  <SectionDesc>Gerencie as configurações de segurança da plataforma e da sua conta.</SectionDesc>
                </div>
              </SectionHeader>

              <SubTitle style={{ marginBottom: 10 }}>Segurança da Conta</SubTitle>
              <ToggleGroup style={{ marginBottom: 24 }}>
                {[
                  { key: 'twoFa',      label: 'Autenticação em Dois Fatores (2FA)', sub: 'Adicionar camada extra com código por app ou SMS' },
                  { key: 'timeout',    label: 'Timeout de Sessão Automático',       sub: 'Desconectar automaticamente após 30 min de inatividade' },
                  { key: 'alertLogin', label: 'Alertas de Login Suspeito',          sub: 'Notificar por e-mail ao detectar acesso de IP não reconhecido' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={secToggles[t.key as keyof typeof secToggles]} onToggle={() => { setSecToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] })); setIsDirty(true); }} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SubTitle style={{ marginBottom: 10 }}>Segurança da Plataforma</SubTitle>
              <ToggleGroup>
                {[
                  { key: 'audit',      label: 'Registro de Atividades (Audit Log)', sub: 'Registrar todas as ações críticas realizadas na plataforma' },
                  { key: 'twoFaAdmin', label: '2FA Obrigatório para Admins',        sub: 'Exigir autenticação em dois fatores para todos os admins de clínicas' },
                ].map(t => (
                  <ToggleRow key={t.key}>
                    <div>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{t.label}</div>
                      <div style={{ fontSize: '0.76rem', color: '#aaa' }}>{t.sub}</div>
                    </div>
                    <Toggle on={secToggles[t.key as keyof typeof secToggles]} onToggle={() => { setSecToggles(p => ({ ...p, [t.key]: !p[t.key as keyof typeof p] })); setIsDirty(true); }} />
                  </ToggleRow>
                ))}
              </ToggleGroup>

              <SaveRow>
                <Btn onClick={() => { if (isDirty) setCancelModal(true); }}>Cancelar</Btn>
                <Btn $variant="primary" onClick={() => requestSave('Segurança salva!', 'As configurações de segurança foram atualizadas com sucesso.', () => {})}>Salvar Configurações</Btn>
              </SaveRow>

              <DangerZone>
                <DangerTitle><Icons.AlertTriangle /> Zona de Perigo</DangerTitle>
                {[
                  { label: 'Exportar todos os dados da plataforma', sub: 'Baixar backup completo de todos os tenants, usuários e transações',  action: () => setSucessModal({ title: 'Exportação iniciada!', message: 'Backup completo sendo gerado. O arquivo ficará disponível em instantes.' }), variant: 'outline', btn: 'Exportar' },
                  { label: 'Limpar dados de ambiente de teste',     sub: 'Remover todos os registros marcados como ambiente sandbox',          action: () => setConfirmModal({ title: 'Limpar dados de teste?',  msg: 'Esta ação é irreversível. Todos os dados de sandbox serão permanentemente removidos.', onConfirm: () => { setConfirmModal(null); setSucessModal({ title: 'Dados removidos!', message: 'Todos os dados de sandbox foram permanentemente removidos.' }); } }), variant: 'danger', btn: 'Limpar' },
                  { label: 'Forçar logout de todos os usuários',    sub: 'Invalidar todas as sessões ativas na plataforma imediatamente',      action: () => setConfirmModal({ title: 'Forçar logout global?',   msg: 'Todos os usuários serão desconectados imediatamente. Isso inclui todas as clínicas e admins ativos.',  onConfirm: () => { setConfirmModal(null); setSucessModal({ title: 'Sessões invalidadas!', message: 'Todos os usuários foram desconectados da plataforma.' }); } }), variant: 'danger', btn: 'Forçar Logout' },
                ].map(item => (
                  <DangerItem key={item.label}>
                    <DangerText>
                      <strong>{item.label}</strong>
                      <span>{item.sub}</span>
                    </DangerText>
                    <Btn $variant={item.variant as any} $size="sm" onClick={item.action}>{item.btn}</Btn>
                  </DangerItem>
                ))}
              </DangerZone>
            </div>
          )}
        </Content>
      </Layout>

      <Modal open={showNewClinic} title="Nova Clínica" onClose={() => setShowNewClinic(false)}
        footer={<><Btn onClick={() => setShowNewClinic(false)}>Cancelar</Btn><Btn $variant="primary" onClick={handleAddClinic}>Cadastrar Clínica</Btn></>}
      >
        <Field label="Nome da Clínica *" placeholder="Ex: Clínica Bella Vita" value={newClinic.name} onChange={(e: any) => setNewClinic(p => ({ ...p, name: e.target.value }))} error={clinicErrors.name} />
        <Field label="CNPJ *"            placeholder="00.000.000/0001-00"     value={newClinic.cnpj} onChange={(e: any) => setNewClinic(p => ({ ...p, cnpj: e.target.value }))} error={clinicErrors.cnpj} />
        <SField label="Plano" options={[{value:'Starter',label:'Starter'},{value:'Pro',label:'Pro'},{value:'Enterprise',label:'Enterprise'}]} value={newClinic.plan} onChange={(v: string) => setNewClinic(p => ({ ...p, plan: v }))} />
      </Modal>

      <Modal open={showEditClinic && !!editClinic} title="Editar Clínica" onClose={() => setShowEditClinic(false)}
        footer={<><Btn onClick={() => setShowEditClinic(false)}>Cancelar</Btn><Btn $variant="primary" onClick={handleEditClinicSave}>Salvar Alterações</Btn></>}
      >
        {editClinic && (
          <>
            <Field label="Nome da Clínica" value={editClinic.name} onChange={(e: any) => setEditClinic(p => p ? { ...p, name: e.target.value } : p)} />
            <Field label="CNPJ"            value={editClinic.cnpj} onChange={(e: any) => setEditClinic(p => p ? { ...p, cnpj: e.target.value } : p)} />
            <SField label="Plano" options={[{value:'Starter',label:'Starter'},{value:'Pro',label:'Pro'},{value:'Enterprise',label:'Enterprise'}]} value={editClinic.plan} onChange={(v: string) => setEditClinic(p => p ? { ...p, plan: v } : p)} />
          </>
        )}
      </Modal>

      <Modal open={!!editPlan} title={editPlan ? `Editar Plano — ${editPlan.name}` : ''} onClose={() => setEditPlan(null)}
        footer={<><Btn onClick={() => setEditPlan(null)}>Cancelar</Btn><Btn $variant="primary" onClick={() => { setEditPlan(null); setSucessModal({ title: `Plano ${editPlan?.name} atualizado!`, message: 'As configurações do plano foram salvas com sucesso.' }); }}>Salvar Plano</Btn></>}
      >
        {editPlan && (
          <>
            <Field label="Nome do Plano"       defaultValue={editPlan.name} />
            <Field label="Preço Mensal (R$)"   defaultValue={editPlan.price.replace('R$ ', '')} type="number" />
            <Field label="Limite de Usuários"  type="number" defaultValue="10" />
            <Field label="Módulos Incluídos"   defaultValue="Todos os módulos" />
          </>
        )}
      </Modal>

      <CancelModal
        isOpen={cancelModal}
        title="Descartar alterações?"
        message="Você fez alterações que ainda não foram salvas. Se sair agora, todas as modificações serão perdidas."
        onConfirm={handleCancelConfirm}
        onCancel={() => { setCancelModal(false); setPendingNav(null); }}
      />

      <ConfirmModal
        isOpen={!!confirmModal}
        title={confirmModal?.title}
        message={confirmModal?.msg || ''}
        onConfirm={confirmModal?.onConfirm || (() => {})}
        onCancel={() => setConfirmModal(null)}
      />

      <SucessModal
        isOpen={!!sucessModal}
        title={sucessModal?.title}
        message={sucessModal?.message || ''}
        onClose={() => setSucessModal(null)}
      />

      <Toast $show={toastShow}>
        <ToastDot />
        {toast}
      </Toast>
    </Container>
  );
}