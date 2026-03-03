'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useRoleRedirect } from '@/components/ui/hooks/useRoleRedirect';
import { listarEmpresas, EmpresaAPI } from '@/services/empresaService';
import {
  Container, Header, Title, Subtitle, LiveBadge,
  StatsGrid, StatCard, StatValue, StatLabel, StatTrend, StatIcon,
  SectionTitle,
  ContentGrid,
  Card, CardHeader, CardTitle, CardBody,
  TableWrapper, Table, Thead, Th, Tbody, Tr, Td,
  Badge,
  ChartArea, ChartBars, ChartBar, ChartBarFill, ChartBarLabel, ChartBarValue,
  AlertList, AlertItem, AlertDot, AlertText, AlertTime,
  QuickGrid, QuickCard, QuickIcon, QuickLabel,
  CompanyRow, CompanyAvatar, CompanyInfo, CompanyName, CompanySub,
  MRRBlock, MRRValue, MRRSub,
  PlanDistGrid, PlanItem, PlanDot, PlanName, PlanCount,
} from './styles';

const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtFull = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

const EMPRESAS_FALLBACK = [
  { id: 1, nome: 'Clínica Bella Vita',    plano: 'Pro',        status: 'ativo',    usuarios: 8,  mrr: 349, ingresso: '01/11/2024' },
  { id: 2, nome: 'Studio Ana Rodrigues',  plano: 'Starter',    status: 'ativo',    usuarios: 3,  mrr: 149, ingresso: '15/01/2025' },
  { id: 3, nome: 'Clínica Derma Saúde',   plano: 'Enterprise', status: 'ativo',    usuarios: 22, mrr: 749, ingresso: '10/03/2024' },
  { id: 4, nome: 'Instituto Skin Care',   plano: 'Pro',        status: 'suspenso', usuarios: 6,  mrr: 349, ingresso: '05/06/2024' },
  { id: 5, nome: 'Espaço Beleza Premium', plano: 'Pro',        status: 'ativo',    usuarios: 11, mrr: 349, ingresso: '20/02/2025' },
];

const MRR_HISTORY = [
  { mes: 'Set', valor: 2800 },
  { mes: 'Out', valor: 3200 },
  { mes: 'Nov', valor: 3800 },
  { mes: 'Dez', valor: 4100 },
  { mes: 'Jan', valor: 4500 },
  { mes: 'Fev', valor: 4945 },
];

const ALERTS = [
  { tipo: 'danger',  texto: 'Instituto Skin Care — fatura vencida há 22 dias',      tempo: '2h'     },
  { tipo: 'warning', texto: 'Studio Ana Rodrigues — trial expira em 3 dias',         tempo: '5h'     },
  { tipo: 'info',    texto: 'Clínica Derma Saúde — renovação automática amanhã',     tempo: '1 dia'  },
  { tipo: 'success', texto: 'Espaço Beleza Premium — upgrade para Pro concluído',    tempo: '2 dias' },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  ativo:    { bg: 'rgba(138,117,96,0.12)', color: '#8a7560', label: 'Ativo' },
  suspenso: { bg: 'rgba(231,76,60,0.12)', color: '#e74c3c', label: 'Suspenso' },
};

