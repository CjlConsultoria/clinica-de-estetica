'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
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
  PaginationWrapper, PaginationInfo, PaginationControls,
  PageButton, PageEllipsis, PaginationArrow,
} from './styles';

type NovoPacienteField =
  | 'nome' | 'cpf' | 'nascimento' | 'telefone' | 'email';

interface NovoPacienteForm {
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  email: string;
  observacoes: string;
}

const FORM_INITIAL: NovoPacienteForm = {
  nome: '', cpf: '', nascimento: '', telefone: '', email: '', observacoes: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'       as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Nome completo é obrigatório' : null },
  { key: 'cpf'        as NovoPacienteField, validate: (v: string) => !v.trim() ? 'CPF é obrigatório' : null },
  { key: 'nascimento' as NovoPacienteField, validate: (v: string) => !v ? 'Data de nascimento é obrigatória' : null },
  { key: 'telefone'   as NovoPacienteField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório' : null },
  { key: 'email'      as NovoPacienteField, validate: (v: string) => !v.trim() ? 'E-mail é obrigatório' : null },
];

const filterOptions = ['Todos', 'Ativos', 'Inativos', 'Alto Valor'];

const mockPatients = [
  {
    id: 1, name: 'Ana Beatriz Costa', phone: '(11) 99872-3141', email: 'ana@email.com',
    birthdate: '1990-03-14', since: 'Mar 2023', status: 'ativo',
    totalSpent: 8400, totalSessions: 12, lastVisit: '18/02/2025', nextVisit: '18/05/2025',
    observations: 'Paciente VIP. Alergia a lidocaína em pomada. Prefere horários matinais.',
    history: [
      { id: 1, date: '18/02/2025', procedure: 'Botox Facial',         units: '40U',      value: 980,  professional: 'Maria Oliveira', lote: 'BTX-2025-003', status: 'realizado' },
      { id: 2, date: '18/11/2024', procedure: 'Botox Facial',         units: '40U',      value: 980,  professional: 'Maria Oliveira', lote: 'BTX-2024-087', status: 'realizado' },
      { id: 3, date: '15/08/2024', procedure: 'Preenchimento Labial', units: '1ml',      value: 1200, professional: 'Clara Andrade',  lote: 'PRE-2024-042', status: 'realizado' },
      { id: 4, date: '10/05/2024', procedure: 'Bioestimulador',       units: '1 frasco', value: 1800, professional: 'Maria Oliveira', lote: 'BIO-2024-011', status: 'realizado' },
      { id: 5, date: '20/02/2024', procedure: 'Botox Facial',         units: '40U',      value: 980,  professional: 'Maria Oliveira', lote: 'BTX-2024-015', status: 'realizado' },
    ],
  },
  {
    id: 2, name: 'Carla Mendonça', phone: '(11) 97654-2211', email: 'carla@email.com',
    birthdate: '1985-07-22', since: 'Jun 2023', status: 'ativo',
    totalSpent: 4500, totalSessions: 6, lastVisit: '15/02/2025', nextVisit: '15/05/2025',
    observations: 'Tende a apresentar hematomas. Usar técnica retrógrada.',
    history: [
      { id: 1, date: '15/02/2025', procedure: 'Preenchimento Labial', units: '1ml', value: 1200, professional: 'Maria Oliveira', lote: 'PRE-2025-007', status: 'realizado' },
      { id: 2, date: '20/09/2024', procedure: 'Botox Facial',         units: '30U', value: 750,  professional: 'Beatriz Santos', lote: 'BTX-2024-062', status: 'realizado' },
      { id: 3, date: '10/04/2024', procedure: 'Preenchimento Labial', units: '1ml', value: 1200, professional: 'Maria Oliveira', lote: 'PRE-2024-029', status: 'realizado' },
    ],
  },
  {
    id: 3, name: 'Fernanda Lima', phone: '(11) 98877-5544', email: 'fernanda@email.com',
    birthdate: '1992-11-08', since: 'Jan 2024', status: 'ativo',
    totalSpent: 3600, totalSessions: 4, lastVisit: '10/02/2025', nextVisit: null,
    observations: '',
    history: [
      { id: 1, date: '10/02/2025', procedure: 'Bioestimulador', units: '1 frasco', value: 1800, professional: 'Clara Andrade', lote: 'BIO-2025-003', status: 'realizado' },
      { id: 2, date: '10/08/2024', procedure: 'Bioestimulador', units: '1 frasco', value: 1800, professional: 'Clara Andrade', lote: 'BIO-2024-049', status: 'realizado' },
    ],
  },
  {
    id: 4, name: 'Marina Souza', phone: '(21) 99123-7788', email: 'marina@email.com',
    birthdate: '1988-04-30', since: 'Set 2022', status: 'ativo',
    totalSpent: 12800, totalSessions: 18, lastVisit: '05/01/2025', nextVisit: '05/04/2025',
    observations: 'Paciente antiga. Protocolo personalizado de manutenção trimestral.',
    history: [
      { id: 1, date: '05/01/2025', procedure: 'Fio de PDO',           units: '10 fios', value: 2500, professional: 'Beatriz Santos', lote: 'FIO-2025-001', status: 'realizado' },
      { id: 2, date: '05/10/2024', procedure: 'Botox Facial',         units: '50U',     value: 1200, professional: 'Maria Oliveira', lote: 'BTX-2024-081', status: 'realizado' },
      { id: 3, date: '05/07/2024', procedure: 'Preenchimento Labial', units: '2ml',     value: 2400, professional: 'Clara Andrade',  lote: 'PRE-2024-055', status: 'realizado' },
    ],
  },
  {
    id: 5, name: 'Juliana Rocha', phone: '(11) 91234-5678', email: 'juliana@email.com',
    birthdate: '1995-09-15', since: 'Nov 2024', status: 'ativo',
    totalSpent: 980, totalSessions: 1, lastVisit: '10/01/2025', nextVisit: '10/04/2025',
    observations: 'Primeira sessão. Orientada sobre protocolo inicial.',
    history: [
      { id: 1, date: '10/01/2025', procedure: 'Toxina Botulínica', units: '20U', value: 980, professional: 'Maria Oliveira', lote: 'BTX-2025-001', status: 'realizado' },
    ],
  },
  {
    id: 6, name: 'Patrícia Alves', phone: '(11) 97788-1122', email: 'patricia@email.com',
    birthdate: '1978-12-01', since: 'Dez 2022', status: 'inativo',
    totalSpent: 5600, totalSessions: 7, lastVisit: '20/12/2024', nextVisit: null,
    observations: 'Última sessão foi de microagulhamento. Sem retorno agendado.',
    history: [
      { id: 1, date: '20/12/2024', procedure: 'Microagulhamento', units: '1 sessão', value: 800, professional: 'Beatriz Santos', lote: 'MIC-2024-019', status: 'realizado' },
      { id: 2, date: '20/09/2024', procedure: 'Microagulhamento', units: '1 sessão', value: 800, professional: 'Beatriz Santos', lote: 'MIC-2024-010', status: 'realizado' },
    ],
  },
];

