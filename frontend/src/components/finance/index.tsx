'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import Pagination from '@/components/ui/pagination';
import { useSequentialValidation } from '@/components/ui/hooks/useSequentialValidation';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, FormGrid, TypeBadge, ChartSection, ChartTitle, BarChart, BarItem,
  BarFill, BarLabel, BarValue,
} from './styles';
import { financeiroService, type Lancamento } from '@/services/financeiro.service';

const pagamentoOptions = [
  { value: 'PIX',           label: 'Pix'                   },
  { value: 'CARTAO_CRED',   label: 'Cartão de Crédito'     },
  { value: 'CARTAO_DEB',    label: 'Cartão de Débito'      },
  { value: 'DINHEIRO',      label: 'Dinheiro'              },
  { value: 'TRANSFERENCIA', label: 'Transferência Bancária' },
];

const filterTypes  = ['Todos', 'Pago', 'Pendente', 'Cancelado'];
const ITEMS_PER_PAGE = 10;
const TABLE_MIN_HEIGHT = 540;

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  PAGO:      { bg: '#f0ebe4', color: '#8a7560',  label: 'Pago'      },
  PENDENTE:  { bg: '#fff3cd', color: '#856404',  label: 'Pendente'  },
  CANCELADO: { bg: '#fdecea', color: '#c0392b',  label: 'Cancelado' },
};

type DescField = 'descricao' | 'valor' | 'data' | 'pagamento';

interface LancForm {
  descricao: string; valor: string; data: string; pagamento: string;
}
const LANC_INITIAL: LancForm = { descricao: '', valor: '', data: '', pagamento: '' };

const LANC_VALIDATION = [
  { key: 'descricao' as DescField, validate: (v: string) => !v.trim() ? 'Descrição é obrigatória' : null },
  { key: 'valor'     as DescField, validate: (v: string) => !v.trim() || v === 'R$ 0,00' ? 'Informe o valor' : null },
  { key: 'data'      as DescField, validate: (v: string) => !v ? 'Data é obrigatória' : null },
  { key: 'pagamento' as DescField, validate: (v: string) => !v ? 'Selecione a forma de pagamento' : null },
];

