'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { estoqueService, Produto } from '@/services/estoque.service';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, FormGrid,
  ToggleGroup, ToggleBtn, CardsGrid, StockCard, StockCardTop, StockCardName,
  StockCardCategory, StockCardBody, StockDetailRow, StockDetailLabel, StockDetailValue,
  StockCardFooter, ProgressBarWrapper, ProgressBar, StockAlertBadge,
  AlertBanner, AlertBannerIcon, AlertBannerText,
} from './styles';

const categoryOptions = [
  { value: 'toxina',         label: 'Toxina Botulínica' },
  { value: 'preenchimento',  label: 'Preenchimento'      },
  { value: 'bioestimulador', label: 'Bioestimulador'     },
  { value: 'fio',            label: 'Fio de PDO'         },
  { value: 'skincare',       label: 'Skincare/Pele'      },
  { value: 'descartavel',    label: 'Descartável'        },
  { value: 'equipamento',    label: 'Equipamento'        },
];

const unitOptions = [
  { value: 'unid', label: 'Unidade'  },
  { value: 'cx',   label: 'Caixa'   },
  { value: 'fr',   label: 'Frasco'  },
  { value: 'amp',  label: 'Ampola'  },
  { value: 'ser',  label: 'Seringa' },
  { value: 'par',  label: 'Par'     },
];

const movTypeOptions = [
  { value: 'saida',   label: 'Saída (Uso em procedimento)'  },
  { value: 'descarte',label: 'Descarte / Vencimento'        },
];

const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele', 'Descartável', 'Equipamento'];
const filterStatusList  = ['Todos', 'Normal', 'Baixo', 'Crítico', 'Esgotado'];

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188', 'Preenchimento': '#EBD5B0', 'Bioestimulador': '#1b1b1b',
  'Fio de PDO': '#a8906f', 'Skincare/Pele': '#8a7560', 'Descartável': '#95a5a6', 'Equipamento': '#e74c3c',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  normal:   { label: 'Normal',   color: '#8a7560', bg: '#f0ebe4' },
  baixo:    { label: 'Baixo',    color: '#d68a00', bg: '#fff8e1' },
  critico:  { label: 'Crítico',  color: '#c0392b', bg: '#fdecea' },
  esgotado: { label: 'Esgotado', color: '#7f8c8d', bg: '#f0f0f0' },
  NORMAL:   { label: 'Normal',   color: '#8a7560', bg: '#f0ebe4' },
  BAIXO:    { label: 'Baixo',    color: '#d68a00', bg: '#fff8e1' },
  CRITICO:  { label: 'Crítico',  color: '#c0392b', bg: '#fdecea' },
  ESGOTADO: { label: 'Esgotado', color: '#7f8c8d', bg: '#f0f0f0' },
};

function deriveStatus(p: Produto): string {
  if (p.status) return p.status.toLowerCase();
  if (p.quantidadeAtual === 0)                     return 'esgotado';
  if (p.quantidadeAtual <= p.estoqueMinimo * 0.5)  return 'critico';
  if (p.quantidadeAtual <= p.estoqueMinimo)         return 'baixo';
  return 'normal';
}

function getProgressColor(st: string) {
  if (st === 'normal')  return '#BBA188';
  if (st === 'baixo')   return '#f39c12';
  if (st === 'critico') return '#e74c3c';
  return '#ccc';
}

function getCategLabel(val: string): string {
  return categoryOptions.find(c => c.value === val)?.label ?? val;
}

type ItemField = 'nome' | 'codigo' | 'categoria' | 'unidade' | 'minimo' | 'maximo' | 'preco' | 'fornecedor';
interface ItemForm { nome: string; codigo: string; categoria: string; unidade: string; minimo: string; maximo: string; preco: string; fornecedor: string; }
type MovField = 'tipoMov' | 'quantidadeMov' | 'observacaoMov';
interface MovForm { tipoMov: string; quantidadeMov: string; observacaoMov: string; }

const ITEM_INITIAL: ItemForm = { nome: '', codigo: '', categoria: '', unidade: '', minimo: '', maximo: '', preco: '', fornecedor: '' };
const MOV_INITIAL: MovForm   = { tipoMov: '', quantidadeMov: '', observacaoMov: '' };

