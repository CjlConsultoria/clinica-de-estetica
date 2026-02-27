'use client';

import { useEffect, useState } from 'react';
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
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  Avatar, PatientInfo, PatientName, PatientEmail, EmptyState,
  FormGrid, SectionLabel, WizardNav, PhoneText, DateText,
  DetailModal, DetailHeader, DetailAvatar, DetailName, DetailMeta, DetailMetaItem,
  DetailSection, DetailSectionTitle, StatsRow, StatPill,
  InfoGrid, InfoItem, InfoLabel, InfoValue, ObsBox,
} from './styles';
import {
  listarPacientes, criarPaciente, atualizarPaciente,
  PacienteResponse,
} from '@/services/pacientesApi';

interface PacienteForm {
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  status: string;
  indicacao: string;
  observacoes: string;
}

type PacienteField = keyof Omit<PacienteForm, 'observacoes' | 'indicacao' | 'status'>;

const FORM_INITIAL: PacienteForm = {
  nome: '', email: '', telefone: '', nascimento: '',
  cpf: '', status: 'ativo', indicacao: '', observacoes: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'       as PacienteField, validate: (v: string) => !v.trim() ? 'Nome completo é obrigatório'      : null },
  { key: 'email'      as PacienteField, validate: (v: string) => !v.trim() ? 'E-mail é obrigatório'             : null },
  { key: 'telefone'   as PacienteField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório'           : null },
  { key: 'nascimento' as PacienteField, validate: (v: string) => !v        ? 'Data de nascimento é obrigatória' : null },
  { key: 'cpf'        as PacienteField, validate: (v: string) => !v.trim() ? 'CPF é obrigatório'                : null },
];

const statusOptions   = [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }];
const filterStatus    = ['Todos', 'Ativo', 'Inativo'];
const filterProcedure = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const statusColors: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: '#f0ebe4', color: '#8a7560' },
  inativo: { bg: '#f5f5f5', color: '#888'    },
};

const avatarColors = ['#BBA188', '#8a7560', '#a8906f', '#c9a882', '#917255', '#d4b896'];

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  cpf: string;
  lastVisit: string;
  procedure: string;
  status: string;
  visits: number;
  indicacao: string;
  observacoes: string;
}

function mapPaciente(p: PacienteResponse): Patient {
  return {
    id:          p.id,
    name:        p.nome,
    email:       p.email ?? '',
    phone:       p.celular ?? p.telefone ?? '',
    birthdate:   p.dataNascimento ?? '',
    cpf:         p.cpf,
    lastVisit:   '—',
    procedure:   '—',
    status:      p.ativo ? 'ativo' : 'inativo',
    visits:      0,
    indicacao:   '',
    observacoes: p.observacoes ?? '',
  };
}

const ITEMS_PER_PAGE = 10;

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
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

