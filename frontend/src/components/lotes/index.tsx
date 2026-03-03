'use client';

import { useState, useEffect } from 'react';
import { listarLotes, criarLote, criarProduto, LoteAPI } from '@/services/estoqueService';
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
  FormGrid, AlertBanner, AlertBannerIcon, AlertBannerText,
  TimelineList, TimelineItem, TimelineDot, TimelineContent, TimelineDate, TimelineText,
  DetailSection, DetailSectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
  UsageTh, UsageTr, UsageTd,
  WizardNav,
} from './styles';

type LoteField =
  | 'lote' | 'registroAnvisa' | 'produto' | 'categoria'
  | 'fabricante' | 'fornecedor' | 'quantidadeEntrada'
  | 'dataFabricacao' | 'dataValidade' | 'dataEntrada' | 'statusLote';

interface LoteForm {
  lote: string; registroAnvisa: string; produto: string; categoria: string;
  fabricante: string; fornecedor: string; quantidadeEntrada: string;
  dataFabricacao: string; dataValidade: string; dataEntrada: string; statusLote: string;
}

const FORM_INITIAL: LoteForm = {
  lote: '', registroAnvisa: '', produto: '', categoria: '',
  fabricante: '', fornecedor: '', quantidadeEntrada: '',
  dataFabricacao: '', dataValidade: '', dataEntrada: '', statusLote: '',
};

const VALIDATION_FIELDS = [
  { key: 'lote'               as LoteField, validate: (v: string) => !v.trim() ? 'Número do lote é obrigatório' : null },
  { key: 'registroAnvisa'     as LoteField, validate: (v: string) => !v.trim() ? 'Registro ANVISA é obrigatório' : null },
  { key: 'produto'            as LoteField, validate: (v: string) => !v.trim() ? 'Nome do produto é obrigatório' : null },
  { key: 'categoria'          as LoteField, validate: (v: string) => !v ? 'Selecione uma categoria' : null },
  { key: 'fabricante'         as LoteField, validate: (v: string) => !v.trim() ? 'Fabricante é obrigatório' : null },
  { key: 'fornecedor'         as LoteField, validate: (v: string) => !v.trim() ? 'Fornecedor é obrigatório' : null },
  { key: 'quantidadeEntrada'  as LoteField, validate: (v: string) => !v.trim() ? 'Informe a quantidade de entrada' : null },
  { key: 'dataFabricacao'     as LoteField, validate: (v: string) => !v ? 'Data de fabricação é obrigatória' : null },
  { key: 'dataValidade'       as LoteField, validate: (v: string) => !v ? 'Data de validade é obrigatória' : null },
  { key: 'dataEntrada'        as LoteField, validate: (v: string) => !v ? 'Data de entrada é obrigatória' : null },
  { key: 'statusLote'         as LoteField, validate: (v: string) => !v ? 'Selecione o status' : null },
];

const categoryOptions = [
  { value: 'toxina', label: 'Toxina Botulínica' }, { value: 'preenchimento', label: 'Preenchimento' },
  { value: 'bioestimulador', label: 'Bioestimulador' }, { value: 'fio', label: 'Fio de PDO' },
  { value: 'skincare', label: 'Skincare/Pele' }, { value: 'descartavel', label: 'Descartável' },
];

const statusOptions = [
  { value: 'ativo', label: 'Ativo' }, { value: 'esgotado', label: 'Esgotado' },
  { value: 'vencido', label: 'Vencido' }, { value: 'descartado', label: 'Descartado' },
];

const filterStatus     = ['Todos', 'Ativo', 'Esgotado', 'Vencido', 'Descartado'];
const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ativo:      { label: 'Ativo',      color: '#8a7560', bg: '#f0ebe4' },
  critico:    { label: 'Crítico',    color: '#c0392b', bg: '#fdecea' },
  esgotado:   { label: 'Esgotado',  color: '#7f8c8d', bg: '#f0f0f0' },
  vencido:    { label: 'Vencido',   color: '#856404', bg: '#fff3cd' },
  descartado: { label: 'Descartado',color: '#555',    bg: '#eee'    },
};

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188', 'Preenchimento': '#EBD5B0', 'Bioestimulador': '#1b1b1b',
  'Fio de PDO': '#a8906f', 'Skincare/Pele': '#8a7560', 'Descartável': '#95a5a6',
};

