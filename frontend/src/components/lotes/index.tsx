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
import ErrorModal from '@/components/modals/errorModal';
import { getApiErrorMessage } from '@/utils/apiError';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import { listarLotes, adicionarLote, LoteResponse } from '@/services/lotesApi';
import { listarProdutos, ProdutoResponse } from '@/services/produtosApi';
import {
  Container, Header, Title, StatsGrid, Controls,
  SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  FormGrid, AlertBanner, AlertBannerIcon, AlertBannerText,
  TimelineList, TimelineItem, TimelineDot, TimelineContent, TimelineDate, TimelineText,
  DetailSection, DetailSectionTitle, DetailGrid, DetailItem, DetailLabel, DetailValue,
  UsageTh, UsageTr, UsageTd,
} from './styles';

type LoteField = 'produtoId' | 'numeroLote' | 'quantidadeEntrada' | 'dataValidade';

interface LoteForm {
  produtoId: string;
  numeroLote: string;
  quantidadeEntrada: string;
  dataFabricacao: string;
  dataValidade: string;
  fornecedor: string;
  notaFiscal: string;
}

const FORM_INITIAL: LoteForm = {
  produtoId: '', numeroLote: '', quantidadeEntrada: '',
  dataFabricacao: '', dataValidade: '', fornecedor: '', notaFiscal: '',
};

const VALIDATION_FIELDS = [
  { key: 'produtoId'        as LoteField, validate: (v: string) => !v ? 'Selecione o produto' : null },
  { key: 'numeroLote'       as LoteField, validate: (v: string) => !v.trim() ? 'Número do lote é obrigatório' : null },
  { key: 'quantidadeEntrada'as LoteField, validate: (v: string) => !v.trim() ? 'Informe a quantidade de entrada' : null },
  { key: 'dataValidade'     as LoteField, validate: (v: string) => !v ? 'Data de validade é obrigatória' : null },
];

const filterStatus     = ['Todos', 'Ativo', 'Vencido', 'Esgotado', 'Recolhido'];
const filterCategories = ['Todas', 'Toxina Botulínica', 'Preenchimento', 'Bioestimulador', 'Fio de PDO', 'Skincare/Pele'];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ATIVO:     { label: 'Ativo',     color: '#8a7560', bg: '#f0ebe4' },
  VENCIDO:   { label: 'Vencido',   color: '#856404', bg: '#fff3cd' },
  ESGOTADO:  { label: 'Esgotado',  color: '#7f8c8d', bg: '#f0f0f0' },
  RECOLHIDO: { label: 'Recolhido', color: '#555',    bg: '#eee'    },
};

