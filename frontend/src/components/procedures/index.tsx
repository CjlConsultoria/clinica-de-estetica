'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { procedimentosService, Procedimento } from '@/services/procedimentos.service';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, CardsGrid, ProcCard, ProcCardHeader, ProcName, ProcCode,
  ProcDetails, DetailRow, DetailLabel, DetailValue, ProcActions, IconBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup,
  ToggleGroup, ToggleBtn, EmptyState, FormGrid,
} from './styles';

type ProcedimentoField =
  | 'nome' | 'codigo' | 'categoria' | 'valor' | 'duracao' | 'comissao' | 'descricao';

interface ProcedimentoForm {
  nome: string;
  codigo: string;
  categoria: string;
  valor: string;
  duracao: string;
  comissao: string;
  descricao: string;
}

const FORM_INITIAL: ProcedimentoForm = {
  nome: '', codigo: '', categoria: '', valor: '', duracao: '', comissao: '', descricao: '',
};

const VALIDATION_FIELDS = [
  { key: 'nome'      as ProcedimentoField, validate: (v: string) => !v.trim() ? 'Nome do procedimento é obrigatório' : null },
  { key: 'codigo'    as ProcedimentoField, validate: (v: string) => !v.trim() ? 'Código é obrigatório' : null },
  { key: 'categoria' as ProcedimentoField, validate: (v: string) => !v ? 'Selecione uma categoria' : null },
  { key: 'valor'     as ProcedimentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor do procedimento' : null },
  { key: 'duracao'   as ProcedimentoField, validate: (v: string) => !v.trim() ? 'Informe a duração em minutos' : null },
  { key: 'comissao'  as ProcedimentoField, validate: (v: string) => !v.trim() ? 'Informe o percentual de comissão' : null },
  { key: 'descricao' as ProcedimentoField, validate: (v: string) => !v.trim() ? 'Descrição é obrigatória' : null },
];

const categoryOptions = [
  { value: 'toxina',        label: 'Toxina Botulínica' },
  { value: 'preenchimento', label: 'Preenchimento'      },
  { value: 'bioestimulador',label: 'Bioestimulador'     },
  { value: 'fio',           label: 'Fio de PDO'         },
  { value: 'skincare',      label: 'Skincare/Pele'      },
];

const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188',
  'Preenchimento':     '#EBD5B0',
  'Bioestimulador':    '#1b1b1b',
  'Fio de PDO':        '#a8906f',
  'Skincare/Pele':     '#8a7560',
  toxina:              '#BBA188',
  preenchimento:       '#EBD5B0',
  bioestimulador:      '#1b1b1b',
  fio:                 '#a8906f',
  skincare:            '#8a7560',
};

function catLabel(value: string): string {
  return categoryOptions.find(c => c.value === value)?.label ?? value;
}

