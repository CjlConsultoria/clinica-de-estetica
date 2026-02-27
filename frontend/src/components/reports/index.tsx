'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/statcard';
import ErrorModal from '@/components/modals/errorModal';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  Container, Header, Title, StatsGrid,
  ReportsGrid, ReportCard, ReportIcon, ReportInfo, ReportTitle, ReportDesc, ReportAction,
  FiltersRow, DropdownWrapper, DropdownBtn, DropdownList, DropdownItem,
  ChartsRow, ChartSection, ChartTitle, PieChart, PieLegend, PieLegendItem, LegendDot,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td, Badge,
} from './styles';

const filterPeriods = ['Este mês', 'Mês anterior', 'Últimos 3 meses', 'Últimos 6 meses', 'Este ano'];

const reportTypes = [
  { title: 'Relatório de Receitas',       desc: 'Visão completa de todas as receitas por período',  icon: '💰', color: '#BBA188' },
  { title: 'Relatório de Pacientes',      desc: 'Análise da carteira de pacientes e evolução',       icon: '👥', color: '#EBD5B0' },
  { title: 'Relatório de Procedimentos',  desc: 'Procedimentos mais realizados e receita gerada',    icon: '💉', color: '#1b1b1b' },
  { title: 'Relatório de Estoque ANVISA', desc: 'Controle de lotes, validades e conformidade',       icon: '📦', color: '#a8906f' },
  { title: 'Relatório de Comissões',      desc: 'Comissões por profissional e período',              icon: '🏆', color: '#8a7560' },
  { title: 'Relatório Fiscal',            desc: 'Dados para contabilidade e declarações',            icon: '📋', color: '#BBA188' },
];

const topProcedures = [
  { name: 'Botox Facial',         sessions: 142, revenue: 113600, growth: 12  },
  { name: 'Preenchimento Labial', sessions: 98,  revenue: 117600, growth: 8   },
  { name: 'Peelings Químicos',    sessions: 110, revenue: 33000,  growth: 22  },
  { name: 'Microagulhamento',     sessions: 89,  revenue: 40050,  growth: 5   },
  { name: 'Toxina Botulínica',    sessions: 67,  revenue: 40200,  growth: -3  },
  { name: 'Fio de PDO',           sessions: 56,  revenue: 100800, growth: 18  },
];