const catColors: Record<string, string> = {
  'Toxina Botulínica': '#BBA188', 'Preenchimento': '#EBD5B0',
  'Bioestimulador': '#1b1b1b', 'Fio de PDO': '#a8906f',
  'Skincare/Pele': '#8a7560', 'Descartável': '#95a5a6',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function isExpiringSoon(d: string | null) {
  if (!d) return false;
  const diff = (new Date(d).getTime() - Date.now()) / 86400000;
  return diff <= 30 && diff > 0;
}
function isExpired(d: string | null) {
  if (!d) return false;
  return new Date(d).getTime() < Date.now();
}

const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

function isFormDirty(form: LoteForm): boolean {
  return (
    form.produtoId !== '' || form.numeroLote.trim() !== '' ||
    form.quantidadeEntrada.trim() !== '' || form.dataFabricacao !== '' ||
    form.dataValidade !== '' || form.fornecedor.trim() !== ''
  );
}

export default function Lotes() {
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Todas');
  const [filterStat, setFilterStat] = useState('Todos');
  const [openDropCat, setOpenDropCat] = useState(false);
  const [openDropStat, setOpenDropStat] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<LoteResponse | null>(null);
  const [form, setForm] = useState<LoteForm>(FORM_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);

  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg,         setErrorMsg]         = useState('');
  const [isErrorOpen,      setIsErrorOpen]      = useState(false);

  const { errors, validate, clearError, clearAll } = useSequentialValidation<LoteField>(VALIDATION_FIELDS);

  useEffect(() => {
    Promise.all([listarLotes(), listarProdutos()])
      .then(([ls, ps]) => { setLotes(ls); setProdutos(ps); })
      .catch(err => showError(err, 'carregar lotes'))
      .finally(() => setLoading(false));
  }, []);

  const produtoOptions = produtos.map(p => ({ value: String(p.id), label: p.nome }));

  const filtered = lotes.filter(l => {
    const matchSearch =
      l.numeroLote.toLowerCase().includes(search.toLowerCase()) ||
      l.produtoNome.toLowerCase().includes(search.toLowerCase()) ||
      (l.produtoRegistroAnvisa ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Todas' || l.produtoCategoria === filterCat;
    const matchStat = filterStat === 'Todos' || l.status === filterStat.toUpperCase();
    return matchSearch && matchCat && matchStat;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalLotes    = lotes.length;
  const ativos        = lotes.filter(l => l.status === 'ATIVO').length;
  const criticos      = lotes.filter(l => l.status === 'VENCIDO' || isExpiringSoon(l.dataValidade)).length;
  const esgotados     = lotes.filter(l => l.status === 'ESGOTADO').length;
  const totalUnidades = lotes.reduce((a, l) => a + l.quantidadeAtual, 0);

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  function handleSearchChange(value: string) { setSearch(value); setCurrentPage(1); }
  function handleFilterCatChange(value: string) { setFilterCat(value); setCurrentPage(1); setOpenDropCat(false); }
  function handleFilterStatChange(value: string) { setFilterStat(value); setCurrentPage(1); setOpenDropStat(false); }
  function handleClearFilters() { setFilterCat('Todas'); setFilterStat('Todos'); setCurrentPage(1); }

  function handleChange(field: keyof LoteForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    clearError(field as LoteField);
  }
  function handleDateChange(field: 'dataFabricacao' | 'dataValidade', raw: string) {
    if (!raw) { handleChange(field, ''); return; }
    const [yearStr, month, day] = raw.split('-');
    const safeYear = yearStr ? yearStr.slice(0, 4) : '';
    handleChange(field, `${safeYear}-${month ?? ''}-${day ?? ''}`);
  }

  function openNew() { setSelected(null); setForm(FORM_INITIAL); clearAll(); setIsModalOpen(true); }

  function openEdit(lote: LoteResponse) {
    setSelected(lote);
    setForm({
      produtoId: String(lote.produtoId),
      numeroLote: lote.numeroLote,
      quantidadeEntrada: String(lote.quantidadeTotal),
      dataFabricacao: lote.dataFabricacao ?? '',
      dataValidade: lote.dataValidade ?? '',
      fornecedor: lote.fornecedor ?? '',
      notaFiscal: lote.notaFiscal ?? '',
    });
    clearAll(); setIsModalOpen(true);
  }

  function handleCancelClick() {
    if (isFormDirty(form)) { setShowCancelModal(true); } else { forceClose(); }
  }

  function forceClose() {
    setForm(FORM_INITIAL); clearAll();
    setIsModalOpen(false); setSelected(null);
    setShowCancelModal(false); setShowConfirmModal(false);
  }

  function handleSaveClick() {
    const isValid = validate({
      produtoId: form.produtoId,
      numeroLote: form.numeroLote,
      quantidadeEntrada: form.quantidadeEntrada,
      dataValidade: form.dataValidade,
    });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    try {
      const payload = {
        produtoId: Number(form.produtoId),
        numeroLote: form.numeroLote,
        quantidadeTotal: Number(form.quantidadeEntrada),
        dataFabricacao: form.dataFabricacao || undefined,
        dataValidade: form.dataValidade || undefined,
        fornecedor: form.fornecedor || undefined,
        notaFiscal: form.notaFiscal || undefined,
      };
      const result = await adicionarLote(payload);
      setLotes(prev => [result, ...prev]);
      setShowConfirmModal(false);
      setIsModalOpen(false);
      setForm(FORM_INITIAL);
      clearAll();
      setSelected(null);
      setShowSuccessModal(true);
    } catch (err) {
      showError(err, 'salvar lote');
      setShowConfirmModal(false);
    }
  }

  return (
    <Container>
      <Header>
        <Title>Controle de Lotes ANVISA</Title>
        <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={openNew}>Registrar Lote</Button>
      </Header>

      {criticos > 0 && (
        <AlertBanner><AlertBannerIcon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></AlertBannerIcon><AlertBannerText><strong>{criticos} {criticos === 1 ? 'lote' : 'lotes'}</strong> com validade próxima ou vencida.</AlertBannerText></AlertBanner>
      )}

      <StatsGrid>
        <StatCard label="Total de Lotes" value={totalLotes} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} />
        <StatCard label="Lotes Ativos" value={ativos} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        <StatCard label="Vencidos / A Vencer" value={criticos} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={{ value: 'Atenção!', positive: false }} />
        <StatCard label="Esgotados" value={esgotados} color="#a8906f" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>} />
        <StatCard label="Unidades em Estoque" value={totalUnidades} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>} />
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
              {loading ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando lotes...</Td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><Td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lote encontrado.</Td></tr>
              ) : paginatedData.map(lote => (
                <Tr key={lote.id}>
                  <Td><code style={{ fontSize: '0.73rem', color: '#BBA188', fontWeight: 700 }}>{lote.numeroLote}</code></Td>
                  <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {lote.produtoNome}
                    {isExpiringSoon(lote.dataValidade) && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fff3cd', color: '#856404', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>A vencer</span>}
                    {isExpired(lote.dataValidade) && !isExpiringSoon(lote.dataValidade) && <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#fdecea', color: '#c0392b', borderRadius: 6, padding: '2px 6px', fontWeight: 600 }}>Vencido</span>}
                  </Td>
                  <Td><Badge $bg={`${catColors[lote.produtoCategoria ?? ''] ?? '#999'}18`} $color={catColors[lote.produtoCategoria ?? ''] ?? '#999'}>{lote.produtoCategoria ?? '—'}</Badge></Td>
                  <Td style={{ color: '#666', fontFamily: 'monospace' }}>{lote.produtoRegistroAnvisa ?? '—'}</Td>
                  <Td style={{ color: isExpiringSoon(lote.dataValidade) ? '#d68a00' : isExpired(lote.dataValidade) ? '#c0392b' : '#555', fontWeight: isExpiringSoon(lote.dataValidade) ? 600 : 400 }}>{formatDate(lote.dataValidade)}</Td>
                  <Td style={{ fontWeight: 700, color: lote.quantidadeAtual === 0 ? '#e74c3c' : '#1a1a1a' }}>{lote.quantidadeAtual}</Td>
                  <Td><Badge $bg={statusConfig[lote.status]?.bg ?? '#eee'} $color={statusConfig[lote.status]?.color ?? '#555'}>{statusConfig[lote.status]?.label ?? lote.status}</Badge></Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn title="Ver rastreabilidade" onClick={() => { setSelected(lote); setIsDetailOpen(true); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></IconBtn>
                      <IconBtn title="Editar" onClick={() => openEdit(lote)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title={selected ? 'Editar Lote' : 'Registrar Novo Lote'} size="lg" footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveClick}>Salvar Lote</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Produto *" options={produtoOptions} placeholder="Selecione o produto..." value={form.produtoId} onChange={(v) => handleChange('produtoId', v)} error={errors.produtoId} />
          </div>
          <Input label="Número do Lote *" placeholder="Ex: LOT-2025-BTX-001" value={form.numeroLote} onChange={(e) => handleChange('numeroLote', e.target.value.toUpperCase())} error={errors.numeroLote} />
          <Input label="Qtd. Entrada *" type="number" placeholder="0" value={form.quantidadeEntrada} onChange={(e) => handleChange('quantidadeEntrada', e.target.value)} error={errors.quantidadeEntrada} />
          <Input label="Data de Fabricação" type="date" value={form.dataFabricacao} onChange={(e) => handleDateChange('dataFabricacao', e.target.value)} />
          <Input label="Data de Validade *" type="date" value={form.dataValidade} onChange={(e) => handleDateChange('dataValidade', e.target.value)} error={errors.dataValidade} />
          <Input label="Fornecedor" placeholder="Nome do fornecedor" value={form.fornecedor} onChange={(e) => handleChange('fornecedor', e.target.value)} />
          <Input label="Nota Fiscal" placeholder="Nº da nota fiscal" value={form.notaFiscal} onChange={(e) => handleChange('notaFiscal', e.target.value)} />
        </FormGrid>
      </Modal>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={`Rastreabilidade — ${selected?.numeroLote ?? ''}`} size="xl" footer={<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>}>
        {selected && (
          <>
            <DetailSection>
              <DetailSectionTitle>Informações do Lote</DetailSectionTitle>
              <DetailGrid>
                <DetailItem><DetailLabel>Nº do Lote</DetailLabel><DetailValue $highlight>{selected.numeroLote}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Registro ANVISA</DetailLabel><DetailValue>{selected.produtoRegistroAnvisa ?? '—'}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Produto</DetailLabel><DetailValue>{selected.produtoNome}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Categoria</DetailLabel><DetailValue>{selected.produtoCategoria ?? '—'}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fabricante</DetailLabel><DetailValue>{selected.produtoFabricante ?? '—'}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Fornecedor</DetailLabel><DetailValue>{selected.fornecedor ?? '—'}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Fabricação</DetailLabel><DetailValue>{selected.dataFabricacao ? formatDate(selected.dataFabricacao) : '—'}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Data de Validade</DetailLabel><DetailValue $warn={isExpiringSoon(selected.dataValidade)}>{formatDate(selected.dataValidade)}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Total</DetailLabel><DetailValue>{selected.quantidadeTotal}</DetailValue></DetailItem>
                <DetailItem><DetailLabel>Qtd. Atual</DetailLabel><DetailValue $highlight>{selected.quantidadeAtual}</DetailValue></DetailItem>
              </DetailGrid>
            </DetailSection>
            <DetailSection>
              <DetailSectionTitle>Rastreabilidade de Uso</DetailSectionTitle>
              <TimelineList>
                <TimelineItem>
                  <TimelineDot />
                  <TimelineContent>
                    <TimelineDate>—</TimelineDate>
                    <TimelineText>Nenhum uso registrado para este lote.</TimelineText>
                  </TimelineContent>
                </TimelineItem>
              </TimelineList>
              <div style={{ marginTop: 20, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead><tr style={{ background: 'linear-gradient(135deg, #BBA188, #a8906f)' }}><UsageTh>Data</UsageTh><UsageTh>Paciente</UsageTh><UsageTh>Procedimento</UsageTh><UsageTh>Profissional</UsageTh><UsageTh>Qtd Usada</UsageTh></tr></thead>
                  <tbody><UsageTr><UsageTd colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>Sem registros de uso</UsageTd></UsageTr></tbody>
                </table>
              </div>
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
        message={selected ? `Deseja salvar as alterações do lote "${form.numeroLote || selected.numeroLote}"?` : `Deseja registrar o lote "${form.numeroLote}" no sistema?`}
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

      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMsg}
        onClose={() => setIsErrorOpen(false)}
      />
    </Container>
  );
}