export default function Finance() {
  const [lancamentos,  setLancamentos]  = useState<Lancamento[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [search,       setSearch]       = useState('');
  const [filterType,   setFilterType]   = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);

  const [lancForm, setLancForm] = useState<LancForm>(LANC_INITIAL);
  const { errors: lancErrors, validate: lancValidate, clearError: lancClearError, clearAll: lancClearAll } =
    useSequentialValidation<DescField>(LANC_VALIDATION);

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const page = await financeiroService.listar(0, 100);
      setLancamentos(page.content);
    } catch (err) {
      console.error('Erro ao carregar lançamentos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const totalReceita = lancamentos.filter(l => l.status === 'PAGO').reduce((a, l) => a + Number(l.valorLiquido ?? l.valor), 0);
  const totalDespesa = 0; // backend só tem receitas (pagamentos de consultas)
  const saldo        = totalReceita - totalDespesa;

  // Gráfico: agrupar por mês
  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    lancamentos.forEach(l => {
      if (!l.criadoEm) return;
      const d = new Date(l.criadoEm);
      const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      map.set(key, (map.get(key) ?? 0) + Number(l.valor));
    });
    return Array.from(map.entries())
      .slice(-6)
      .map(([month, receita]) => ({ month, receita, despesa: 0 }));
  }, [lancamentos]);

  const maxBar = Math.max(...monthlyData.map(d => d.receita), 1);

  const filtered = useMemo(() => lancamentos.filter(l => {
    const desc = (l.descricao ?? '').toLowerCase();
    const pac  = (l.pacienteNome ?? '').toLowerCase();
    const matchSearch = desc.includes(search.toLowerCase()) || pac.includes(search.toLowerCase());
    const matchType =
      filterType === 'Todos'     ||
      (filterType === 'Pago'     && l.status === 'PAGO')     ||
      (filterType === 'Pendente' && l.status === 'PENDENTE') ||
      (filterType === 'Cancelado'&& l.status === 'CANCELADO');
    return matchSearch && matchType;
  }), [lancamentos, search, filterType]);

  const totalFiltered = filtered.length;
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const safePage      = Math.min(currentPage, totalPages);
  const startIndex    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleLancChange(field: DescField, value: string) {
    setLancForm(prev => ({ ...prev, [field]: value }));
    lancClearError(field);
  }

  function handleCloseLancModal() { setLancForm(LANC_INITIAL); lancClearAll(); setIsModalOpen(false); }

  async function handleSaveLanc() {
    const valid = lancValidate({ descricao: lancForm.descricao, valor: lancForm.valor, data: lancForm.data, pagamento: lancForm.pagamento });
    if (!valid) return;
    setSaving(true);
    try {
      // Parse valor from R$ format
      const valorNum = parseFloat(lancForm.valor.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
      await financeiroService.criar({
        valor: valorNum,
        descricao: lancForm.descricao,
        dataVencimento: lancForm.data,
        formaPagamento: lancForm.pagamento,
      });
      await carregarDados();
      handleCloseLancModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar lançamento');
    } finally {
      setSaving(false);
    }
  }

  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/relatorios/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: filtered, monthlyData, totalReceita, totalDespesa, saldo }),
      });
      if (!response.ok) throw new Error('Falha ao gerar PDF');
      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a'); a.href = url; a.download = 'relatorio-financeiro.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error('[Exportar PDF]', err); alert('Erro ao exportar o PDF.'); }
    finally { setExporting(false); }
  };

  return (
    <Container>
      <Header>
        <Title>Financeiro</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" loading={exporting}
            icon={!exporting ? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>) : undefined}
            onClick={handleExportPDF}>{exporting ? 'Exportando...' : 'Exportar PDF'}</Button>
          <Button variant="primary" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setIsModalOpen(true)}>Novo Lançamento</Button>
        </div>
      </Header>

      <StatsGrid>
        <StatCard label="Receita Total" value={`R$ ${fmt(totalReceita)}`} color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} />
        <StatCard label="Pendentes" value={`R$ ${fmt(lancamentos.filter(l=>l.status==='PENDENTE').reduce((a,l)=>a+Number(l.valor),0))}`} color="#d4a84b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard label="Saldo" value={`R$ ${fmt(saldo)}`} color={saldo >= 0 ? '#8a7560' : '#e74c3c'}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Lançamentos" value={lancamentos.length} color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
      </StatsGrid>

      {monthlyData.length > 0 && (
        <ChartSection>
          <ChartTitle>Receitas por Mês</ChartTitle>
          <BarChart>
            {monthlyData.map((d, i) => (
              <BarItem key={i}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
                    <BarFill $height={(d.receita / maxBar) * 100} $color="#BBA188" title={`R$ ${fmt(d.receita)}`} />
                  </div>
                </div>
                <BarLabel>{d.month}</BarLabel>
              </BarItem>
            ))}
          </BarChart>
        </ChartSection>
      )}

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
          {filterType !== 'Todos' && (<ClearFilterBtn onClick={() => { setFilterType('Todos'); setCurrentPage(1); }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>Limpar</ClearFilterBtn>)}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableWrapper style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <Table>
            <Thead>
              <tr>
                <Th $width="11%">Data</Th><Th $width="30%">Descrição</Th><Th $width="16%">Paciente</Th><Th $width="12%">Valor</Th><Th $width="12%">Líquido</Th><Th $width="10%">Status</Th><Th $width="9%">Pagamento</Th>
              </tr>
            </Thead>
            <Tbody>
              {loading ? (
                <tr><td colSpan={7}><EmptyState><p>Carregando lançamentos...</p></EmptyState></td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>Nenhum lançamento encontrado.</td></tr>
              ) : paginatedData.map(l => {
                const sc = statusColors[l.status ?? 'PENDENTE'] ?? { bg: '#f5f5f5', color: '#888', label: l.status ?? '' };
                const dataFmt = l.criadoEm ? new Date(l.criadoEm).toLocaleDateString('pt-BR') : '—';
                return (
                  <Tr key={l.id}>
                    <Td style={{ color: '#888' }}>{dataFmt}</Td>
                    <Td style={{ fontWeight: 500, color: '#1a1a1a' }}>{l.descricao || `Recibo ${l.numeroRecibo || l.id}`}</Td>
                    <Td style={{ color: '#777' }}>{l.pacienteNome || '—'}</Td>
                    <Td style={{ fontWeight: 600, color: '#BBA188' }}>R$ {fmt(Number(l.valor))}</Td>
                    <Td style={{ fontWeight: 700, color: '#8a7560' }}>R$ {fmt(Number(l.valorLiquido ?? l.valor))}</Td>
                    <Td><Badge $bg={sc.bg} $color={sc.color}>{sc.label}</Badge></Td>
                    <Td style={{ color: '#888', fontSize: '0.82rem' }}>{l.formaPagamento?.replace('_', ' ') || '—'}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableWrapper>
        <Pagination currentPage={safePage} totalItems={totalFiltered} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseLancModal} title="Novo Lançamento" size="md"
        footer={<><Button variant="outline" onClick={handleCloseLancModal}>Cancelar</Button><Button variant="primary" onClick={handleSaveLanc} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button></>}>
        <FormGrid>
          <div style={{ gridColumn: 'span 2' }}>
            <Input label="Descrição *" placeholder="Descreva o lançamento..." value={lancForm.descricao}
              onChange={e => handleLancChange('descricao', e.target.value)} maxLength={100} error={lancErrors.descricao} />
          </div>
          <Input label="Valor (R$) *" mask="moeda" value={lancForm.valor} inputMode="numeric" maxLength={14}
            onValueChange={v => handleLancChange('valor', v)} error={lancErrors.valor} />
          <Input label="Data Vencimento *" type="date" value={lancForm.data}
            onChange={e => handleLancChange('data', e.target.value)} error={lancErrors.data} />
          <div style={{ gridColumn: 'span 2' }}>
            <Select label="Forma de Pagamento *" options={pagamentoOptions} placeholder="Selecione..."
              value={lancForm.pagamento} onChange={v => handleLancChange('pagamento', v)} error={lancErrors.pagamento} />
          </div>
        </FormGrid>
      </Modal>
    </Container>
  );
}
