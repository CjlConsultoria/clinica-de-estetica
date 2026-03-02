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
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, FormGrid, TypeBadge, ChartSection, ChartTitle, BarChart, BarItem,
  BarFill, BarLabel, BarValue,
} from './styles';
import { listarLancamentos, criarLancamento, cancelarLancamento } from '@/services/financeService';

const typeOptions      = [{ value: 'receita', label: 'Receita' }, { value: 'despesa', label: 'Despesa' }];
const categoryOptions  = [{ value: 'procedimento', label: 'Procedimento' }, { value: 'produto', label: 'Produto' }, { value: 'aluguel', label: 'Aluguel' }, { value: 'insumo', label: 'Insumo' }, { value: 'comissao', label: 'Comissão' }, { value: 'outros', label: 'Outros' }];
const pagamentoOptions = [{ value: 'pix', label: 'Pix' }, { value: 'cartao_cred', label: 'Cartão de Crédito' }, { value: 'cartao_deb', label: 'Cartão de Débito' }, { value: 'dinheiro', label: 'Dinheiro' }, { value: 'transferencia', label: 'Transferência Bancária' }];
const filterTypes      = ['Todos', 'Receita', 'Despesa'];
const filterMonths     = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
const PAGAMENTO_MAP: Record<string, string> = {
  pix:           'PIX',
  cartao_cred:   'CARTAO_CREDITO',
  cartao_deb:    'CARTAO_DEBITO',
  dinheiro:      'DINHEIRO',
  transferencia: 'TRANSFERENCIA',
};

const monthlyData = [
  { month: 'Set', receita: 32000, despesa: 12000 },
  { month: 'Out', receita: 35000, despesa: 14000 },
  { month: 'Nov', receita: 28000, despesa: 11000 },
  { month: 'Dez', receita: 42000, despesa: 15000 },
  { month: 'Jan', receita: 38000, despesa: 13500 },
  { month: 'Fev', receita: 38450, despesa: 14300 },
];

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatDateFromISO(iso: string): string {
  if (!iso) return '—';
  try {
    const [datePart] = iso.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return iso;
  }
}