const ITEM_VALIDATION: { key: ItemField; validate: (v: string) => string | null }[] = [
  { key: 'nome',       validate: v => !v.trim()                      ? 'Nome é obrigatório'           : null },
  { key: 'codigo',     validate: v => !v.trim()                      ? 'Código é obrigatório'         : null },
  { key: 'categoria',  validate: v => !v                             ? 'Selecione uma categoria'      : null },
  { key: 'unidade',    validate: v => !v                             ? 'Selecione uma unidade'        : null },
  { key: 'minimo',     validate: v => !v.trim() || isNaN(Number(v)) ? 'Estoque mínimo é obrigatório' : null },
  { key: 'maximo',     validate: v => !v.trim() || isNaN(Number(v)) ? 'Estoque máximo é obrigatório' : null },
  { key: 'preco',      validate: v => !v.trim() || isNaN(Number(v)) ? 'Preço é obrigatório'          : null },
  { key: 'fornecedor', validate: v => !v.trim()                      ? 'Fornecedor é obrigatório'     : null },
];

const MOV_VALIDATION: { key: MovField; validate: (v: string) => string | null }[] = [
  { key: 'tipoMov',       validate: v => !v                             ? 'Selecione o tipo' : null },
  { key: 'quantidadeMov', validate: v => !v.trim() || isNaN(Number(v)) ? 'Quantidade é obrigatória' : null },
  { key: 'observacaoMov', validate: v => !v.trim()                      ? 'Observação é obrigatória' : null },
];

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Estoque() {
  const [produtos,         setProdutos]         = useState<Produto[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [view,             setView]             = useState<'cards' | 'tabela'>('tabela');
  const [search,           setSearch]           = useState('');
  const [filterCat,        setFilterCat]        = useState('Todas');
  const [filterStat,       setFilterStat]       = useState('Todos');
  const [openDropdownCat,  setOpenDropdownCat]  = useState(false);
  const [openDropdownStat, setOpenDropdownStat] = useState(false);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isMovModal,       setIsMovModal]       = useState(false);
  const [selected,         setSelected]         = useState<Produto | null>(null);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [movSaving,        setMovSaving]        = useState(false);

  const [itemForm, setItemForm] = useState<ItemForm>(ITEM_INITIAL);
  const { errors: itemErrors, validate: itemValidate, clearError: itemClearError, clearAll: itemClearAll } = useSequentialValidation<ItemField>(ITEM_VALIDATION);
  const [movForm, setMovForm]   = useState<MovForm>(MOV_INITIAL);
  const { errors: movErrors, validate: movValidate, clearError: movClearError, clearAll: movClearAll } = useSequentialValidation<MovField>(MOV_VALIDATION);

  const loadProdutos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await estoqueService.listarProdutos();
      setProdutos(data);
    } catch { setProdutos([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProdutos(); }, [loadProdutos]);

  const filtered = produtos.filter(p => {
    const st      = deriveStatus(p);
    const catLabel = getCategLabel(p.categoria);
    const matchSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat  === 'Todas' || catLabel === filterCat || p.categoria === filterCat;
    const matchStat   = filterStat === 'Todos' || st === filterStat.toLowerCase() || (filterStat === 'Crítico' && st === 'critico');
    return matchSearch && matchCat && matchStat;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const lowStock      = produtos.filter(p => ['baixo', 'critico'].includes(deriveStatus(p))).length;
  const outOfStock    = produtos.filter(p => deriveStatus(p) === 'esgotado').length;
  const totalValue    = produtos.reduce((acc, p) => acc + (p.precoUnitario ?? 0) * (p.quantidadeAtual ?? 0), 0);
  const criticalItems = produtos.filter(p => ['critico', 'esgotado'].includes(deriveStatus(p)));

  function handleItemChange(field: ItemField, value: string) { setItemForm(prev => ({ ...prev, [field]: value })); itemClearError(field); }
  function handleCloseItemModal() { setItemForm(ITEM_INITIAL); itemClearAll(); setIsModalOpen(false); setSelected(null); }

  async function handleSaveItem() {
    const isValid = itemValidate({ nome: itemForm.nome, codigo: itemForm.codigo, categoria: itemForm.categoria, unidade: itemForm.unidade, minimo: itemForm.minimo, maximo: itemForm.maximo, preco: itemForm.preco, fornecedor: itemForm.fornecedor });
    if (!isValid) return;
    setSaving(true);
    try {
      const payload = {
        nome: itemForm.nome, codigo: itemForm.codigo, categoria: itemForm.categoria,
        unidade: itemForm.unidade, estoqueMinimo: Number(itemForm.minimo),
        estoqueMaximo: Number(itemForm.maximo), precoUnitario: Number(itemForm.preco),
        fornecedor: itemForm.fornecedor,
      };
      if (selected) { await estoqueService.atualizarProduto(selected.id, payload); }
      else { await estoqueService.criarProduto(payload); }
      handleCloseItemModal();
      loadProdutos();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar produto');
    } finally { setSaving(false); }
  }

  function handleMovChange(field: MovField, value: string) { setMovForm(prev => ({ ...prev, [field]: value })); movClearError(field); }
  function handleCloseMovModal() { setMovForm(MOV_INITIAL); movClearAll(); setIsMovModal(false); setSelected(null); }

  async function handleSaveMov() {
    const isValid = movValidate({ tipoMov: movForm.tipoMov, quantidadeMov: movForm.quantidadeMov, observacaoMov: movForm.observacaoMov });
    if (!isValid) return;
    setMovSaving(true);
    try {
      // Buscar lotes do produto e dar baixa no primeiro lote ativo
      const lotes = await estoqueService.listarLotes();
      const loteAtivo = lotes.find(l => l.produtoId === selected?.id && l.status !== 'ESGOTADO' && l.status !== 'DESCARTADO' && l.quantidadeAtual > 0);
      if (loteAtivo) {
        await estoqueService.baixaLote(loteAtivo.id, Number(movForm.quantidadeMov), movForm.observacaoMov);
      }
      handleCloseMovModal();
      loadProdutos();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao registrar movimentação');
    } finally { setMovSaving(false); }
  }

  function openEdit(p: Produto) {
    setSelected(p);
    setItemForm({ nome: p.nome, codigo: p.codigo, categoria: p.categoria, unidade: p.unidade, minimo: String(p.estoqueMinimo), maximo: String(p.estoqueMaximo), preco: String(p.precoUnitario), fornecedor: p.fornecedor });
    itemClearAll();
    setIsModalOpen(true);
  }

  function openMov(p: Produto) { setSelected(p); setMovForm(MOV_INITIAL); movClearAll(); setIsMovModal(true); }

  return (
    <Container>
      <Header>
        <Title>Estoque</Title>
        <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => { setSelected(null); setItemForm(ITEM_INITIAL); itemClearAll(); setIsModalOpen(true); }}>
          Novo Item
        </Button>
      </Header>

      {criticalItems.length > 0 && (
        <AlertBanner>
          <AlertBannerIcon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></AlertBannerIcon>
          <AlertBannerText><strong>{criticalItems.length} {criticalItems.length === 1 ? 'item' : 'itens'}</strong> com estoque crítico ou esgotado: {criticalItems.slice(0, 3).map(p => p.nome).join(', ')}{criticalItems.length > 3 ? `... +${criticalItems.length - 3}` : ''}</AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Itens" value={loading ? '...' : produtos.length} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Estoque Baixo/Crítico" value={loading ? '...' : lowStock} color="#f39c12" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={lowStock > 0 ? { value: 'Atenção!', positive: false } : undefined} />
        <StatCard label="Esgotados" value={loading ? '...' : outOfStock} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} trend={outOfStock > 0 ? { value: 'Repor urgente', positive: false } : undefined} />
        <StatCard label="Valor em Estoque" value={loading ? '...' : `R$ ${totalValue.toLocaleString('pt-BR')}`} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por nome ou código..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropdownCat(!openDropdownCat); setOpenDropdownStat(false); }}><span>{filterCat}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdownCat && (<DropdownList>{filterCategories.map(c => (<DropdownItem key={c} $active={filterCat === c} onClick={() => { setFilterCat(c); setOpenDropdownCat(false); setCurrentPage(1); }}>{c}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropdownStat(!openDropdownStat); setOpenDropdownCat(false); }}><span>{filterStat}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdownStat && (<DropdownList>{filterStatusList.map(s => (<DropdownItem key={s} $active={filterStat === s} onClick={() => { setFilterStat(s); setOpenDropdownStat(false); setCurrentPage(1); }}>{s}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {(filterCat !== 'Todas' || filterStat !== 'Todos') && (<ClearFilterBtn onClick={() => { setFilterCat('Todas'); setFilterStat('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
          <ToggleGroup>
            <ToggleBtn $active={view === 'tabela'} onClick={() => setView('tabela')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></ToggleBtn>
            <ToggleBtn $active={view === 'cards'} onClick={() => setView('cards')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></ToggleBtn>
          </ToggleGroup>
        </FilterRow>
      </Controls>

      {view === 'tabela' ? (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
            <Table>
              <Thead>
                <tr><Th $width="10%">Código</Th><Th $width="26%">Nome</Th><Th $width="16%">Categoria</Th><Th $width="11%">Qtd / Un</Th><Th $width="8%">Mín</Th><Th $width="9%">Fornecedor</Th><Th $width="10%">Status</Th><Th $width="10%">Ações</Th></tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando...</Td></tr>
                ) : paginatedData.length === 0 ? (
                  <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum item encontrado.</Td></tr>
                ) : paginatedData.map(p => {
                  const st  = deriveStatus(p);
                  const cfg = statusConfig[st] ?? statusConfig['normal'];
                  const cat = getCategLabel(p.categoria);
                  const catColor = catColors[cat] ?? '#BBA188';
                  return (
                    <Tr key={p.id}>
                      <Td><code style={{ fontSize: '0.73rem', color: '#888' }}>{p.codigo}</code></Td>
                      <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{p.nome}</Td>
                      <Td><Badge $bg={`${catColor}18`} $color={catColor}>{cat}</Badge></Td>
                      <Td style={{ fontWeight: 700, color: p.quantidadeAtual === 0 ? '#e74c3c' : '#1a1a1a' }}>{p.quantidadeAtual} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.72rem' }}>{p.unidade}</span></Td>
                      <Td style={{ color: '#888' }}>{p.estoqueMinimo} {p.unidade}</Td>
                      <Td style={{ fontSize: '0.82rem', color: '#666' }}>{p.fornecedor}</Td>
                      <Td><Badge $bg={cfg.bg} $color={cfg.color}>{cfg.label}</Badge></Td>
                      <Td>
                        <ActionGroup>
                          <IconBtn title="Dar baixa" onClick={() => openMov(p)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></IconBtn>
                          <IconBtn title="Editar" onClick={() => openEdit(p)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>
                        </ActionGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrapper>
          <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <CardsGrid>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#bbb', padding: '48px 0' }}>Carregando...</div>
          ) : filtered.length === 0 ? (
            <EmptyState><h3>Nenhum item encontrado</h3><p>Tente ajustar os filtros de busca.</p></EmptyState>
          ) : filtered.map(p => {
            const st       = deriveStatus(p);
            const cfg      = statusConfig[st] ?? statusConfig['normal'];
            const cat      = getCategLabel(p.categoria);
            const catColor = catColors[cat] ?? '#BBA188';
            return (
              <StockCard key={p.id}>
                <StockCardTop $color={catColor}>
                  <div>
                    <StockCardCategory>{cat}</StockCardCategory>
                    <StockCardName>{p.nome}</StockCardName>
                    <code style={{ fontSize: '0.72rem', color: '#999' }}>{p.codigo}</code>
                  </div>
                  <StockAlertBadge $bg={cfg.bg} $color={cfg.color}>{cfg.label}</StockAlertBadge>
                </StockCardTop>
                <StockCardBody>
                  <StockDetailRow><StockDetailLabel>Quantidade</StockDetailLabel><StockDetailValue $highlight $color={p.quantidadeAtual === 0 ? '#e74c3c' : p.quantidadeAtual <= p.estoqueMinimo ? '#d68a00' : '#1a1a1a'}>{p.quantidadeAtual} {p.unidade}</StockDetailValue></StockDetailRow>
                  <ProgressBarWrapper><ProgressBar $pct={Math.min(p.estoqueMaximo > 0 ? (p.quantidadeAtual / p.estoqueMaximo) * 100 : 0, 100)} $color={getProgressColor(st)} /></ProgressBarWrapper>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#aaa', marginBottom: 12 }}><span>Mín: {p.estoqueMinimo}</span><span>Máx: {p.estoqueMaximo}</span></div>
                  <StockDetailRow><StockDetailLabel>Fornecedor</StockDetailLabel><StockDetailValue>{p.fornecedor}</StockDetailValue></StockDetailRow>
                  <StockDetailRow><StockDetailLabel>Preço Unit.</StockDetailLabel><StockDetailValue $highlight>R$ {(p.precoUnitario ?? 0).toLocaleString('pt-BR')}</StockDetailValue></StockDetailRow>
                </StockCardBody>
                <StockCardFooter>
                  <Button variant="outline" size="sm" onClick={() => openMov(p)}>+ Movimentar</Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Editar</Button>
                </StockCardFooter>
              </StockCard>
            );
          })}
        </CardsGrid>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseItemModal} title={selected ? 'Editar Item' : 'Novo Item de Estoque'} size="md" footer={<><Button variant="outline" onClick={handleCloseItemModal}>Cancelar</Button><Button variant="primary" onClick={handleSaveItem} loading={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}><Input label="Nome do Item *" placeholder="Ex: Toxina Botulínica Allergan..." value={itemForm.nome} onChange={e => handleItemChange('nome', e.target.value)} maxLength={120} error={itemErrors.nome} /></div>
          <Input label="Código *" placeholder="Ex: BTX-001" value={itemForm.codigo} onChange={e => handleItemChange('codigo', e.target.value.toUpperCase())} maxLength={30} error={itemErrors.codigo} />
          <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={itemForm.categoria} onChange={v => handleItemChange('categoria', v)} error={itemErrors.categoria} />
          <Select label="Unidade *" options={unitOptions} placeholder="Selecione..." value={itemForm.unidade} onChange={v => handleItemChange('unidade', v)} error={itemErrors.unidade} />
          <Input label="Estoque Mínimo *" type="number" placeholder="0" value={itemForm.minimo} onChange={e => handleItemChange('minimo', e.target.value)} error={itemErrors.minimo} />
          <Input label="Estoque Máximo *" type="number" placeholder="0" value={itemForm.maximo} onChange={e => handleItemChange('maximo', e.target.value)} error={itemErrors.maximo} />
          <Input label="Preço Unitário (R$) *" type="number" placeholder="0.00" value={itemForm.preco} onChange={e => handleItemChange('preco', e.target.value)} error={itemErrors.preco} />
          <Input label="Fornecedor *" placeholder="Nome do fornecedor" value={itemForm.fornecedor} onChange={e => handleItemChange('fornecedor', e.target.value)} maxLength={80} error={itemErrors.fornecedor} />
        </FormGrid>
      </Modal>

      <Modal isOpen={isMovModal} onClose={handleCloseMovModal} title={`Movimentar: ${selected?.nome ?? ''}`} size="sm" footer={<><Button variant="outline" onClick={handleCloseMovModal}>Cancelar</Button><Button variant="primary" onClick={handleSaveMov} loading={movSaving}>{movSaving ? 'Salvando...' : 'Confirmar'}</Button></>}>
        <FormGrid style={{ gridTemplateColumns: '1fr' }}>
          <Select label="Tipo de Movimentação *" options={movTypeOptions} placeholder="Selecione o tipo..." value={movForm.tipoMov} onChange={v => handleMovChange('tipoMov', v)} error={movErrors.tipoMov} />
          <Input label="Quantidade *" type="number" placeholder="0" value={movForm.quantidadeMov} onChange={e => handleMovChange('quantidadeMov', e.target.value)} error={movErrors.quantidadeMov} />
          <Input label="Observação *" placeholder="Ex: Uso em procedimento da paciente Ana..." value={movForm.observacaoMov} onChange={e => handleMovChange('observacaoMov', e.target.value)} maxLength={200} error={movErrors.observacaoMov} />
        </FormGrid>
      </Modal>
    </Container>
  );
}
