'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import CancelModal from '@/components/modals/cancelModal';
import ConfirmModal from '@/components/modals/confirmModal';
import SucessModal from '@/components/modals/sucessModal';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { listarProcedimentos, criarProcedimento, atualizarProcedimento, inativarProcedimento, ProcedimentoAPI } from '@/services/procedimentoService';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, CardsGrid, ProcCard, ProcCardHeader, ProcName, ProcCode,
  ProcDetails, DetailRow, DetailLabel, DetailValue, ProcActions, IconBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup,
  ToggleGroup, ToggleBtn, EmptyState, FormGrid,
  PaginationWrapper, PaginationInfo, PaginationControls,
  PageButton, PageEllipsis, PaginationArrow,
  CardsContainer, TableContainer,
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
];

const categoryOptions = [
  { value: 'toxina',         label: 'Toxina Botulínica' },
  { value: 'preenchimento',  label: 'Preenchimento'      },
  { value: 'bioestimulador', label: 'Bioestimulador'     },
  { value: 'fio',            label: 'Fio de PDO'         },
  { value: 'skincare',       label: 'Skincare/Pele'      },
];

const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188',
  'Preenchimento':     '#EBD5B0',
  'Bioestimulador':    '#1b1b1b',
  'Fio de PDO':        '#a8906f',
  'Skincare/Pele':     '#8a7560',
};

