'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import {
  Container, Header, Title, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, PatientGrid, PatientCard, PatientCardHeader, PatientAvatar, PatientInfo,
  PatientName, PatientSub, PatientCardBody, TimelineWrap, TimelineItem,
  TimelineDot, TimelineContent, TimelineDate, TimelineTitle, TimelineDesc,
  TimelineTag, PatientCardFooter, DetailModal, DetailHeader, DetailAvatar,
  DetailName, DetailMeta, DetailMetaItem, DetailSection, DetailSectionTitle,
  FullTimeline, FullTimelineItem, FullDot, FullContent, FullDate,
  FullTitle, FullDesc, FullTags, FullTag, StatsRow, StatPill,
  EmptyState, FormGrid,
  CardsContainer, CardsWrapper, PaginationContainer,
} from './styles';

type NovoPacienteField = 'nome' | 'cpf' | 'nascimento' | 'telefone' | 'email';
type AtendimentoField  = 'procedure' | 'units' | 'value' | 'professional' | 'lote' | 'date';

interface NovoPacienteForm {
  nome: string; cpf: string; nascimento: string;
  telefone: string; email: string; observacoes: string;
}

interface AtendimentoForm {
  date: string; procedure: string; units: string;
  value: string; professional: string; lote: string;
  nextVisit: string; observacoes: string;
}

const PACIENTE_INITIAL: NovoPacienteForm = {
  nome: '', cpf: '', nascimento: '', telefone: '', email: '', observacoes: '',
};

const ATENDIMENTO_INITIAL: AtendimentoForm = {
  date: '', procedure: '', units: '', value: '', professional: '', lote: '', nextVisit: '', observacoes: '',
};

