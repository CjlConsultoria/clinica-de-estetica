'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/statcard';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import { obterDashboard, DashboardResponse } from '@/services/dashboardApi';
import { listarAgendamentos, AgendamentoResponse } from '@/services/agendamentosApi';
import {
  Container, DashHeader, DashTitle, DateText,
  ContentGrid, BigCard, CardHeader, CardTitle, CardBody,
  AppointmentItem, AppointmentTime, AppointmentInfo, AppointmentName,
  AppointmentProcedure, StatusDot, AppointmentStatus,
  QuickActions, QuickAction, QuickActionIcon, QuickActionLabel,
  ChartBar, ChartBars, ChartRow, ChartLabelText, ChartValue,
  AlertsList, AlertItem, AlertIcon, AlertText, AlertTime,
  RecentPatientRow, PatientAvatar, PatientName, PatientSub,
} from './styles';

const weekData = [
  { day: 'Seg', value: 0, max: 15 },
  { day: 'Ter', value: 0, max: 15 },
  { day: 'Qua', value: 0, max: 15 },
  { day: 'Qui', value: 0, max: 15 },
  { day: 'Sex', value: 0, max: 15 },
  { day: 'Sáb', value: 0, max: 15 },
];

const allQuickActions = [
  { key: 'agenda',    label: 'Novo Agendamento',   icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>, color: '#BBA188', href: '/agenda'   },
  { key: 'pacientes', label: 'Cadastrar Paciente', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg>, color: '#EBD5B0', href: '/patients' },
  { key: 'financeiro',label: 'Lançar Financeiro',  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,  color: '#1b1b1b', href: '/finance'  },
  { key: 'reports',   label: 'Ver Relatórios',     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: '#a8906f', href: '/reports'  },
];

