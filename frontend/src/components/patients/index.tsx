'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import {
  Container, Header, Title, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td,
  Avatar, PatientInfo, PatientName, PatientEmail,
  Badge, ActionGroup, IconBtn, EmptyState, FormGrid, PhoneText, DateText,
} from './styles';

type PacienteField =
  | 'nome' | 'email' | 'telefone' | 'nascimento' | 'cpf' | 'status' | 'indicacao';

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

const FORM_INITIAL: PacienteForm = {
  nome: '', email: '', telefone: '', nascimento: '',
  cpf: '', status: '', indicacao: '', observacoes: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'       as PacienteField, validate: (v: string) => !v.trim() ? 'Nome completo é obrigatório' : null },
  { key: 'email'      as PacienteField, validate: (v: string) => !v.trim() ? 'E-mail é obrigatório' : null },
  { key: 'telefone'   as PacienteField, validate: (v: string) => !v.trim() ? 'Telefone é obrigatório' : null },
  { key: 'nascimento' as PacienteField, validate: (v: string) => !v ? 'Data de nascimento é obrigatória' : null },
  { key: 'cpf'        as PacienteField, validate: (v: string) => !v.trim() ? 'CPF é obrigatório' : null },
  { key: 'status'     as PacienteField, validate: (v: string) => !v ? 'Selecione um status' : null },
  { key: 'indicacao'  as PacienteField, validate: (v: string) => !v.trim() ? 'Informe como nos conheceu' : null },
];

const statusOptions = [
  { value: 'ativo',   label: 'Ativo'   },
  { value: 'inativo', label: 'Inativo' },
];

const filterStatus    = ['Todos', 'Ativo', 'Inativo'];
const filterProcedure = ['Todos', 'Botox', 'Preenchimento', 'Bioestimulador', 'Fio PDO', 'Microagulhamento'];

const mockPatients = [
  { id: 1, name: 'Ana Beatriz Costa',   email: 'ana.costa@email.com',    phone: '(11) 98765-4321', birthdate: '15/03/1988', lastVisit: '18/02/2025', procedure: 'Botox',         status: 'ativo',   visits: 8  },
  { id: 2, name: 'Carla Mendonça',      email: 'carla.m@email.com',      phone: '(11) 97654-3210', birthdate: '22/07/1992', lastVisit: '15/02/2025', procedure: 'Preenchimento', status: 'ativo',   visits: 5  },
  { id: 3, name: 'Fernanda Lima',       email: 'fernanda.lima@email.com', phone: '(11) 96543-2109', birthdate: '05/11/1985', lastVisit: '10/02/2025', procedure: 'Bioestimulador',status: 'ativo',   visits: 3  },
  { id: 4, name: 'Marina Souza',        email: 'marina.s@email.com',      phone: '(21) 95432-1098', birthdate: '30/04/1990', lastVisit: '08/01/2025', procedure: 'Fio PDO',       status: 'ativo',   visits: 6  },
  { id: 5, name: 'Juliana Rocha',       email: 'juliana.r@email.com',     phone: '(21) 94321-0987', birthdate: '14/09/1995', lastVisit: '05/01/2025', procedure: 'Botox',         status: 'ativo',   visits: 2  },
  { id: 6, name: 'Patrícia Alves',      email: 'patricia.a@email.com',    phone: '(31) 93210-9876', birthdate: '19/12/1982', lastVisit: '20/12/2024', procedure: 'Microagulhamento',status:'inativo', visits: 12 },
  { id: 7, name: 'Roberta Gomes',       email: 'roberta.g@email.com',     phone: '(31) 92109-8765', birthdate: '08/06/1998', lastVisit: '15/12/2024', procedure: 'Preenchimento', status: 'ativo',   visits: 1  },
  { id: 8, name: 'Sandra Oliveira',     email: 'sandra.o@email.com',      phone: '(41) 91098-7654', birthdate: '25/02/1978', lastVisit: '10/11/2024', procedure: 'Bioestimulador',status: 'inativo', visits: 7  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: '#f0ebe4', color: '#8a7560' },
  inativo: { bg: '#f5f5f5', color: '#888'    },
};

const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#e74c3c', '#8a7560', '#BBA188', '#EBD5B0'];

type Patient = typeof mockPatients[0];

