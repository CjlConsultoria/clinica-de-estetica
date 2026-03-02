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
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import { listarProdutos, criarProduto, atualizarProduto, listarLotes, criarLote, ProdutoAPI, LoteAPI } from '@/services/estoqueService';
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

const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele', 'Descartável', 'Equipamento'];
const filterStatus     = ['Todos', 'Normal', 'Baixo', 'Crítico', 'Esgotado'];

const unitOptions = [
  { value: 'unid', label: 'Unidade'  },
  { value: 'cx',   label: 'Caixa'   },
  { value: 'fr',   label: 'Frasco'  },
  { value: 'amp',  label: 'Ampola'  },
  { value: 'ser',  label: 'Seringa' },
  { value: 'par',  label: 'Par'     },
];

const movTypeOptions = [
  { value: 'entrada',  label: 'Entrada (Compra/Recebimento)' },
  { value: 'saida',    label: 'Saída (Uso em procedimento)'  },
  { value: 'ajuste',   label: 'Ajuste de Inventário'         },
  { value: 'descarte', label: 'Descarte / Vencimento'        },
];

const mockStock = [
  { id: 1,  code: 'BTX-ALE-001', name: 'Toxina Botulínica Allergan 100U',  category: 'Toxina Botulínica', quantity: 8,  minStock: 5,  maxStock: 30,  unit: 'fr',  price: 980,  expiryDate: '2025-06-15', supplier: 'Biolab',       status: 'normal'   },
  { id: 2,  code: 'BTX-MED-002', name: 'Toxina Botulínica Medytoxin 200U', category: 'Toxina Botulínica', quantity: 2,  minStock: 4,  maxStock: 20,  unit: 'fr',  price: 1200, expiryDate: '2025-04-20', supplier: 'MedEsthetics', status: 'critico'  },
  { id: 3,  code: 'PRE-JUV-001', name: 'Ácido Hialurônico Juvederm 1ml',   category: 'Preenchimento',     quantity: 3,  minStock: 5,  maxStock: 25,  unit: 'ser', price: 450,  expiryDate: '2025-08-10', supplier: 'Allergan',     status: 'baixo'    },
  { id: 4,  code: 'PRE-RES-002', name: 'Restylane Lyft 1ml',               category: 'Preenchimento',     quantity: 12, minStock: 4,  maxStock: 20,  unit: 'ser', price: 520,  expiryDate: '2025-09-30', supplier: 'Galderma',     status: 'normal'   },
  { id: 5,  code: 'BIO-SCU-001', name: 'Sculptra 150mg',                   category: 'Bioestimulador',    quantity: 0,  minStock: 2,  maxStock: 10,  unit: 'fr',  price: 1800, expiryDate: '2025-07-22', supplier: 'Galderma',     status: 'esgotado' },
  { id: 6,  code: 'BIO-RAD-002', name: 'Radiesse 1.5ml',                   category: 'Bioestimulador',    quantity: 6,  minStock: 3,  maxStock: 15,  unit: 'ser', price: 950,  expiryDate: '2025-11-05', supplier: 'Merz',         status: 'normal'   },
  { id: 7,  code: 'FIO-PDO-001', name: 'Fio PDO Tensor Espiral 19G',       category: 'Fio de PDO',        quantity: 4,  minStock: 5,  maxStock: 30,  unit: 'cx',  price: 320,  expiryDate: '2026-01-10', supplier: 'Aesthetic',    status: 'baixo'    },
  { id: 8,  code: 'SKN-VIT-001', name: 'Vitamina C 20% Sérum',             category: 'Skincare/Pele',     quantity: 15, minStock: 5,  maxStock: 40,  unit: 'fr',  price: 180,  expiryDate: '2025-12-01', supplier: 'Sesderma',     status: 'normal'   },
  { id: 9,  code: 'DES-AGU-001', name: 'Agulhas 30G 0.5mm',                category: 'Descartável',       quantity: 1,  minStock: 10, maxStock: 100, unit: 'cx',  price: 45,   expiryDate: '2027-01-01', supplier: 'BD',           status: 'critico'  },
  { id: 10, code: 'DES-LUV-002', name: 'Luvas Nitrila M',                  category: 'Descartável',       quantity: 22, minStock: 5,  maxStock: 50,  unit: 'cx',  price: 38,   expiryDate: '2027-06-01', supplier: 'Medix',        status: 'normal'   },
  { id: 11, code: 'DES-LUV-003', name: 'Luvas Nitrila G',                  category: 'Descartável',       quantity: 22, minStock: 5,  maxStock: 50,  unit: 'cx',  price: 38,   expiryDate: '2027-06-01', supplier: 'Medix',        status: 'normal'   },
];

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188',
  'Preenchimento':     '#EBD5B0',
  'Bioestimulador':    '#1b1b1b',
  'Fio de PDO':        '#a8906f',
  'Skincare/Pele':     '#8a7560',
  'Descartável':       '#95a5a6',
  'Equipamento':       '#e74c3c',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  normal:   { label: 'Normal',   color: '#8a7560', bg: '#f0ebe4' },
  baixo:    { label: 'Baixo',    color: '#d68a00', bg: '#fff8e1' },
  critico:  { label: 'Crítico',  color: '#c0392b', bg: '#fdecea' },
  esgotado: { label: 'Esgotado', color: '#7f8c8d', bg: '#f0f0f0' },
};