function parseMoeda(v: string): number {
  const clean = v.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function getCategoryLabel(value: string): string {
  return categoryOptions.find(c => c.value === value)?.label ?? value;
}

interface Procedure {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  commission: number;
  status: string;
  sessions: number;
  descricao: string;
}

function mapApiToProcedure(p: ProcedimentoAPI): Procedure {
  return {
    id:         p.id,
    name:       p.nome,
    code:       p.codigo,
    category:   p.categoria,
    price:      p.valor,
    duration:   p.duracaoMinutos,
    commission: p.percentualComissao,
    status:     p.ativo ? 'ativo' : 'inativo',
    sessions:   0,
    descricao:  p.descricao || '',
  };
}

const CARDS_PER_PAGE = 6;
const TABLE_PER_PAGE = 10;

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

function isFormDirty(form: ProcedimentoForm): boolean {
  return (
    form.nome.trim() !== '' ||
    form.codigo.trim() !== '' ||
    form.categoria !== '' ||
    form.valor.trim() !== '' ||
    form.duracao.trim() !== '' ||
    form.comissao.trim() !== '' ||
    form.descricao.trim() !== ''
  );
}

export default function Procedures() {
  const [procedures,   setProcedures]   = useState<Procedure[]>([]);
  const [loading,      setLoading]      = useState(false);

  const [view,         setView]         = useState<'cards' | 'tabela'>('cards');
  const [search,       setSearch]       = useState('');
  const [filterCat,    setFilterCat]    = useState('Todas');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [selected,     setSelected]     = useState<Procedure | null>(null);
  const [form,         setForm]         = useState<ProcedimentoForm>(FORM_INITIAL);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [isEditing,    setIsEditing]    = useState(false);

  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage,   setSuccessMessage]   = useState('');

  const { errors, validate, clearError, clearAll } =
    useSequentialValidation<ProcedimentoField>(VALIDATION_FIELDS);

  async function fetchProcedimentos() {
    setLoading(true);
    try {
      const data = await listarProcedimentos(false);
      setProcedures(data.map(mapApiToProcedure));
    } catch {
      setProcedures([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProcedimentos();
  }, []);

  const totalSessions = procedures.reduce((a, p) => a + p.sessions, 0);
  const avgPrice      = procedures.length > 0
    ? procedures.reduce((a, p) => a + p.price, 0) / procedures.length
    : 0;

  const filtered = procedures.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'Todas' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalPagesCards   = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePageCards     = Math.min(currentPage, totalPagesCards);
  const startIdxCards     = (safePageCards - 1) * CARDS_PER_PAGE;
  const paginatedCards    = filtered.slice(startIdxCards, startIdxCards + CARDS_PER_PAGE);
  const startItemCards    = filtered.length === 0 ? 0 : startIdxCards + 1;
  const visiblePagesCards = getVisiblePages(safePageCards, totalPagesCards);

  const totalPagesTable   = Math.max(1, Math.ceil(filtered.length / TABLE_PER_PAGE));
  const safePageTable     = Math.min(currentPage, totalPagesTable);
  const startIdxTable     = (safePageTable - 1) * TABLE_PER_PAGE;
  const paginatedTable    = filtered.slice(startIdxTable, startIdxTable + TABLE_PER_PAGE);
  const startItemTable    = filtered.length === 0 ? 0 : startIdxTable + 1;
  const visiblePagesTable = getVisiblePages(safePageTable, totalPagesTable);

  function handleSearchChange(v: string)  { setSearch(v);      setCurrentPage(1); }
  function handleFilterChange(v: string)  { setFilterCat(v);   setCurrentPage(1); setOpenDropdown(false); }
  function handleClearFilter()            { setFilterCat('Todas'); setCurrentPage(1); }

  function handleChange(field: keyof ProcedimentoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as ProcedimentoField);
  }

  function handleMaskedChange(field: keyof ProcedimentoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as ProcedimentoField);
  }

  function openNew() {
    setIsEditing(false);
    setSelected(null);
    setForm(FORM_INITIAL);
    clearAll();
    setIsModalOpen(true);
  }

  function openEdit(proc: Procedure) {
    setIsEditing(true);
    setSelected(proc);
    setForm({
      nome:      proc.name,
      codigo:    proc.code,
      categoria: categoryOptions.find(c => c.label === proc.category)?.value ?? '',
      valor:     `R$ ${proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      duracao:   String(proc.duration),
      comissao:  String(proc.commission),
      descricao: proc.descricao ?? '',
    });
    clearAll();
    setIsModalOpen(true);
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
    setSelected(null);
    setIsEditing(false);
    setShowCancelModal(false);
    setShowConfirmModal(false);
  }

  function handleSaveClick() {
    const isValid = validate({
      nome: form.nome, codigo: form.codigo, categoria: form.categoria,
      valor: form.valor, duracao: form.duracao, comissao: form.comissao,
    });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    const procedimentoRequest = {
      nome:               form.nome,
      codigo:             form.codigo,
      categoria:          getCategoryLabel(form.categoria),
      valor:              parseMoeda(form.valor),
      duracaoMinutos:     parseInt(form.duracao, 10) || 0,
      percentualComissao: parseFloat(form.comissao) || 0,
      descricao:          form.descricao,
    };

    try {
      if (isEditing && selected) {
        await atualizarProcedimento(selected.id, procedimentoRequest);
        setSuccessMessage('Procedimento atualizado com sucesso!');
      } else {
        await criarProcedimento(procedimentoRequest);
        setCurrentPage(1);
        setSuccessMessage('Procedimento cadastrado com sucesso!');
      }
      await fetchProcedimentos();
    } catch {
      // keep existing list on error
    }

    setShowConfirmModal(false);
    setIsModalOpen(false);
    setShowSuccessModal(true);
  }

  function handleSuccessClose() {
    setShowSuccessModal(false);
    setSuccessMessage('');
    setForm(FORM_INITIAL);
    clearAll();
    setSelected(null);
    setIsEditing(false);
  }

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
        <StatCard label="Total de Procedimentos" value={procedures.length} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
        />
        <StatCard label="Total de Sessões" value={totalSessions} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
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
          <SearchIconWrap>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome ou código..." value={search} onChange={e => handleSearchChange(e.target.value)} />
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
                  <DropdownItem key={c} $active={filterCat === c} onClick={() => handleFilterChange(c)}>{c}</DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          {filterCat !== 'Todas' && (
            <ClearFilterBtn onClick={handleClearFilter}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
          <ToggleGroup>
            <ToggleBtn $active={view === 'cards'} onClick={() => { setView('cards'); setCurrentPage(1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </ToggleBtn>
            <ToggleBtn $active={view === 'tabela'} onClick={() => { setView('tabela'); setCurrentPage(1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </ToggleBtn>
          </ToggleGroup>
        </FilterRow>
      </Controls>

      {view === 'cards' ? (
        <CardsContainer>
          <div style={{ padding: 20, flex: 1, overflow: 'hidden' }}>
            {loading ? (
              <EmptyState>
                <p>Carregando procedimentos...</p>
              </EmptyState>
            ) : filtered.length === 0 ? (
              <EmptyState>
                <h3>Nenhum procedimento encontrado</h3>
                <p>Tente ajustar os filtros ou a busca.</p>
              </EmptyState>
            ) : (
              <CardsGrid>
                {paginatedCards.map(proc => (
                  <ProcCard key={proc.id}>
                    <ProcCardHeader $color={catColors[proc.category] || '#BBA188'}>
                      <div>
                        <ProcCode>{proc.code}</ProcCode>
                        <ProcName>{proc.name}</ProcName>
                      </div>
                      <Badge $bg={`${catColors[proc.category]}22`} $color={catColors[proc.category] || '#BBA188'}>{proc.category}</Badge>
                    </ProcCardHeader>
                    <ProcDetails>
                      <DetailRow><DetailLabel>Valor</DetailLabel><DetailValue $highlight>R$ {proc.price.toLocaleString('pt-BR')}</DetailValue></DetailRow>
                      <DetailRow><DetailLabel>Duração</DetailLabel><DetailValue>{proc.duration} min</DetailValue></DetailRow>
                      <DetailRow><DetailLabel>Comissão</DetailLabel><DetailValue>{proc.commission}%</DetailValue></DetailRow>
                      <DetailRow><DetailLabel>Sessões</DetailLabel><DetailValue>{proc.sessions}</DetailValue></DetailRow>
                    </ProcDetails>
                    <ProcActions>
                      <Button variant="outline" size="sm" onClick={() => openEdit(proc)}>Editar</Button>
                      <Badge $bg={proc.status === 'ativo' ? '#f0ebe4' : '#f5f5f5'} $color={proc.status === 'ativo' ? '#8a7560' : '#888'}>
                        {proc.status.charAt(0).toUpperCase() + proc.status.slice(1)}
                      </Badge>
                    </ProcActions>
                  </ProcCard>
                ))}
              </CardsGrid>
            )}
          </div>

          <PaginationWrapper>
            <PaginationInfo>
              {filtered.length === 0
                ? 'Nenhum registro'
                : `Mostrando ${safePageCards} de ${totalPagesCards}`
              }
            </PaginationInfo>
            <PaginationControls>
              <PaginationArrow
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePageCards <= 1}
                aria-label="Página anterior"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </PaginationArrow>
              {visiblePagesCards.map((page, idx) =>
                page === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageButton
                    key={page}
                    $active={page === safePageCards}
                    onClick={() => setCurrentPage(page as number)}
                    aria-label={`Página ${page}`}
                    aria-current={page === safePageCards ? 'page' : undefined}
                  >
                    {page}
                  </PageButton>
                )
              )}
              <PaginationArrow
                onClick={() => setCurrentPage(p => Math.min(totalPagesCards, p + 1))}
                disabled={safePageCards >= totalPagesCards}
                aria-label="Próxima página"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </PaginationArrow>
            </PaginationControls>
          </PaginationWrapper>
        </CardsContainer>
      ) : (
        <TableContainer>
          <TableWrapper>
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
                {loading ? (
                  <tr>
                    <Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
                      Carregando procedimentos...
                    </Td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
                      Nenhum procedimento encontrado.
                    </Td>
                  </tr>
                ) : paginatedTable.map(proc => (
                  <Tr key={proc.id}>
                    <Td><code style={{ fontSize: '0.73rem', color: '#888' }}>{proc.code}</code></Td>
                    <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{proc.name}</Td>
                    <Td>
                      <Badge
                        $bg={`${catColors[proc.category] || '#BBA188'}18`}
                        $color={catColors[proc.category] || '#BBA188'}
                      >
                        {proc.category}
                      </Badge>
                    </Td>
                    <Td style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {proc.price.toLocaleString('pt-BR')}</Td>
                    <Td>{proc.duration} min</Td>
                    <Td>{proc.commission}%</Td>
                    <Td>
                      <Badge
                        $bg={proc.status === 'ativo' ? '#f0ebe4' : '#f5f5f5'}
                        $color={proc.status === 'ativo' ? '#8a7560' : '#888'}
                      >
                        {proc.status.charAt(0).toUpperCase() + proc.status.slice(1)}
                      </Badge>
                    </Td>
                    <Td>
                      <ActionGroup>
                        <IconBtn onClick={() => openEdit(proc)} title="Editar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </IconBtn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>

          <PaginationWrapper>
            <PaginationInfo>
              {filtered.length === 0
                ? 'Nenhum registro'
                : `Mostrando ${safePageTable} de ${totalPagesTable}`
              }
            </PaginationInfo>
            <PaginationControls>
              <PaginationArrow
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePageTable <= 1}
                aria-label="Página anterior"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </PaginationArrow>
              {visiblePagesTable.map((page, idx) =>
                page === '...' ? (
                  <PageEllipsis key={`ellipsis-${idx}`}>…</PageEllipsis>
                ) : (
                  <PageButton
                    key={page}
                    $active={page === safePageTable}
                    onClick={() => setCurrentPage(page as number)}
                    aria-label={`Página ${page}`}
                    aria-current={page === safePageTable ? 'page' : undefined}
                  >
                    {page}
                  </PageButton>
                )
              )}
              <PaginationArrow
                onClick={() => setCurrentPage(p => Math.min(totalPagesTable, p + 1))}
                disabled={safePageTable >= totalPagesTable}
                aria-label="Próxima página"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </PaginationArrow>
            </PaginationControls>
          </PaginationWrapper>
        </TableContainer>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        closeOnOverlayClick={false}
        title={isEditing ? 'Editar Procedimento' : 'Novo Procedimento'}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={handleCancelClick}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveClick}>Salvar</Button>
          </>
        }
      >
        <FormGrid>
          <Input
            label="Nome do Procedimento *"
            placeholder="Ex: Botox Facial Completo"
            value={form.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            error={errors.nome}
          />
          <Input
            label="Código *"
            placeholder="Ex: BTX-001"
            value={form.codigo}
            onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
            maxLength={20}
            error={errors.codigo}
          />
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Categoria *"
              options={categoryOptions}
              placeholder="Selecione..."
              value={form.categoria}
              onChange={(v) => handleChange('categoria', v)}
              error={errors.categoria}
            />
          </div>
          <Input
            label="Valor (R$) *"
            mask="moeda"
            value={form.valor}
            inputMode="numeric"
            maxLength={14}
            onValueChange={(v) => handleMaskedChange('valor', v)}
            error={errors.valor}
          />
          <Input
            label="Duração (min) *"
            type="number"
            placeholder="Ex: 60"
            value={form.duracao}
            onChange={(e) => handleChange('duracao', e.target.value)}
            error={errors.duracao}
          />
          <Input
            label="Comissão (%) *"
            type="number"
            placeholder="Ex: 20"
            value={form.comissao}
            onChange={(e) => handleChange('comissao', e.target.value)}
            error={errors.comissao}
          />
          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Descrição"
              placeholder="Descreva o procedimento..."
              maxLength={300}
              value={form.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              error={errors.descricao}
            />
          </div>
        </FormGrid>
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
        title={isEditing ? 'Salvar alterações?' : 'Cadastrar procedimento?'}
        message={isEditing
          ? 'Tem certeza que deseja salvar as alterações neste procedimento?'
          : `Tem certeza que deseja cadastrar "${form.nome || 'este procedimento'}"?`
        }
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
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