function calcAge(dateStr: string): string {
  if (!dateStr) return '';
  const input = toInputDate(dateStr);
  const birth = new Date(input);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} anos`;
}

function isFormDirty(form: PacienteForm): boolean {
  return (
    form.nome.trim() !== '' ||
    form.email.trim() !== '' ||
    form.telefone.trim() !== '' ||
    form.nascimento !== '' ||
    form.cpf.trim() !== '' ||
    form.indicacao.trim() !== '' ||
    form.observacoes.trim() !== ''
  );
}

export default function Patients() {
  const [patients,        setPatients]        = useState<Patient[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search,          setSearch]          = useState('');
  const [filterSt,        setFilterSt]        = useState('Todos');
  const [filterProc,      setFilterProc]      = useState('Todos');
  const [openDrop,        setOpenDrop]        = useState<string | null>(null);
  const [isModalOpen,     setIsModalOpen]     = useState(false);
  const [isDetailOpen,    setIsDetailOpen]    = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing,       setIsEditing]       = useState(false);
  const [form,            setForm]            = useState<PacienteForm>(FORM_INITIAL);
  const [currentPage,     setCurrentPage]     = useState(1);

  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { errors, validate, clearError, clearAll } = useSequentialValidation<PacienteField>(VALIDATION_FIELDS);

  const fetchPatients = () => {
    setLoading(true);
    listarPacientes()
      .then(r => setPatients(r.content.map(mapPaciente)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.includes(search);
    const matchStatus = filterSt   === 'Todos' || p.status    === filterSt.toLowerCase();
    const matchProc   = filterProc === 'Todos' || p.procedure === filterProc;
    return matchSearch && matchStatus && matchProc;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const ativos   = patients.filter(p => p.status === 'ativo').length;
  const inativos = patients.filter(p => p.status === 'inativo').length;

  function handleSearchChange(v: string)     { setSearch(v);     setCurrentPage(1); }
  function handleFilterStChange(v: string)   { setFilterSt(v);   setCurrentPage(1); setOpenDrop(null); }
  function handleFilterProcChange(v: string) { setFilterProc(v); setCurrentPage(1); setOpenDrop(null); }
  function handleClearFilters()              { setFilterSt('Todos'); setFilterProc('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof PacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field !== 'observacoes' && field !== 'indicacao' && field !== 'status') {
      clearError(field as PacienteField);
    }
  }

  function handleDateChange(raw: string) {
    if (!raw) { handleChange('nascimento', ''); return; }
    const [y, m, d] = raw.split('-');
    handleChange('nascimento', `${(y ?? '').slice(0, 4)}-${m ?? ''}-${d ?? ''}`);
  }

  function openNew() {
    setIsEditing(false);
    setSelectedPatient(null);
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(true);
  }

  function openEdit(p: Patient) {
    setIsEditing(true);
    setSelectedPatient(p);
    setForm({
      nome:        p.name,
      email:       p.email,
      telefone:    p.phone,
      nascimento:  toInputDate(p.birthdate),
      cpf:         p.cpf,
      status:      p.status,
      indicacao:   p.indicacao,
      observacoes: p.observacoes,
    });
    clearAll();
    setIsDetailOpen(false);
    setIsModalOpen(true);
  }

  function openDetail(p: Patient) {
    setSelectedPatient(p);
    setIsDetailOpen(true);
  }

  function handleCancelClick() {
    if (isFormDirty(form)) {
      setShowCancelModal(true);
    } else {
      forceClose();
    }
  }

  function forceClose() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(false);
    setSelectedPatient(null);
    setIsEditing(false);
    setShowCancelModal(false);
    setShowConfirmModal(false);
  }

  function handleSaveClick() {
    const isValid = validate({
      nome:       form.nome,
      email:      form.email,
      telefone:   form.telefone,
      nascimento: form.nascimento,
      cpf:        form.cpf,
    });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    setShowConfirmModal(false);
    const payload = {
      nome:           form.nome,
      cpf:            form.cpf,
      email:          form.email || undefined,
      celular:        form.telefone || undefined,
      dataNascimento: form.nascimento || undefined,
      observacoes:    form.observacoes || undefined,
    };
    try {
      if (isEditing && selectedPatient) {
        const updated = await atualizarPaciente(selectedPatient.id, payload);
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? mapPaciente(updated) : p));
      } else {
        const created = await criarPaciente(payload);
        setPatients(prev => [...prev, mapPaciente(created)]);
      }
      setIsModalOpen(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    setForm(FORM_INITIAL);
    clearAll();
    setSelectedPatient(null);
    setIsEditing(false);
  }

  return (
    <Container>
      <Header>
        <Title>Pacientes</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={openNew}
        >
          Novo Paciente
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Pacientes" value={patients.length} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Inativos" value={inativos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
        />
        <StatCard label="Total Cadastrados" value={patients.length} color="#a8906f"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
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
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            autoComplete="off"
            name="search-pacientes-filter"
            data-form-type="other"
            data-lpignore="true"
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
                {filterStatus.map(s => <DropdownItem key={s} $active={filterSt === s} onClick={() => handleFilterStChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDrop(p => p === 'proc' ? null : 'proc')}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDrop === 'proc' && (
              <DropdownList>
                {filterProcedure.map(s => <DropdownItem key={s} $active={filterProc === s} onClick={() => handleFilterProcChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterSt !== 'Todos' || filterProc !== 'Todos') && (
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
                <Th $width="24%">Paciente</Th>
                <Th $width="13%">Telefone</Th>
                <Th $width="11%">Nascimento</Th>
                <Th $width="12%">Última Visita</Th>
                <Th $width="15%">Procedimento</Th>
                <Th $width="7%" $center>Visitas</Th>
                <Th $width="8%">Status</Th>
                <Th $width="10%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={8}>
                  <EmptyState>
                    <p style={{ color: '#bbb' }}>Carregando pacientes...</p>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={8}>
                  <EmptyState>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <h3>Nenhum paciente encontrado</h3>
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
                      <PatientInfo>
                        <PatientName>{p.name}</PatientName>
                        <PatientEmail>{p.email}</PatientEmail>
                      </PatientInfo>
                    </div>
                  </Td>
                  <Td><PhoneText>{p.phone}</PhoneText></Td>
                  <Td><DateText>{formatDate(p.birthdate)}</DateText></Td>
                  <Td><DateText>{p.lastVisit}</DateText></Td>
                  <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{p.procedure}</Badge></Td>
                  <Td $center $bold>{p.visits || '—'}</Td>
                  <Td><Badge $bg={statusColors[p.status].bg} $color={statusColors[p.status].color}>{p.status === 'ativo' ? 'Ativo' : 'Inativo'}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver detalhes" onClick={() => openDetail(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </IconBtn>
                      <IconBtn title="Editar" onClick={() => openEdit(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination
          currentPage={safePage}
          totalItems={totalFiltered}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        closeOnOverlayClick={false}
        title="Ficha do Paciente"
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'space-between' }}>
            <Button
              variant="outline"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
              onClick={() => selectedPatient && openEdit(selectedPatient)}
            >
              Editar Ficha
            </Button>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </div>
        }
      >
        {selectedPatient && (
          <DetailModal>
            <DetailHeader>
              <DetailAvatar $color="#BBA188">{getInitials(selectedPatient.name)}</DetailAvatar>
              <div style={{ flex: 1 }}>
                <DetailName>{selectedPatient.name}</DetailName>
                <DetailMeta>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.92 6.92l1.37-1.37a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 17z"/></svg>
                    {selectedPatient.phone}
                  </DetailMetaItem>
                  <DetailMetaItem>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {selectedPatient.email}
                  </DetailMetaItem>
                </DetailMeta>
                <StatsRow style={{ marginTop: 10 }}>
                  <StatPill $color={selectedPatient.status === 'ativo' ? '#8a7560' : '#888'}>
                    {selectedPatient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </StatPill>
                </StatsRow>
              </div>
            </DetailHeader>

            {selectedPatient.observacoes && (
              <ObsBox>
                <strong>⚠ Observações / Alergias: </strong>{selectedPatient.observacoes}
              </ObsBox>
            )}

            <DetailSection>
              <DetailSectionTitle>Dados do Paciente</DetailSectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Data de Nascimento</InfoLabel>
                  <InfoValue>{formatDate(selectedPatient.birthdate)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Idade</InfoLabel>
                  <InfoValue>{calcAge(selectedPatient.birthdate)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>CPF</InfoLabel>
                  <InfoValue>
                    <code style={{ fontSize: '0.83rem', color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5 }}>
                      {selectedPatient.cpf}
                    </code>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Status</InfoLabel>
                  <InfoValue>
                    <Badge $bg={statusColors[selectedPatient.status].bg} $color={statusColors[selectedPatient.status].color}>
                      {selectedPatient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            </DetailSection>
          </DetailModal>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        closeOnOverlayClick={false}
        title={isEditing ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
        footer={
          <WizardNav>
            <Button variant="outline" onClick={handleCancelClick}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveClick}>
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
            </Button>
          </WizardNav>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', maxHeight: '65vh', paddingRight: 4 }}>
          <div>
            <SectionLabel style={{ marginBottom: 12 }}>Dados Pessoais</SectionLabel>
            <FormGrid>
              <div style={{ gridColumn: 'span 2' }}>
                <Input
                  label="Nome Completo *"
                  placeholder="Digite o nome completo"
                  value={form.nome}
                  onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                  maxLength={80}
                  error={errors.nome}
                />
              </div>
              <Input
                label="E-mail *"
                type="email"
                placeholder="Digite o e-mail"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="Telefone *"
                mask="telefone"
                placeholder="Digite o telefone"
                value={form.telefone}
                inputMode="numeric"
                maxLength={15}
                onValueChange={v => handleChange('telefone', v)}
                error={errors.telefone}
              />
              <Input
                label="Data de Nascimento *"
                type="date"
                value={form.nascimento}
                onChange={e => handleDateChange(e.target.value)}
                error={errors.nascimento}
              />
              <Input
                label="CPF *"
                mask="cpf"
                placeholder="Digite o CPF"
                value={form.cpf}
                inputMode="numeric"
                maxLength={14}
                onValueChange={v => handleChange('cpf', v)}
                error={errors.cpf}
              />
            </FormGrid>
          </div>
          <div>
            <SectionLabel style={{ marginBottom: 12 }}>Informações Adicionais</SectionLabel>
            <FormGrid>
              {isEditing && (
                <Select
                  key={`status-${selectedPatient?.id}`}
                  label="Status"
                  options={statusOptions}
                  placeholder="Selecione o status"
                  value={form.status}
                  onChange={v => handleChange('status', v)}
                />
              )}
              <div style={{ gridColumn: isEditing ? 'auto' : 'span 2' }}>
                <Input
                  label="Como nos conheceu?"
                  placeholder="Ex: Instagram, indicação, Google..."
                  value={form.indicacao}
                  onChange={e => handleChange('indicacao', e.target.value)}
                />
              </div>
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

      <CancelModal
        isOpen={showCancelModal}
        title="Deseja cancelar?"
        message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas."
        onConfirm={forceClose}
        onCancel={() => setShowCancelModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title={isEditing ? 'Salvar alterações?' : 'Cadastrar paciente?'}
        message={
          isEditing
            ? 'Tem certeza que deseja salvar as alterações feitas na ficha deste paciente?'
            : `Tem certeza que deseja cadastrar ${form.nome || 'este paciente'}?`
        }
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />

      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message={isEditing ? 'Alterações salvas com sucesso!' : 'Paciente cadastrado com sucesso!'}
        onClose={handleSuccessClose}
        buttonText="Continuar"
      />
    </Container>
  );
}
