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
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';
import {
  listarLancamentos, criarLancamento, registrarPagamento, cancelarLancamento,
  type LancamentoResponse,
} from '@/services/financeiroApi';
import { listarPacientes, type PacienteResponse } from '@/services/pacientesApi';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, FormGrid, TypeBadge, ChartSection, ChartTitle, BarChart, BarItem,
  BarFill, BarLabel, BarValue,
} from './styles';

const pagamentoOptions = [{ value: 'PIX', label: 'Pix' }, { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' }, { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' }, { value: 'DINHEIRO', label: 'Dinheiro' }, { value: 'TRANSFERENCIA', label: 'Transferência Bancária' }];
const filterMonths     = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

// Static chart data (decorative - monthly trend)
const monthlyData = [
  { month: 'Set', receita: 32000, despesa: 0 },
  { month: 'Out', receita: 35000, despesa: 0 },
  { month: 'Nov', receita: 28000, despesa: 0 },
  { month: 'Dez', receita: 42000, despesa: 0 },
  { month: 'Jan', receita: 38000, despesa: 0 },
  { month: 'Fev', receita: 38450, despesa: 0 },
];

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface FinanceItem {
  id: number;
  date: string;
  description: string;
  type: 'receita';
  category: string;
  value: number;
  patient: string | null;
  status: string;
  pacienteId: number | null;
  formaPagamento: string | null;
}

type LancamentoField = 'pacienteId' | 'valor' | 'data';

interface LancamentoForm {
  pacienteId: string;
  valor: string;
  data: string;
  pagamento: string;
  descricao: string;
}

