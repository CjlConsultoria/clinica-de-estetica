'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import PermissionGuard from '@/components/ui/PermissionGuard';
import { ROLE_PERMISSIONS, Permission } from '@/types/auth';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  Avatar, ProfissionalInfo, ProfissionalName, ProfissionalEmail, EmptyState,
  FormGrid, SectionLabel, PasswordHint, RoleTag,
  WizardSteps, WizardStep, WizardStepLine, WizardStepCircle, WizardStepLabel,
  AreaCard, AreaGrid, AreaIcon, AreaTitle, AreaDesc,
  WizardNav, StepSection,
  DetailModal, DetailHeader, DetailAvatar, DetailName, DetailMeta, DetailMetaItem,
  DetailSection, DetailSectionTitle, StatsRow, StatPill,
  InfoGrid, InfoItem, InfoLabel, InfoValue,
  ObsBox,
} from './styles';
import { validateEmail, validatePassword, ERROR_MESSAGES } from './validation';
import {
  listarProfissionais,
  criarProfissional,
  atualizarProfissional,
  inativarProfissional,
} from '@/services/profissionalService';
import { listarEmpresas, EmpresaAPI } from '@/services/empresaService';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';

type AreaType = 'tecnica' | 'administrativa' | '';
type CargoTecnico = 'esteticista' | 'biomedico' | 'enfermeiro' | 'dermatologista' | 'fisioterapeuta';
type CargoAdmin = 'recepcionista' | 'gerente' | 'financeiro';
type Cargo = CargoTecnico | CargoAdmin | '';

interface CargoConfig {
  label: string;
  icon: React.ReactNode;
  desc: string;
  requiresRegistro: boolean;
  registroLabel?: string;
  registroPlaceholder?: string;
  requiresEspecialidade: boolean;
  especialidades?: { value: string; label: string }[];
}

const CARGO_TECNICO_CONFIG: Record<CargoTecnico, CargoConfig> = {
  esteticista: {
    label: 'Esteticista',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><line x1="12" y1="11" x2="12" y2="14"/></svg>,
    desc: 'Limpeza de pele, drenagem, tratamentos faciais e corporais',
    requiresRegistro: true, registroLabel: 'CREFITO / Registro Profissional', registroPlaceholder: 'Ex: CREFITO-3 123456-F',
    requiresEspecialidade: true,
    especialidades: [
      { value: 'estetica-facial',   label: 'Estética Facial'   },
      { value: 'estetica-corporal', label: 'Estética Corporal' },
      { value: 'estetica-capilar',  label: 'Estética Capilar'  },
      { value: 'depilacao',         label: 'Depilação'          },
      { value: 'massoterapia',      label: 'Massoterapia'       },
      { value: 'estetica-completa', label: 'Estética Completa'  },
    ],
  },
  biomedico: {
    label: 'Biomédico Esteta',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    desc: 'Toxina botulínica, preenchimento, bioestimuladores, injetáveis',
    requiresRegistro: true, registroLabel: 'CRBim', registroPlaceholder: 'Ex: CRBim-5 123456',
    requiresEspecialidade: true,
    especialidades: [
      { value: 'biomedicina-estetica',     label: 'Biomedicina Estética'     },
      { value: 'procedimentos-injetaveis', label: 'Procedimentos Injetáveis' },
      { value: 'laser-terapia',            label: 'Laserterapia'              },
    ],
  },
  enfermeiro: {
    label: 'Enfermeiro Esteta',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    desc: 'Aplicações, tratamentos injetáveis, procedimentos minimamente invasivos',
    requiresRegistro: true, registroLabel: 'COREN', registroPlaceholder: 'Ex: COREN/SP 123456',
    requiresEspecialidade: true,
    especialidades: [
      { value: 'enfermagem-estetica',      label: 'Enfermagem Estética'      },
      { value: 'procedimentos-injetaveis', label: 'Procedimentos Injetáveis' },
      { value: 'enfermagem-geral',         label: 'Enfermagem Geral'         },
    ],
  },
  dermatologista: {
    label: 'Dermatologista',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
    desc: 'Tratamentos clínicos, procedimentos médicos, casos complexos',
    requiresRegistro: true, registroLabel: 'CRM', registroPlaceholder: 'Ex: CRM/SP 123456',
    requiresEspecialidade: true,
    especialidades: [
      { value: 'dermatologia-clinica',   label: 'Dermatologia Clínica'   },
      { value: 'dermatologia-estetica',  label: 'Dermatologia Estética'  },
      { value: 'cirurgia-dermatologica', label: 'Cirurgia Dermatológica' },
    ],
  },
  fisioterapeuta: {
    label: 'Fisioterapeuta Dermato',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 8v4"/><path d="M8 20l4-8 4 8"/><line x1="7" y1="14" x2="17" y2="14"/></svg>,
    desc: 'Tratamentos corporais, pós-operatório, ultrassom, radiofrequência',
    requiresRegistro: true, registroLabel: 'CREFITO', registroPlaceholder: 'Ex: CREFITO-3 654321-F',
    requiresEspecialidade: true,
    especialidades: [
      { value: 'dermato-funcional', label: 'Dermato Funcional' },
      { value: 'pos-operatorio',    label: 'Pós-Operatório'    },
      { value: 'corporal',          label: 'Corporal Geral'    },
    ],
  },
};

const CARGO_ADMIN_CONFIG: Record<CargoAdmin, CargoConfig> = {
  recepcionista: {
    label: 'Recepcionista',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>,
    desc: 'Atendimento ao cliente, agendamentos, organização da agenda',
    requiresRegistro: false, requiresEspecialidade: false,
  },
  gerente: {
    label: 'Gerente de Clínica',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    desc: 'Gestão de equipe, controle financeiro, metas e estratégia',
    requiresRegistro: false, requiresEspecialidade: false,
  },
  financeiro: {
    label: 'Financeiro',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    desc: 'Contas a pagar/receber, fluxo de caixa, relatórios',
    requiresRegistro: false, requiresEspecialidade: false,
  },
};

const ALL_CARGO_CONFIG: Record<string, CargoConfig> = {
  ...CARGO_TECNICO_CONFIG,
  ...CARGO_ADMIN_CONFIG,
};

const CARGO_TO_ROLE: Record<string, 'tecnico' | 'recepcionista' | 'gerente' | 'financeiro'> = {
  esteticista:    'tecnico',
  biomedico:      'tecnico',
  enfermeiro:     'tecnico',
  dermatologista: 'tecnico',
  fisioterapeuta: 'tecnico',
  recepcionista:  'recepcionista',
  gerente:        'gerente',
  financeiro:     'financeiro',
};