const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Patients() {
  const [search,          setSearch]          = useState('');
  const [filterSt,        setFilterSt]        = useState('Todos');
  const [filterProc,      setFilterProc]      = useState('Todos');
  const [openDropdown,    setOpenDropdown]     = useState<string | null>(null);
  const [isModalOpen,     setIsModalOpen]      = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form,            setForm]            = useState<PacienteForm>(FORM_INITIAL);
  const [currentPage,     setCurrentPage]     = useState(1);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<PacienteField>(VALIDATION_FIELDS);

  const filtered = mockPatients.filter(p => {
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

  const ativos = mockPatients.filter(p => p.status === 'ativo').length;

  const toggleDropdown = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleFilterStChange(value: string) {
    setFilterSt(value);
    setCurrentPage(1);
    setOpenDropdown(null);
  }

  function handleFilterProcChange(value: string) {
    setFilterProc(value);
    setCurrentPage(1);
    setOpenDropdown(null);
  }

  function handleClearFilters() {
    setFilterSt('Todos');
    setFilterProc('Todos');
    setCurrentPage(1);
  }

  function handleChange(field: keyof PacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as PacienteField);
  }

  function handleMaskedChange(field: keyof PacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as PacienteField);
  }

  function handleDateChange(field: 'nascimento', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function openNew() {
    setSelectedPatient(null);
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(true);
  }

  function openEdit(p: Patient) {
    setSelectedPatient(p);
    setForm({
      nome:        p.name,
      email:       p.email,
      telefone:    p.phone,
      nascimento:  '',
      cpf:         '',
      status:      p.status,
      indicacao:   '',
      observacoes: '',
    });
    clearAll();
    setIsModalOpen(true);
  }

  function handleClose() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(false);
  }

  function handleSave() {
    const isValid = validate({
      nome:       form.nome,
      email:      form.email,
      telefone:   form.telefone,
      nascimento: form.nascimento,
      cpf:        form.cpf,
      status:     form.status,
      indicacao:  form.indicacao,
    });
    if (!isValid) return;
    console.log('Salvar paciente:', form);
    handleClose();
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
        <StatCard label="Total de Pacientes" value={mockPatients.length} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
        />
        <StatCard label="Inativos" value={mockPatients.length - ativos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
        />
        <StatCard label="Novos este mês" value={3} color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => handleSearchChange(e.target.value)} />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggleDropdown('status')}>
              <span>{filterSt}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'status' && (
              <DropdownList>
                {filterStatus.map(s => (
                  <DropdownItem key={s} $active={filterSt === s} onClick={() => handleFilterStChange(s)}>{s}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn onClick={() => toggleDropdown('proc')}>
              <span>{filterProc}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'proc' && (
              <DropdownList>
                {filterProcedure.map(s => (
                  <DropdownItem key={s} $active={filterProc === s} onClick={() => handleFilterProcChange(s)}>{s}</DropdownItem>
                ))}
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

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="28%">Paciente</Th>
                <Th $width="16%">Telefone</Th>
                <Th $width="13%">Nascimento</Th>
                <Th $width="14%">Última Visita</Th>
                <Th $width="14%">Procedimento</Th>
                <Th $width="8%">Status</Th>
                <Th $width="7%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Tente ajustar os filtros</p>
                  </EmptyState>
                </td></tr>
              ) : paginatedData.map((p, i) => (
                <Tr key={p.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar $color={avatarColors[(startIndex + i) % avatarColors.length]}>
                        {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </Avatar>
                      <PatientInfo>
                        <PatientName>{p.name}</PatientName>
                        <PatientEmail>{p.email}</PatientEmail>
                      </PatientInfo>
                    </div>
                  </Td>
                  <Td><PhoneText>{p.phone}</PhoneText></Td>
                  <Td><DateText>{p.birthdate}</DateText></Td>
                  <Td><DateText>{p.lastVisit}</DateText></Td>
                  <Td><Badge $bg="rgba(187,161,136,0.15)" $color="#BBA188">{p.procedure}</Badge></Td>
                  <Td><Badge $bg={statusColors[p.status].bg} $color={statusColors[p.status].color}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Editar" onClick={() => openEdit(p)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                      <IconBtn title="Ver histórico">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
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
        isOpen={isModalOpen}
        onClose={handleClose}
        title={selectedPatient ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Salvar</Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Nome Completo *"
              placeholder="Nome do paciente..."
              value={form.nome}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
                handleChange('nome', val);
              }}
              maxLength={80}
              error={errors.nome}
            />
          </div>

          <Input
            label="E-mail *"
            type="email"
            placeholder="email@exemplo.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          <Input
            label="Telefone *"
            mask="telefone"
            value={form.telefone}
            inputMode="numeric"
            maxLength={15}
            onValueChange={(v) => handleMaskedChange('telefone', v)}
            error={errors.telefone}
          />

          <Input
            label="Data de Nascimento *"
            type="date"
            value={form.nascimento}
            onChange={(e) => handleDateChange('nascimento', e.target.value)}
            error={errors.nascimento}
          />

          <Input
            label="CPF *"
            mask="cpf"
            value={form.cpf}
            inputMode="numeric"
            maxLength={14}
            onValueChange={(v) => handleMaskedChange('cpf', v)}
            error={errors.cpf}
          />

          <Select
            label="Status *"
            options={statusOptions}
            placeholder="Selecione..."
            value={form.status}
            onChange={(v) => handleChange('status', v)}
            error={errors.status}
          />

          <Input
            label="Como nos conheceu? *"
            placeholder="Indicação, Instagram, Google..."
            value={form.indicacao}
            onChange={(e) => handleChange('indicacao', e.target.value)}
            error={errors.indicacao}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Observações / Alergias"
              placeholder="Informações de saúde relevantes..."
              maxLength={300}
              value={form.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
            />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}