const LANCAMENTO_INITIAL: LancamentoForm = { pacienteId: '', valor: '', data: '', pagamento: '', descricao: '' };
const LANCAMENTO_VALIDATION_FIELDS = [
  { key: 'pacienteId' as LancamentoField, validate: (v: string) => !v ? 'Selecione um paciente' : null },
  { key: 'valor'      as LancamentoField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor do lançamento' : null },
  { key: 'data'       as LancamentoField, validate: (v: string) => !v ? 'Data de vencimento é obrigatória' : null },
];

const ITEMS_PER_PAGE   = 10;
const TABLE_MIN_HEIGHT = 540;

function parseMoeda(v: string): number {
  const clean = v.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function mapLancamento(l: LancamentoResponse): FinanceItem {
  return {
    id:             l.id,
    date:           l.dataVencimento ? new Date(l.dataVencimento).toLocaleDateString('pt-BR') : '—',
    description:    l.descricao || 'Lançamento',
    type:           'receita',
    category:       l.formaPagamento || 'Pendente',
    value:          l.valorLiquido ?? l.valor,
    patient:        l.pacienteNome ?? null,
    status:         l.status,
    pacienteId:     l.pacienteId ?? null,
    formaPagamento: l.formaPagamento ?? null,
  };
}

function isLancFormDirty(form: LancamentoForm) {
  return form.pacienteId !== '' || form.valor.trim() !== '' || form.data !== '' || form.pagamento !== '' || form.descricao.trim() !== '';
}

export default function Finance() {
  const { can, isSuperAdmin } = usePermissions();

  const [lancamentos,  setLancamentos]  = useState<FinanceItem[]>([]);
  const [pacientes,    setPacientes]    = useState<PacienteResponse[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterMonth,  setFilterMonth]  = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [showCancelModal,        setShowCancelModal]        = useState(false);
  const [showConfirmModal,       setShowConfirmModal]       = useState(false);
  const [showSuccessModal,       setShowSuccessModal]       = useState(false);
  const [showExportConfirmModal, setShowExportConfirmModal] = useState(false);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [lancForm, setLancForm] = useState<LancamentoForm>(LANCAMENTO_INITIAL);
  const [errorMsg,    setErrorMsg]    = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const { errors: lancErrors, validate: lancValidate, clearError: lancClearError, clearAll: lancClearAll } =
    useSequentialValidation<LancamentoField>(LANCAMENTO_VALIDATION_FIELDS);

  if (!isSuperAdmin && !can('financeiro.read')) return <AccessDenied />;

  const canCreate = isSuperAdmin || can('financeiro.create');

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  useEffect(() => {
    listarLancamentos(0, 200)
      .then(r => setLancamentos(r.content.map(mapLancamento)))
      .catch(err => showError(err, 'carregar lançamentos'))
      .finally(() => setLoading(false));

    listarPacientes(undefined, 0, 500)
      .then(r => setPacientes(r.content))
      .catch(err => showError(err, 'carregar pacientes'));
  }, []);

  const pacienteOptions = pacientes.map(p => ({ value: String(p.id), label: p.nome }));

  const totalReceita = lancamentos.reduce((a, f) => a + f.value, 0);
  const maxBar       = Math.max(...monthlyData.map(d => d.receita));

  const filtered = lancamentos.filter(f => {
    const matchSearch = f.description.toLowerCase().includes(search.toLowerCase()) || (f.patient || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  function handleLancChange(field: keyof LancamentoForm, value: string) {
    setLancForm(prev => ({ ...prev, [field]: value }));
    if (field === 'pacienteId' || field === 'valor' || field === 'data') lancClearError(field as LancamentoField);
  }
  function handleLancDataChange(raw: string) {
    if (!raw) { handleLancChange('data', ''); return; }
    const [yearStr, month, day] = raw.split('-');
    handleLancChange('data', `${(yearStr || '').slice(0, 4)}-${month ?? ''}-${day ?? ''}`);
  }
  function handleCancelClick() { isLancFormDirty(lancForm) ? setShowCancelModal(true) : forceClose(); }
  function forceClose() { setLancForm(LANCAMENTO_INITIAL); lancClearAll(); setIsModalOpen(false); setShowCancelModal(false); }
  function handleSaveLancClick() {
    const isValid = lancValidate({ pacienteId: lancForm.pacienteId, valor: lancForm.valor, data: lancForm.data });
    if (!isValid) return;
    setShowConfirmModal(true);
  }

  async function handleConfirmSave() {
    setShowConfirmModal(false);
    const payload = {
      pacienteId:     Number(lancForm.pacienteId),
      valor:          parseMoeda(lancForm.valor),
      formaPagamento: lancForm.pagamento || undefined,
      dataVencimento: lancForm.data || undefined,
      descricao:      lancForm.descricao || undefined,
    };
    try {
      const created = await criarLancamento(payload);
      setLancamentos(prev => [mapLancamento(created), ...prev]);
      setIsModalOpen(false);
      setLancForm(LANCAMENTO_INITIAL);
      lancClearAll();
      setShowSuccessModal(true);
    } catch (err) {
      showError(err, 'salvar lançamento');
    }
  }

  async function handleRegistrarPagamento(item: FinanceItem) {
    const forma = item.formaPagamento || 'PIX';
    if (!confirm(`Confirmar pagamento via ${forma}?`)) return;
    try {
      const updated = await registrarPagamento(item.id, forma);
      setLancamentos(prev => prev.map(l => l.id === item.id ? mapLancamento(updated) : l));
    } catch (err) {
      showError(err, 'registrar pagamento');
    }
  }

  async function handleCancelarLancamento(id: number) {
    if (!confirm('Cancelar este lançamento?')) return;
    try {
      const updated = await cancelarLancamento(id);
      setLancamentos(prev => prev.map(l => l.id === id ? mapLancamento(updated) : l));
    } catch (err) {
      showError(err, 'cancelar lançamento');
    }
  }

  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);
  const handleExportClick = () => setShowExportConfirmModal(true);
  const handleConfirmExport = async () => {
    setShowExportConfirmModal(false);
    try {
      setExporting(true);
      const response = await fetch('/api/relatorios/financeiro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactions: lancamentos, monthlyData, totalReceita, saldo: totalReceita }) });
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'relatorio-financeiro.pdf'; a.click();
      URL.revokeObjectURL(url);
      setShowExportSuccessModal(true);
    } catch (err) { showError(err, 'exportar PDF'); } finally { setExporting(false); }
  };

  const statusColor = (status: string): { bg: string; color: string } => {
    if (status === 'PAGO')      return { bg: '#f0ebe4', color: '#8a7560' };
    if (status === 'PENDENTE')  return { bg: '#fff3cd', color: '#856404' };
    if (status === 'CANCELADO') return { bg: '#fde8e8', color: '#c53030' };
    return { bg: '#f5f5f5', color: '#888' };
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
        <StatCard label="Receita Total" value={loading ? '...' : `R$ ${fmt(totalReceita)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend={{ value: '+8.5% vs mês ant.', positive: true }} />
        <StatCard label="Pendente" value={loading ? '...' : `R$ ${fmt(lancamentos.filter(l => l.status === 'PENDENTE').reduce((a, l) => a + l.value, 0))}`} color="#d4a84b" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Saldo Recebido" value={loading ? '...' : `R$ ${fmt(lancamentos.filter(l => l.status === 'PAGO').reduce((a, l) => a + l.value, 0))}`} color="#8a7560" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Transações" value={loading ? '...' : lancamentos.length} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
      </StatsGrid>

      <ChartSection>
        <ChartTitle>Receitas — Últimos 6 Meses (estimativa)</ChartTitle>
        <BarChart>
          {monthlyData.map((d, i) => (
            <BarItem key={i}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                  <BarFill $height={(d.receita / maxBar) * 100} $color="#BBA188" title={`Receita: R$ ${fmt(d.receita)}`} />
                </div>
              </div>
              <BarLabel>{d.month}</BarLabel>
            </BarItem>
          ))}
        </BarChart>
      </ChartSection>

      <Controls>
        <SearchBarWrapper>
          <SearchIconWrap><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></SearchIconWrap>
          <SearchInputStyled placeholder="Buscar por descrição ou paciente..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('month')}><span>{filterMonth}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></DropdownBtn>
            {openDropdown === 'month' && (<DropdownList>{filterMonths.map(m => (<DropdownItem key={m} $active={filterMonth === m} onClick={() => { setFilterMonth(m); toggle('month'); setCurrentPage(1); }}>{m}</DropdownItem>))}</DropdownList>)}
          </DropdownWrapper>
          {filterMonth !== 'Todos' && (<ClearFilterBtn onClick={() => { setFilterMonth('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr><Th $width="12%">Data</Th><Th $width="28%">Descrição</Th><Th $width="14%">Pagamento</Th><Th $width="10%">Status</Th><Th $width="14%">Valor</Th><Th $width="12%">Paciente</Th><Th $width="10%">Ações</Th></tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Carregando...</Td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lançamento encontrado.</Td></tr>
              ) : paginatedData.map(f => {
                const sc = statusColor(f.status);
                const isPendente = f.status === 'PENDENTE';
                return (
                  <Tr key={f.id}>
                    <Td style={{ color: '#888' }}>{f.date}</Td>
                    <Td style={{ fontWeight: 500, color: '#1a1a1a' }}>{f.description}</Td>
                    <Td><Badge $bg="rgba(187,161,136,0.12)" $color="#a8906f">{f.category}</Badge></Td>
                    <Td><Badge $bg={sc.bg} $color={sc.color}>{f.status === 'PAGO' ? 'Pago' : f.status === 'PENDENTE' ? 'Pendente' : 'Cancelado'}</Badge></Td>
                    <Td style={{ fontWeight: 700, color: '#BBA188', fontSize: '0.85rem' }}>R$ {fmt(f.value)}</Td>
                    <Td style={{ color: '#777' }}>{f.patient || '—'}</Td>
                    <Td>
                      <ActionGroup>
                        {isPendente && canCreate && (
                          <>
                            <IconBtn title="Registrar pagamento" onClick={() => handleRegistrarPagamento(f)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            </IconBtn>
                            <IconBtn title="Cancelar" onClick={() => handleCancelarLancamento(f.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </IconBtn>
                          </>
                        )}
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

      <Modal isOpen={isModalOpen} onClose={handleCancelClick} closeOnOverlayClick={false} title="Novo Lançamento" size="md" footer={<><Button variant="outline" onClick={handleCancelClick}>Cancelar</Button><Button variant="primary" onClick={handleSaveLancClick}>Salvar</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Select
              label="Paciente *"
              placeholder={pacientes.length === 0 ? 'Carregando...' : 'Selecione um paciente...'}
              options={pacienteOptions}
              value={lancForm.pacienteId}
              onChange={v => handleLancChange('pacienteId', v)}
              error={lancErrors.pacienteId}
            />
          </div>
          <Input label="Valor (R$) *" mask="moeda" value={lancForm.valor} inputMode="numeric" maxLength={14} onValueChange={v => handleLancChange('valor', v)} error={lancErrors.valor} />
          <Input label="Data de Vencimento *" type="date" value={lancForm.data} onChange={e => handleLancDataChange(e.target.value)} error={lancErrors.data} />
          <Select label="Forma de Pagamento" options={pagamentoOptions} placeholder="Selecione..." value={lancForm.pagamento} onChange={v => handleLancChange('pagamento', v)} />
          <Input label="Descrição (opcional)" placeholder="Descreva o lançamento..." value={lancForm.descricao} onChange={e => handleLancChange('descricao', e.target.value)} maxLength={150} />
        </FormGrid>
      </Modal>

      <CancelModal isOpen={showCancelModal} title="Deseja cancelar?" message="Você preencheu alguns campos. Se continuar, todas as informações serão perdidas." onConfirm={forceClose} onCancel={() => setShowCancelModal(false)} />
      <ConfirmModal isOpen={showConfirmModal} title="Salvar lançamento?" message={`Deseja registrar este lançamento?`} confirmText="Confirmar" cancelText="Voltar" onConfirm={handleConfirmSave} onCancel={() => setShowConfirmModal(false)} />
      <SucessModal isOpen={showSuccessModal} title="Sucesso!" message="Lançamento registrado com sucesso!" onClose={() => setShowSuccessModal(false)} buttonText="Continuar" />
      <ConfirmModal isOpen={showExportConfirmModal} title="Exportar PDF?" message="Deseja exportar o relatório financeiro em PDF?" confirmText="Exportar" cancelText="Cancelar" onConfirm={handleConfirmExport} onCancel={() => setShowExportConfirmModal(false)} />
      <SucessModal isOpen={showExportSuccessModal} title="PDF exportado!" message="Relatório financeiro exportado com sucesso!" onClose={() => setShowExportSuccessModal(false)} buttonText="Continuar" />
      <ErrorModal isOpen={isErrorOpen} message={errorMsg} onClose={() => setIsErrorOpen(false)} />
    </Container>
  );
}