const CARGO_TO_BACKEND: Record<string, string> = {
  esteticista:    'ESTETICISTA',
  biomedico:      'BIOMEDICO',
  enfermeiro:     'ENFERMEIRO',
  dermatologista: 'DERMATOLOGO',
  fisioterapeuta: 'FISIOTERAPEUTA',
  recepcionista:  'RECEPCIONISTA',
  gerente:        'GERENTE',
  financeiro:     'FINANCEIRO',
};

const BACKEND_TO_CARGO: Record<string, string> = {
  ESTETICISTA:    'esteticista',
  BIOMEDICO:      'biomedico',
  ENFERMEIRO:     'enfermeiro',
  DERMATOLOGO:    'dermatologista',
  FISIOTERAPEUTA: 'fisioterapeuta',
  RECEPCIONISTA:  'recepcionista',
  GERENTE:        'gerente',
  FINANCEIRO:     'financeiro',
};

const BACKEND_TO_AREA: Record<string, AreaType> = {
  TECNICA:        'tecnica',
  ADMINISTRATIVA: 'administrativa',
};

const PERMISSION_GROUPS: { label: string; perms: Permission[] }[] = [
  { label: 'Dashboard',       perms: ['dashboard.read'] },
  { label: 'Profissionais',   perms: ['profissionais.read', 'profissionais.create', 'profissionais.edit', 'profissionais.delete'] },
  { label: 'Agenda',          perms: ['agenda.read', 'agenda.read_own', 'agenda.create', 'agenda.edit', 'agenda.delete'] },
  { label: 'Pacientes',       perms: ['pacientes.read', 'pacientes.read_own', 'pacientes.create', 'pacientes.edit', 'pacientes.delete'] },
  { label: 'Prontuário',      perms: ['prontuario.read', 'prontuario.read_own', 'prontuario.create', 'prontuario.edit'] },
  { label: 'Histórico',       perms: ['historico.read', 'historico.read_own'] },
  { label: 'Fotos',           perms: ['fotos.read', 'fotos.read_own', 'fotos.create'] },
  { label: 'Reaplicações',    perms: ['reaplicacoes.read', 'reaplicacoes.read_own', 'reaplicacoes.create'] },
  { label: 'Procedimentos',   perms: ['procedimentos.read', 'procedimentos.create', 'procedimentos.edit'] },
  { label: 'Consentimento',   perms: ['consentimento.read', 'consentimento.read_own', 'consentimento.create'] },
  { label: 'Financeiro',      perms: ['financeiro.read', 'financeiro.create', 'financeiro.edit', 'financeiro.delete'] },
  { label: 'Comissões',       perms: ['comissoes.read', 'comissoes.read_own', 'comissoes.edit'] },
  { label: 'Estoque',         perms: ['estoque.read', 'estoque.create', 'estoque.edit'] },
  { label: 'Lotes',           perms: ['lotes.read', 'lotes.create', 'lotes.edit'] },
  { label: 'Relatórios',      perms: ['relatorios.operacional', 'relatorios.financeiro', 'relatorios.completo'] },
  { label: 'Configurações',   perms: ['configuracoes.read', 'configuracoes.edit'] },
];

const PERM_LABEL: Record<string, string> = {
  'dashboard.read':          'Ver dashboard',
  'profissionais.read':      'Ver profissionais',
  'profissionais.create':    'Cadastrar',
  'profissionais.edit':      'Editar',
  'profissionais.delete':    'Excluir',
  'agenda.read':             'Ver agenda',
  'agenda.read_own':         'Ver própria agenda',
  'agenda.create':           'Criar agendamentos',
  'agenda.edit':             'Editar agendamentos',
  'agenda.delete':           'Excluir agendamentos',
  'pacientes.read':          'Ver todos pacientes',
  'pacientes.read_own':      'Ver próprios pacientes',
  'pacientes.create':        'Cadastrar pacientes',
  'pacientes.edit':          'Editar pacientes',
  'pacientes.delete':        'Excluir pacientes',
  'prontuario.read':         'Ver prontuários',
  'prontuario.read_own':     'Ver próprio prontuário',
  'prontuario.create':       'Criar prontuários',
  'prontuario.edit':         'Editar prontuários',
  'historico.read':          'Ver histórico geral',
  'historico.read_own':      'Ver próprio histórico',
  'fotos.read':              'Ver fotos',
  'fotos.read_own':          'Ver próprias fotos',
  'fotos.create':            'Adicionar fotos',
  'reaplicacoes.read':       'Ver reaplicações',
  'reaplicacoes.read_own':   'Ver próprias reaplicações',
  'reaplicacoes.create':     'Criar reaplicações',
  'procedimentos.read':      'Ver procedimentos',
  'procedimentos.create':    'Criar procedimentos',
  'procedimentos.edit':      'Editar procedimentos',
  'consentimento.read':      'Ver consentimentos',
  'consentimento.read_own':  'Ver próprios consentimentos',
  'consentimento.create':    'Criar consentimentos',
  'financeiro.read':         'Ver financeiro',
  'financeiro.create':       'Lançar entradas',
  'financeiro.edit':         'Editar lançamentos',
  'financeiro.delete':       'Excluir lançamentos',
  'comissoes.read':          'Ver comissões',
  'comissoes.read_own':      'Ver próprias comissões',
  'comissoes.edit':          'Editar comissões',
  'estoque.read':            'Ver estoque',
  'estoque.create':          'Adicionar ao estoque',
  'estoque.edit':            'Editar estoque',
  'lotes.read':              'Ver lotes',
  'lotes.create':            'Criar lotes',
  'lotes.edit':              'Editar lotes',
  'relatorios.operacional':  'Relatório operacional',
  'relatorios.financeiro':   'Relatório financeiro',
  'relatorios.completo':     'Relatório completo',
  'configuracoes.read':      'Ver configurações',
  'configuracoes.edit':      'Editar configurações',
};

const statusOptions = [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }];
const filterStatus  = ['Todos', 'Ativo', 'Inativo'];
const filterAreas   = ['Todos', 'Técnica', 'Administrativa'];
const STEP_LABELS   = ['Dados Básicos', 'Área', 'Cargo', 'Acesso', 'Permissões'];

const avatarColors = ['#BBA188', '#8a7560', '#a8906f', '#c9a882', '#917255', '#d4b896'];

const statusColors: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: '#f0ebe4', color: '#8a7560' },
  inativo: { bg: '#f5f5f5', color: '#888'    },
};