const pieData = [
  { label: 'Botox/Toxina',   value: 35, color: '#BBA188' },
  { label: 'Preenchimento',  value: 28, color: '#EBD5B0' },
  { label: 'Skincare',       value: 18, color: '#a8906f' },
  { label: 'Bioestimulador', value: 12, color: '#1b1b1b' },
  { label: 'Fio PDO',        value: 7,  color: '#8a7560' },
];

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function Reports() {
  const [period,       setPeriod]       = useState('Este mês');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [isErrorOpen,  setIsErrorOpen]  = useState(false);

  function showError(err: unknown, context: string) {
    setErrorMsg(getApiErrorMessage(err, context));
    setIsErrorOpen(true);
  }

  let cumulative = 0;
  const pieGradient = pieData.map(d => {
    const start = cumulative;
    cumulative += d.value;
    return `${d.color} ${start}% ${cumulative}%`;
  }).join(', ');

  const handleExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setExporting(true);
    let objectUrl: string | null = null;

    try {
      const response = await fetch('/api/relatorios/relatorios', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period,
          stats: {
            totalRevenue:  462540,
            totalSessions: 562,
            avgTicket:     822,
            newPatients:   42,
          },
          procedures: topProcedures,
          pieData,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).details ?? 'Erro ao gerar PDF');
      }

      const blob     = await response.blob();
      objectUrl      = URL.createObjectURL(blob);
      const filename = `relatorio-gerencial-${period.replace(/\s/g, '-').toLowerCase()}.pdf`;

      const link         = document.createElement('a');
      link.href          = objectUrl;
      link.download      = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showError(err, 'exportar relatório PDF');
    } finally {
      setExporting(false);
      if (objectUrl) {
        setTimeout(() => URL.revokeObjectURL(objectUrl!), 1000);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Relatórios</Title>

        <FiltersRow>
          <DropdownWrapper>
            <DropdownBtn type="button" onClick={() => setOpenDropdown(!openDropdown)}>
              <span>{period}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </DropdownBtn>
            {openDropdown && (
              <DropdownList>
                {filterPeriods.map(p => (
                  <DropdownItem
                    key={p}
                    $active={period === p}
                    onClick={() => { setPeriod(p); setOpenDropdown(false); }}
                  >
                    {p}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            icon={
              exporting ? (
                <svg
                  width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              )
            }
          >
            {exporting ? 'Gerando PDF...' : 'Exportar PDF'}
          </Button>
        </FiltersRow>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </Header>

      <StatsGrid>
        <StatCard
          label="Receita Total"
          value="R$ 462.540"
          color="#BBA188"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
          trend={{ value: '+14% vs período ant.', positive: true }}
        />
        <StatCard
          label="Total de Sessões"
          value="562"
          color="#EBD5B0"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
          trend={{ value: '+9% vs período ant.', positive: true }}
        />
        <StatCard
          label="Ticket Médio"
          value="R$ 822"
          color="#8a7560"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          trend={{ value: '+4.5% vs período ant.', positive: true }}
        />
        <StatCard
          label="Novos Pacientes"
          value="42"
          color="#1b1b1b"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
          trend={{ value: '+18% vs período ant.', positive: true }}
        />
      </StatsGrid>

      <ReportsGrid>
        {reportTypes.map((r, i) => (
          <ReportCard key={i} $color={r.color}>
            <ReportIcon $color={r.color}>{r.icon}</ReportIcon>
            <ReportInfo>
              <ReportTitle>{r.title}</ReportTitle>
              <ReportDesc>{r.desc}</ReportDesc>
            </ReportInfo>
            <ReportAction type="button" $color={r.color}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar
            </ReportAction>
          </ReportCard>
        ))}
      </ReportsGrid>

      <ChartsRow>
        <ChartSection>
          <ChartTitle>Distribuição por Categoria</ChartTitle>
          <PieChart style={{ background: `conic-gradient(${pieGradient})` }} />
          <PieLegend>
            {pieData.map((d, i) => (
              <PieLegendItem key={i}>
                <LegendDot $color={d.color} />
                <span>{d.label}</span>
                <strong>{d.value}%</strong>
              </PieLegendItem>
            ))}
          </PieLegend>
        </ChartSection>

        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <ChartTitle style={{ margin: 0 }}>Procedimentos Mais Realizados</ChartTitle>
          </div>
          <TableWrapper>
            <Table>
              <Thead>
                <tr>
                  <Th>Procedimento</Th>
                  <Th $width="14%">Sessões</Th>
                  <Th $width="18%">Receita</Th>
                  <Th $width="12%">Crescimento</Th>
                </tr>
              </Thead>
              <Tbody>
                {topProcedures.map((p, i) => (
                  <Tr key={i}>
                    <Td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#BBA188' }} />
                        {p.name}
                      </div>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>{p.sessions}</Td>
                    <Td style={{ fontWeight: 700, color: '#1a1a1a' }}>R$ {fmt(p.revenue)}</Td>
                    <Td>
                      <Badge
                        $bg={p.growth >= 0 ? 'rgba(187,161,136,0.15)' : 'rgba(231,76,60,0.1)'}
                        $color={p.growth >= 0 ? '#BBA188' : '#e74c3c'}
                      >
                        {p.growth >= 0 ? '↑' : '↓'} {Math.abs(p.growth)}%
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrapper>
        </div>
<<<<<<< HEAD
      </div>
      <ErrorModal
        isOpen={isErrorOpen}
        message={errorMsg}
        onClose={() => setIsErrorOpen(false)}
      />
=======
      </ChartsRow>
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
    </Container>
  );
}