function formatDate(d: string) { const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; }
function isExpiringSoon(d: string) { const diff = (new Date(d).getTime() - Date.now()) / 86400000; return diff <= 30 && diff > 0; }
function isExpired(d: string) { return new Date(d).getTime() < Date.now(); }

interface LoteUso {
  data: string;
  paciente: string;
  procedimento: string;
  profissional: string;
  quantidade: number;
}

interface Lote {
  id: number;
  lote: string;
  produto: string;
  categoria: string;
  fabricante: string;
  fornecedor: string;
  dataEntrada: string;
  dataFabricacao: string;
  dataValidade: string;
  quantidadeEntrada: number;
  quantidadeAtual: number;
  unidade: string;
  registroAnvisa: string;
  status: string;
  usos: LoteUso[];
}

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

function mapApiToLote(l: LoteAPI): Lote {
  const qty    = l.quantidadeAtual  ?? 0;
  const maxQty = l.quantidadeTotal  ?? 1;
  const ratio  = qty / Math.max(maxQty, 1);
  const status = l.dataValidade && isExpired(l.dataValidade)
    ? 'vencido'
    : qty === 0 ? 'esgotado'
    : ratio <= 0.2 ? 'critico' : 'ativo';
  return {
    id:                l.id,
    lote:              l.numeroLote   || `L${l.id}`,
    produto:           l.produto?.nome || '—',
    categoria:         l.produto?.categoria || '—',
    fabricante:        '—',
    fornecedor:        l.fornecedor   || '—',
    dataEntrada:       l.criadoEm ? new Date(l.criadoEm).toLocaleDateString('pt-BR') : '—',
    dataFabricacao:    '—',
    dataValidade:      l.dataValidade || '2099-12-31',
    quantidadeEntrada: maxQty,
    quantidadeAtual:   qty,
    unidade:           l.produto?.unidade || 'unid',
    registroAnvisa:    '—',
    status,
    usos: [],
  };
}

function isFormDirty(form: LoteForm): boolean {
  return (
    form.lote.trim() !== '' || form.registroAnvisa.trim() !== '' || form.produto.trim() !== '' ||
    form.categoria !== '' || form.fabricante.trim() !== '' || form.fornecedor.trim() !== '' ||
    form.quantidadeEntrada.trim() !== '' || form.dataFabricacao !== '' ||
    form.dataValidade !== '' || form.dataEntrada !== '' || form.statusLote !== ''
  );
}