const cargoTagColors: Record<string, { bg: string; color: string }> = {
  esteticista:    { bg: '#fdf0e8', color: '#c97a3a' },
  biomedico:      { bg: '#f0e8fd', color: '#7a3ac9' },
  enfermeiro:     { bg: '#e8fdf0', color: '#3ac97a' },
  dermatologista: { bg: '#e8f0fd', color: '#3a6bc9' },
  fisioterapeuta: { bg: '#fde8f5', color: '#c93a8a' },
  recepcionista:  { bg: '#fdf8e8', color: '#c9b03a' },
  gerente:        { bg: '#1b1b1b', color: '#EBD5B0' },
  financeiro:     { bg: '#e8fdf8', color: '#3ac9a8' },
};

interface ProfissionalForm {
  nome: string; email: string; telefone: string;
  area: AreaType; cargo: Cargo;
  especialidade: string; registro: string; status: string; observacoes: string;
  senha: string; confirmarSenha: string;
  useCustomPermissions: boolean;
  customPermissions: Permission[];
  empresaId: string;
}

const FORM_INITIAL: ProfissionalForm = {
  nome: '', email: '', telefone: '',
  area: '', cargo: '', especialidade: '', registro: '', status: 'ativo', observacoes: '',
  senha: '', confirmarSenha: '',
  useCustomPermissions: false,
  customPermissions: [],
  empresaId: '',
};

type Step1Field = 'nome' | 'email' | 'telefone' | 'empresaId';
type Step2Field = 'area';
type Step3Field = 'cargo' | 'registro' | 'especialidade';
type Step4Field = 'senha' | 'confirmarSenha';

type Profissional = {
  id: number; name: string; email: string; phone: string;
  registro: string; area: string; cargo: string; especialidade: string;
  status: string; atendimentos: number; ultimoAcesso: string; observacoes: string;
  customPermissions: Permission[] | null;
};

function getEspecialidadeLabel(cargo: string, value: string): string {
  if (!value) return '—';
  const config = ALL_CARGO_CONFIG[cargo];
  if (!config?.especialidades) return value;
  return config.especialidades.find(e => e.value === value)?.label || value;
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function CargoCard({ children, $active, onClick }: { children: React.ReactNode; $active: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 14px',
      border: `1.5px solid ${$active ? '#BBA188' : '#e8e8e8'}`, borderRadius: 12,
      background: $active ? 'rgba(187,161,136,0.07)' : 'white',
      cursor: 'pointer', transition: 'all 0.18s',
      boxShadow: $active ? '0 0 0 3px rgba(187,161,136,0.15)' : 'none',
    }}>
      {children}
    </div>
  );
}

function EyeBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
      {children}
    </button>
  );
}

function EyeOnIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

const AreaTecnicaIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/>
    <circle cx="20" cy="10" r="2"/>
  </svg>
);

const AreaAdminIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="9" y1="6" x2="15" y2="6"/>
    <line x1="9" y1="10" x2="15" y2="10"/>
    <line x1="9" y1="14" x2="13" y2="14"/>
    <line x1="9" y1="18" x2="11" y2="18"/>
  </svg>
);

const ITEMS_PER_PAGE = 10;

