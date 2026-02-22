'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { pacientesService, Paciente } from '@/services/pacientes.service';
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
  nome: string; email: string; telefone: string; nascimento: string;
  cpf: string; status: string; indicacao: string; observacoes: string;
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

const statusOptions    = [{ value: 'ativo', label: 'Ativo' }, { value: 'inativo', label: 'Inativo' }];
const filterStatusList = ['Todos', 'Ativo', 'Inativo'];
const avatarColors     = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#e74c3c', '#8a7560'];

const statusColors: Record<string, { bg: string; color: string }> = {
  ativo:   { bg: '#f0ebe4', color: '#8a7560' },
  inativo: { bg: '#f5f5f5', color: '#888'    },
  ATIVO:   { bg: '#f0ebe4', color: '#8a7560' },
  INATIVO: { bg: '#f5f5f5', color: '#888'    },
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const [year, month, day] = iso.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
}

function getInitials(nome: string): string {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Patients() {
  const [pacientes,       setPacientes]       = useState<Paciente[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [totalElements,   setTotalElements]   = useState(0);
  const [search,          setSearch]          = useState('');
  const [filterSt,        setFilterSt]        = useState('Todos');
  const [openDropdown,    setOpenDropdown]     = useState<string | null>(null);
  const [isModalOpen,     setIsModalOpen]      = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [form,            setForm]            = useState<PacienteForm>(FORM_INITIAL);
  const [currentPage,     setCurrentPage]     = useState(1);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<PacienteField>(VALIDATION_FIELDS);

  const loadPacientes = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await pacientesService.listar(page - 1, ITEMS_PER_PAGE, search || undefined);
      setPacientes(data.content);
      setTotalElements(data.totalElements);
    } catch {
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => loadPacientes(currentPage), 300);
    return () => clearTimeout(t);
  }, [loadPacientes, currentPage]);

  const ativos   = pacientes.filter(p => ['ativo', 'ATIVO'].includes(p.status)).length;
  const inativos = pacientes.filter(p => ['inativo', 'INATIVO'].includes(p.status)).length;

  const filtered = pacientes.filter(p => {
    const matchStatus = filterSt === 'Todos' || p.status.toLowerCase() === filterSt.toLowerCase();
    return matchStatus;
  });

  function toggleDropdown(name: string) { setOpenDropdown(prev => prev === name ? null : name); }

  function handleChange(field: keyof PacienteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field !== 'observacoes' && field !== 'nascimento') clearError(field as PacienteField);
  }

  function handleDateChange(field: 'nascimento', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function openNew() {
    setSelectedPaciente(null);
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(true);
  }

  function openEdit(p: Paciente) {
    setSelectedPaciente(p);
    setForm({
      nome:        p.nome,
      email:       p.email,
      telefone:    p.telefone,
      nascimento:  p.dataNascimento ?? '',
      cpf:         p.cpf ?? '',
      status:      p.status.toLowerCase(),
      indicacao:   p.indicacao ?? '',
      observacoes: p.observacoes ?? '',
    });
    clearAll();
    setIsModalOpen(true);
  }

  function handleClose() {
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(false);
  }

  async function handleSave() {
    const isValid = validate({
      nome: form.nome, email: form.email, telefone: form.telefone,
      nascimento: form.nascimento, cpf: form.cpf, status: form.status, indicacao: form.indicacao,
    });
    if (!isValid) return;

    setSaving(true);
    try {
      const payload = {
        nome: form.nome, email: form.email, telefone: form.telefone,
        dataNascimento: form.nascimento || undefined,
        cpf: form.cpf || undefined,
        status: form.status,
        indicacao: form.indicacao || undefined,
        observacoes: form.observacoes || undefined,
      };
      if (selectedPaciente) {
        await pacientesService.atualizar(selectedPaciente.id, payload);
      } else {
        await pacientesService.criar(payload);
      }
      handleClose();
      loadPacientes(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar paciente';
      alert(msg);
    } finally {
      setSaving(false);
    }
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
        <StatCard label="Total de Pacientes" value={loading ? '...' : totalElements} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard label="Pacientes Ativos" value={loading ? '...' : ativos} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
        />
        <StatCard label="Inativos" value={loading ? '...' : inativos} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>}
        />
        <StatCard label="Nesta página" value={loading ? '...' : filtered.length} color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggleDropdown('status')}>
              <span>{filterSt}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'status' && (
              <DropdownList>
                {filterStatusList.map(s => (
                  <DropdownItem key={s} $active={filterSt === s} onClick={() => { setFilterSt(s); setOpenDropdown(null); setCurrentPage(1); }}>{s}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          {filterSt !== 'Todos' && (
            <ClearFilterBtn onClick={() => { setFilterSt('Todos'); setCurrentPage(1); }}>
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
                <Th $width="30%">Paciente</Th>
                <Th $width="16%">Telefone</Th>
                <Th $width="14%">Nascimento</Th>
                <Th $width="14%">Cadastro</Th>
                <Th $width="11%">Status</Th>
                <Th $width="8%">Indicação</Th>
                <Th $width="7%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={7}>
                  <EmptyState><p style={{ color: '#bbb' }}>Carregando pacientes...</p></EmptyState>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <EmptyState>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <h3>Nenhum paciente encontrado</h3>
                    <p>Tente ajustar os filtros ou cadastrar um novo paciente</p>
                  </EmptyState>
                </td></tr>
              ) : filtered.map((p, i) => {
                const st = (statusColors[p.status] ?? { bg: '#f5f5f5', color: '#888' });
                return (
                  <Tr key={p.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar $color={avatarColors[i % avatarColors.length]}>
                          {getInitials(p.nome)}
                        </Avatar>
                        <PatientInfo>
                          <PatientName>{p.nome}</PatientName>
                          <PatientEmail>{p.email}</PatientEmail>
                        </PatientInfo>
                      </div>
                    </Td>
                    <Td><PhoneText>{p.telefone}</PhoneText></Td>
                    <Td><DateText>{formatDate(p.dataNascimento)}</DateText></Td>
                    <Td><DateText>{formatDate(p.criadoEm)}</DateText></Td>
                    <Td>
                      <Badge $bg={st.bg} $color={st.color}>
                        {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase() : '—'}
                      </Badge>
                    </Td>
                    <Td style={{ fontSize: '0.8rem', color: '#888', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.indicacao ?? '—'}
                    </Td>
                    <Td>
                      <ActionGroup>
                        <IconBtn title="Editar" onClick={() => openEdit(p)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </IconBtn>
                        <IconBtn title="Histórico">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </IconBtn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination
          currentPage={currentPage}
          totalItems={totalElements}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={selectedPaciente ? 'Editar Paciente' : 'Novo Paciente'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Nome Completo *"
              placeholder="Nome do paciente..."
              value={form.nome}
              onChange={e => handleChange('nome', e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
              maxLength={80}
              error={errors.nome}
            />
          </div>
          <Input label="E-mail *" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => handleChange('email', e.target.value)} error={errors.email} />
          <Input label="Telefone *" mask="telefone" value={form.telefone} inputMode="numeric" maxLength={15} onValueChange={v => { setForm(p => ({ ...p, telefone: v })); clearError('telefone'); }} error={errors.telefone} />
          <Input label="Data de Nascimento *" type="date" value={form.nascimento} onChange={e => handleDateChange('nascimento', e.target.value)} error={errors.nascimento} />
          <Input label="CPF *" mask="cpf" value={form.cpf} inputMode="numeric" maxLength={14} onValueChange={v => { setForm(p => ({ ...p, cpf: v })); clearError('cpf'); }} error={errors.cpf} />
          <Select label="Status *" options={statusOptions} placeholder="Selecione..." value={form.status} onChange={v => handleChange('status', v)} error={errors.status} />
          <Input label="Como nos conheceu? *" placeholder="Indicação, Instagram, Google..." value={form.indicacao} onChange={e => handleChange('indicacao', e.target.value)} error={errors.indicacao} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Observações / Alergias" placeholder="Informações de saúde relevantes..." maxLength={300} value={form.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}