export default function Lotes() {
  const [search,           setSearch]           = useState('');
  const [filterCat,        setFilterCat]        = useState('Todas');
  const [filterStat,       setFilterStat]       = useState('Todos');
  const [openDropCat,      setOpenDropCat]      = useState(false);
  const [openDropStat,     setOpenDropStat]     = useState(false);
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [isDetailOpen,     setIsDetailOpen]     = useState(false);
  const [selected,         setSelected]         = useState<Lote | null>(null);
  const [form,             setForm]             = useState<LoteForm>(FORM_INITIAL);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lotes,            setLotes]            = useState<Lote[]>([]);

  const { errors, validate, clearError, clearAll } = useSequentialValidation<LoteField>(VALIDATION_FIELDS);

  function fetchLotes() {
    listarLotes().then((data: LoteAPI[]) => {
      setLotes(data.map(mapApiToLote));
    }).catch(() => {});
  }

  useEffect(() => {
    fetchLotes();
  }, []);

  const filtered = lotes.filter(l => {
    const matchSearch = l.lote.toLowerCase().includes(search.toLowerCase()) || l.produto.toLowerCase().includes(search.toLowerCase()) || l.registroAnvisa.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat  === 'Todas' || l.categoria === filterCat;
    const matchStat   = filterStat === 'Todos' || l.status    === filterStat.toLowerCase();
    return matchSearch && matchCat && matchStat;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalLotes    = lotes.length;
  const ativos        = lotes.filter(l => l.status === 'ativo').length;
  const criticos      = lotes.filter(l => l.status === 'critico' || isExpiringSoon(l.dataValidade)).length;
  const esgotados     = lotes.filter(l => l.status === 'esgotado').length;
  const totalProdutos = lotes.reduce((a, l) => a + l.quantidadeAtual, 0);

  function handleSearchChange(value: string)     { setSearch(value);    setCurrentPage(1); }
  function handleFilterCatChange(value: string)  { setFilterCat(value); setCurrentPage(1); setOpenDropCat(false); }
  function handleFilterStatChange(value: string) { setFilterStat(value);setCurrentPage(1); setOpenDropStat(false); }
  function handleClearFilters()                  { setFilterCat('Todas'); setFilterStat('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof LoteForm, value: string) { setForm(prev => ({ ...prev, [field]: value })); clearError(field as LoteField); }
  function handleDateChange(field: 'dataFabricacao' | 'dataValidade' | 'dataEntrada', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function openNew() { setSelected(null); setForm(FORM_INITIAL); clearAll(); setIsModalOpen(true); }

  function openEdit(lote: Lote) {
    setSelected(lote);
    setForm({
      lote: lote.lote, registroAnvisa: lote.registroAnvisa, produto: lote.produto,
      categoria: categoryOptions.find(c => c.label === lote.categoria)?.value ?? '',
      fabricante: lote.fabricante, fornecedor: lote.fornecedor,
      quantidadeEntrada: String(lote.quantidadeEntrada), dataFabricacao: lote.dataFabricacao,
      dataValidade: lote.dataValidade, dataEntrada: '',
      statusLote: statusOptions.find(s => s.label.toLowerCase() === lote.status)?.value ?? lote.status,
    });
    clearAll(); setIsModalOpen(true);
  }

  function handleCancelClick() {
    if (isFormDirty(form)) { setShowCancelModal(true); } else { forceClose(); }
  }

  function forceClose() {
    setForm(FORM_INITIAL); clearAll(); setIsModalOpen(false);
    setSelected(null); setShowCancelModal(false); setShowConfirmModal(false);
  }

  function handleSaveClick() {
    const isValid = validate({
      lote: form.lote, registroAnvisa: form.registroAnvisa, produto: form.produto,
      categoria: form.categoria, fabricante: form.fabricante, fornecedor: form.fornecedor,
      quantidadeEntrada: form.quantidadeEntrada, dataFabricacao: form.dataFabricacao,
      dataValidade: form.dataValidade, dataEntrada: form.dataEntrada, statusLote: form.statusLote,
    });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    setShowConfirmModal(false);
    try {
      if (!selected) {
        const catLabel = categoryOptions.find(c => c.value === form.categoria)?.label ?? form.categoria;
        const produto  = await criarProduto({ nome: form.produto, fabricante: form.fabricante || '—', categoria: catLabel, unidade: 'unid', descricao: form.produto });
        await criarLote({
          produtoId:        produto.id,
          numeroLote:       form.lote,
          quantidadeTotal:  parseInt(form.quantidadeEntrada, 10) || 1,
          dataValidade:     form.dataValidade,
          fornecedor:       form.fornecedor,
        });
        fetchLotes();
      }
    } catch {}
    setIsModalOpen(false);
    setForm(FORM_INITIAL); clearAll(); setSelected(null); setShowSuccessModal(true);
  }

  return (
    <Container>
      <Header>
        <Title>Controle de Lotes ANVISA</Title>
        <Button
          variant="primary"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
          onClick={openNew}
        >
          Registrar Lote
        </Button>
      </Header>

      {criticos > 0 && (
        <AlertBanner>
          <AlertBannerIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </AlertBannerIcon>
          <AlertBannerText>
            <strong>{criticos} {criticos === 1 ? 'lote' : 'lotes'}</strong> com validade próxima ou estoque crítico.
          </AlertBannerText>
        </AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Lotes"       value={totalLotes}    color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Lotes Ativos"         value={ativos}        color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Críticos / A Vencer"  value={criticos}      color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={{ value: 'Atenção!', positive: false }} />
        <StatCard label="Esgotados"            value={esgotados}     color="#a8906f" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} />
        <StatCard label="Unidades em Estoque"  value={totalProdutos} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por lote, produto ou registro ANVISA..." value={search} onChange={e => handleSearchChange(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropCat(!openDropCat); setOpenDropStat(false); }}>
              <span>{filterCat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropCat && (
              <DropdownList>
                {filterCategories.map(c => <DropdownItem key={c} $active={filterCat === c} onClick={() => handleFilterCatChange(c)}>{c}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => { setOpenDropStat(!openDropStat); setOpenDropCat(false); }}>
              <span>{filterStat}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropStat && (
              <DropdownList>
                {filterStatus.map(s => <DropdownItem key={s} $active={filterStat === s} onClick={() => handleFilterStatChange(s)}>{s}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>
          {(filterCat !== 'Todas' || filterStat !== 'Todos') && (
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
                <Th $width="14%">Nº do Lote</Th>
                <Th $width="22%">Produto</Th>
                <Th $width="15%">Categoria</Th>
                <Th $width="16%">Registro ANVISA</Th>
                <Th $width="11%">Validade</Th>
                <Th $width="9%">Qtd Atual</Th>
                <Th $width="8%">Status</Th>
                <Th $width="5%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lote encontrado.</Td></tr>
              ) : paginatedData.map(lote => (
                <Tr key={lote.id}>
                  <Td><code style={{ fontSize: '0.73rem', color: '#BBA188', fontWeight: 700 }}>{lote.lote}</code></Td>
                  <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {lote.produto}
                    {isExpiringSoon(lote.dataValidade) && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fff3cd', color: '#856404', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>A vencer</span>}
                    {isExpired(lote.dataValidade)      && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fdecea', color: '#c0392b', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>Vencido</span>}
                  </Td>
                  <Td><Badge $bg={`${catColors[lote.categoria]}18`} $color={catColors[lote.categoria]}>{lote.categoria}</Badge></Td>
                  <Td style={{ color: '#666', fontFamily: 'monospace' }}>{lote.registroAnvisa}</Td>
                  <Td style={{ color: isExpiringSoon(lote.dataValidade) ? '#d68a00' : isExpired(lote.dataValidade) ? '#c0392b' : '#555', fontWeight: isExpiringSoon(lote.dataValidade) ? 600 : 400 }}>{formatDate(lote.dataValidade)}</Td>
                  <Td style={{ fontWeight: 700, color: lote.quantidadeAtual === 0 ? '#e74c3c' : '#1a1a1a' }}>
                    {lote.quantidadeAtual} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.72rem' }}>{lote.unidade}</span>
                  </Td>
                  <Td><Badge $bg={statusConfig[lote.status]?.bg} $color={statusConfig[lote.status]?.color}>{statusConfig[lote.status]?.label}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver rastreabilidade" onClick={() => { setSelected(lote); setIsDetailOpen(true); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </IconBtn>
                      <IconBtn title="Editar" onClick={() => openEdit(lote)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelClick}
        closeOnOverlayClick={false}
        title={selected ? 'Editar Lote' : 'Registrar Novo Lote'}
        size="lg"
        footer={
          <WizardNav>
            <Button variant="outline" onClick={handleCancelClick}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveClick}>Salvar Lote</Button>
          </WizardNav>
        }
      >
        <FormGrid>
          <Input label="Número do Lote *"   placeholder="Ex: LOT-2025-BTX-001"    value={form.lote}             onChange={e => handleChange('lote', e.target.value.toUpperCase())} error={errors.lote} />
          <Input label="Registro ANVISA *"  placeholder="Ex: 1.0309.0198.001-9"   value={form.registroAnvisa}   onChange={e => handleChange('registroAnvisa', e.target.value)}      error={errors.registroAnvisa} />
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Nome do Produto *" placeholder="Nome completo do produto..." value={form.produto} onChange={e => handleChange('produto', e.target.value)} error={errors.produto} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={form.categoria} onChange={v => handleChange('categoria', v)} error={errors.categoria} />
          </div>
          <Input label="Fabricante *"       placeholder="Nome do fabricante"       value={form.fabricante}       onChange={e => handleChange('fabricante', e.target.value)}          error={errors.fabricante} />
          <Input label="Fornecedor *"       placeholder="Nome do fornecedor"       value={form.fornecedor}       onChange={e => handleChange('fornecedor', e.target.value)}          error={errors.fornecedor} />
          <Input label="Qtd. Entrada *"     type="number" placeholder="0"          value={form.quantidadeEntrada}onChange={e => handleChange('quantidadeEntrada', e.target.value)}  error={errors.quantidadeEntrada} />
          <Input label="Data de Fabricação *" type="date"                          value={form.dataFabricacao}   onChange={e => handleDateChange('dataFabricacao', e.target.value)}  error={errors.dataFabricacao} />
          <Input label="Data de Validade *"   type="date"                          value={form.dataValidade}     onChange={e => handleDateChange('dataValidade', e.target.value)}    error={errors.dataValidade} />
          <Input label="Data de Entrada *"    type="date"                          value={form.dataEntrada}      onChange={e => handleDateChange('dataEntrada', e.target.value)}     error={errors.dataEntrada} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Status *" options={statusOptions} placeholder="Selecione..." value={form.statusLote} onChange={v => handleChange('statusLote', v)} error={errors.statusLote} />
          </div>
        </FormGrid>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Rastreabilidade — ${selected?.lote}`}
        size="xl"
        footer={
          <WizardNav>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </WizardNav>
        }
      >
        {selected && (
          <>
            <DetailSection>
              <DetailSectionTitle>Informações do Lote</DetailSectionTitle>
              <DetailGrid>
                <DetailItem><DetailLabel>Nº do Lote</DetailLabel><DetailValue $highlight>{selected.lote}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Registro ANVISA</DetailLabel><DetailValue>{selected.registroAnvisa}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Produto</DetailLabel><DetailValue>{selected.produto}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Categoria</DetailLabel><DetailValue>{selected.categoria}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fabricante</DetailLabel><DetailValue>{selected.fabricante}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fornecedor</DetailLabel><DetailValue>{selected.fornecedor}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Fabricação</DetailLabel><DetailValue>{selected.dataFabricacao}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Validade</DetailLabel><DetailValue $warn={isExpiringSoon(selected.dataValidade)}>{formatDate(selected.dataValidade)}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Entrada</DetailLabel><DetailValue>{selected.quantidadeEntrada} {selected.unidade}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Atual</DetailLabel><DetailValue $highlight>{selected.quantidadeAtual} {selected.unidade}</DetailValue></DetailItem>
              </DetailGrid>
            </DetailSection>
            <DetailSection>
              <DetailSectionTitle>Rastreabilidade de Uso</DetailSectionTitle>
              {selected.usos.length === 0 ? (
                <p style={{ color: '#bbb', fontSize: '0.88rem', padding: '16px 0' }}>Nenhum uso registrado para este lote.</p>
              ) : (
                <>
                  <TimelineList>
                    {selected.usos.map((uso, i) => (
                      <TimelineItem key={i}>
                        <TimelineDot />
                        <TimelineContent>
                          <TimelineDate>{uso.data}</TimelineDate>
                          <TimelineText>
                            <strong>{uso.paciente}</strong> — {uso.procedimento}
                            <span style={{ marginLeft: 8, color: '#BBA188', fontSize: '0.8rem' }}>Prof: {uso.profissional}</span>
                            <span style={{ marginLeft: 8, color: '#999', fontSize: '0.8rem' }}>{uso.quantidade} {selected.unidade} utilizado(s)</span>
                          </TimelineText>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </TimelineList>
                  <div style={{ marginTop: 20, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #BBA188, #a8906f)' }}>
                          <UsageTh>Data</UsageTh><UsageTh>Paciente</UsageTh><UsageTh>Procedimento</UsageTh><UsageTh>Profissional</UsageTh><UsageTh>Qtd Usada</UsageTh>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.usos.map((uso, i) => (
                          <UsageTr key={i}>
                            <UsageTd>{uso.data}</UsageTd>
                            <UsageTd style={{ fontWeight: 600 }}>{uso.paciente}</UsageTd>
                            <UsageTd>{uso.procedimento}</UsageTd>
                            <UsageTd>{uso.profissional}</UsageTd>
                            <UsageTd>{uso.quantidade} {selected.unidade}</UsageTd>
                          </UsageTr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </DetailSection>
          </>
        )}
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
        title={selected ? 'Salvar alterações?' : 'Registrar lote?'}
        message={selected ? `Deseja salvar as alterações do lote "${form.lote || selected.lote}"?` : `Deseja registrar o lote "${form.lote}" no sistema?`}
        confirmText="Confirmar"
        cancelText="Voltar"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
      <SucessModal
        isOpen={showSuccessModal}
        title="Sucesso!"
        message={selected ? 'Lote atualizado com sucesso!' : 'Lote registrado com sucesso!'}
        onClose={() => setShowSuccessModal(false)}
        buttonText="Continuar"
      />
    </Container>
  );
}