function fmtMoeda(val: number): string {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#BBA188'];

export default function Dashboard() {
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();

  const [stats,        setStats]        = useState<DashboardResponse | null>(null);
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponse[]>([]);

  useEffect(() => {
    obterDashboard().then(setStats).catch(console.error);
    listarAgendamentos(0, 50).then(r => {
      const today = new Date().toDateString();
      const todayAppts = r.content.filter(a => new Date(a.dataHora).toDateString() === today);
      setAgendamentos(todayAppts);
    }).catch(console.error);
  }, []);

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const allStats = [
    {
      key: 'agenda',
      label: 'Agendamentos Hoje',
      value: stats !== null ? stats.agendamentosHoje : '—',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
      color: '#BBA188',
      trend: { value: `${stats?.agendamentosAgendados ?? 0} confirmados`, positive: true },
    },
    {
      key: 'pacientes',
      label: 'Pacientes Cadastrados',
      value: stats !== null ? stats.totalPacientes : '—',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      color: '#EBD5B0',
      trend: { value: `${stats?.totalMedicos ?? 0} profissionais`, positive: true },
    },
    {
      key: 'financeiro',
      label: 'Receita Mensal',
      value: stats !== null ? `R$ ${fmtMoeda(stats.receitaMes)}` : '—',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      color: '#8a7560',
      trend: { value: `R$ ${fmtMoeda(stats?.receitaPendente ?? 0)} pendente`, positive: false },
    },
    {
      key: 'estoque',
      label: 'Agend. Cancelados',
      value: stats !== null ? stats.agendamentosCancelados : '—',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      color: '#e74c3c',
      trend: { value: 'este mês', positive: (stats?.agendamentosCancelados ?? 0) === 0 },
    },
  ];

  const visibleStats = allStats.filter(s => {
    if (isSuperAdmin) return true;
    if (s.key === 'financeiro') return can('financeiro.read');
    if (s.key === 'estoque')    return can('estoque.read');
    if (s.key === 'agenda')     return can('agenda.read') || can('agenda.read_own');
    return true;
  });

  const visibleQuickActions = allQuickActions.filter(qa => {
    if (isSuperAdmin) return true;
    if (qa.key === 'agenda')     return can('agenda.create');
    if (qa.key === 'financeiro') return can('financeiro.create');
    if (qa.key === 'reports')    return can('relatorios.operacional');
    return true;
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    AGENDADO:   { label: 'Agendado',   color: '#BBA188' },
    CONFIRMADO: { label: 'Confirmado', color: '#BBA188' },
    AGUARDANDO: { label: 'Aguardando', color: '#d4a84b' },
    ATENDIDO:   { label: 'Atendido',   color: '#95A5A6' },
    CANCELADO:  { label: 'Cancelado',  color: '#e74c3c' },
  };

  const alertIconMap: Record<string, string> = {
    warning: '#d4a84b', info: '#BBA188', success: '#8a7560', error: '#e74c3c'
  };

  const alerts = [
    { type: 'info', text: 'Dados em tempo real via backend', time: 'agora' },
    ...(stats && stats.agendamentosCancelados > 0
      ? [{ type: 'warning', text: `${stats.agendamentosCancelados} agendamento(s) cancelado(s) este mês`, time: '' }]
      : []),
    ...(stats && stats.receitaPendente > 0
      ? [{ type: 'warning', text: `R$ ${fmtMoeda(stats.receitaPendente)} em pagamentos pendentes`, time: '' }]
      : []),
  ];

  return (
    <Container>
      <DashHeader>
        <div>
          <DashTitle>Dashboard</DashTitle>
          <DateText>{today.charAt(0).toUpperCase() + today.slice(1)}</DateText>
        </div>
      </DashHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 20, marginBottom: 32 }}>
        {visibleStats.map((s, i) => <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} trend={s.trend} />)}
      </div>

      {visibleQuickActions.length > 0 && (
        <QuickActions>
          {visibleQuickActions.map((qa, i) => (
            <Link key={i} href={qa.href} passHref legacyBehavior>
              <QuickAction $color={qa.color}>
                <QuickActionIcon $color={qa.color}>{qa.icon}</QuickActionIcon>
                <QuickActionLabel>{qa.label}</QuickActionLabel>
              </QuickAction>
            </Link>
          ))}
        </QuickActions>
      )}

      <ContentGrid>
        {(isSuperAdmin || can('agenda.read') || can('agenda.read_own')) && (
          <BigCard style={{ gridColumn: 'span 2' }}>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
              <span style={{ fontSize: '0.82rem', color: '#BBA188', fontWeight: 600 }}>{agendamentos.length} pacientes</span>
            </CardHeader>
            <CardBody>
              {agendamentos.length === 0 ? (
                <p style={{ color: '#bbb', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                  Nenhum agendamento para hoje
                </p>
              ) : agendamentos.map((apt, i) => {
                const hora = new Date(apt.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const st   = statusMap[apt.status] ?? { label: apt.status, color: '#BBA188' };
                return (
                  <AppointmentItem key={i}>
                    <AppointmentTime>{hora}</AppointmentTime>
                    <AppointmentInfo>
                      <AppointmentName>{apt.pacienteNome}</AppointmentName>
                      <AppointmentProcedure>{apt.tipoConsulta ?? '—'}</AppointmentProcedure>
                    </AppointmentInfo>
                    <AppointmentStatus>
                      <StatusDot $color={st.color} />
                      {st.label}
                    </AppointmentStatus>
                  </AppointmentItem>
                );
              })}
            </CardBody>
          </BigCard>
        )}

        <BigCard>
          <CardHeader><CardTitle>Alertas do Sistema</CardTitle></CardHeader>
          <AlertsList>
            {alerts.map((a, i) => (
              <AlertItem key={i} $color={alertIconMap[a.type]}>
                <AlertIcon $color={alertIconMap[a.type]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </AlertIcon>
                <AlertText>
                  {a.text}
                  {a.time && <AlertTime>{a.time}</AlertTime>}
                </AlertText>
              </AlertItem>
            ))}
          </AlertsList>
        </BigCard>

        <BigCard>
          <CardHeader><CardTitle>Atendimentos da Semana</CardTitle></CardHeader>
          <CardBody style={{ paddingTop: 12 }}>
            <ChartBars>
              {weekData.map((d, i) => (
                <ChartRow key={i}>
                  <ChartLabelText>{d.day}</ChartLabelText>
                  <ChartBar style={{ width: '0%' }} />
                  <ChartValue>{d.value}</ChartValue>
                </ChartRow>
              ))}
            </ChartBars>
          </CardBody>
        </BigCard>

        <BigCard>
          <CardHeader><CardTitle>Últimos Agendamentos</CardTitle></CardHeader>
          <CardBody>
            {agendamentos.slice(0, 4).map((a, i) => (
              <RecentPatientRow key={i}>
                <PatientAvatar $color={avatarColors[i % avatarColors.length]}>
                  {getInitials(a.pacienteNome)}
                </PatientAvatar>
                <div>
                  <PatientName>{a.pacienteNome}</PatientName>
                  <PatientSub>
                    {a.tipoConsulta ?? '—'} · {new Date(a.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </PatientSub>
                </div>
              </RecentPatientRow>
            ))}
          </CardBody>
        </BigCard>
      </ContentGrid>
    </Container>
  );
}
