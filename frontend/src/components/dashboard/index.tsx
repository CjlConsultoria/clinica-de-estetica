'use client';

import Link from 'next/link';
import StatCard from '@/components/ui/statcard';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
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

const allStats = [
  { key: 'agenda',    label: 'Agendamentos Hoje', value: 12, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, color: '#BBA188', trend: { value: '+3 vs ontem', positive: true } },
  { key: 'pacientes', label: 'Pacientes Ativos',  value: 248, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#EBD5B0', trend: { value: '+12 este mês', positive: true } },
  { key: 'financeiro',label: 'Receita Mensal',    value: 'R$ 38.450', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#8a7560', trend: { value: '+8.5%', positive: true } },
  { key: 'estoque',   label: 'Estoque Baixo',     value: 4, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, color: '#e74c3c', trend: { value: 'Atenção!', positive: false } },
];

const appointments = [
  { time: '08:30', name: 'Ana Beatriz Costa', procedure: 'Botox Facial',        status: 'confirmado' },
  { time: '09:15', name: 'Carla Mendonça',    procedure: 'Preenchimento Labial', status: 'confirmado' },
  { time: '10:00', name: 'Fernanda Lima',     procedure: 'Bioestimulador',       status: 'aguardando' },
  { time: '11:30', name: 'Marina Souza',      procedure: 'Fio de PDO',           status: 'confirmado' },
  { time: '14:00', name: 'Juliana Rocha',     procedure: 'Toxina Botulínica',    status: 'aguardando' },
  { time: '15:30', name: 'Patrícia Alves',    procedure: 'Microagulhamento',     status: 'atendida'   },
];

const weekData = [
  { day: 'Seg', value: 8,  max: 15 },
  { day: 'Ter', value: 12, max: 15 },
  { day: 'Qua', value: 10, max: 15 },
  { day: 'Qui', value: 15, max: 15 },
  { day: 'Sex', value: 11, max: 15 },
  { day: 'Sáb', value: 6,  max: 15 },
];

const alerts = [
  { type: 'warning', text: 'Ácido Hialurônico 1ml com estoque baixo (2 unid.)',         time: '10 min' },
  { type: 'info',    text: 'Paciente Ana Beatriz - reaplicação de botox recomendada',    time: '30 min' },
  { type: 'warning', text: 'Toxina Botulínica - validade expira em 5 dias',              time: '1h'     },
  { type: 'success', text: 'Comissão de outubro processada com sucesso',                 time: '2h'     },
];

const recentPatients = [
  { initials: 'AB', name: 'Ana Beatriz Costa', sub: 'Botox · Hoje 08:30',       color: '#BBA188' },
  { initials: 'CM', name: 'Carla Mendonça',    sub: 'Preenchimento · Hoje 09:15', color: '#EBD5B0' },
  { initials: 'FL', name: 'Fernanda Lima',     sub: 'Bioestimulador · Hoje 10:00',color: '#1b1b1b' },
  { initials: 'MS', name: 'Marina Souza',      sub: 'Fio PDO · Hoje 11:30',      color: '#BBA188' },
];

const allQuickActions = [
  { key: 'agenda',    label: 'Novo Agendamento',     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>, color: '#BBA188', href: '/agenda'     },
  { key: 'pacientes', label: 'Cadastrar Paciente',   icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg>, color: '#EBD5B0', href: '/patients'   },
  { key: 'financeiro',label: 'Lançar Financeiro',    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,  color: '#1b1b1b', href: '/finance'    },
  { key: 'reports',   label: 'Ver Relatórios',       icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: '#a8906f', href: '/reports'    },
];

export default function Dashboard() {
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
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
    confirmado: { label: 'Confirmado', color: '#BBA188' },
    aguardando: { label: 'Aguardando', color: '#d4a84b' },
    atendida:   { label: 'Atendida',   color: '#95A5A6' },
  };

  const alertIconMap: Record<string, string> = {
    warning: '#d4a84b', info: '#BBA188', success: '#8a7560', error: '#e74c3c'
  };

  const visibleAlerts = alerts.filter(a => {
    if (isSuperAdmin) return true;
    if (a.type === 'warning' && a.text.includes('estoque')) return can('estoque.read');
    return true;
  });

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
              <span style={{ fontSize: '0.82rem', color: '#BBA188', fontWeight: 600 }}>{appointments.length} pacientes</span>
            </CardHeader>
            <CardBody>
              {appointments.map((apt, i) => (
                <AppointmentItem key={i}>
                  <AppointmentTime>{apt.time}</AppointmentTime>
                  <AppointmentInfo>
                    <AppointmentName>{apt.name}</AppointmentName>
                    <AppointmentProcedure>{apt.procedure}</AppointmentProcedure>
                  </AppointmentInfo>
                  <AppointmentStatus>
                    <StatusDot $color={statusMap[apt.status]?.color} />
                    {statusMap[apt.status]?.label}
                  </AppointmentStatus>
                </AppointmentItem>
              ))}
            </CardBody>
          </BigCard>
        )}

        <BigCard>
          <CardHeader><CardTitle>Alertas do Sistema</CardTitle></CardHeader>
          <AlertsList>
            {visibleAlerts.map((a, i) => (
              <AlertItem key={i} $color={alertIconMap[a.type]}>
                <AlertIcon $color={alertIconMap[a.type]}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </AlertIcon>
                <AlertText>{a.text}<AlertTime>{a.time} atrás</AlertTime></AlertText>
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
                  <ChartBar style={{ width: `${(d.value / d.max) * 100}%` }} />
                  <ChartValue>{d.value}</ChartValue>
                </ChartRow>
              ))}
            </ChartBars>
          </CardBody>
        </BigCard>

        <BigCard>
          <CardHeader><CardTitle>Últimos Pacientes</CardTitle></CardHeader>
          <CardBody>
            {recentPatients.map((p, i) => (
              <RecentPatientRow key={i}>
                <PatientAvatar $color={p.color}>{p.initials}</PatientAvatar>
                <div>
                  <PatientName>{p.name}</PatientName>
                  <PatientSub>{p.sub}</PatientSub>
                </div>
              </RecentPatientRow>
            ))}
          </CardBody>
        </BigCard>
      </ContentGrid>
    </Container>
  );
}