export default function Profissionais() {
  const { can } = usePermissions();
  const { currentUser } = useAuth();

  const canCreate    = can('profissionais.create');
  const canEdit      = can('profissionais.edit');
  const canRead      = can('profissionais.read');
  const canDelete    = can('profissionais.delete');
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [profissionais,        setProfissionais]        = useState<Profissional[]>([]);
  const [empresas,             setEmpresas]             = useState<EmpresaAPI[]>([]);
  const [loading,              setLoading]              = useState(true);
  const [saveLoading,          setSaveLoading]          = useState(false);
  const [deleteLoading,        setDeleteLoading]        = useState(false);
  const [apiError,             setApiError]             = useState<string | null>(null);
  const [emailConflictError,   setEmailConflictError]   = useState<string | null>(null);
  const [search,               setSearch]               = useState('');
  const [filterStat,           setFilterStat]           = useState('Todos');
  const [filterArea,           setFilterArea]           = useState('Todos');
  const [openDrop,             setOpenDrop]             = useState<string | null>(null);
  const [isModalOpen,          setIsModalOpen]          = useState(false);
  const [isDetailOpen,         setIsDetailOpen]         = useState(false);
  const [isDeleteOpen,         setIsDeleteOpen]         = useState(false);
  const [isSuccessOpen,        setIsSuccessOpen]        = useState(false);
  const [profissionalToDelete, setProfissionalToDelete] = useState<Profissional | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [form,                 setForm]                 = useState<ProfissionalForm>(FORM_INITIAL);
  const [step,                 setStep]                 = useState(1);
  const [showSenha,            setShowSenha]            = useState(false);
  const [showConfirm,          setShowConfirm]          = useState(false);
  const [isEditing,            setIsEditing]            = useState(false);
  const [currentPage,          setCurrentPage]          = useState(1);

  useEffect(() => {
    fetchProfissionais();
    if (isSuperAdmin) {
      listarEmpresas().then(setEmpresas).catch(() => {});
    }
  }, [isSuperAdmin]);

  async function fetchProfissionais() {
    try {
      setLoading(true);
      setApiError(null);
      const data = await listarProfissionais();
      const mapped: Profissional[] = data.map((p, idx) => ({
        id:              p.id,
        name:            p.nome,
        email:           p.email,
        phone:           p.telefone || '',
        registro:        p.registro || '',
        area:            BACKEND_TO_AREA[p.areaProfissional] || 'tecnica',
        cargo:           BACKEND_TO_CARGO[p.cargo] || p.cargo.toLowerCase(),
        especialidade:   p.especialidade || '',
        status:          p.ativo ? 'ativo' : 'inativo',
        atendimentos:    p.atendimentos || 0,
        ultimoAcesso:    p.criadoEm ? new Date(p.criadoEm).toLocaleDateString('pt-BR') : '—',
        observacoes:     p.observacoes || '',
        customPermissions: null,
      }));
      setProfissionais(mapped);
    } catch (err: any) {
      console.error('[Profissionais] Erro ao carregar:', err);
      setApiError('Erro ao carregar profissionais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const step1Validation = useSequentialValidation<Step1Field>([
    { key: 'nome',      validate: (v) => !v.trim() ? 'Nome completo é obrigatório' : null },
    { key: 'email',     validate: (v) => { const err = validateEmail(v); return err ? err.message : null; } },
    { key: 'telefone',  validate: (v) => !v.trim() ? 'Telefone é obrigatório' : null },
    { key: 'empresaId', validate: (v) => (isSuperAdmin && !isEditing && !v) ? 'Selecione a clínica' : null },
  ]);

  const step2Validation = useSequentialValidation<Step2Field>([
    { key: 'area', validate: (v) => !v ? 'Selecione uma área' : null },
  ]);

  const step3Validation = useSequentialValidation<Step3Field>([
    { key: 'cargo',       validate: (v) => !v ? 'Selecione o cargo' : null },
    { key: 'registro',    validate: (v) => {
      const config = form.cargo ? ALL_CARGO_CONFIG[form.cargo] : null;
      if (config?.requiresRegistro && !v.trim()) return `${config.registroLabel} é obrigatório`;
      return null;
    }},
    { key: 'especialidade', validate: (v) => {
      const config = form.cargo ? ALL_CARGO_CONFIG[form.cargo] : null;
      if (config?.requiresEspecialidade && !v) return 'Selecione a área de atuação';
      return null;
    }},
  ]);

  const step4Validation = useSequentialValidation<Step4Field>([
    { key: 'senha', validate: (v) => {
      if (!isEditing || v) {
        if (!isEditing && !v) return 'Senha é obrigatória';
        if (v) { const err = validatePassword(v); return err ? err.message : null; }
      }
      return null;
    }},
    { key: 'confirmarSenha', validate: (v) => {
      if (!isEditing && !v.trim()) return ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED;
      if (form.senha && !v.trim()) return ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED;
      return null;
    }},
  ]);

  const cargoConfig  = form.cargo ? ALL_CARGO_CONFIG[form.cargo] : null;
  const cargoOptions =
    form.area === 'tecnica'
      ? Object.entries(CARGO_TECNICO_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))
      : form.area === 'administrativa'
        ? Object.entries(CARGO_ADMIN_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))
        : [];

  const defaultPermsForCargo: Permission[] = form.cargo
    ? (ROLE_PERMISSIONS[CARGO_TO_ROLE[form.cargo]] ?? [])
    : [];

  function toggleCustomPerm(perm: Permission) {
    setForm(prev => {
      const has = prev.customPermissions.includes(perm);
      return { ...prev, customPermissions: has ? prev.customPermissions.filter(p => p !== perm) : [...prev.customPermissions, perm] };
    });
  }

  function activateCustomPermissions() {
    setForm(prev => ({ ...prev, useCustomPermissions: true, customPermissions: [...defaultPermsForCargo] }));
  }

  function resetToDefault() {
    setForm(prev => ({ ...prev, useCustomPermissions: false, customPermissions: [] }));
  }

  const filtered = profissionais.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.includes(search);
    const matchStat   = filterStat === 'Todos' || p.status === filterStat.toLowerCase();
    const matchArea   = filterArea === 'Todos' || (filterArea === 'Técnica' ? p.area === 'tecnica' : p.area === 'administrativa');
    return matchSearch && matchStat && matchArea;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleSearchChange(value: string)     { setSearch(value);     setCurrentPage(1); }
  function handleFilterStatChange(value: string) { setFilterStat(value); setCurrentPage(1); setOpenDrop(null); }
  function handleFilterAreaChange(value: string) { setFilterArea(value); setCurrentPage(1); setOpenDrop(null); }
  function handleClearFilters()                  { setFilterStat('Todos'); setFilterArea('Todos'); setCurrentPage(1); }

  const totalProfissionais = profissionais.length;
  const ativos             = profissionais.filter(p => p.status === 'ativo').length;
  const inativos           = profissionais.filter(p => p.status === 'inativo').length;
  const totalAtend         = profissionais.reduce((acc, p) => acc + p.atendimentos, 0);

  function handleChange(field: keyof ProfissionalForm, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'area')  { next.cargo = ''; next.especialidade = ''; next.registro = ''; next.useCustomPermissions = false; next.customPermissions = []; }
      if (field === 'cargo') { next.especialidade = ''; next.registro = ''; next.useCustomPermissions = false; next.customPermissions = []; }
      return next;
    });
    if (field === 'nome' || field === 'email' || field === 'telefone' || field === 'empresaId') step1Validation.clearError(field as Step1Field);
    if (field === 'email') setEmailConflictError(null);
    if (field === 'area')                                                         step2Validation.clearError('area');
    if (field === 'cargo' || field === 'registro' || field === 'especialidade')  step3Validation.clearError(field as Step3Field);
    if (field === 'senha' || field === 'confirmarSenha')                         step4Validation.clearError(field as Step4Field);
  }

  function validateStep(s: number): boolean {
    if (s === 1) return step1Validation.validate({ nome: form.nome, email: form.email, telefone: form.telefone, empresaId: form.empresaId });
    if (s === 2) return step2Validation.validate({ area: form.area });
    if (s === 3) return step3Validation.validate({ cargo: form.cargo, registro: form.registro, especialidade: form.especialidade });
    if (s === 4) return step4Validation.validate({ senha: form.senha, confirmarSenha: form.confirmarSenha });
    return true;
  }

  function nextStep() { if (!validateStep(step)) return; setStep(s => Math.min(s + 1, 5)); }
  function prevStep() {
    step1Validation.clearAll(); step2Validation.clearAll();
    step3Validation.clearAll(); step4Validation.clearAll();
    setStep(s => Math.max(s - 1, 1));
  }

  function clearAllErrors() {
    step1Validation.clearAll(); step2Validation.clearAll();
    step3Validation.clearAll(); step4Validation.clearAll();
  }

  function openNew() {
    if (!canCreate) return;
    setIsEditing(false); setSelectedProfissional(null);
    setForm(FORM_INITIAL); clearAllErrors(); setStep(1); setIsModalOpen(true);
  }

  function openEdit(p: Profissional) {
    if (!canEdit) return;
    setIsEditing(true); setSelectedProfissional(p);
    setForm({
      nome: p.name, email: p.email, telefone: p.phone,
      area: p.area as AreaType, cargo: p.cargo as Cargo,
      especialidade: p.especialidade, registro: p.registro,
      status: p.status, observacoes: p.observacoes || '',
      senha: '', confirmarSenha: '',
      useCustomPermissions: p.customPermissions !== null,
      customPermissions: p.customPermissions ?? [],
      empresaId: '',
    });
    clearAllErrors(); setStep(1); setIsDetailOpen(false); setIsModalOpen(true);
  }

  function openDetail(p: Profissional) { setSelectedProfissional(p); setIsDetailOpen(true); }

  function openDeleteConfirm(p: Profissional) {
    setProfissionalToDelete(p);
    setIsDetailOpen(false);
    setIsDeleteOpen(true);
  }

  function handleClose() {
    setForm(FORM_INITIAL); clearAllErrors(); setIsModalOpen(false);
    setSelectedProfissional(null); setStep(1);
    setShowSenha(false); setShowConfirm(false); setIsEditing(false);
    setApiError(null); setEmailConflictError(null);
  }

  async function handleDelete() {
    if (!profissionalToDelete) return;
    try {
      setDeleteLoading(true);
      await inativarProfissional(profissionalToDelete.id);
      await fetchProfissionais();
      setIsDeleteOpen(false);
      setProfissionalToDelete(null);
      setIsSuccessOpen(true);
    } catch (err: any) {
      console.error('[Profissionais] Erro ao excluir:', err);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleSave() {
    if (saveLoading) return;
    if (step === 4 && !validateStep(4)) return;
    if (form.senha && form.senha !== form.confirmarSenha) { step4Validation.clearAll(); return; }

    try {
      setSaveLoading(true);
      setApiError(null);

      const backendCargo = CARGO_TO_BACKEND[form.cargo] || form.cargo.toUpperCase();

      if (isEditing && selectedProfissional) {
        const payload: Record<string, unknown> = {
          nome:          form.nome,
          email:         form.email,
          cargo:         backendCargo,
          telefone:      form.telefone,
          especialidade: form.especialidade || undefined,
          registro:      form.registro || undefined,
          observacoes:   form.observacoes || undefined,
        };
        if (form.senha) payload.senha = form.senha;

        await atualizarProfissional(selectedProfissional.id, payload as any);
      } else {
        await criarProfissional({
          nome:          form.nome,
          email:         form.email,
          senha:         form.senha,
          cargo:         backendCargo,
          telefone:      form.telefone,
          especialidade: form.especialidade || undefined,
          registro:      form.registro || undefined,
          observacoes:   form.observacoes || undefined,
          empresaId:     form.empresaId ? Number(form.empresaId) : undefined,
        });
      }

      await fetchProfissionais();
      handleClose();
    } catch (err: any) {
      console.error('[Profissionais] Erro ao salvar:', err);
      const is409 = err?.status === 409 || err?.message?.includes('409') || err?.message?.toLowerCase().includes('duplicado') || err?.message?.toLowerCase().includes('integridade');
      if (is409) {
        setEmailConflictError('Este e-mail já está cadastrado no sistema. Use outro e-mail.');
        setApiError(null);
        setStep(1); 
      } else {
        const msg = err?.response?.data?.mensagem || err?.message || 'Erro ao salvar profissional.';
        setApiError(msg);
      }
    } finally {
      setSaveLoading(false);
    }
  }

  const errors1 = step1Validation.errors;
  const errors2 = step2Validation.errors;
  const errors3 = step3Validation.errors;
  const errors4 = step4Validation.errors;

  function renderStepContent() {
    switch (step) {
      case 1:
        return (
          <StepSection>
            <SectionLabel>Dados Pessoais</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Nome Completo *" placeholder="Ex: Ana Beatriz Lima" value={form.nome}
                  onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s.]/g, ''))}
                  maxLength={80} error={errors1.nome} />
              </div>
              <Input label="E-mail de Acesso *" type="email" placeholder="Digite seu e-mail"
                value={form.email} onChange={e => handleChange('email', e.target.value)} error={emailConflictError || errors1.email} />
              <Input label="Telefone *" mask="telefone" value={form.telefone} inputMode="numeric"
                maxLength={15} onValueChange={v => handleChange('telefone', v)} error={errors1.telefone} />
              {isSuperAdmin && !isEditing && (
                <div style={{ gridColumn: 'span 2' }}>
                  <Select
                    label="Clínica (empresa) *"
                    placeholder="Selecione a clínica..."
                    value={form.empresaId}
                    onChange={v => handleChange('empresaId', v)}
                    options={empresas.map(e => ({ value: String(e.id), label: e.nome }))}
                    error={errors1.empresaId}
                  />
                </div>
              )}
            </FormGrid>
          </StepSection>
        );

      case 2:
        return (
          <StepSection>
            <SectionLabel>Selecione a Área de Atuação</SectionLabel>
            {errors2.area && <p style={{ color: '#e74c3c', fontSize: '0.82rem', margin: '4px 0 12px' }}>{errors2.area}</p>}
            <AreaGrid>
              <AreaCard $active={form.area === 'tecnica'} onClick={() => handleChange('area', 'tecnica')}>
                <AreaIcon><AreaTecnicaIcon /></AreaIcon>
                <AreaTitle>Área Técnica</AreaTitle>
                <AreaDesc>Esteticista, Biomédico, Enfermeiro, Dermatologista, Fisioterapeuta</AreaDesc>
              </AreaCard>
              <AreaCard $active={form.area === 'administrativa'} onClick={() => handleChange('area', 'administrativa')}>
                <AreaIcon><AreaAdminIcon /></AreaIcon>
                <AreaTitle>Área Administrativa</AreaTitle>
                <AreaDesc>Recepcionista, Gerente de Clínica, Financeiro</AreaDesc>
              </AreaCard>
            </AreaGrid>
          </StepSection>
        );

      case 3:
        return (
          <StepSection>
            <SectionLabel>Cargo — {form.area === 'tecnica' ? 'Área Técnica' : 'Área Administrativa'}</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: 10, marginTop: 0 }}>Selecione o cargo do profissional:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10 }}>
                  {cargoOptions.map(opt => {
                    const cfg = ALL_CARGO_CONFIG[opt.value];
                    return (
                      <CargoCard key={opt.value} $active={form.cargo === opt.value} onClick={() => handleChange('cargo', opt.value)}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>{cfg.icon}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{cfg.label}</span>
                        <span style={{ fontSize: '0.72rem', color: '#aaa', lineHeight: 1.4 }}>{cfg.desc}</span>
                      </CargoCard>
                    );
                  })}
                </div>
                {errors3.cargo && <p style={{ color: '#e74c3c', fontSize: '0.82rem', marginTop: 6 }}>{errors3.cargo}</p>}
              </div>
              {cargoConfig?.requiresRegistro && (
                <Input label={`${cargoConfig.registroLabel} *`} placeholder={cargoConfig.registroPlaceholder}
                  value={form.registro} onChange={e => handleChange('registro', e.target.value.toUpperCase())}
                  maxLength={30} error={errors3.registro} />
              )}
              {cargoConfig?.requiresEspecialidade && cargoConfig.especialidades && (
                <Select key={`esp-${form.cargo}`} label="Área de Especialização *" options={cargoConfig.especialidades}
                  placeholder="Selecione..." value={form.especialidade}
                  onChange={v => handleChange('especialidade', v)} error={errors3.especialidade} />
              )}
              {isEditing && (
                <div style={{ gridColumn: cargoConfig?.requiresRegistro || cargoConfig?.requiresEspecialidade ? 'auto' : 'span 2' }}>
                  <Select key={`status-${selectedProfissional?.id}`} label="Status do Profissional"
                    options={statusOptions} value={form.status} onChange={v => handleChange('status', v)} />
                  {form.status === 'inativo' && (
                    <div style={{ padding: '8px 12px', borderLeft: '3px solid #856404', borderRadius: 8, color: '#856404', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 2 }}>
                      <svg style={{ flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      O acesso deste profissional ao sistema será desativado.
                    </div>
                  )}
                </div>
              )}
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Observações" placeholder="Informações adicionais sobre o profissional..."
                  maxLength={300} value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
              </div>
            </FormGrid>
          </StepSection>
        );

      case 4:
        return (
          <StepSection>
            <SectionLabel>{isEditing ? 'Alterar Senha (opcional)' : 'Senha de Acesso ao Sistema'}</SectionLabel>
            <FormGrid>
              <div style={{ position: 'relative' }}>
                <Input label={isEditing ? 'Nova Senha' : 'Senha *'} type={showSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha" value={form.senha}
                  onChange={e => handleChange('senha', e.target.value)} error={errors4.senha} />
                <EyeBtn type="button" onClick={() => setShowSenha(p => !p)} tabIndex={-1}>
                  {showSenha ? <EyeOffIcon /> : <EyeOnIcon />}
                </EyeBtn>
              </div>
              <div style={{ position: 'relative' }}>
                <Input label={isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha *'} type={showConfirm ? 'text' : 'password'}
                  placeholder="Digite sua senha" value={form.confirmarSenha}
                  onChange={e => handleChange('confirmarSenha', e.target.value)} error={errors4.confirmarSenha} />
                <EyeBtn type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                  {showConfirm ? <EyeOffIcon /> : <EyeOnIcon />}
                </EyeBtn>
              </div>
              {isEditing && <PasswordHint style={{ gridColumn: 'span 2' }}>Deixe os campos em branco para manter a senha atual.</PasswordHint>}

              <div style={{ gridColumn: 'span 2', background: '#fdf9f5', borderRadius: 12, padding: 16, border: '1px solid #f0ebe4' }}>
                <p style={{ fontSize: '0.77rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Resumo do Cadastro</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                  {([
                    ['Nome',          form.nome],
                    ['E-mail',        form.email],
                    ['Telefone',      form.telefone],
                    ['Área',          form.area === 'tecnica' ? 'Técnica' : 'Administrativa'],
                    ['Cargo',         cargoConfig?.label || '—'],
                    ['Especialidade', cargoConfig?.especialidades?.find(e => e.value === form.especialidade)?.label || form.especialidade || '—'],
                    ['Registro',      form.registro || '—'],
                    ...(isEditing ? [['Status', form.status === 'ativo' ? 'Ativo' : 'Inativo'] as [string, string]] : []),
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label}>
                      <span style={{ fontSize: '0.72rem', color: '#bbb', display: 'block' }}>{label}</span>
                      <span style={{ fontSize: '0.83rem', color: '#555', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FormGrid>
          </StepSection>
        );

      case 5:
        return (
          <StepSection>
            <SectionLabel>Permissões de Acesso</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.7rem',
                  background: form.useCustomPermissions ? '#fdf0e8' : '#f0ebe4',
                  color: form.useCustomPermissions ? '#c97a3a' : '#8a7560',
                  padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                }}>
                  {form.useCustomPermissions ? '✎ Personalizado' : '● Padrão do cargo'}
                </span>
                {form.useCustomPermissions && (() => {
                  const added   = form.customPermissions.filter(p => !defaultPermsForCargo.includes(p));
                  const removed = defaultPermsForCargo.filter(p => !form.customPermissions.includes(p));
                  const total = added.length + removed.length;
                  if (total === 0) return null;
                  return (
                    <span style={{ fontSize: '0.68rem', color: '#999' }}>
                      {added.length > 0 && <span style={{ color: '#3a9c3a' }}>+{added.length} </span>}
                      {removed.length > 0 && <span style={{ color: '#c93a3a' }}>−{removed.length} </span>}
                      alteração(ões)
                    </span>
                  );
                })()}
              </div>
              {form.useCustomPermissions ? (
                <button onClick={resetToDefault} style={{ fontSize: '0.72rem', color: '#e74c3c', background: 'none', border: '1px solid #e74c3c', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>
                  ↩ Restaurar padrão
                </button>
              ) : (
                <button onClick={activateCustomPermissions} style={{ fontSize: '0.72rem', color: '#BBA188', background: 'none', border: '1px solid #BBA188', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>
                  ✎ Personalizar
                </button>
              )}
            </div>

            {!form.useCustomPermissions && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fdf9f5', border: '1px solid #f0ebe4', fontSize: '0.78rem', color: '#999', marginBottom: 14 }}>
                Exibindo permissões padrão do cargo <strong style={{ color: '#8a7560' }}>{cargoConfig?.label}</strong>. Clique em <strong style={{ color: '#BBA188' }}>Personalizar</strong> para ajustar acessos individualmente.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PERMISSION_GROUPS.map(group => {
                const groupHasDefault = group.perms.some(p => defaultPermsForCargo.includes(p));
                if (!form.useCustomPermissions && !groupHasDefault) return null;

                return (
                  <div key={group.label} style={{ border: '1px solid #f0ebe4', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ background: '#fdf9f5', padding: '5px 12px', fontSize: '0.7rem', fontWeight: 700, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #f0ebe4' }}>
                      {group.label}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0 }}>
                      {group.perms.map(perm => {
                        const isDefault   = defaultPermsForCargo.includes(perm);
                        const isActive    = form.useCustomPermissions ? form.customPermissions.includes(perm) : isDefault;
                        const isCustomOn  = form.useCustomPermissions && isActive && !isDefault;
                        const isCustomOff = form.useCustomPermissions && !isActive && isDefault;

                        return (
                          <div
                            key={perm}
                            onClick={() => form.useCustomPermissions && toggleCustomPerm(perm)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '7px 12px',
                              cursor: form.useCustomPermissions ? 'pointer' : 'default',
                              borderBottom: '1px solid #f9f5f0',
                              background: isCustomOn ? 'rgba(106,191,105,0.06)' : isCustomOff ? 'rgba(220,80,80,0.04)' : 'white',
                              transition: 'background 0.15s',
                            }}
                          >
                            <div style={{
                              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                              border: `1.5px solid ${isActive ? (isCustomOn ? '#6abf69' : '#BBA188') : (isCustomOff ? '#e74c3c' : '#ddd')}`,
                              background: isActive ? (isCustomOn ? '#6abf69' : '#BBA188') : 'white',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}>
                              {isActive && (
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: isActive ? '#444' : '#bbb', flex: 1, textDecoration: isCustomOff ? 'line-through' : 'none' }}>
                              {PERM_LABEL[perm] ?? perm}
                            </span>
                            {isCustomOn  && <span style={{ fontSize: '0.6rem', background: '#e8fde8', color: '#3a9c3a', borderRadius: 4, padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>+EXTRA</span>}
                            {isCustomOff && <span style={{ fontSize: '0.6rem', background: '#fde8e8', color: '#c93a3a', borderRadius: 4, padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>REMOVIDO</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {form.useCustomPermissions && (() => {
              const added   = form.customPermissions.filter(p => !defaultPermsForCargo.includes(p));
              const removed = defaultPermsForCargo.filter(p => !form.customPermissions.includes(p));
              if (added.length === 0 && removed.length === 0) return (
                <div style={{ marginTop: 12, padding: '8px 14px', background: '#f5fdf5', borderRadius: 8, border: '1px solid #d4edda', fontSize: '0.75rem', color: '#3a9c3a', textAlign: 'center' }}>
                  ✓ Igual ao padrão — nenhuma alteração
                </div>
              );
              return (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#fdf9f5', borderRadius: 10, border: '1px solid #f0ebe4', fontSize: '0.75rem' }}>
                  {added.length > 0 && (
                    <div style={{ marginBottom: removed.length > 0 ? 6 : 0 }}>
                      <span style={{ color: '#3a9c3a', fontWeight: 700 }}>+{added.length} acesso(s) extra: </span>
                      <span style={{ color: '#666' }}>{added.map(p => PERM_LABEL[p] ?? p).join(', ')}</span>
                    </div>
                  )}
                  {removed.length > 0 && (
                    <div>
                      <span style={{ color: '#c93a3a', fontWeight: 700 }}>−{removed.length} acesso(s) removido(s): </span>
                      <span style={{ color: '#666' }}>{removed.map(p => PERM_LABEL[p] ?? p).join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </StepSection>
        );

      default: return null;
    }
  }

  const modalFooter = (
    <WizardNav>
      {step > 1
        ? <Button variant="outline" onClick={prevStep}>Voltar</Button>
        : <Button variant="outline" onClick={handleClose}>Cancelar</Button>
      }
      {step < 5
        ? <Button variant="primary" onClick={nextStep}>Continuar</Button>
        : <Button variant="primary" loading={saveLoading} onClick={handleSave}>{isEditing ? 'Salvar Alterações' : 'Cadastrar Profissional'}</Button>
      }
    </WizardNav>
  );

  if (!canRead) {
    return (
      <Container>
        <PermissionGuard permission="profissionais.read" showDenied />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Profissionais</Title>
        <PermissionGuard permission="profissionais.create">
          <Button variant="primary"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
            onClick={openNew}
          >
            Cadastrar Profissional
          </Button>
        </PermissionGuard>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Profissionais" value={totalProfissionais} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <StatCard label="Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Inativos" value={inativos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>} />
        <StatCard label="Atendimentos Total" value={totalAtend} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M9 3h6"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M21 9v6"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/><path d="M15 21H9"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M3 15V9"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <input type="text" name="prevent-autofill-name" autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="email" name="prevent-autofill-email" autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="password" name="prevent-autofill-pass" autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled type="search" placeholder="Buscar por nome ou e-mail..." value={search}
            onChange={e => handleSearchChange(e.target.value)} autoComplete="off"
            name="search-profissionais-filter" data-form-type="other" data-lpignore="true" />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'status' ? null : 'status')}>
              <span>{filterStat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'status' && (
              <DropdownList>
                {filterStatus.map(s => <DropdownItem key={s} $active={filterStat === s} onClick={() => handleFilterStatChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'area' ? null : 'area')}>
              <span>{filterArea}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'area' && (
              <DropdownList>
                {filterAreas.map(a => <DropdownItem key={a} $active={filterArea === a} onClick={() => handleFilterAreaChange(a)}>{a}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterStat !== 'Todos' || filterArea !== 'Todos') && (
            <ClearFilterBtn onClick={handleClearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 596 }}>
        <TableWrapper style={{ flex: 1 }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="22%">Profissional</Th>
                <Th $width="11%">Telefone</Th>
                <Th $width="7%">Área</Th>
                <Th $width="11%">Cargo</Th>
                <Th $width="11%">Especialidade</Th>
                <Th $width="10%">Registro</Th>
                <Th $width="5%" $center>Atend.</Th>
                <Th $width="8%">Últ. Acesso</Th>
                <Th $width="5%">Status</Th>
                <Th $width="10%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={10}>
                  <EmptyState>
                    <p style={{ color: '#bbb' }}>Carregando profissionais...</p>
                  </EmptyState>
                </td></tr>
              ) : apiError ? (
                <tr><td colSpan={10}>
                  <EmptyState>
                    <p style={{ color: '#e74c3c' }}>{apiError}</p>
                    <button onClick={fetchProfissionais} style={{ marginTop: 8, padding: '6px 16px', background: '#BBA188', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                      Tentar novamente
                    </button>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={10}>
                  <EmptyState>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <h3>Nenhum profissional encontrado</h3>
                    <p>Tente ajustar os filtros</p>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.map((p, i) => (
                <Tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar $color={avatarColors[(startIndex + i) % avatarColors.length]}>
                        {getInitials(p.name)}
                      </Avatar>
                      <ProfissionalInfo>
                        <ProfissionalName>
                          {p.name}
                          {p.customPermissions !== null && (
                            <span title="Permissões personalizadas" style={{ marginLeft: 5, fontSize: '0.6rem', background: '#fdf0e8', color: '#c97a3a', borderRadius: 4, padding: '1px 4px', fontWeight: 700, verticalAlign: 'middle' }}>✎</span>
                          )}
                        </ProfissionalName>
                        <ProfissionalEmail>{p.email}</ProfissionalEmail>
                      </ProfissionalInfo>
                    </div>
                  </Td>
                  <Td $muted>{p.phone}</Td>
                  <Td>
                    <Badge $bg={p.area === 'tecnica' ? '#e8f5fd' : '#fdf8e8'} $color={p.area === 'tecnica' ? '#3a7dc9' : '#c9a03a'}>
                      {p.area === 'tecnica' ? 'Técnica' : 'Admin.'}
                    </Badge>
                  </Td>
                  <Td>
                    <RoleTag $bg={cargoTagColors[p.cargo]?.bg} $color={cargoTagColors[p.cargo]?.color}>
                      {ALL_CARGO_CONFIG[p.cargo]?.label || p.cargo}
                    </RoleTag>
                  </Td>
                  <Td $muted>{getEspecialidadeLabel(p.cargo, p.especialidade)}</Td>
                  <Td>
                    {p.registro
                      ? <code style={{ fontSize: '0.71rem', color: '#888', background: '#f5f5f5', padding: '2px 5px', borderRadius: 4 }}>{p.registro}</code>
                      : <span style={{ color: '#ccc' }}>—</span>
                    }
                  </Td>
                  <Td $center $bold>{p.atendimentos || '—'}</Td>
                  <Td $muted>{p.ultimoAcesso}</Td>
                  <Td>
                    <Badge $bg={statusColors[p.status]?.bg ?? '#f5f5f5'} $color={statusColors[p.status]?.color ?? '#888'}>
                      {p.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver detalhes" onClick={() => openDetail(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </IconBtn>
                      {canEdit && (
                        <IconBtn title="Editar" onClick={() => openEdit(p)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </IconBtn>
                      )}
                      {canEdit && (
                        <IconBtn
                          title="Excluir"
                          onClick={() => openDeleteConfirm(p)}
                          style={{ color: '#e74c3c', borderColor: '#fde8e8' }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = '#e74c3c';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e74c3c';
                            (e.currentTarget as HTMLButtonElement).style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'white';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = '#fde8e8';
                            (e.currentTarget as HTMLButtonElement).style.color = '#e74c3c';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </IconBtn>
                      )}
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} closeOnOverlayClick={false} title="Ficha do Profissional" size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <PermissionGuard permission="profissionais.edit">
              <Button variant="outline"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                onClick={() => selectedProfissional && openEdit(selectedProfissional)}
              >Editar Ficha</Button>
            </PermissionGuard>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selectedProfissional && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selectedProfissional.name)}</DetailAvatar>
              <div style={{ flex: 1 }}>
                <DetailName>{selectedProfissional.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selectedProfissional.phone}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selectedProfissional.email}
                  </DetailMetaItem>
                </DetailMeta>
                <StatsRow style={{ marginTop: 10 }}>
                  <StatPill $color="#BBA188">{selectedProfissional.atendimentos} atendimentos</StatPill>
                  <StatPill $color={selectedProfissional.status === 'ativo' ? '#8a7560' : '#888'}>{selectedProfissional.status === 'ativo' ? 'Ativo' : 'Inativo'}</StatPill>
                  <StatPill $color={selectedProfissional.area === 'tecnica' ? '#3a7dc9' : '#c9a03a'}>{selectedProfissional.area === 'tecnica' ? 'Área Técnica' : 'Área Administrativa'}</StatPill>
                  {selectedProfissional.customPermissions !== null && <StatPill $color="#c97a3a">✎ Permissões personalizadas</StatPill>}
                </StatsRow>
              </div>
            </DetailHeader>

            {selectedProfissional.observacoes && (
              <ObsBox><strong>⚠ Observações: </strong>{selectedProfissional.observacoes}</ObsBox>
            )}

            <DetailSection>
              <DetailSectionTitle>Dados Profissionais</DetailSectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Cargo</InfoLabel>
                  <InfoValue>
                    <RoleTag $bg={cargoTagColors[selectedProfissional.cargo]?.bg} $color={cargoTagColors[selectedProfissional.cargo]?.color}>
                      {ALL_CARGO_CONFIG[selectedProfissional.cargo]?.label || selectedProfissional.cargo}
                    </RoleTag>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Área de Atuação</InfoLabel>
                  <InfoValue>{selectedProfissional.area === 'tecnica' ? 'Técnica' : 'Administrativa'}</InfoValue>
                </InfoItem>
                {selectedProfissional.especialidade && (
                  <InfoItem>
                    <InfoLabel>Especialidade</InfoLabel>
                    <InfoValue>{getEspecialidadeLabel(selectedProfissional.cargo, selectedProfissional.especialidade)}</InfoValue>
                  </InfoItem>
                )}
                {selectedProfissional.registro && (
                  <InfoItem>
                    <InfoLabel>Registro Profissional</InfoLabel>
                    <InfoValue>
                      <code style={{ fontSize: '0.83rem', color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5 }}>{selectedProfissional.registro}</code>
                    </InfoValue>
                  </InfoItem>
                )}
                <InfoItem>
                  <InfoLabel>Último Acesso</InfoLabel>
                  <InfoValue>{selectedProfissional.ultimoAcesso}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Total de Atendimentos</InfoLabel>
                  <InfoValue style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.1rem' }}>{selectedProfissional.atendimentos}</InfoValue>
                </InfoItem>
                {selectedProfissional.customPermissions !== null && (
                  <InfoItem style={{ gridColumn: 'span 2' }}>
                    <InfoLabel>Permissões Personalizadas</InfoLabel>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedProfissional.customPermissions.length === 0
                        ? <span style={{ fontSize: '0.78rem', color: '#bbb' }}>Nenhuma permissão ativa</span>
                        : selectedProfissional.customPermissions.map(perm => (
                          <span key={perm} style={{ fontSize: '0.68rem', background: '#fdf0e8', color: '#c97a3a', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>
                            {PERM_LABEL[perm] ?? perm}
                          </span>
                        ))
                      }
                    </div>
                  </InfoItem>
                )}
              </InfoGrid>
            </DetailSection>
          </DetailModal>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setProfissionalToDelete(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Excluir Profissional"
        message={profissionalToDelete ? `Tem certeza que deseja excluir o profissional "${profissionalToDelete.name}"? Esta ação irá desativar o acesso ao sistema e não pode ser desfeita.` : ''}
      />
      <SucessModal
        isOpen={isSuccessOpen}
        title="Profissional excluído"
        message="O profissional foi excluído com sucesso."
        onClose={() => setIsSuccessOpen(false)}
      />
      <PermissionGuard anyOf={['profissionais.create', 'profissionais.edit']}>
        <Modal isOpen={isModalOpen} onClose={handleClose} closeOnOverlayClick={false}
          title={isEditing ? 'Editar Profissional' : 'Cadastrar Profissional'} size="lg" footer={modalFooter}
        >
          <form autoComplete="off" onSubmit={e => e.preventDefault()} style={{ display: 'contents' }}>
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
            {apiError && (
              <div style={{ margin: '0 0 12px', padding: '10px 14px', background: '#fde8e8', borderRadius: 8, border: '1px solid #f5c0c0', color: '#c93a3a', fontSize: '0.82rem' }}>
                {apiError}
              </div>
            )}
            {renderStepContent()}
          </form>
        </Modal>
      </PermissionGuard>
    </Container>
  );
}