function getProgressColor(status: string) {
  if (status === 'normal')  return '#BBA188';
  if (status === 'baixo')   return '#f39c12';
  if (status === 'critico') return '#e74c3c';
  return '#ccc';
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function isExpiringSoon(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff > 0;
}

type ItemField =
  | 'nome' | 'codigo' | 'categoria' | 'unidade'
  | 'quantidade' | 'minimo' | 'maximo' | 'preco' | 'fornecedor' | 'validade';

interface ItemForm {
  nome: string; codigo: string; categoria: string; unidade: string;
  quantidade: string; minimo: string; maximo: string; preco: string;
  fornecedor: string; validade: string;
}

type MovField = 'tipoMov' | 'quantidadeMov' | 'observacaoMov';

interface MovForm {
  tipoMov: string; quantidadeMov: string; observacaoMov: string;
}

const ITEM_INITIAL: ItemForm = {
  nome: '', codigo: '', categoria: '', unidade: '',
  quantidade: '', minimo: '', maximo: '', preco: '', fornecedor: '', validade: '',
};

const MOV_INITIAL: MovForm = {
  tipoMov: '', quantidadeMov: '', observacaoMov: '',
};

const ITEM_VALIDATION_FIELDS = [
  { key: 'nome'       as ItemField, validate: (v: string) => !v.trim()                      ? 'Nome do item é obrigatório'   : null },
  { key: 'codigo'     as ItemField, validate: (v: string) => !v.trim()                      ? 'Código é obrigatório'         : null },
  { key: 'categoria'  as ItemField, validate: (v: string) => !v                             ? 'Selecione uma categoria'      : null },
  { key: 'unidade'    as ItemField, validate: (v: string) => !v                             ? 'Selecione uma unidade'        : null },
  { key: 'quantidade' as ItemField, validate: (v: string) => !v.trim() || isNaN(Number(v)) ? 'Quantidade é obrigatória'     : null },
  { key: 'minimo'     as ItemField, validate: (v: string) => !v.trim() || isNaN(Number(v)) ? 'Estoque mínimo é obrigatório' : null },
  { key: 'maximo'     as ItemField, validate: (v: string) => !v.trim() || isNaN(Number(v)) ? 'Estoque máximo é obrigatório' : null },
  { key: 'preco'      as ItemField, validate: (v: string) => !v.trim() || isNaN(Number(v)) ? 'Preço unitário é obrigatório' : null },
  { key: 'fornecedor' as ItemField, validate: (v: string) => !v.trim()                      ? 'Fornecedor é obrigatório'     : null },
  { key: 'validade'   as ItemField, validate: (v: string) => !v                             ? 'Validade é obrigatória'       : null },
];

const MOV_VALIDATION_FIELDS = [
  { key: 'tipoMov'       as MovField, validate: (v: string) => !v                             ? 'Selecione o tipo de movimentação' : null },
  { key: 'quantidadeMov' as MovField, validate: (v: string) => !v.trim() || isNaN(Number(v)) ? 'Quantidade é obrigatória'          : null },
  { key: 'observacaoMov' as MovField, validate: (v: string) => !v.trim()                      ? 'Observação é obrigatória'          : null },
];

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

interface StockItem {
  id: number; code: string; name: string; category: string;
  quantity: number; minStock: number; maxStock: number; unit: string;
  price: number; expiryDate: string; supplier: string; status: string;
}

function mapLoteToStockItem(lote: LoteAPI): StockItem {
  const qty    = lote.quantidadeAtual ?? 0;
  const maxQty = lote.quantidadeTotal ?? 1;
  const ratio  = qty / Math.max(maxQty, 1);
  const status = qty === 0 ? 'esgotado' : ratio <= 0.2 ? 'critico' : ratio <= 0.5 ? 'baixo' : 'normal';
  return {
    id:         lote.id,
    code:       lote.numeroLote || `L${lote.id}`,
    name:       lote.produto?.nome || '—',
    category:   lote.produto?.categoria || '—',
    quantity:   qty,
    minStock:   0,
    maxStock:   maxQty,
    unit:       lote.produto?.unidade || 'unid',
    price:      0,
    expiryDate: lote.dataValidade || '',
    supplier:   lote.fornecedor || '',
    status,
  };
}

function isItemFormDirty(form: ItemForm): boolean {
  return (
    form.nome.trim() !== '' || form.codigo.trim() !== '' || form.categoria !== '' ||
    form.unidade !== '' || form.quantidade.trim() !== '' || form.minimo.trim() !== '' ||
    form.maximo.trim() !== '' || form.preco.trim() !== '' || form.fornecedor.trim() !== '' ||
    form.validade !== ''
  );
}

function isMovFormDirty(form: MovForm): boolean {
  return form.tipoMov !== '' || form.quantidadeMov.trim() !== '' || form.observacaoMov.trim() !== '';
}

export default function Estoque() {

  const { can, isSuperAdmin } = usePermissions();

  const [view,             setView]             = useState<'cards' | 'tabela'>('tabela');
  const [search,           setSearch]           = useState('');
  const [filterCat,        setFilterCat]        = useState('Todas');
  const [filterStat,       setFilterStat]       = useState('Todos');
  const [openDropdownCat,  setOpenDropdownCat]  = useState(false);
  const [openDropdownStat, setOpenDropdownStat] = useState(false);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isMovModal,       setIsMovModal]       = useState(false);
  const [estoque,          setEstoque]          = useState<StockItem[]>(mockStock as StockItem[]);
  const [selected,         setSelected]         = useState<StockItem | null>(null);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [showItemCancelModal,  setShowItemCancelModal]  = useState(false);
  const [showItemConfirmModal, setShowItemConfirmModal] = useState(false);
  const [showItemSuccessModal, setShowItemSuccessModal] = useState(false);
  const [showMovCancelModal,   setShowMovCancelModal]   = useState(false);
  const [showMovConfirmModal,  setShowMovConfirmModal]  = useState(false);
  const [showMovSuccessModal,  setShowMovSuccessModal]  = useState(false);
  const [itemForm, setItemForm] = useState<ItemForm>(ITEM_INITIAL);
  const { errors: itemErrors, validate: itemValidate, clearError: itemClearError, clearAll: itemClearAll } = useSequentialValidation<ItemField>(ITEM_VALIDATION_FIELDS);
  const [movForm, setMovForm] = useState<MovForm>(MOV_INITIAL);
  const { errors: movErrors, validate: movValidate, clearError: movClearError, clearAll: movClearAll } = useSequentialValidation<MovField>(MOV_VALIDATION_FIELDS);

  useEffect(() => {
    listarLotes().then(lotes => {
      setEstoque(lotes.map(mapLoteToStockItem));
    }).catch(() => {});
  }, []);

  if (!isSuperAdmin && !can('estoque.read')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('estoque.create');
  const canEdit   = isSuperAdmin || can('estoque.edit');

  const filtered = estoque.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat  === 'Todas' || item.category === filterCat;
    const matchStat   = filterStat === 'Todos' || item.status   === filterStat.toLowerCase();
    return matchSearch && matchCat && matchStat;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalItems    = estoque.length;
  const lowStock      = estoque.filter(i => i.status === 'baixo' || i.status === 'critico').length;
  const outOfStock    = estoque.filter(i => i.status === 'esgotado').length;
  const expiringSoon  = estoque.filter(i => isExpiringSoon(i.expiryDate)).length;
  const totalValue    = estoque.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const criticalItems = estoque.filter(i => i.status === 'critico' || i.status === 'esgotado');

  function handleItemChange(field: ItemField, value: string) { setItemForm(prev => ({ ...prev, [field]: value })); itemClearError(field); }
  function handleItemDataChange(raw: string) { if (!raw) { handleItemChange('validade', ''); return; } const [yearStr, month, day] = raw.split('-'); const safeYear = yearStr ? yearStr.slice(0, 4) : ''; handleItemChange('validade', `${safeYear}-${month ?? ''}-${day ?? ''}`); }

  function handleItemCancelClick() {
    if (isItemFormDirty(itemForm)) { setShowItemCancelModal(true); } else { forceCloseItemModal(); }
  }
  function forceCloseItemModal() {
    setItemForm(ITEM_INITIAL); itemClearAll(); setIsModalOpen(false); setSelected(null); setShowItemCancelModal(false);
  }
  function handleSaveItemClick() {
    const isValid = itemValidate({ nome: itemForm.nome, codigo: itemForm.codigo, categoria: itemForm.categoria, unidade: itemForm.unidade, quantidade: itemForm.quantidade, minimo: itemForm.minimo, maximo: itemForm.maximo, preco: itemForm.preco, fornecedor: itemForm.fornecedor, validade: itemForm.validade });
    if (!isValid) return;
    setShowItemConfirmModal(true);
  }
  async function handleConfirmSaveItem() {
    setShowItemConfirmModal(false);
    try {
      if (selected) {
        await atualizarProduto(selected.id, {
          nome: itemForm.nome, fabricante: itemForm.fornecedor,
          categoria: categoryOptions.find(c => c.value === itemForm.categoria)?.label || itemForm.categoria,
          unidade: itemForm.unidade,
        });
      } else {
        const produto = await criarProduto({
          nome: itemForm.nome, fabricante: itemForm.fornecedor,
          categoria: categoryOptions.find(c => c.value === itemForm.categoria)?.label || itemForm.categoria,
          unidade: itemForm.unidade,
        });
        await criarLote({
          produtoId:       produto.id,
          numeroLote:      itemForm.codigo,
          dataValidade:    itemForm.validade,
          quantidadeTotal: Number(itemForm.quantidade) || 0,
          fornecedor:      itemForm.fornecedor,
        });
      }
      const lotes = await listarLotes();
      setEstoque(lotes.map(mapLoteToStockItem));
    } catch {}
    setIsModalOpen(false); setItemForm(ITEM_INITIAL); itemClearAll(); setSelected(null); setShowItemSuccessModal(true);
  }

  function handleMovChange(field: MovField, value: string) { setMovForm(prev => ({ ...prev, [field]: value })); movClearError(field); }
  function handleMovCancelClick() {
    if (isMovFormDirty(movForm)) { setShowMovCancelModal(true); } else { forceCloseMovModal(); }
  }
  function forceCloseMovModal() {
    setMovForm(MOV_INITIAL); movClearAll(); setIsMovModal(false); setSelected(null); setShowMovCancelModal(false);
  }
  function handleSaveMovClick() {
    const isValid = movValidate({ tipoMov: movForm.tipoMov, quantidadeMov: movForm.quantidadeMov, observacaoMov: movForm.observacaoMov });
    if (!isValid) return;
    setShowMovConfirmModal(true);
  }
  function handleConfirmSaveMov() {
    setShowMovConfirmModal(false); setIsMovModal(false); setMovForm(MOV_INITIAL); movClearAll(); setSelected(null); setShowMovSuccessModal(true);
  }

  function openEdit(item: StockItem) {
    setSelected(item);
    setItemForm({ nome: item.name, codigo: item.code, categoria: categoryOptions.find(c => c.label === item.category)?.value ?? '', unidade: item.unit, quantidade: String(item.quantity), minimo: String(item.minStock), maximo: String(item.maxStock), preco: String(item.price), fornecedor: item.supplier, validade: item.expiryDate });
    setIsModalOpen(true);
  }
  function openMov(item: StockItem) { setSelected(item); setMovForm(MOV_INITIAL); movClearAll(); setIsMovModal(true); }

  return (
    <Container>
      <Header>
        <Title>Estoque</Title>
        {canCreate && (
          <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => { setSelected(null); setItemForm(ITEM_INITIAL); itemClearAll(); setIsModalOpen(true); }}>Novo Item</Button>
        )}
      </Header>

      {criticalItems.length > 0 && (
        <AlertBanner>
          <AlertBannerIcon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></AlertBannerIcon>
          <AlertBannerText><strong>{criticalItems.length} {criticalItems.length === 1 ? 'item' : 'itens'}</strong> com estoque crítico ou esgotado: {criticalItems.map(i => i.name).join(', ')}</AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Itens"        value={totalItems}   color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Estoque Baixo/Crítico"  value={lowStock}     color="#f39c12" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={{ value: 'Atenção!', positive: false }} />
        <StatCard label="Esgotados"              value={outOfStock}   color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} trend={{ value: 'Repor urgente', positive: false }} />
        <StatCard label="A Vencer (30 dias)"    value={expiringSoon} color="#a8906f" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} />
        <StatCard label="Valor em Estoque"      value={`R$ ${totalValue.toLocaleString('pt-BR')}`} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} trend={{ value: '+R$ 4.200 vs mês', positive: true }} />
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
            {openDropdownStat && (<DropdownList>{filterStatus.map(s => (<DropdownItem key={s} $active={filterStat === s} onClick={() => { setFilterStat(s); setOpenDropdownStat(false); setCurrentPage(1); }}>{s}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {(filterCat !== 'Todas' || filterStat !== 'Todos') && (<ClearFilterBtn onClick={() => { setFilterCat('Todas'); setFilterStat('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
          <ToggleGroup>
            <ToggleBtn $active={view === 'tabela'} onClick={() => setView('tabela')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></ToggleBtn>
            <ToggleBtn $active={view === 'cards'}  onClick={() => setView('cards')} ><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></ToggleBtn>
          </ToggleGroup>
        </FilterRow>
      </Controls>

      {view === 'tabela' ? (
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
            <Table>
              <Thead>
                <tr>
                  <Th $width="10%">Código</Th><Th $width="22%">Nome</Th><Th $width="16%">Categoria</Th><Th $width="10%">Qtd / Un</Th><Th $width="10%">Mín</Th><Th $width="12%">Validade</Th><Th $width="10%">Status</Th><Th $width="10%">Ações</Th>
                </tr>
              </Thead>
              <Tbody>
                {paginatedData.length === 0 ? (
                  <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum item encontrado.</Td></tr>
                ) : paginatedData.map(item => (
                  <Tr key={item.id}>
                    <Td><code style={{ fontSize: '0.73rem', color: '#888' }}>{item.code}</code></Td>
                    <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                      {item.name}
                      {isExpiringSoon(item.expiryDate) && (<span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fff3cd', color: '#856404', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>Vence em breve</span>)}
                    </Td>
                    <Td><Badge $bg={`${catColors[item.category]}18`} $color={catColors[item.category]}>{item.category}</Badge></Td>
                    <Td style={{ fontWeight: 700, color: item.quantity === 0 ? '#e74c3c' : '#1a1a1a' }}>{item.quantity} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.72rem' }}>{item.unit}</span></Td>
                    <Td style={{ color: '#888' }}>{item.minStock} {item.unit}</Td>
                    <Td style={{ color: isExpiringSoon(item.expiryDate) ? '#d68a00' : '#555', fontWeight: isExpiringSoon(item.expiryDate) ? 600 : 400 }}>{formatDate(item.expiryDate)}</Td>
                    <Td><Badge $bg={statusConfig[item.status].bg} $color={statusConfig[item.status].color}>{statusConfig[item.status].label}</Badge></Td>
                    <Td>
                      {canEdit && (
                        <ActionGroup>
                          <IconBtn title="Movimentar" onClick={() => openMov(item)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></IconBtn>
                          <IconBtn title="Editar"     onClick={() => openEdit(item)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>
                        </ActionGroup>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
          <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <CardsGrid>
          {filtered.length === 0 ? (
            <EmptyState><h3>Nenhum item encontrado</h3><p>Tente ajustar os filtros de busca.</p></EmptyState>
          ) : filtered.map(item => (
            <StockCard key={item.id}>
              <StockCardTop $color={catColors[item.category] || '#BBA188'}>
                <div>
                  <StockCardCategory>{item.category}</StockCardCategory>
                  <StockCardName>{item.name}</StockCardName>
                  <code style={{ fontSize: '0.72rem', color: '#999' }}>{item.code}</code>
                </div>
                <StockAlertBadge $bg={statusConfig[item.status].bg} $color={statusConfig[item.status].color}>{statusConfig[item.status].label}</StockAlertBadge>
              </StockCardTop>
              <StockCardBody>
                <StockDetailRow><StockDetailLabel>Quantidade</StockDetailLabel><StockDetailValue $highlight $color={item.quantity === 0 ? '#e74c3c' : item.quantity <= item.minStock ? '#d68a00' : '#1a1a1a'}>{item.quantity} {item.unit}</StockDetailValue></StockDetailRow>
                <ProgressBarWrapper><ProgressBar $pct={Math.min((item.quantity / item.maxStock) * 100, 100)} $color={getProgressColor(item.status)} /></ProgressBarWrapper>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#aaa', marginBottom: 12 }}><span>Mín: {item.minStock}</span><span>Máx: {item.maxStock}</span></div>
                <StockDetailRow><StockDetailLabel>Validade</StockDetailLabel><StockDetailValue $color={isExpiringSoon(item.expiryDate) ? '#d68a00' : '#444'}>{formatDate(item.expiryDate)}{isExpiringSoon(item.expiryDate) && ' ⚠️'}</StockDetailValue></StockDetailRow>
                <StockDetailRow><StockDetailLabel>Fornecedor</StockDetailLabel><StockDetailValue>{item.supplier}</StockDetailValue></StockDetailRow>
                <StockDetailRow><StockDetailLabel>Preço Unit.</StockDetailLabel><StockDetailValue $highlight>R$ {item.price.toLocaleString('pt-BR')}</StockDetailValue></StockDetailRow>
              </StockCardBody>
              {canEdit && (
                <StockCardFooter>
                  <Button variant="outline" size="sm" onClick={() => openMov(item)}>+ Movimentar</Button>
                  <Button variant="ghost"   size="sm" onClick={() => openEdit(item)}>Editar</Button>
                </StockCardFooter>
              )}
            </StockCard>
          ))}
        </CardsGrid>
      )}

      <Modal isOpen={isModalOpen} onClose={handleItemCancelClick} closeOnOverlayClick={false} title={selected ? 'Editar Item' : 'Novo Item de Estoque'} size="md" footer={<><Button variant="outline" onClick={handleItemCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveItemClick}>Salvar</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}><Input label="Nome do Item *" placeholder="Ex: Toxina Botulínica Allergan..." value={itemForm.nome} onChange={e => handleItemChange('nome', e.target.value)} maxLength={120} error={itemErrors.nome} /></div>
          <Input label="Código *" placeholder="Ex: BTX-001" value={itemForm.codigo} onChange={e => handleItemChange('codigo', e.target.value.toUpperCase())} maxLength={30} error={itemErrors.codigo} />
          <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={itemForm.categoria} onChange={v => handleItemChange('categoria', v)} error={itemErrors.categoria} />
          <Select label="Unidade *" options={unitOptions} placeholder="Selecione..." value={itemForm.unidade} onChange={v => handleItemChange('unidade', v)} error={itemErrors.unidade} />
          <Input label="Quantidade *" type="number" placeholder="0" value={itemForm.quantidade} onChange={e => handleItemChange('quantidade', e.target.value)} error={itemErrors.quantidade} />
          <Input label="Estoque Mínimo *" type="number" placeholder="0" value={itemForm.minimo} onChange={e => handleItemChange('minimo', e.target.value)} error={itemErrors.minimo} />
          <Input label="Estoque Máximo *" type="number" placeholder="0" value={itemForm.maximo} onChange={e => handleItemChange('maximo', e.target.value)} error={itemErrors.maximo} />
          <Input label="Preço Unitário (R$) *" type="number" placeholder="0,00" value={itemForm.preco} onChange={e => handleItemChange('preco', e.target.value)} error={itemErrors.preco} />
          <Input label="Fornecedor *" placeholder="Nome do fornecedor" value={itemForm.fornecedor} onChange={e => handleItemChange('fornecedor', e.target.value)} maxLength={80} error={itemErrors.fornecedor} />
          <Input label="Validade *" type="date" value={itemForm.validade} onChange={e => handleItemDataChange(e.target.value)} error={itemErrors.validade} />
        </FormGrid>
      </Modal>

      <Modal isOpen={isMovModal} onClose={handleMovCancelClick} closeOnOverlayClick={false} title={`Movimentar: ${selected?.name ?? ''}`} size="sm" footer={<><Button variant="outline" onClick={handleMovCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveMovClick}>Confirmar</Button></>}>
        <FormGrid style={{ gridTemplateColumns: '1fr' }}>
          <Select label="Tipo de Movimentação *" options={movTypeOptions} placeholder="Selecione o tipo..." value={movForm.tipoMov} onChange={v => handleMovChange('tipoMov', v)} error={movErrors.tipoMov} />
          <Input label="Quantidade *" type="number" placeholder="0" value={movForm.quantidadeMov} onChange={e => handleMovChange('quantidadeMov', e.target.value)} error={movErrors.quantidadeMov} />
          <Input label="Observação *" placeholder="Ex: NF 1234, Procedimento da paciente Ana..." value={movForm.observacaoMov} onChange={e => handleMovChange('observacaoMov', e.target.value)} maxLength={200} error={movErrors.observacaoMov} />
        </FormGrid>
      </Modal>

      <CancelModal isOpen={showItemCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceCloseItemModal} onCancel={() => setShowItemCancelModal(false)} />
      <ConfirmModal isOpen={showItemConfirmModal} title={selected ? 'Salvar alterações?' : 'Adicionar item?'} message={selected ? `Deseja salvar as alterações do item "${itemForm.nome || selected.name}"?` : `Deseja adicionar o item "${itemForm.nome}" ao estoque?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSaveItem} onCancel={() => setShowItemConfirmModal(false)} />
      <SucessModal isOpen={showItemSuccessModal} title="Sucesso!" message={selected ? 'Item atualizado com sucesso!' : 'Item adicionado ao estoque com sucesso!'} onClose={() => setShowItemSuccessModal(false)} buttonText="Continuar" />

      <CancelModal isOpen={showMovCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, a movimentação será descartada." onConfirm={forceCloseMovModal} onCancel={() => setShowMovCancelModal(false)} />
      <ConfirmModal isOpen={showMovConfirmModal} title="Confirmar movimentação?" message={`Deseja registrar a movimentação de "${selected?.name ?? 'item'}"?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSaveMov} onCancel={() => setShowMovConfirmModal(false)} />
      <SucessModal isOpen={showMovSuccessModal} title="Sucesso!" message="Movimentação registrada com sucesso!" onClose={() => setShowMovSuccessModal(false)} buttonText="Continuar" />
    </Container>
  );
}