const PACIENTE_VALIDATION = [
  { key: 'nome'       as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Nome completo é obrigatório' : null },
  { key: 'cpf'        as NovoPacienteField, validate: (v: string) => !v.trim() ? 'CPF é obrigatório' : null },
  { key: 'nascimento' as NovoPacienteField, validate: (v: string) => !v ? 'Data de nascimento é obrigatória' : null },
  { key: 'telefone'   as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório' : null },
  { key: 'email'      as NovoPacienteField, validate: (v: string) => !v.trim() ? 'E-mail é obrigatório' : null },
];

const ATENDIMENTO_VALIDATION = [
  { key: 'date'         as AtendimentoField, validate: (v: string) => !v ? 'Data do atendimento é obrigatória' : null },
  { key: 'procedure'    as AtendimentoField, validate: (v: string) => !v.trim() ? 'Procedimento é obrigatório' : null },
  { key: 'units'        as AtendimentoField, validate: (v: string) => !v.trim() ? 'Quantidade/unidade é obrigatória' : null },
  { key: 'value'        as AtendimentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Valor é obrigatório' : null },
  { key: 'professional' as AtendimentoField, validate: (v: string) => !v.trim() ? 'Profissional é obrigatório' : null },
  { key: 'lote'         as AtendimentoField, validate: (v: string) => !v.trim() ? 'Lote ANVISA é obrigatório' : null },
];

const filterOptions = ['Todos', 'Ativos', 'Inativos', 'Alto Valor'];

const procedureOptions = [
  { value: 'Botox Facial',         label: 'Botox Facial'         },
  { value: 'Preenchimento Labial', label: 'Preenchimento Labial' },
  { value: 'Bioestimulador',       label: 'Bioestimulador'       },
  { value: 'Fio de PDO',           label: 'Fio de PDO'           },
  { value: 'Microagulhamento',     label: 'Microagulhamento'     },
  { value: 'Toxina Botulínica',    label: 'Toxina Botulínica'    },
  { value: 'Outro',                label: 'Outro'                },
];

const procedureColors: Record<string, string> = {
  'Botox Facial':         '#BBA188',
  'Preenchimento Labial': '#EBD5B0',
  'Bioestimulador':       '#1b1b1b',
  'Fio de PDO':           '#a8906f',
  'Microagulhamento':     '#8a7560',
  'Toxina Botulínica':    '#BBA188',
  'Outro':                '#BBA188',
};

type HistoryItem = {
  id: number; date: string; procedure: string; units: string;
  value: number; professional: string; lote: string; status: string;
};

type Patient = {
  id: number; name: string; phone: string; email: string;
  cpf: string;
  birthdate: string; since: string; status: string;
  totalSpent: number; totalSessions: number;
  lastVisit: string; nextVisit: string | null;
  observations: string; history: HistoryItem[];
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getAge(birthdate: string) {
  if (!birthdate) return 0;
  const diff = Date.now() - new Date(birthdate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  if (dateStr.includes('/')) return dateStr;
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}

function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
}

function parseMoeda(v: string): number {
  const clean = v.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function todayInputDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Formata CPF: 00000000000 → 000.000.000-00
function formatCpf(cpf: string): string {
  if (!cpf) return '';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

import { listarPacientes, criarPaciente, PacienteAPI } from '@/services/pacienteService';
import { listarProntuariosPorPaciente, ProntuarioAPI } from '@/services/prontuarioService';
import { listarProfissionais } from '@/services/profissionalService';

const CARDS_PER_PAGE = 4;

function isNewFormDirty(form: NovoPacienteForm): boolean {
  return form.nome.trim() !== '' || form.cpf.trim() !== '' || form.nascimento !== '' ||
    form.telefone.trim() !== '' || form.email.trim() !== '' || form.observacoes.trim() !== '';
}

function isEditFormDirty(form: NovoPacienteForm): boolean {
  return form.nome.trim() !== '' || form.email.trim() !== '' || form.telefone.trim() !== '' ||
    form.nascimento !== '' || form.observacoes.trim() !== '';
}

function isAtendimentoFormDirty(form: AtendimentoForm): boolean {
  return form.procedure.trim() !== '' || form.units.trim() !== '' || form.value.trim() !== '' ||
    form.professional.trim() !== '' || form.lote.trim() !== '';
}

function mapPacienteToPatient(p: PacienteAPI, history: HistoryItem[] = []): Patient {
  return {
    id:            p.id,
    name:          p.nome,
    phone:         p.telefone || p.celular || '',
    email:         p.email,
    cpf:           p.cpf || '',
    birthdate:     p.dataNascimento || '',
    since:         p.criadoEm ? new Date(p.criadoEm).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '',
    status:        p.ativo ? 'ativo' : 'inativo',
    totalSpent:    history.reduce((a, h) => a + h.value, 0),
    totalSessions: history.length,
    lastVisit:     history[0]?.date || '—',
    nextVisit:     null,
    observations:  p.observacoes || '',
    history,
  };
}

export default function HistoricoPaciente() {
  const [patients,     setPatients]     = useState<Patient[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected,     setSelected]     = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen,    setIsNewOpen]    = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [form,         setForm]         = useState<NovoPacienteForm>(PACIENTE_INITIAL);
  const [editForm,     setEditForm]     = useState<NovoPacienteForm>(PACIENTE_INITIAL);
  const [editErrors,   setEditErrors]   = useState<Partial<Record<NovoPacienteField, string>>>({});
  const [currentPage,  setCurrentPage]  = useState(1);

  // Profissionais do backend
  const [profissionaisOptions, setProfissionaisOptions] = useState<{ value: string; label: string }[]>([]);

  const [isAtendimentoOpen,     setIsAtendimentoOpen]     = useState(false);
  const [atendimentoForm,       setAtendimentoForm]       = useState<AtendimentoForm>(ATENDIMENTO_INITIAL);
  const [showCancelAtend,       setShowCancelAtend]       = useState(false);
  const [showConfirmAtend,      setShowConfirmAtend]      = useState(false);

  const [showCancelNewModal,   setShowCancelNewModal]   = useState(false);
  const [showCancelEditModal,  setShowCancelEditModal]  = useState(false);
  const [showConfirmNewModal,  setShowConfirmNewModal]  = useState(false);
  const [showConfirmEditModal, setShowConfirmEditModal] = useState(false);
  const [showSuccessModal,     setShowSuccessModal]     = useState(false);
  const [successMessage,       setSuccessMessage]       = useState('');
  const [saveNewError,         setSaveNewError]         = useState<string | null>(null);

  const {
    errors: pacienteErrors, validate: validatePaciente,
    clearError: clearPacienteError, clearAll: clearPacienteAll,
  } = useSequentialValidation<NovoPacienteField>(PACIENTE_VALIDATION);

  const {
    errors: atendErrors, validate: validateAtend,
    clearError: clearAtendError, clearAll: clearAtendAll,
  } = useSequentialValidation<AtendimentoField>(ATENDIMENTO_VALIDATION);

  // Carrega pacientes
  useEffect(() => {
    setLoading(true);
    listarPacientes('', 0, 500).then(res => {
      const pacs = res.content || [];
      setPatients(pacs.map(p => mapPacienteToPatient(p)));
    }).catch(() => {
      setPatients([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Carrega profissionais do backend
  useEffect(() => {
    listarProfissionais().then(data => {
      const ativos = data
        .filter(p => p.ativo !== false)
        .map(p => ({ value: p.nome, label: p.nome }));
      setProfissionaisOptions(ativos);
    }).catch(() => {
      setProfissionaisOptions([]);
    });
  }, []);

  const filtered = patients.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos' ||
      (filter === 'Ativos'     && p.status === 'ativo')   ||
      (filter === 'Inativos'   && p.status === 'inativo') ||
      (filter === 'Alto Valor' && p.totalSpent >= 5000);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage   = Math.min(currentPage, totalPages);
  const startIdx   = (safePage - 1) * CARDS_PER_PAGE;
  const paginated  = filtered.slice(startIdx, startIdx + CARDS_PER_PAGE);

  const totalPacientes = patients.length;
  const ativos         = patients.filter(p => p.status === 'ativo').length;
  const totalSessoes   = patients.reduce((a, p) => a + p.totalSessions, 0);
  const totalReceita   = patients.reduce((a, p) => a + p.totalSpent, 0);

  function handleSearchChange(v: string) { setSearch(v);  setCurrentPage(1); }
  function handleFilterChange(v: string) { setFilter(v);  setCurrentPage(1); setOpenDropdown(false); }
  function handleClearFilter()           { setFilter('Todos'); setCurrentPage(1); }

  function openDetail(p: Patient) { setSelected(p); setIsDetailOpen(true); }

  function syncSelected(updated: Patient) {
    setSelected(updated);
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  }

  function handleChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearPacienteError(field as NovoPacienteField);
  }

  function handleMaskedChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearPacienteError(field as NovoPacienteField);
  }

  function handleCancelNewClick() {
    if (isNewFormDirty(form)) setShowCancelNewModal(true);
    else forceCloseNew();
  }

  function forceCloseNew() {
    setForm(PACIENTE_INITIAL); clearPacienteAll(); setSaveNewError(null);
    setIsNewOpen(false); setShowCancelNewModal(false); setShowConfirmNewModal(false);
  }

  function handleSaveNewClick() {
    const ok = validatePaciente({ nome: form.nome, cpf: form.cpf, nascimento: form.nascimento, telefone: form.telefone, email: form.email });
    if (!ok) return;
    setShowConfirmNewModal(true);
  }

  async function handleConfirmNew() {
    setShowConfirmNewModal(false);
    setSaveNewError(null);
    try {
      const created = await criarPaciente({
        nome:           form.nome,
        cpf:            form.cpf.replace(/\D/g, ''),
        dataNascimento: form.nascimento,
        sexo:           'OUTRO',
        telefone:       form.telefone,
        email:          form.email,
        observacoes:    form.observacoes || undefined,
      });
      setPatients(prev => [mapPacienteToPatient(created), ...prev]);
      setIsNewOpen(false);
      setSaveNewError(null);
      setSuccessMessage('Paciente cadastrado com sucesso!');
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao cadastrar paciente. Tente novamente.';
      setSaveNewError(msg);
    }
  }

  function handleEditChange(field: keyof NovoPacienteForm, value: string) {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setEditErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validateEditForm(): boolean {
    const e: Partial<Record<NovoPacienteField, string>> = {};
    if (!editForm.nome.trim())     e.nome       = 'Nome completo é obrigatório';
    if (!editForm.cpf.trim())      e.cpf        = 'CPF é obrigatório';
    if (!editForm.nascimento)      e.nascimento = 'Data de nascimento é obrigatória';
    if (!editForm.telefone.trim()) e.telefone   = 'Telefone é obrigatório';
    if (!editForm.email.trim())    e.email      = 'E-mail é obrigatório';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  }

  // Abre edição com TODOS os dados reais do paciente, incluindo CPF formatado
  function openEdit(p: Patient) {
    setEditForm({
      nome:        p.name,
      cpf:         formatCpf(p.cpf),
      nascimento:  toInputDate(p.birthdate),
      telefone:    p.phone,
      email:       p.email,
      observacoes: p.observations,
    });
    setEditErrors({});
    setIsDetailOpen(false);
    setIsEditOpen(true);
  }

  function handleCancelEditClick() {
    if (isEditFormDirty(editForm)) setShowCancelEditModal(true);
    else forceCloseEdit();
  }

  function forceCloseEdit() {
    setEditForm(PACIENTE_INITIAL); setEditErrors({});
    setIsEditOpen(false); setShowCancelEditModal(false); setShowConfirmEditModal(false);
  }

  function handleSaveEditClick() {
    if (!validateEditForm()) return;
    setShowConfirmEditModal(true);
  }

  function handleConfirmEdit() {
    if (!selected) return;
    const updated: Patient = {
      ...selected,
      name:         editForm.nome,
      phone:        editForm.telefone,
      email:        editForm.email,
      cpf:          editForm.cpf.replace(/\D/g, ''),
      birthdate:    editForm.nascimento,
      observations: editForm.observacoes,
    };
    syncSelected(updated);
    setShowConfirmEditModal(false);
    setIsEditOpen(false);
    setSuccessMessage('Alterações salvas com sucesso!');
    setShowSuccessModal(true);
  }

  function openAtendimento() {
    setAtendimentoForm({ ...ATENDIMENTO_INITIAL, date: todayInputDate() });
    clearAtendAll();
    setIsDetailOpen(false);
    setIsAtendimentoOpen(true);
  }

  function handleAtendChange(field: keyof AtendimentoForm, value: string) {
    setAtendimentoForm(prev => ({ ...prev, [field]: value }));
    clearAtendError(field as AtendimentoField);
  }

  function handleCancelAtendClick() {
    if (isAtendimentoFormDirty(atendimentoForm)) setShowCancelAtend(true);
    else forceCloseAtend();
  }

  function forceCloseAtend() {
    setAtendimentoForm(ATENDIMENTO_INITIAL); clearAtendAll();
    setIsAtendimentoOpen(false); setShowCancelAtend(false); setShowConfirmAtend(false);
    if (selected) setIsDetailOpen(true);
  }

  function handleSaveAtendClick() {
    const ok = validateAtend({
      date:         atendimentoForm.date,
      procedure:    atendimentoForm.procedure,
      units:        atendimentoForm.units,
      value:        atendimentoForm.value,
      professional: atendimentoForm.professional,
      lote:         atendimentoForm.lote,
    });
    if (!ok) return;
    setShowConfirmAtend(true);
  }

  function handleConfirmAtend() {
    if (!selected) return;

    const valor = parseMoeda(atendimentoForm.value);

    const newItem: HistoryItem = {
      id:           Date.now(),
      date:         formatDate(atendimentoForm.date),
      procedure:    atendimentoForm.procedure,
      units:        atendimentoForm.units,
      value:        valor,
      professional: atendimentoForm.professional,
      lote:         atendimentoForm.lote,
      status:       'realizado',
    };

    const nextVisit = atendimentoForm.nextVisit
      ? formatDate(atendimentoForm.nextVisit)
      : selected.nextVisit;

    const updated: Patient = {
      ...selected,
      history:       [newItem, ...selected.history],
      totalSessions: selected.totalSessions + 1,
      totalSpent:    selected.totalSpent + valor,
      lastVisit:     formatDate(atendimentoForm.date),
      nextVisit,
      status:        'ativo',
    };

    syncSelected(updated);
    setShowConfirmAtend(false);
    setIsAtendimentoOpen(false);
    clearAtendAll();
    setSuccessMessage('Atendimento registrado com sucesso!');
    setShowSuccessModal(true);
  }

  const handleExportFicha = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (!selected) return;
    setExporting(true);
    let objectUrl: string | null = null;
    try {
      const response = await fetch('/api/relatorios/ficha-paciente', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ patient: selected }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).details ?? 'Erro ao gerar PDF');
      }
      const blob    = await response.blob();
      objectUrl     = URL.createObjectURL(blob);
      const name    = selected.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      const link    = document.createElement('a');
      link.href     = objectUrl;
      link.download = `ficha-${name}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao exportar ficha:', err);
      alert('Não foi possível gerar a ficha. Tente novamente.');
    } finally {
      setExporting(false);
      if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000);
    }
  };

  function handleSuccessClose() {
    setShowSuccessModal(false);
    setSuccessMessage('');
    setForm(PACIENTE_INITIAL);
    clearPacienteAll();
    if (selected && !isDetailOpen && !isNewOpen && !isEditOpen) {
      setIsDetailOpen(true);
    }
  }

  return (
    <Container>
      <Header>
        <Title>Histórico de Pacientes</Title>
        <Button
          type="button"
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={() => setIsNewOpen(true)}
        >
          Novo Paciente
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Pacientes" value={totalPacientes} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          trend={{ value: `${totalPacientes > 0 ? Math.round((ativos / totalPacientes) * 100) : 0}% retorno`, positive: true }}
        />
        <StatCard label="Total de Sessões" value={totalSessoes} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Receita Total" value={`R$ ${totalReceita.toLocaleString('pt-BR')}`} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <input type="text"     name="prevent-autofill-name"  autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="email"    name="prevent-autofill-email" autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <input type="password" name="prevent-autofill-pass"  autoComplete="off" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled
            type="search"
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            autoComplete="off"
            name="search-historico-filter"
            data-form-type="other"
            data-lpignore="true"
          />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => setOpenDropdown(!openDropdown)}>
              <span>{filter}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown && (
              <DropdownList>
                {filterOptions.map(f => (
                  <DropdownItem key={f} $active={filter === f} onClick={() => handleFilterChange(f)}>{f}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filter !== 'Todos' && (
            <ClearFilterBtn type="button" onClick={handleClearFilter}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <CardsContainer>
        <CardsWrapper>
          {loading ? (
            <EmptyState>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <p>Carregando pacientes...</p>
            </EmptyState>
          ) : filtered.length === 0 ? (
            <EmptyState>
              <h3>Nenhum paciente encontrado</h3>
              <p>Tente ajustar os filtros ou a busca.</p>
            </EmptyState>
          ) : (
            <PatientGrid>
              {paginated.map(patient => (
                <PatientCard key={patient.id} onClick={() => openDetail(patient)}>
                  <PatientCardHeader>
                    <PatientAvatar $color={patient.status === 'inativo' ? '#95a5a6' : '#BBA188'}>
                      {getInitials(patient.name)}
                    </PatientAvatar>
                    <PatientInfo>
                      <PatientName>{patient.name}</PatientName>
                      <PatientSub>{getAge(patient.birthdate)} anos · Cliente desde {patient.since || '—'}</PatientSub>
                      <StatsRow>
                        <StatPill $color="#BBA188">{patient.totalSessions} sessões</StatPill>
                        <StatPill $color="#8a7560">R$ {patient.totalSpent.toLocaleString('pt-BR')}</StatPill>
                        {patient.status === 'inativo' && <StatPill $color="#95a5a6">Inativo</StatPill>}
                      </StatsRow>
                    </PatientInfo>
                  </PatientCardHeader>
                  <PatientCardBody>
                    <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Últimos procedimentos
                    </div>
                    <TimelineWrap>
                      {patient.history.slice(0, 3).map((h, i) => (
                        <TimelineItem key={i}>
                          <TimelineDot $color={procedureColors[h.procedure] || '#BBA188'} />
                          <TimelineContent>
                            <TimelineDate>{h.date}</TimelineDate>
                            <TimelineTitle>{h.procedure}</TimelineTitle>
                            <TimelineDesc>{h.units} · R$ {h.value.toLocaleString('pt-BR')} · {h.professional}</TimelineDesc>
                            <TimelineTag $color={procedureColors[h.procedure] || '#BBA188'}>{h.lote}</TimelineTag>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                      {patient.history.length > 3 && (
                        <div style={{ fontSize: '0.78rem', color: '#BBA188', paddingLeft: 24, fontWeight: 600 }}>
                          +{patient.history.length - 3} procedimento(s) anteriores
                        </div>
                      )}
                      {patient.history.length === 0 && (
                        <div style={{ fontSize: '0.82rem', color: '#ccc', paddingLeft: 4 }}>
                          Nenhum procedimento registrado.
                        </div>
                      )}
                    </TimelineWrap>
                  </PatientCardBody>
                  <PatientCardFooter>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      <span style={{ fontWeight: 600, color: '#555' }}>Última visita:</span> {patient.lastVisit}
                    </div>
                    {patient.nextVisit
                      ? <div style={{ fontSize: '0.8rem', color: '#BBA188', fontWeight: 600 }}>Próxima: {patient.nextVisit}</div>
                      : <div style={{ fontSize: '0.78rem', color: '#ccc' }}>Sem agendamento</div>
                    }
                  </PatientCardFooter>
                </PatientCard>
              ))}
            </PatientGrid>
          )}
        </CardsWrapper>

        <PaginationContainer>
          <Pagination
            currentPage={safePage}
            totalItems={filtered.length}
            itemsPerPage={CARDS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationContainer>
      </CardsContainer>

      {/* ── Modal Detalhes ── */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Ficha do Paciente"
        size="lg"
        footer={
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
            <Button
              type="button"
              variant="primary"
              fullWidth
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
              onClick={openAtendimento}
            >
              Novo Atendimento
            </Button>
            <Button type="button" variant="outline" fullWidth
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
              onClick={() => selected && openEdit(selected)}
            >
              Editar Ficha
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleExportFicha}
              disabled={exporting}
              icon={exporting
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
            >
              {exporting ? 'Gerando...' : 'Exportar PDF'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        {selected && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color={selected.status === 'ativo' ? '#BBA188' : '#95a5a6'}>
                {getInitials(selected.name)}
              </DetailAvatar>
              <div>
                <DetailName>{selected.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selected.phone}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selected.email}
                  </DetailMetaItem>
                  {selected.cpf && (
                    <DetailMetaItem>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                      CPF: {formatCpf(selected.cpf)}
                    </DetailMetaItem>
                  )}
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {getAge(selected.birthdate)} anos · Nascimento: {formatDate(selected.birthdate)} · Cliente desde {selected.since || '—'}
                  </DetailMetaItem>
                </DetailMeta>
                <StatsRow style={{ marginTop: 12 }}>
                  <StatPill $color="#BBA188">{selected.totalSessions} sessões</StatPill>
                  <StatPill $color="#8a7560">R$ {selected.totalSpent.toLocaleString('pt-BR')} gastos</StatPill>
                  {selected.nextVisit && <StatPill $color="#a8906f">Próx: {selected.nextVisit}</StatPill>}
                  <StatPill $color={selected.status === 'ativo' ? '#8a7560' : '#95a5a6'}>
                    {selected.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </StatPill>
                </StatsRow>
              </div>
            </DetailHeader>

            {selected.observations && (
              <div style={{ background: '#fdf9f5', borderRadius: 10, padding: '12px 16px', border: '1px solid #f0ebe4', fontSize: '0.85rem', color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                <strong style={{ color: '#BBA188' }}>⚠ Observações: </strong>{selected.observations}
              </div>
            )}

            <DetailSection>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <DetailSectionTitle style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                  Histórico Completo de Procedimentos
                </DetailSectionTitle>
              </div>
              <div style={{ height: 1, background: '#f0ebe4', marginBottom: 14 }} />

              {selected.history.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#bbb', padding: '20px 0', textAlign: 'center' }}>
                  Nenhum procedimento registrado. Clique em &quot;Novo Atendimento&quot; para começar.
                </div>
              ) : (
                <FullTimeline>
                  {selected.history.map((h, i) => (
                    <FullTimelineItem key={i}>
                      <FullDot $color={procedureColors[h.procedure] || '#BBA188'} $first={i === 0} />
                      <FullContent>
                        <FullDate>{h.date}</FullDate>
                        <FullTitle>{h.procedure}</FullTitle>
                        <FullDesc>
                          <span>{h.units}</span><span>·</span>
                          <span style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {h.value.toLocaleString('pt-BR')}</span>
                          <span>·</span><span>{h.professional}</span>
                        </FullDesc>
                        <FullTags>
                          <FullTag $color={procedureColors[h.procedure] || '#BBA188'}>Lote: {h.lote}</FullTag>
                          <FullTag $color="#8a7560">Realizado</FullTag>
                        </FullTags>
                      </FullContent>
                    </FullTimelineItem>
                  ))}
                </FullTimeline>
              )}
            </DetailSection>
          </DetailModal>
        )}
      </Modal>

      {/* ── Modal Novo Atendimento ── */}
      <Modal
        isOpen={isAtendimentoOpen}
        onClose={handleCancelAtendClick}
        closeOnOverlayClick={false}
        title={`Novo Atendimento — ${selected?.name ?? ''}`}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelAtendClick}>Cancelar</Button>
            <Button type="button" variant="primary" onClick={handleSaveAtendClick}>Registrar Atendimento</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          {selected?.observations && (
            <div style={{ background: '#fff8f0', borderRadius: 10, padding: '10px 14px', border: '1px solid #f0ebe4', fontSize: '0.83rem', color: '#666', lineHeight: 1.5 }}>
              <strong style={{ color: '#BBA188' }}>⚠ Atenção: </strong>{selected.observations}
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Dados do Procedimento
            </div>
            <FormGrid>
              <Input
                label="Data do Atendimento *"
                type="date"
                value={atendimentoForm.date}
                onChange={e => handleAtendChange('date', e.target.value)}
                error={atendErrors.date}
              />
              <Select
                label="Procedimento *"
                options={procedureOptions}
                placeholder="Selecione..."
                value={atendimentoForm.procedure}
                onChange={v => handleAtendChange('procedure', v)}
                error={atendErrors.procedure}
              />
              <Input
                label="Quantidade / Unidade *"
                placeholder="Ex: 40U, 1ml, 1 frasco"
                value={atendimentoForm.units}
                onChange={e => handleAtendChange('units', e.target.value)}
                error={atendErrors.units}
              />
              <Input
                label="Valor Cobrado (R$) *"
                mask="moeda"
                value={atendimentoForm.value}
                inputMode="numeric"
                maxLength={14}
                onValueChange={v => handleAtendChange('value', v)}
                error={atendErrors.value}
              />
              <Select
                label="Profissional Responsável *"
                options={profissionaisOptions.length > 0 ? profissionaisOptions : [{ value: '', label: 'Carregando...' }]}
                placeholder="Selecione..."
                value={atendimentoForm.professional}
                onChange={v => handleAtendChange('professional', v)}
                error={atendErrors.professional}
              />
              <Input
                label="Lote ANVISA *"
                placeholder="Ex: BTX-2025-003"
                value={atendimentoForm.lote}
                onChange={e => handleAtendChange('lote', e.target.value.toUpperCase())}
                error={atendErrors.lote}
              />
            </FormGrid>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Próximo Retorno e Observações
            </div>
            <FormGrid>
              <Input
                label="Próxima Visita"
                type="date"
                value={atendimentoForm.nextVisit}
                onChange={e => handleAtendChange('nextVisit', e.target.value)}
              />
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Observações do Atendimento"
                  placeholder="Reações, intercorrências, orientações pós-procedimento..."
                  maxLength={400}
                  value={atendimentoForm.observacoes}
                  onChange={e => handleAtendChange('observacoes', e.target.value)}
                />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      {/* ── Modal Editar Paciente ── */}
      <Modal
        isOpen={isEditOpen}
        onClose={handleCancelEditClick}
        closeOnOverlayClick={false}
        title="Editar Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelEditClick}>Cancelar</Button>
            <Button type="button" variant="primary" onClick={handleSaveEditClick}>Salvar Alterações</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Dados Pessoais
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Nome Completo *"
                  placeholder="Digite o nome completo"
                  value={editForm.nome}
                  onChange={e => handleEditChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                  maxLength={80}
                  error={editErrors.nome}
                />
              </div>
              <Input label="E-mail *" type="email" placeholder="Digite o e-mail" value={editForm.email} onChange={e => handleEditChange('email', e.target.value)} error={editErrors.email} />
              <Input label="Telefone *" mask="telefone" placeholder="Digite o telefone" value={editForm.telefone} inputMode="numeric" maxLength={15} onValueChange={v => handleEditChange('telefone', v)} error={editErrors.telefone} />
              <Input label="Data de Nascimento *" type="date" value={editForm.nascimento} onChange={e => handleEditChange('nascimento', e.target.value)} error={editErrors.nascimento} />
              <Input label="CPF *" mask="cpf" placeholder="Digite o CPF" value={editForm.cpf} inputMode="numeric" maxLength={14} onValueChange={v => handleEditChange('cpf', v)} error={editErrors.cpf} />
            </FormGrid>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Observações
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Observações / Alergias"
                  placeholder="Digite observações de saúde relevantes ou alergias"
                  maxLength={300}
                  value={editForm.observacoes}
                  onChange={e => handleEditChange('observacoes', e.target.value)}
                />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      {/* ── Modal Novo Paciente ── */}
      <Modal
        isOpen={isNewOpen}
        onClose={handleCancelNewClick}
        closeOnOverlayClick={false}
        title="Novo Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelNewClick}>Cancelar</Button>
            <Button type="button" variant="primary" onClick={handleSaveNewClick}>Cadastrar Paciente</Button>
          </div>
        }
      >
        {saveNewError && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: 8, color: '#c0392b', fontSize: '0.85rem' }}>
            {saveNewError}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Dados Pessoais
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Nome Completo *"
                  placeholder="Digite o nome completo"
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                  maxLength={80}
                  error={pacienteErrors.nome}
                />
              </div>
              <Input label="E-mail *" type="email" placeholder="Digite o e-mail" value={form.email} onChange={e => handleChange('email', e.target.value)} error={pacienteErrors.email} />
              <Input label="Telefone *" mask="telefone" placeholder="Digite o telefone" value={form.telefone} inputMode="numeric" maxLength={15} onValueChange={v => handleMaskedChange('telefone', v)} error={pacienteErrors.telefone} />
              <Input label="Data de Nascimento *" type="date" value={form.nascimento} onChange={e => handleChange('nascimento', e.target.value)} error={pacienteErrors.nascimento} />
              <Input label="CPF *" mask="cpf" placeholder="Digite o CPF" value={form.cpf} inputMode="numeric" maxLength={14} onValueChange={v => handleMaskedChange('cpf', v)} error={pacienteErrors.cpf} />
            </FormGrid>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Observações
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Observações / Alergias"
                  placeholder="Digite observações de saúde relevantes ou alergias"
                  maxLength={300}
                  value={form.observacoes}
                  onChange={e => handleChange('observacoes', e.target.value)}
                />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      {/* ── Modais reutilizáveis ── */}
      <CancelModal
        isOpen={showCancelNewModal}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceCloseNew}
        onCancel={() => setShowCancelNewModal(false)}
      />
      <CancelModal
        isOpen={showCancelEditModal}
        title="Deseja cancelar?"
        message="Você fez alterações na ficha. Se continuar, as alterações serão perdidas."
        onConfirm={forceCloseEdit}
        onCancel={() => setShowCancelEditModal(false)}
      />
      <CancelModal
        isOpen={showCancelAtend}
        title="Deseja cancelar o atendimento?"
        message="Os dados preenchidos serão perdidos. Deseja continuar?"
        onConfirm={forceCloseAtend}
        onCancel={() => setShowCancelAtend(false)}
      />

      <ConfirmModal
        isOpen={showConfirmNewModal}
        title="Cadastrar paciente?"
        message={`Tem certeza que deseja cadastrar ${form.nome || 'este paciente'}?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmNew}
        onCancel={() => setShowConfirmNewModal(false)}
      />
      <ConfirmModal
        isOpen={showConfirmEditModal}
        title="Salvar alterações?"
        message="Tem certeza que deseja salvar as alterações feitas na ficha deste paciente?"
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmEdit}
        onCancel={() => setShowConfirmEditModal(false)}
      />
      <ConfirmModal
        isOpen={showConfirmAtend}
        title="Registrar atendimento?"
        message={`Confirma o registro do atendimento de ${selected?.name ?? 'este paciente'}?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmAtend}
        onCancel={() => setShowConfirmAtend(false)}
      />

      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message={successMessage}
        onClose={handleSuccessClose}
        buttonText="Continuar"
      />
    </Container>
  );
}