const procedureColors: Record<string, string> = {
  'Botox Facial':         '#BBA188',
  'Preenchimento Labial': '#EBD5B0',
  'Bioestimulador':       '#1b1b1b',
  'Fio de PDO':           '#a8906f',
  'Microagulhamento':     '#8a7560',
  'Toxina Botulínica':    '#BBA188',
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getAge(birthdate: string) {
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

const CARDS_PER_PAGE = 4;

function getVisiblePages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  const half = 2;
  let start = Math.max(2, currentPage - half);
  let end   = Math.min(totalPages - 1, currentPage + half);
  if (currentPage <= half + 1) end   = Math.min(totalPages - 1, 4);
  if (currentPage >= totalPages - half) start = Math.max(2, totalPages - 3);
  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

type Patient = typeof mockPatients[0];

function isNewFormDirty(form: NovoPacienteForm): boolean {
  return (
    form.nome.trim() !== '' ||
    form.cpf.trim() !== '' ||
    form.nascimento !== '' ||
    form.telefone.trim() !== '' ||
    form.email.trim() !== '' ||
    form.observacoes.trim() !== ''
  );
}

function isEditFormDirty(form: NovoPacienteForm): boolean {
  return (
    form.nome.trim() !== '' ||
    form.email.trim() !== '' ||
    form.telefone.trim() !== '' ||
    form.nascimento !== '' ||
    form.observacoes.trim() !== ''
  );
}

export default function HistoricoPaciente() {
  const [patients,     setPatients]     = useState(mockPatients);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selected,     setSelected]     = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen,    setIsNewOpen]    = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [form,         setForm]         = useState<NovoPacienteForm>(FORM_INITIAL);
  const [editForm,     setEditForm]     = useState<NovoPacienteForm>(FORM_INITIAL);
  const [editErrors,   setEditErrors]   = useState<Partial<Record<NovoPacienteField, string>>>({});
  const [currentPage,  setCurrentPage]  = useState(1);

  const [showCancelNewModal,  setShowCancelNewModal]  = useState(false);
  const [showCancelEditModal, setShowCancelEditModal] = useState(false);
  const [showConfirmNewModal, setShowConfirmNewModal] = useState(false);
  const [showConfirmEditModal,setShowConfirmEditModal]= useState(false);
  const [showSuccessModal,    setShowSuccessModal]    = useState(false);
  const [successMessage,      setSuccessMessage]      = useState('');

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<NovoPacienteField>(VALIDATION_FIELDS);

  const filtered = patients.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos'     ||
      (filter === 'Ativos'     && p.status === 'ativo')   ||
      (filter === 'Inativos'   && p.status === 'inativo') ||
      (filter === 'Alto Valor' && p.totalSpent >= 5000);
    return matchSearch && matchFilter;
  });

  const totalPages   = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const startIdx     = (safePage - 1) * CARDS_PER_PAGE;
  const paginated    = filtered.slice(startIdx, startIdx + CARDS_PER_PAGE);
  const startItem    = filtered.length === 0 ? 0 : startIdx + 1;
  const visiblePages = getVisiblePages(safePage, totalPages);

  function handleSearchChange(v: string)  { setSearch(v);  setCurrentPage(1); }
  function handleFilterChange(v: string)  { setFilter(v);  setCurrentPage(1); setOpenDropdown(false); }
  function handleClearFilter()            { setFilter('Todos'); setCurrentPage(1); }

  const totalPacientes = patients.length;
  const ativos         = patients.filter(p => p.status === 'ativo').length;
  const totalSessoes   = patients.reduce((a, p) => a + p.totalSessions, 0);
  const totalReceita   = patients.reduce((a, p) => a + p.totalSpent, 0);

  function handleChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as NovoPacienteField);
  }

  function handleMaskedChange(field: keyof NovoPacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as NovoPacienteField);
  }

  function handleDateChange(field: 'nascimento', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function handleCancelNewClick() {
    if (isNewFormDirty(form)) {
      setShowCancelNewModal(true);
    } else {
      forceCloseNew();
    }
  }

  function forceCloseNew() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsNewOpen(false);
    setShowCancelNewModal(false);
    setShowConfirmNewModal(false);
  }

  function handleSaveNewClick() {
    const isValid = validate({
      nome:       form.nome,
      cpf:        form.cpf,
      nascimento: form.nascimento,
      telefone:   form.telefone,
      email:      form.email,
    });
    if (!isValid) return;
    setShowConfirmNewModal(true);
  }

  function handleConfirmNew() {
    const newPatient: Patient = {
      id:            Date.now(),
      name:          form.nome,
      phone:         form.telefone,
      email:         form.email,
      birthdate:     form.nascimento,
      since:         new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      status:        'ativo',
      totalSpent:    0,
      totalSessions: 0,
      lastVisit:     '—',
      nextVisit:     null,
      observations:  form.observacoes,
      history:       [],
    };
    setPatients(prev => [...prev, newPatient]);
    setShowConfirmNewModal(false);
    setIsNewOpen(false);
    setSuccessMessage('Paciente cadastrado com sucesso!');
    setShowSuccessModal(true);
  }

  function handleEditChange(field: keyof NovoPacienteForm, value: string) {
    setEditForm(prev => ({ ...prev, [field]: value }));
    setEditErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleEditDateChange(raw: string) {
    if (!raw) { handleEditChange('nascimento', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleEditChange('nascimento', `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function validateEditForm(): boolean {
    const e: Partial<Record<NovoPacienteField, string>> = {};
    if (!editForm.nome.trim())      e.nome       = 'Nome completo é obrigatório';
    if (!editForm.cpf.trim())       e.cpf        = 'CPF é obrigatório';
    if (!editForm.nascimento)       e.nascimento = 'Data de nascimento é obrigatória';
    if (!editForm.telefone.trim())  e.telefone   = 'Telefone é obrigatório';
    if (!editForm.email.trim())     e.email      = 'E-mail é obrigatório';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  }

  function openEdit(p: Patient) {
    setEditForm({
      nome:        p.name,
      cpf:         '',
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
    if (isEditFormDirty(editForm)) {
      setShowCancelEditModal(true);
    } else {
      forceCloseEdit();
    }
  }

  function forceCloseEdit() {
    setEditForm(FORM_INITIAL);
    setEditErrors({});
    setIsEditOpen(false);
    setShowCancelEditModal(false);
    setShowConfirmEditModal(false);
  }

  function handleSaveEditClick() {
    if (!validateEditForm()) return;
    setShowConfirmEditModal(true);
  }

  function handleConfirmEdit() {
    if (!selected) return;
    setPatients(prev => prev.map(p =>
      p.id === selected.id
        ? { ...p, name: editForm.nome, phone: editForm.telefone, email: editForm.email, birthdate: editForm.nascimento, observations: editForm.observacoes }
        : p
    ));
    setSelected(prev => prev
      ? { ...prev, name: editForm.nome, phone: editForm.telefone, email: editForm.email, birthdate: editForm.nascimento, observations: editForm.observacoes }
      : prev
    );
    setShowConfirmEditModal(false);
    setIsEditOpen(false);
    setSuccessMessage('Alterações salvas com sucesso!');
    setShowSuccessModal(true);
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    setSuccessMessage('');
    setForm(FORM_INITIAL);
    clearAll();
  }

  function openDetail(p: Patient) {
    setSelected(p);
    setIsDetailOpen(true);
  }

  const handleExportFicha = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
          trend={{ value: `${Math.round((ativos / totalPacientes) * 100)}% retorno`, positive: true }}
        />
        <StatCard label="Total de Sessões" value={totalSessoes} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Receita Total" value={`R$ ${totalReceita.toLocaleString('pt-BR')}`} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          trend={{ value: '+R$ 6.800 vs mês', positive: true }}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome, telefone ou e-mail..." value={search} onChange={e => handleSearchChange(e.target.value)} />
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

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 780 }}>
        {filtered.length === 0 ? (
          <EmptyState><h3>Nenhum paciente encontrado</h3><p>Tente ajustar os filtros ou a busca.</p></EmptyState>
        ) : (
          <div style={{ padding: 20, flex: 1 }}>
            <PatientGrid>
              {paginated.map(patient => (
                <PatientCard key={patient.id} onClick={() => openDetail(patient)}>
                  <PatientCardHeader>
                    <PatientAvatar $color={patient.status === 'inativo' ? '#95a5a6' : '#BBA188'}>
                      {getInitials(patient.name)}
                    </PatientAvatar>
                    <PatientInfo>
                      <PatientName>{patient.name}</PatientName>
                      <PatientSub>{getAge(patient.birthdate)} anos · Cliente desde {patient.since}</PatientSub>
                      <StatsRow>
                        <StatPill $color="#BBA188">{patient.totalSessions} sessões</StatPill>
                        <StatPill $color="#8a7560">R$ {patient.totalSpent.toLocaleString('pt-BR')}</StatPill>
                        {patient.status === 'inativo' && <StatPill $color="#95a5a6">Inativo</StatPill>}
                      </StatsRow>
                    </PatientInfo>
                  </PatientCardHeader>
                  <PatientCardBody>
                    <div style={{ fontSize: '0.76rem', color: '#aaa', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Últimos procedimentos</div>
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
                        <div style={{ fontSize: '0.82rem', color: '#ccc', paddingLeft: 4 }}>Nenhum procedimento registrado.</div>
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
          </div>
        )}

        <PaginationWrapper>
          <PaginationInfo>
            {filtered.length === 0
              ? 'Nenhum registro'
              : `Mostrando ${startItem} de ${filtered.length} paciente(s)`
            }
          </PaginationInfo>
          <PaginationControls>
            <PaginationArrow onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} aria-label="Página anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </PaginationArrow>
            {visiblePages.map((page, idx) =>
              page === '...' ? (
                <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
              ) : (
                <PageButton key={page} $active={page === safePage} onClick={() => setCurrentPage(page as number)} aria-label={`Página ${page}`} aria-current={page === safePage ? 'page' : undefined}>
                  {page}
                </PageButton>
              )
            )}
            <PaginationArrow onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} aria-label="Próxima página">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </PaginationArrow>
          </PaginationControls>
        </PaginationWrapper>
      </div>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Ficha do Paciente" size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button type="button" variant="outline"
                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                onClick={() => selected && openEdit(selected)}
              >
                Editar Ficha
              </Button>
              <Button type="button" variant="primary" onClick={handleExportFicha} disabled={exporting}
                icon={exporting
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
              >
                {exporting ? 'Gerando PDF...' : 'Exportar Ficha'}
              </Button>
            </div>
            <Button type="button" variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        {selected && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selected.name)}</DetailAvatar>
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
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {getAge(selected.birthdate)} anos · Nascimento: {formatDate(selected.birthdate)} · Cliente desde {selected.since}
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
              <DetailSectionTitle>Histórico Completo de Procedimentos</DetailSectionTitle>
              {selected.history.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: '#bbb', padding: '20px 0', textAlign: 'center' }}>Nenhum procedimento registrado.</div>
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

      <Modal isOpen={isEditOpen} onClose={handleCancelEditClick} closeOnOverlayClick={false} title="Editar Paciente" size="lg"
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
                <Input label="Nome Completo *" placeholder="Digite o nome completo" value={editForm.nome} onChange={e => handleEditChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))} maxLength={80} error={editErrors.nome} />
              </div>
              <Input label="E-mail *" type="email" placeholder="Digite o e-mail" value={editForm.email} onChange={e => handleEditChange('email', e.target.value)} error={editErrors.email} />
              <Input label="Telefone *" mask="telefone" placeholder="Digite o telefone" value={editForm.telefone} inputMode="numeric" maxLength={15} onValueChange={v => handleEditChange('telefone', v)} error={editErrors.telefone} />
              <Input label="Data de Nascimento *" type="date" value={editForm.nascimento} onChange={e => handleEditDateChange(e.target.value)} error={editErrors.nascimento} />
              <Input label="CPF *" mask="cpf" placeholder="Digite o CPF" value={editForm.cpf} inputMode="numeric" maxLength={14} onValueChange={v => handleEditChange('cpf', v)} error={editErrors.cpf} />
            </FormGrid>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Observações
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Observações / Alergias" placeholder="Digite observações de saúde relevantes ou alergias" maxLength={300} value={editForm.observacoes} onChange={e => handleEditChange('observacoes', e.target.value)} />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isNewOpen} onClose={handleCancelNewClick} closeOnOverlayClick={false} title="Novo Paciente" size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button type="button" variant="outline" onClick={handleCancelNewClick}>Cancelar</Button>
            <Button type="button" variant="primary" onClick={handleSaveNewClick}>Cadastrar Paciente</Button>
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
                <Input label="Nome Completo *" placeholder="Digite o nome completo" value={form.nome} onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))} maxLength={80} error={errors.nome} />
              </div>
              <Input label="E-mail *" type="email" placeholder="Digite o e-mail" value={form.email} onChange={e => handleChange('email', e.target.value)} error={errors.email} />
              <Input label="Telefone *" mask="telefone" placeholder="Digite o telefone" value={form.telefone} inputMode="numeric" maxLength={15} onValueChange={v => handleMaskedChange('telefone', v)} error={errors.telefone} />
              <Input label="Data de Nascimento *" type="date" value={form.nascimento} onChange={e => handleDateChange('nascimento', e.target.value)} error={errors.nascimento} />
              <Input label="CPF *" mask="cpf" placeholder="Digite o CPF" value={form.cpf} inputMode="numeric" maxLength={14} onValueChange={v => handleMaskedChange('cpf', v)} error={errors.cpf} />
            </FormGrid>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#BBA188', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0ebe4', paddingBottom: 6, marginBottom: 12 }}>
              Observações
            </div>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input label="Observações / Alergias" placeholder="Digite observações de saúde relevantes ou alergias" maxLength={300} value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
              </div>
            </FormGrid>
          </div>
        </div>
      </Modal>

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