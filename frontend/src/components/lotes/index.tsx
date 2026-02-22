'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { estoqueService, LoteProduto, LoteRequest } from '@/services/estoque.service';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, AlertBanner, AlertBannerIcon, AlertBannerText,
  DetailSection, DetailSectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
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
  { key: 'lote'              as LoteField, validate: (v: string) => !v.trim() ? 'Número do lote é obrigatório' : null },
  { key: 'produto'           as LoteField, validate: (v: string) => !v.trim() ? 'ID do produto é obrigatório' : null },
  { key: 'quantidadeEntrada' as LoteField, validate: (v: string) => !v.trim() ? 'Informe a quantidade de entrada' : null },
  { key: 'dataValidade'      as LoteField, validate: (v: string) => !v ? 'Data de validade é obrigatória' : null },
];

const categoryOptions = [
  { value: 'toxina',         label: 'Toxina Botulínica' },
  { value: 'preenchimento',  label: 'Preenchimento'      },
  { value: 'bioestimulador', label: 'Bioestimulador'     },
  { value: 'fio',            label: 'Fio de PDO'         },
  { value: 'skincare',       label: 'Skincare/Pele'      },
  { value: 'descartavel',    label: 'Descartável'        },
];

const filterStatus     = ['Todos', 'ATIVO', 'ESGOTADO', 'VENCIDO', 'DESCARTADO'];
const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ATIVO:      { label: 'Ativo',      color: '#8a7560', bg: '#f0ebe4' },
  ESGOTADO:   { label: 'Esgotado',   color: '#7f8c8d', bg: '#f0f0f0' },
  VENCIDO:    { label: 'Vencido',    color: '#856404', bg: '#fff3cd' },
  DESCARTADO: { label: 'Descartado', color: '#555',    bg: '#eee'    },
};

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188', toxina: '#BBA188',
  'Preenchimento':     '#EBD5B0', preenchimento: '#EBD5B0',
  'Bioestimulador':    '#1b1b1b', bioestimulador: '#1b1b1b',
  'Fio de PDO':        '#a8906f', fio: '#a8906f',
  'Skincare/Pele':     '#8a7560', skincare: '#8a7560',
  'Descartável':       '#95a5a6', descartavel: '#95a5a6',
};

function formatDate(d: string) {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return d;
}
function isExpiringSoon(d: string) { const diff = (new Date(d).getTime() - Date.now()) / 86400000; return diff <= 30 && diff > 0; }
function isExpired(d: string) { return new Date(d).getTime() < Date.now(); }

function catDisplayLabel(cat: string): string {
  return categoryOptions.find(c => c.value === cat)?.label ?? cat ?? '—';
}

const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

