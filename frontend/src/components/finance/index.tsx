'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import StatCard from '@/components/ui/statcard';
import {
  Container, Header, Title, Controls, SearchBarWrapper, SearchIconWrap, SearchInputStyled,
  FilterRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem, ClearFilterBtn,
  StatsGrid, TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge, ActionGroup, IconBtn,
  EmptyState, FormGrid, TypeBadge, ChartSection, ChartTitle, BarChart, BarItem,
  BarFill, BarLabel, BarValue,
} from './styles';

const typeOptions = [
  { value: 'receita', label: 'Receita' },
  { value: 'despesa', label: 'Despesa' },
];
const categoryOptions = [
  { value: 'procedimento', label: 'Procedimento' },
  { value: 'produto', label: 'Produto' },
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'insumo', label: 'Insumo' },
  { value: 'comissao', label: 'Comissão' },
  { value: 'outros', label: 'Outros' },
];

const filterTypes = ['Todos', 'Receita', 'Despesa'];
const filterMonths = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

const mockFinance = [
  { id: 1,  date: '18/02/2025', description: 'Botox Facial - Ana Costa',           type: 'receita' as const, category: 'Procedimento', value: 800,  patient: 'Ana Costa'      },
  { id: 2,  date: '18/02/2025', description: 'Preenchimento Labial - Carla M.',    type: 'receita' as const, category: 'Procedimento', value: 1200, patient: 'Carla Mendonça'  },
  { id: 3,  date: '17/02/2025', description: 'Reposição de Insumos ANVISA',        type: 'despesa' as const, category: 'Insumo',       value: 2340, patient: null              },
  { id: 4,  date: '16/02/2025', description: 'Bioestimulador - Fernanda Lima',     type: 'receita' as const, category: 'Procedimento', value: 2500, patient: 'Fernanda Lima'   },
  { id: 5,  date: '15/02/2025', description: 'Aluguel do Espaço',                 type: 'despesa' as const, category: 'Aluguel',      value: 3500, patient: null              },
  { id: 6,  date: '14/02/2025', description: 'Fio PDO - Marina Souza',            type: 'receita' as const, category: 'Procedimento', value: 1800, patient: 'Marina Souza'    },
  { id: 7,  date: '13/02/2025', description: 'Comissão Profissional - Fevereiro',  type: 'despesa' as const, category: 'Comissão',     value: 1280, patient: null              },
  { id: 8,  date: '12/02/2025', description: 'Microagulhamento - Patrícia A.',     type: 'receita' as const, category: 'Procedimento', value: 450,  patient: 'Patrícia Alves'  },
  { id: 9,  date: '10/02/2025', description: 'Toxina Botulínica - Juliana R.',     type: 'receita' as const, category: 'Procedimento', value: 600,  patient: 'Juliana Rocha'   },
  { id: 10, date: '08/02/2025', description: 'Material de Escritório',             type: 'despesa' as const, category: 'Outros',       value: 180,  patient: null              },
];

const monthlyData = [
  { month: 'Set', receita: 32000, despesa: 12000 },
  { month: 'Out', receita: 35000, despesa: 14000 },
  { month: 'Nov', receita: 28000, despesa: 11000 },
  { month: 'Dez', receita: 42000, despesa: 15000 },
  { month: 'Jan', receita: 38000, despesa: 13500 },
  { month: 'Fev', receita: 38450, despesa: 14300 },
];