function parseMoeda(v: string): number {
  return parseFloat(v.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
}

export default function Procedures() {
  const [view,         setView]        = useState<'cards' | 'tabela'>('cards');
  const [search,       setSearch]      = useState('');
  const [filterCat,    setFilterCat]   = useState('Todas');
  const [openDropdown, setOpenDropdown]= useState(false);
  const [isModalOpen,  setIsModalOpen] = useState(false);
  const [selected,     setSelected]    = useState<Procedimento | null>(null);
  const [form,         setForm]        = useState<ProcedimentoForm>(FORM_INITIAL);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState<string | null>(null);

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<ProcedimentoField>(VALIDATION_FIELDS);

  async function carregar() {
    try {
      setLoading(true);
      const data = await procedimentosService.listar(false);
      setProcedimentos(data);
    } catch (e) {
      setError('Erro ao carregar procedimentos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const filtered = procedimentos.filter(p => {
    const label = catLabel(p.categoria);
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'Todas' || label === filterCat;
    return matchSearch && matchCat;
  });

  const totalSessions = 0;
  const avgPrice = filtered.length > 0 ? filtered.reduce((a, p) => a + p.valor, 0) / filtered.length : 0;

  function handleChange(field: keyof ProcedimentoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as ProcedimentoField);
  }

  function handleMaskedChange(field: keyof ProcedimentoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as ProcedimentoField);
  }

  function openNew() {
    setSelected(null);
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(true);
  }

  function openEdit(proc: Procedimento) {
    setSelected(proc);
    setForm({
      nome:      proc.nome,
      codigo:    proc.codigo,
      categoria: proc.categoria,
      valor:     `R$ ${proc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      duracao:   String(proc.duracaoMinutos ?? ''),
      comissao:  String(proc.percentualComissao ?? ''),
      descricao: proc.descricao ?? '',
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
      nome: form.nome, codigo: form.codigo, categoria: form.categoria,
      valor: form.valor, duracao: form.duracao, comissao: form.comissao, descricao: form.descricao,
    });
    if (!isValid) return;

    const payload = {
      nome:                form.nome,
      codigo:              form.codigo.toUpperCase(),
      categoria:           form.categoria,
      valor:               parseMoeda(form.valor),
      duracaoMinutos:      form.duracao ? parseInt(form.duracao) : undefined,
      percentualComissao:  form.comissao ? parseFloat(form.comissao) : undefined,
      descricao:           form.descricao || undefined,
    };

    try {
      if (selected) {
        await procedimentosService.atualizar(selected.id, payload);
      } else {
        await procedimentosService.criar(payload);
      }
      await carregar();
      handleClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar procedimento';
      alert(msg);
    }
  }

  async function handleToggleStatus(proc: Procedimento) {
    try {
      if (proc.ativo) {
        await procedimentosService.inativar(proc.id);
      } else {
        await procedimentosService.ativar(proc.id);
      }
      await carregar();
    } catch {
      alert('Erro ao alterar status');
    }
  }

  if (loading) return <Container><p style={{ padding: 32, color: '#888' }}>Carregando procedimentos...</p></Container>;
  if (error)   return <Container><p style={{ padding: 32, color: '#c0392b' }}>{error}</p></Container>;

  return (
    <Container>
      <Header>
        <Title>Procedimentos</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={openNew}
        >
          Novo Procedimento
        </Button>
      </Header>

      <StatsGrid>
        <StatCard label="Total de Procedimentos" value={procedimentos.length} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
        />
        <StatCard label="Procedimentos Ativos" value={procedimentos.filter(p => p.ativo).length} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard label="Ticket Médio" value={`R$ ${avgPrice.toFixed(0)}`} color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <StatCard label="Categorias" value={categoryOptions.length} color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>}
        />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome ou código..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBarWrapper>

        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => setOpenDropdown(!openDropdown)}>
              <span>{filterCat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown && (
              <DropdownList>
                {filterCategories.map(c => (
                  <DropdownItem key={c} $active={filterCat === c} onClick={() => { setFilterCat(c); setOpenDropdown(false); }}>{c}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filterCat !== 'Todas' && (
            <ClearFilterBtn onClick={() => setFilterCat('Todas')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
          <ToggleGroup>
            <ToggleBtn $active={view === 'cards'} onClick={() => setView('cards')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </ToggleBtn>
            <ToggleBtn $active={view === 'tabela'} onClick={() => setView('tabela')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </ToggleBtn>
          </ToggleGroup>
        </FilterRow>
      </Controls>

      {view === 'cards' ? (
        filtered.length === 0 ? (
          <EmptyState>Nenhum procedimento encontrado.</EmptyState>
        ) : (
          <CardsGrid>
            {filtered.map(proc => {
              const label = catLabel(proc.categoria);
              const color = catColors[proc.categoria] || catColors[label] || '#BBA188';
              return (
                <ProcCard key={proc.id}>
                  <ProcCardHeader $color={color}>
                    <div>
                      <ProcCode>{proc.codigo}</ProcCode>
                      <ProcName>{proc.nome}</ProcName>
                    </div>
                    <Badge $bg={`${color}22`} $color={color}>{label}</Badge>
                  </ProcCardHeader>
                  <ProcDetails>
                    <DetailRow><DetailLabel>Valor</DetailLabel><DetailValue $highlight>R$ {proc.valor.toLocaleString('pt-BR')}</DetailValue></DetailRow>
                    <DetailRow><DetailLabel>Duração</DetailLabel><DetailValue>{proc.duracaoMinutos ?? '—'} min</DetailValue></DetailRow>
                    <DetailRow><DetailLabel>Comissão</DetailLabel><DetailValue>{proc.percentualComissao ?? '—'}%</DetailValue></DetailRow>
                  </ProcDetails>
                  <ProcActions>
                    <Button variant="outline" size="sm" onClick={() => openEdit(proc)}>Editar</Button>
                    <Badge $bg={proc.ativo ? '#f0ebe4' : '#f5f5f5'} $color={proc.ativo ? '#8a7560' : '#888'} style={{ cursor: 'pointer' }} onClick={() => handleToggleStatus(proc)}>
                      {proc.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </ProcActions>
                </ProcCard>
              );
            })}
          </CardsGrid>
        )
      ) : (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 596 }}>
          <TableWrapper style={{ flex: 1 }}>
            <Table>
              <Thead>
                <tr>
                  <Th $width="8%">Código</Th>
                  <Th $width="26%">Nome</Th>
                  <Th $width="20%">Categoria</Th>
                  <Th $width="12%">Valor</Th>
                  <Th $width="10%">Duração</Th>
                  <Th $width="10%">Comissão</Th>
                  <Th $width="8%">Status</Th>
                  <Th $width="6%">Ações</Th>
                </tr>
              </Thead>
              <Tbody>
                {filtered.length === 0 ? (
                  <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum procedimento encontrado.</Td></tr>
                ) : filtered.map(proc => {
                  const label = catLabel(proc.categoria);
                  const color = catColors[proc.categoria] || catColors[label] || '#BBA188';
                  return (
                    <Tr key={proc.id}>
                      <Td><code style={{ fontSize: '0.8rem', color: '#888' }}>{proc.codigo}</code></Td>
                      <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{proc.nome}</Td>
                      <Td><Badge $bg={`${color}18`} $color={color}>{label}</Badge></Td>
                      <Td style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {proc.valor.toLocaleString('pt-BR')}</Td>
                      <Td>{proc.duracaoMinutos ?? '—'} min</Td>
                      <Td>{proc.percentualComissao ?? '—'}%</Td>
                      <Td><Badge $bg={proc.ativo ? '#f0ebe4' : '#f5f5f5'} $color={proc.ativo ? '#8a7560' : '#888'}>{proc.ativo ? 'Ativo' : 'Inativo'}</Badge></Td>
                      <Td>
                        <ActionGroup>
                          <IconBtn onClick={() => openEdit(proc)}>
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
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={selected ? 'Editar Procedimento' : 'Novo Procedimento'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Salvar</Button>
          </>
        }
      >
        <FormGrid>
          <Input label="Nome do Procedimento *" placeholder="Ex: Botox Facial Completo" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} error={errors.nome} />
          <Input label="Código *" placeholder="Ex: BTX-001" value={form.codigo} onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())} maxLength={20} error={errors.codigo} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={form.categoria} onChange={(v) => handleChange('categoria', v)} error={errors.categoria} />
          </div>
          <Input label="Valor (R$) *" mask="moeda" value={form.valor} inputMode="numeric" maxLength={14} onValueChange={(v) => handleMaskedChange('valor', v)} error={errors.valor} />
          <Input label="Duração (min) *" type="number" placeholder="Ex: 60" value={form.duracao} onChange={(e) => handleChange('duracao', e.target.value)} error={errors.duracao} />
          <Input label="Comissão (%) *" type="number" placeholder="Ex: 20" value={form.comissao} onChange={(e) => handleChange('comissao', e.target.value)} error={errors.comissao} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Descrição *" placeholder="Descreva o procedimento..." maxLength={300} value={form.descricao} onChange={(e) => handleChange('descricao', e.target.value)} error={errors.descricao} />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}