export default function Lotes() {
  const [search,       setSearch]       = useState('');
  const [filterCat,    setFilterCat]    = useState('Todas');
  const [filterStat,   setFilterStat]   = useState('Todos');
  const [openDropCat,  setOpenDropCat]  = useState(false);
  const [openDropStat, setOpenDropStat] = useState(false);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected,     setSelected]     = useState<LoteProduto | null>(null);
  const [form,         setForm]         = useState<LoteForm>(FORM_INITIAL);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [lotes,        setLotes]        = useState<LoteProduto[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const { errors, validate, clearError, clearAll } = useSequentialValidation<LoteField>(VALIDATION_FIELDS);

  async function carregar() {
    try {
      setLoading(true);
      const data = await estoqueService.listarLotes();
      setLotes(data);
    } catch {
      setError('Erro ao carregar lotes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  const filtered = lotes.filter(l => {
    const catName = catDisplayLabel(l.produtoCategoria ?? '');
    const matchSearch = (l.numeroLote ?? '').toLowerCase().includes(search.toLowerCase())
      || (l.produtoNome ?? '').toLowerCase().includes(search.toLowerCase())
      || (l.produtoRegistroAnvisa ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat  = filterCat === 'Todas' || catName === filterCat || l.produtoCategoria === filterCat;
    const matchStat = filterStat === 'Todos' || l.status === filterStat;
    return matchSearch && matchCat && matchStat;
  });

  const totalFiltered  = filtered.length;
  const totalPages     = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage       = Math.min(currentPage, totalPages);
  const startIndex     = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData  = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalLotes    = lotes.length;
  const ativos        = lotes.filter(l => l.status === 'ATIVO').length;
  const criticos      = lotes.filter(l => isExpiringSoon(l.dataValidade) || l.quantidadeAtual === 0).length;
  const esgotados     = lotes.filter(l => l.status === 'ESGOTADO').length;
  const totalProdutos = lotes.reduce((a, l) => a + l.quantidadeAtual, 0);

  function handleSearchChange(value: string) { setSearch(value); setCurrentPage(1); }
  function handleFilterCatChange(value: string) { setFilterCat(value); setCurrentPage(1); setOpenDropCat(false); }
  function handleFilterStatChange(value: string) { setFilterStat(value); setCurrentPage(1); setOpenDropStat(false); }
  function handleClearFilters() { setFilterCat('Todas'); setFilterStat('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof LoteForm, value: string) { setForm(prev => ({ ...prev, [field]: value })); clearError(field as LoteField); }
  function handleDateChange(field: 'dataFabricacao' | 'dataValidade' | 'dataEntrada', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function openNew() { setSelected(null); setForm(FORM_INITIAL); clearAll(); setIsModalOpen(true); }

  function openEdit(lote: LoteProduto) {
    setSelected(lote);
    setForm({
      lote:              lote.numeroLote,
      registroAnvisa:    lote.produtoRegistroAnvisa ?? '',
      produto:           String(lote.produtoId),
      categoria:         lote.produtoCategoria ?? '',
      fabricante:        lote.produtoFabricante ?? '',
      fornecedor:        lote.fornecedor ?? '',
      quantidadeEntrada: String(lote.quantidadeTotal),
      dataFabricacao:    lote.dataFabricacao ?? '',
      dataValidade:      lote.dataValidade,
      dataEntrada:       lote.criadoEm ? lote.criadoEm.split('T')[0] : '',
      statusLote:        lote.status,
    });
    clearAll();
    setIsModalOpen(true);
  }

  function handleClose() { setForm(FORM_INITIAL); clearAll(); setIsModalOpen(false); }

  async function handleSave() {
    const isValid = validate({
      lote: form.lote, registroAnvisa: form.registroAnvisa, produto: form.produto,
      categoria: form.categoria, fabricante: form.fabricante, fornecedor: form.fornecedor,
      quantidadeEntrada: form.quantidadeEntrada, dataFabricacao: form.dataFabricacao,
      dataValidade: form.dataValidade, dataEntrada: form.dataEntrada, statusLote: form.statusLote,
    });
    if (!isValid) return;
    try {
      const payload: LoteRequest = {
        produtoId:       parseInt(form.produto),
        numeroLote:      form.lote,
        dataFabricacao:  form.dataFabricacao || undefined,
        dataValidade:    form.dataValidade,
        quantidadeTotal: parseInt(form.quantidadeEntrada),
        fornecedor:      form.fornecedor || undefined,
      };
      await estoqueService.criarLote(payload);
      await carregar();
      handleClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao salvar lote';
      alert(msg);
    }
  }

  if (loading) return <Container><p style={{ padding: 32, color: '#888' }}>Carregando lotes...</p></Container>;
  if (error)   return <Container><p style={{ padding: 32, color: '#c0392b' }}>{error}</p></Container>;

  return (
    <Container>
      <Header>
        <Title>Controle de Lotes ANVISA</Title>
        <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={openNew}>Registrar Lote</Button>
      </Header>

      {criticos > 0 && (
        <AlertBanner><AlertBannerIcon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></AlertBannerIcon><AlertBannerText><strong>{criticos} {criticos === 1 ? 'lote' : 'lotes'}</strong> com validade próxima ou estoque crítico.</AlertBannerText></AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Lotes" value={totalLotes} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Lotes Ativos" value={ativos} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Críticos / A Vencer" value={criticos} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={{ value: 'Atenção!', positive: false }} />
        <StatCard label="Esgotados" value={esgotados} color="#a8906f" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} />
        <StatCard label="Unidades em Estoque" value={totalProdutos} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>} />
      </StatsGrid>

      <Controls>
        <SearchBarWrapper><SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap><SearchInputStyled placeholder="Buscar por lote, produto ou registro ANVISA..." value={search} onChange={e => handleSearchChange(e.target.value)} /></SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper><DropdownBtn onClick={() => { setOpenDropCat(!openDropCat); setOpenDropStat(false); }}><span>{filterCat}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>{openDropCat && (<DropdownList>{filterCategories.map(c => <DropdownItem key={c} $active={filterCat === c} onClick={() => handleFilterCatChange(c)}>{c}</DropdownItem>)}</DropdownList>)}</DropdownWrapper>
          <DropdownWrapper><DropdownBtn onClick={() => { setOpenDropStat(!openDropStat); setOpenDropCat(false); }}><span>{filterStat}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>{openDropStat && (<DropdownList>{filterStatus.map(s => <DropdownItem key={s} $active={filterStat === s} onClick={() => handleFilterStatChange(s)}>{s}</DropdownItem>)}</DropdownList>)}</DropdownWrapper>
          {(filterCat !== 'Todas' || filterStat !== 'Todos') && (<ClearFilterBtn onClick={handleClearFilters}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="14%">Nº do Lote</Th><Th $width="22%">Produto</Th><Th $width="15%">Categoria</Th><Th $width="16%">Registro ANVISA</Th><Th $width="11%">Validade</Th><Th $width="9%">Qtd Atual</Th><Th $width="8%">Status</Th><Th $width="5%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {paginatedData.length === 0 ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lote encontrado.</Td></tr>
              ) : paginatedData.map(lote => {
                const catKey   = lote.produtoCategoria ?? '';
                const catColor = catColors[catKey] || '#BBA188';
                const catName  = catDisplayLabel(catKey);
                return (
                  <Tr key={lote.id}>
                    <Td><code style={{ fontSize: '0.73rem', color: '#BBA188', fontWeight: 700 }}>{lote.numeroLote}</code></Td>
                    <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>{lote.produtoNome}{isExpiringSoon(lote.dataValidade) && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fff3cd', color: '#856404', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>A vencer</span>}{isExpired(lote.dataValidade) && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fdecea', color: '#c0392b', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>Vencido</span>}</Td>
                    <Td><Badge $bg={`${catColor}18`} $color={catColor}>{catName}</Badge></Td>
                    <Td style={{ color: '#666', fontFamily: 'monospace' }}>{lote.produtoRegistroAnvisa ?? '—'}</Td>
                    <Td style={{ color: isExpiringSoon(lote.dataValidade) ? '#d68a00' : isExpired(lote.dataValidade) ? '#c0392b' : '#555', fontWeight: isExpiringSoon(lote.dataValidade) ? 600 : 400 }}>{formatDate(lote.dataValidade)}</Td>
                    <Td style={{ fontWeight: 700, color: lote.quantidadeAtual === 0 ? '#e74c3c' : '#1a1a1a' }}>{lote.quantidadeAtual} <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.72rem' }}>{lote.produtoUnidade ?? ''}</span></Td>
                    <Td><Badge $bg={statusConfig[lote.status]?.bg ?? '#eee'} $color={statusConfig[lote.status]?.color ?? '#555'}>{statusConfig[lote.status]?.label ?? lote.status}</Badge></Td>
                    <Td>
                      <ActionGroup>
                        <IconBtn title="Ver detalhes" onClick={() => { setSelected(lote); setIsDetailOpen(true); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></IconBtn>
                        <IconBtn title="Editar" onClick={() => openEdit(lote)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>
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

      <Modal isOpen={isModalOpen} onClose={handleClose} title={selected ? 'Editar Lote' : 'Registrar Novo Lote'} size="lg" footer={<><Button variant="outline" onClick={handleClose}>Cancelar</Button><Button variant="primary" onClick={handleSave}>Salvar Lote</Button></>}>
        <FormGrid>
          <Input label="Número do Lote *" placeholder="Ex: LOT-2025-BTX-001" value={form.lote} onChange={(e) => handleChange('lote', e.target.value.toUpperCase())} error={errors.lote} />
          <Input label="ID do Produto *" placeholder="ID do produto cadastrado" type="number" value={form.produto} onChange={(e) => handleChange('produto', e.target.value)} error={errors.produto} />
          <Input label="Fornecedor" placeholder="Nome do fornecedor" value={form.fornecedor} onChange={(e) => handleChange('fornecedor', e.target.value)} />
          <Input label="Qtd. Entrada *" type="number" placeholder="0" value={form.quantidadeEntrada} onChange={(e) => handleChange('quantidadeEntrada', e.target.value)} error={errors.quantidadeEntrada} />
          <Input label="Data de Fabricação" type="date" value={form.dataFabricacao} onChange={(e) => handleDateChange('dataFabricacao', e.target.value)} />
          <Input label="Data de Validade *" type="date" value={form.dataValidade} onChange={(e) => handleDateChange('dataValidade', e.target.value)} error={errors.dataValidade} />
        </FormGrid>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={`Detalhes — ${selected?.numeroLote}`} size="xl" footer={<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>}>
        {selected && (
          <DetailSection>
            <DetailSectionTitle>Informações do Lote</DetailSectionTitle>
            <DetailGrid>
              <DetailItem><DetailLabel>Nº do Lote</DetailLabel><DetailValue $highlight>{selected.numeroLote}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Registro ANVISA</DetailLabel><DetailValue>{selected.produtoRegistroAnvisa ?? '—'}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Produto</DetailLabel><DetailValue>{selected.produtoNome}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Categoria</DetailLabel><DetailValue>{catDisplayLabel(selected.produtoCategoria ?? '')}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Fabricante</DetailLabel><DetailValue>{selected.produtoFabricante ?? '—'}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Fornecedor</DetailLabel><DetailValue>{selected.fornecedor ?? '—'}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Data de Fabricação</DetailLabel><DetailValue>{formatDate(selected.dataFabricacao ?? '')}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Data de Validade</DetailLabel><DetailValue $warn={isExpiringSoon(selected.dataValidade)}>{formatDate(selected.dataValidade)}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Qtd. Entrada</DetailLabel><DetailValue>{selected.quantidadeTotal} {selected.produtoUnidade ?? ''}</DetailValue></DetailItem>
              <DetailItem><DetailLabel>Qtd. Atual</DetailLabel><DetailValue $highlight>{selected.quantidadeAtual} {selected.produtoUnidade ?? ''}</DetailValue></DetailItem>
            </DetailGrid>
          </DetailSection>
        )}
      </Modal>
    </Container>
  );
}