const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Finance() {
  const [search, setSearch]           = useState('');
  const [filterType, setFilterType]   = useState('Todos');
  const [filterMonth, setFilterMonth] = useState('Todos');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting]     = useState(false);

  const totalReceita = mockFinance.filter(f => f.type === 'receita').reduce((a, f) => a + f.value, 0);
  const totalDespesa = mockFinance.filter(f => f.type === 'despesa').reduce((a, f) => a + f.value, 0);
  const saldo        = totalReceita - totalDespesa;
  const maxBar       = Math.max(...monthlyData.map(d => d.receita));

  const filtered = mockFinance.filter(f => {
    const matchSearch = f.description.toLowerCase().includes(search.toLowerCase()) || (f.patient || '').toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'Todos' || f.type === filterType.toLowerCase();
    return matchSearch && matchType;
  });

  const toggle = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/relatorios/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: mockFinance,
          monthlyData,
          month: 'Fevereiro 2025',
          totalReceita,
          totalDespesa,
          saldo,
        }),
      });

      if (!response.ok) throw new Error('Falha ao gerar PDF');

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'relatorio-financeiro-fevereiro-2025.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Exportar PDF]', err);
      alert('Erro ao exportar o PDF. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Financeiro</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="outline"
            loading={exporting}
            icon={
              !exporting ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              ) : undefined
            }
            onClick={handleExportPDF}
          >
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
          <Button
            variant="primary"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
            onClick={() => setIsModalOpen(true)}
          >
            Novo Lançamento
          </Button>
        </div>
      </Header>

      <StatsGrid>
        <StatCard label="Receita do Mês" value={`R$ ${fmt(totalReceita)}`} color="#BBA188" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend={{ value: '+8.5% vs mês ant.', positive: true }} />
        <StatCard label="Despesas do Mês" value={`R$ ${fmt(totalDespesa)}`} color="#e74c3c" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>} trend={{ value: '+2.1% vs mês ant.', positive: false }} />
        <StatCard label="Saldo do Mês" value={`R$ ${fmt(saldo)}`} color={saldo >= 0 ? '#8a7560' : '#e74c3c'} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Transações" value={mockFinance.length} color="#EBD5B0" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
      </StatsGrid>

      {/* Gráfico */}
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
          <SearchInputStyled placeholder="Buscar por descrição ou paciente..." value={search} onChange={e => setSearch(e.target.value)} />
        </SearchBarWrapper>
        <FilterRow>
          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('type')}>
              <span>{filterType}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'type' && (
              <DropdownList>
                {filterTypes.map(t => <DropdownItem key={t} $active={filterType === t} onClick={() => { setFilterType(t); toggle('type'); }}>{t}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>

          <DropdownWrapper>
            <DropdownBtn onClick={() => toggle('month')}>
              <span>{filterMonth}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </DropdownBtn>
            {openDropdown === 'month' && (
              <DropdownList>
                {filterMonths.map(m => <DropdownItem key={m} $active={filterMonth === m} onClick={() => { setFilterMonth(m); toggle('month'); }}>{m}</DropdownItem>)}
              </DropdownList>
            )}
          </DropdownWrapper>

          {(filterType !== 'Todos' || filterMonth !== 'Todos') && (
            <ClearFilterBtn onClick={() => { setFilterType('Todos'); setFilterMonth('Todos'); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar
            </ClearFilterBtn>
          )}
        </FilterRow>
      </Controls>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <TableWrapper>
          <Table>
            <Thead>
              <tr>
                <Th $width="12%">Data</Th>
                <Th $width="32%">Descrição</Th>
                <Th $width="15%">Categoria</Th>
                <Th $width="10%">Tipo</Th>
                <Th $width="14%">Valor</Th>
                <Th $width="11%">Paciente</Th>
                <Th $width="6%">Ações</Th>
              </tr>
            </Thead>
            <Tbody>
              {filtered.map(f => (
                <Tr key={f.id}>
                  <Td style={{ color: '#888', fontSize: '0.82rem' }}>{f.date}</Td>
                  <Td style={{ fontWeight: 500, color: '#1a1a1a' }}>{f.description}</Td>
                  <Td><Badge $bg="rgba(187,161,136,0.12)" $color="#a8906f">{f.category}</Badge></Td>
                  <Td><TypeBadge $type={f.type}><span style={{ fontSize: '0.8rem' }}>{f.type === 'receita' ? '↑' : '↓'}</span>{f.type === 'receita' ? ' Receita' : ' Despesa'}</TypeBadge></Td>
                  <Td style={{ fontWeight: 700, color: f.type === 'receita' ? '#BBA188' : '#e74c3c', fontSize: '0.95rem' }}>
                    {f.type === 'receita' ? '+' : '-'} R$ {fmt(f.value)}
                  </Td>
                  <Td style={{ fontSize: '0.82rem', color: '#777' }}>{f.patient || '—'}</Td>
                  <Td>
                    <ActionGroup>
                      <IconBtn>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </IconBtn>
                    </ActionGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary">Salvar</Button>
          </>
        }
      >
        <FormGrid>
          <Select label="Tipo" options={typeOptions} placeholder="Selecione..." />
          <Select label="Categoria" options={categoryOptions} placeholder="Selecione..." />
          <div style={{ gridColumn: 'span 2' }}><Input label="Descrição" placeholder="Descreva o lançamento..." /></div>
          <Input label="Valor (R$)" type="number" placeholder="0,00" />
          <Input label="Data" type="date" />
          <Input label="Paciente (opcional)" placeholder="Nome do paciente..." />
          <Input label="Forma de Pagamento" placeholder="Cartão, Pix, Dinheiro..." />
        </FormGrid>
      </Modal>
    </Container>
  );
}