// Fallback para planos não mapeados
const PLAN_CONFIG_FALLBACK = { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' };

const planConfig: Record<string, { bg: string; color: string }> = {
  Starter:       { bg: 'rgba(59,130,246,0.1)',    color: '#3b82f6' },
  Pro:           { bg: 'rgba(187,161,136,0.15)',   color: '#8a7560' },
  Profissional:  { bg: 'rgba(187,161,136,0.15)',   color: '#8a7560' },
  Enterprise:    { bg: 'rgba(27,27,27,0.08)',      color: '#1b1b1b' },
};

const getPlanConfig = (plano: string) => planConfig[plano] ?? PLAN_CONFIG_FALLBACK;
const getStatusConfig = (status: string) => statusConfig[status] ?? { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', label: status };

const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
const maxMRR = Math.max(...MRR_HISTORY.map(m => m.valor));

type EmpresaRow = { id: number; nome: string; plano: string; status: string; usuarios: number; mrr: number; ingresso: string };

export default function DashboardSuperAdmin() {
  const allowed = useRoleRedirect({ superAdminOnly: true });
  const [tab, setTab] = useState<'visao' | 'empresas'>('visao');
  const [empresas, setEmpresas] = useState<EmpresaRow[]>(EMPRESAS_FALLBACK);

  useEffect(() => {
    listarEmpresas().then((data: EmpresaAPI[]) => {
      const mapped: EmpresaRow[] = data.map(e => ({
        id: e.id,
        nome: e.nome,
        plano: e.plano || 'Starter',
        status: e.status || 'ativo',
        usuarios: e.usuarios || 0,
        mrr: e.valor || 0,
        ingresso: e.dataInicio ? new Date(e.dataInicio).toLocaleDateString('pt-BR') : '—',
      }));
      if (mapped.length > 0) setEmpresas(mapped);
    }).catch(() => {});
  }, []);

  const totalMRR  = empresas.filter(e => e.status === 'ativo').reduce((a, e) => a + e.mrr, 0);
  const ativas    = empresas.filter(e => e.status === 'ativo').length;
  const suspensos = empresas.filter(e => e.status === 'suspenso').length;

  const planoDist = (['Starter', 'Pro', 'Profissional', 'Enterprise'] as const).map(nome => ({
    nome,
    count: empresas.filter(e => e.plano === nome).length,
    color: nome === 'Starter' ? '#3b82f6' : nome === 'Enterprise' ? '#1b1b1b' : '#BBA188',
  })).filter(p => p.count > 0);

  if (!allowed) return null;

  return (
    <Container>
      <Header>
        <div>
          <Title>Painel do Sistema</Title>
          <Subtitle>{hoje}</Subtitle>
        </div>
        <LiveBadge>Ao vivo</LiveBadge>
      </Header>

      <StatsGrid>
        <StatCard $accent="#BBA188">
          <StatIcon $color="#BBA188">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </StatIcon>
          <StatLabel>MRR Total</StatLabel>
          <StatValue>{fmt(totalMRR)}</StatValue>
          <StatTrend $positive>+R$ 445 vs mês anterior</StatTrend>
        </StatCard>

        <StatCard $accent="#8a7560">
          <StatIcon $color="#8a7560">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </StatIcon>
          <StatLabel>Empresas Ativas</StatLabel>
          <StatValue>{ativas}</StatValue>
          <StatTrend $positive>+1 este mês</StatTrend>
        </StatCard>

        <StatCard $accent="#3b82f6">
          <StatIcon $color="#3b82f6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </StatIcon>
          <StatLabel>Usuários Totais</StatLabel>
          <StatValue>{empresas.reduce((a, e) => a + e.usuarios, 0)}</StatValue>
          <StatTrend $positive>+8 vs mês anterior</StatTrend>
        </StatCard>

        <StatCard $accent="#e74c3c">
          <StatIcon $color="#e74c3c">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </StatIcon>
          <StatLabel>Em Atraso / Suspenso</StatLabel>
          <StatValue>{suspensos}</StatValue>
          <StatTrend $positive={false}>Requer atenção</StatTrend>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Card style={{ gridColumn: 'span 2' }}>
          <CardHeader>
            <CardTitle>Evolução do MRR</CardTitle>
            <MRRBlock>
              <MRRValue>{fmt(totalMRR)}</MRRValue>
              <MRRSub>/mês atual</MRRSub>
            </MRRBlock>
          </CardHeader>
          <CardBody>
            <ChartArea>
              <ChartBars>
                {MRR_HISTORY.map(m => (
                  <ChartBar key={m.mes}>
                    <ChartBarValue>{fmt(m.valor)}</ChartBarValue>
                    <ChartBarFill $height={Math.round((m.valor / maxMRR) * 100)} $current={m.mes === 'Fev'} />
                    <ChartBarLabel>{m.mes}</ChartBarLabel>
                  </ChartBar>
                ))}
              </ChartBars>
            </ChartArea>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <AlertList>
              {ALERTS.map((a, i) => (
                <AlertItem key={i}>
                  <AlertDot $tipo={a.tipo} />
                  <AlertText>{a.texto}</AlertText>
                  <AlertTime>{a.tempo}</AlertTime>
                </AlertItem>
              ))}
            </AlertList>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
          </CardHeader>
          <CardBody>
            <PlanDistGrid>
              {planoDist.map(p => (
                <PlanItem key={p.nome}>
                  <PlanDot $color={p.color} />
                  <PlanName>{p.nome}</PlanName>
                  <PlanCount>{p.count} empresa{p.count !== 1 ? 's' : ''}</PlanCount>
                </PlanItem>
              ))}
            </PlanDistGrid>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: 8, fontWeight: 600 }}>RECEITA POR PLANO</div>
              {planoDist.map(p => {
                const empresasDePlano = empresas.filter(e => e.plano === p.nome && e.status === 'ativo');
                const receitaPlano = empresasDePlano.reduce((a, e) => a + e.mrr, 0);
                const pct = totalMRR > 0 ? Math.round((receitaPlano / totalMRR) * 100) : 0;
                return (
                  <div key={p.nome} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: '#555', fontWeight: 600 }}>{p.nome}</span>
                      <span style={{ color: '#888' }}>{fmt(receitaPlano)} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: '#f0ebe4', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: p.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card style={{ gridColumn: 'span 2' }}>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <Link href="/empresas" style={{ fontSize: '0.78rem', color: '#BBA188', textDecoration: 'none', fontWeight: 600 }}>Ver todas →</Link>
          </CardHeader>
          <CardBody style={{ padding: 0 }}>
            <TableWrapper>
              <Table>
                <Thead>
                  <tr>
                    <Th>Empresa</Th>
                    <Th>Plano</Th>
                    <Th>Usuários</Th>
                    <Th>MRR</Th>
                    <Th>Ingresso</Th>
                    <Th>Status</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {empresas.map(e => {
                    const pCfg = getPlanConfig(e.plano);
                    const sCfg = getStatusConfig(e.status);
                    return (
                      <Tr key={e.id}>
                        <Td>
                          <CompanyRow>
                            <CompanyAvatar>{e.nome.slice(0, 2).toUpperCase()}</CompanyAvatar>
                            <CompanyInfo>
                              <CompanyName>{e.nome}</CompanyName>
                              <CompanySub>{e.usuarios} usuário{e.usuarios !== 1 ? 's' : ''}</CompanySub>
                            </CompanyInfo>
                          </CompanyRow>
                        </Td>
                        <Td>
                          <Badge $bg={pCfg.bg} $color={pCfg.color}>{e.plano}</Badge>
                        </Td>
                        <Td style={{ textAlign: 'center', fontWeight: 600 }}>{e.usuarios}</Td>
                        <Td style={{ fontWeight: 700, color: '#BBA188' }}>{fmtFull(e.mrr)}</Td>
                        <Td style={{ color: '#aaa', fontSize: '0.78rem' }}>{e.ingresso}</Td>
                        <Td>
                          <Badge $bg={sCfg.bg} $color={sCfg.color}>
                            {sCfg.label}
                          </Badge>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableWrapper>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardBody>
            <QuickGrid>
              {[
                { label: 'Nova Empresa',     href: '/empresas',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,        color: '#BBA188' },
                { label: 'Financeiro',        href: '/finance',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#8a7560' },
                { label: 'Comunicados',       href: '/comunicados', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>, color: '#3b82f6' },
                { label: 'Configurações',     href: '/settings',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, color: '#a8906f' },
                { label: 'Suporte',           href: '/suporte',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,  color: '#c9a03a' },
                { label: 'Onboarding',        href: '/onboarding',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>, color: '#6b7280' },
              ].map(q => (
                <QuickCard key={q.label} href={q.href} $color={q.color}>
                  <QuickIcon $color={q.color}>{q.icon}</QuickIcon>
                  <QuickLabel>{q.label}</QuickLabel>
                </QuickCard>
              ))}
            </QuickGrid>
          </CardBody>
        </Card>
      </ContentGrid>
    </Container>
  );
}