function parseMoeda(v: string): number {
  if (!v) return 0;
  const cleaned = v.replace(/[^0-9,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

type FinanceItem = {
  id: number;
  date: string;
  description: string;
  type: 'receita' | 'despesa';
  category: string;
  value: number;
  patient: string | null;
};

type LancamentoField = 'tipo' | 'categoria' | 'descricao' | 'valor' | 'data' | 'pagamento';
interface LancamentoForm { tipo: string; categoria: string; descricao: string; valor: string; data: string; paciente: string; pagamento: string; }
const LANCAMENTO_INITIAL: LancamentoForm = { tipo: '', categoria: '', descricao: '', valor: '', data: '', paciente: '', pagamento: '' };
const LANCAMENTO_VALIDATION_FIELDS = [
  { key: 'tipo'      as LancamentoField, validate: (v: string) => !v ? 'Selecione o tipo (Receita ou Despesa)' : null },
  { key: 'categoria' as LancamentoField, validate: (v: string) => !v ? 'Selecione uma categoria' : null },
  { key: 'descricao' as LancamentoField, validate: (v: string) => !v.trim() ? 'Descrição é obrigatória' : null },
  { key: 'valor'     as LancamentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor do lançamento' : null },
  { key: 'data'      as LancamentoField, validate: (v: string) => !v ? 'Data é obrigatória' : null },
  { key: 'pagamento' as LancamentoField, validate: (v: string) => !v ? 'Selecione a forma de pagamento' : null },
];
const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

function isLancFormDirty(form: LancamentoForm) {
  return form.tipo !== '' || form.categoria !== '' || form.descricao.trim() !== '' || form.valor.trim() !== '' || form.data !== '' || form.paciente.trim() !== '' || form.pagamento !== '';
}

export default function Finance() {
  const { can, isSuperAdmin } = usePermissions();

  const [lancamentos,            setLancamentos]            = useState<FinanceItem[]>([]);
  const [loading,                setLoading]                = useState(true);
  const [saveLoading,            setSaveLoading]            = useState(false);
  const [apiError,               setApiError]              = useState<string | null>(null);
  const [search, setSearch]             = useState('');
  const [filterType, setFilterType]     = useState('Todos');
  const [filterMonth, setFilterMonth]   = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [exporting, setExporting]       = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [showCancelModal,        setShowCancelModal]        = useState(false);
  const [showConfirmModal,       setShowConfirmModal]       = useState(false);
  const [showSuccessModal,       setShowSuccessModal]       = useState(false);
  const [showExportConfirmModal, setShowExportConfirmModal] = useState(false);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [lancForm, setLancForm] = useState<LancamentoForm>(LANCAMENTO_INITIAL);

  const { errors: lancErrors, validate: lancValidate, clearError: lancClearError, clearAll: lancClearAll } =
    useSequentialValidation<LancamentoField>(LANCAMENTO_VALIDATION_FIELDS);
  useEffect(() => {
    fetchLancamentos();
  }, []);

  async function fetchLancamentos() {
    try {
      setLoading(true);
      setApiError(null);
      const page = await listarLancamentos(0, 200);
      const items = (page.content ?? []).map((l): FinanceItem => ({
        id:          l.id,
        date:        formatDateFromISO(l.criadoEm),
        description: l.descricao,
        type:        'receita' as const,
        category:    'Procedimento',
        value:       l.valor,
        patient:     null,
      }));
      setLancamentos(items);
    } catch (err: any) {
      console.error('[Finance] Erro ao carregar lançamentos:', err);
      setApiError('Erro ao carregar lançamentos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!isSuperAdmin && !can('financeiro.read')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('financeiro.create');

  const totalReceita = lancamentos.filter(f => f.type === 'receita').reduce((a, f) => a + f.value, 0);
  const totalDespesa = lancamentos.filter(f => f.type === 'despesa').reduce((a, f) => a + f.value, 0);
  const saldo        = totalReceita - totalDespesa;
  const maxBar       = Math.max(...monthlyData.map(d => d.receita));

  const filtered = lancamentos.filter(f => {
    const matchSearch = f.description.toLowerCase().includes(search.toLowerCase()) || (f.patient || '').toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'Todos' || f.type === filterType.toLowerCase();
    return matchSearch && matchType;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  function handleLancChange(field: LancamentoField | 'paciente', value: string) {
    setLancForm(prev => ({ ...prev, [field]: value }));
    if (field !== 'paciente') lancClearError(field as LancamentoField);
  }
  function handleLancDataChange(raw: string) {
    if (!raw) { handleLancChange('data', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    handleLancChange('data', `${(yearStr || '').slice(0, 4)}-${month ?? ''}-${day ?? ''}`);
  }
  function handleCancelClick() { isLancFormDirty(lancForm) ? setShowCancelModal(true) : forceClose(); }
  function forceClose() { setLancForm(LANCAMENTO_INITIAL); lancClearAll(); setIsModalOpen(false); setShowCancelModal(false); setApiError(null); }
  function handleSaveLancClick() {
    const isValid = lancValidate({ tipo: lancForm.tipo, categoria: lancForm.categoria, descricao: lancForm.descricao, valor: lancForm.valor, data: lancForm.data, pagamento: lancForm.pagamento });
    if (!isValid) return;
    setShowConfirmModal(true);
  }
  async function handleConfirmSave() {
    setShowConfirmModal(false);
    try {
      setSaveLoading(true);
      setApiError(null);
      await criarLancamento({
        valor:           parseMoeda(lancForm.valor),
        formaPagamento:  PAGAMENTO_MAP[lancForm.pagamento] || lancForm.pagamento.toUpperCase(),
        dataVencimento:  lancForm.data,
        descricao:       lancForm.descricao,
      });
      setIsModalOpen(false);
      setLancForm(LANCAMENTO_INITIAL);
      lancClearAll();
      setShowSuccessModal(true);
      await fetchLancamentos();
    } catch (err: any) {
      console.error('[Finance] Erro ao criar lançamento:', err);
      const msg = err?.response?.data?.mensagem || err?.message || 'Erro ao salvar lançamento.';
      setApiError(msg);
    } finally {
      setSaveLoading(false);
    }
  }
  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);
  const handleExportClick = () => setShowExportConfirmModal(true);
  const handleConfirmExport = async () => {
    setShowExportConfirmModal(false);
    try {
      setExporting(true);
      const response = await fetch('/api/relatorios/financeiro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactions: lancamentos, monthlyData, month: 'Fevereiro 2025', totalReceita, totalDespesa, saldo }) });
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'relatorio-financeiro-fevereiro-2025.pdf'; a.click();
      URL.revokeObjectURL(url);
      setShowExportSuccessModal(true);
    } catch (err) { console.error('[Exportar PDF]', err); alert('Erro ao exportar o PDF. Tente novamente.'); } finally { setExporting(false); }
  };

  return (
    <Container>
      <Header>
        <Title>Financeiro</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" loading={exporting} icon={!exporting ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>) : undefined} onClick={handleExportClick}>{exporting ? 'Exportando...' : 'Exportar PDF'}</Button>
          {canCreate && (
            <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setIsModalOpen(true)}>Novo Lançamento</Button>
          )}
        </div>
      </Header>

      <StatsGrid>
        <StatCard label="Receita do Mês" value={`R$ ${fmt(totalReceita)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend={{ value: '+8.5% vs mês ant.', positive: true }} />
        <StatCard label="Despesas do Mês" value={`R$ ${fmt(totalDespesa)}`} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>} trend={{ value: '+2.1% vs mês ant.', positive: false }} />
        <StatCard label="Saldo do Mês" value={`R$ ${fmt(saldo)}`} color={saldo >= 0 ? '#8a7560' : '#e74c3c'} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Transações" value={lancamentos.length} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Receitas vs Despesas — Últimos 6 Meses</ChartTitle>
        <BarChart>
          {monthlyData.map((d, i) => (
            <BarItem key={i}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                  <BarFill $height={(d.receita / maxBar) * 100} $color="#BBA188" title={`Receita: R$ ${fmt(d.receita)}`} />
                  <BarFill $height={(d.despesa / maxBar) * 100} $color="#e74c3c" title={`Despesa: R$ ${fmt(d.despesa)}`} />
                </div>
              </div>
              <BarLabel>{d.month}</BarLabel>
            </BarItem>
          ))}
        </BarChart>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {[{ label: 'Receita', color: '#BBA188' }, { label: 'Despesa', color: '#e74c3c' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#666' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />{l.label}
            </div>
          ))}
        </div>
      </ChartSection>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por descrição ou paciente..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('type')}><span>{filterType}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown === 'type' && (<DropdownList>{filterTypes.map(t => (<DropdownItem key={t} $active={filterType === t} onClick={() => { setFilterType(t); toggle('type'); setCurrentPage(1); }}>{t}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('month')}><span>{filterMonth}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown === 'month' && (<DropdownList>{filterMonths.map(m => (<DropdownItem key={m} $active={filterMonth === m} onClick={() => { setFilterMonth(m); toggle('month'); setCurrentPage(1); }}>{m}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {(filterType !== 'Todos' || filterMonth !== 'Todos') && (<ClearFilterBtn onClick={() => { setFilterType('Todos'); setFilterMonth('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr><Th $width="12%">Data</Th><Th $width="32%">Descrição</Th><Th $width="15%">Categoria</Th><Th $width="10%">Tipo</Th><Th $width="14%">Valor</Th><Th $width="11%">Paciente</Th><Th $width="6%">Ações</Th></tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando lançamentos...</Td></tr>
              ) : apiError ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ color: '#e74c3c', marginBottom: 8 }}>{apiError}</div>
                  <button onClick={fetchLancamentos} style={{ padding: '6px 16px', background: '#BBA188', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    Tentar novamente
                  </button>
                </Td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lançamento encontrado.</Td></tr>
              ) : paginatedData.map(f => (
                <Tr key={f.id}>
                  <Td style={{ color: '#888' }}>{f.date}</Td>
                  <Td style={{ fontWeight: 500, color: '#1a1a1a' }}>{f.description}</Td>
                  <Td><Badge $bg="rgba(187,161,136,0.12)" $color="#a8906f">{f.category}</Badge></Td>
                  <Td><TypeBadge $type={f.type}><span style={{ fontSize: '0.72rem' }}>{f.type === 'receita' ? '↑' : '↓'}</span>{f.type === 'receita' ? ' Receita' : ' Despesa'}</TypeBadge></Td>
                  <Td style={{ fontWeight: 700, color: f.type === 'receita' ? '#BBA188' : '#e74c3c', fontSize: '0.85rem' }}>{f.type === 'receita' ? '+' : '-'} R$ {fmt(f.value)}</Td>
                  <Td style={{ color: '#777' }}>{f.patient || '—'}</Td>
                  <Td><ActionGroup>{canCreate && <IconBtn><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></IconBtn>}</ActionGroup></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Lançamento" size="md" footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" loading={saveLoading} onClick={handleSaveLancClick}>Salvar</Button></>}>
        {apiError && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fde8e8', borderRadius: 8, border: '1px solid #f5c0c0', color: '#c93a3a', fontSize: '0.82rem' }}>
            {apiError}
          </div>
        )}
        <FormGrid>
          <Select label="Tipo *" options={typeOptions} placeholder="Selecione..." value={lancForm.tipo} onChange={v => handleLancChange('tipo', v)} error={lancErrors.tipo} />
          <Select label="Categoria *" options={categoryOptions} placeholder="Selecione..." value={lancForm.categoria} onChange={v => handleLancChange('categoria', v)} error={lancErrors.categoria} />
          <div style={{ gridColumn: 'span 2' }}><Input label="Descrição *" placeholder="Descreva o lançamento..." value={lancForm.descricao} onChange={e => handleLancChange('descricao', e.target.value)} maxLength={150} error={lancErrors.descricao} /></div>
          <Input label="Valor (R$) *" mask="moeda" value={lancForm.valor} inputMode="numeric" maxLength={14} onValueChange={v => handleLancChange('valor', v)} error={lancErrors.valor} />
          <Input label="Data *" type="date" value={lancForm.data} onChange={e => handleLancDataChange(e.target.value)} error={lancErrors.data} />
          <Select label="Forma de Pagamento *" options={pagamentoOptions} placeholder="Selecione..." value={lancForm.pagamento} onChange={v => handleLancChange('pagamento', v)} error={lancErrors.pagamento} />
          <Input label="Paciente (opcional)" placeholder="Nome do paciente..." value={lancForm.paciente} onChange={e => handleLancChange('paciente', e.target.value)} maxLength={80} />
        </FormGrid>
      </Modal>

      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal isOpen={showConfirmModal} title="Salvar lançamento?" message={`Deseja registrar este lançamento de ${lancForm.tipo === 'receita' ? 'receita' : 'despesa'}${lancForm.descricao ? `: "${lancForm.descricao}"` : ''}?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSave} onCancel={() => setShowConfirmModal(false)} />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message="Lançamento registrado com sucesso!" onClose={() => setShowSuccessModal(false)} buttonText="Continuar" />
      <ConfirmModal isOpen={showExportConfirmModal} title="Exportar PDF?" message="Deseja exportar o relatório financeiro em PDF?" confirmText="Exportar" cancelText="Cancelar" onConfirm={handleConfirmExport} onCancel={() => setShowExportConfirmModal(false)} />
      <SucessModal isOpen={showExportSuccessModal} title="PDF exportado!" message="Relatório financeiro exportado com sucesso!" onClose={() => setShowExportSuccessModal(false)} buttonText="Continuar" />
    </Container>
  );
}
