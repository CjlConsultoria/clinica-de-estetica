'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/statcard';
import { dashboardService, DashboardResumo } from '@/services/dashboard.service';
import { agendamentosService, Agendamento } from '@/services/agendamentos.service';
import { estoqueService, AlertaEstoque } from '@/services/estoque.service';
import {
  Container, DashHeader, DashTitle, DateText,
  ContentGrid, BigCard, CardHeader, CardTitle, CardBody,
  AppointmentItem, AppointmentTime, AppointmentInfo, AppointmentName,
  AppointmentProcedure, StatusDot, AppointmentStatus,
  QuickActions, QuickAction, QuickActionIcon, QuickActionLabel,
  AlertsList, AlertItem, AlertIcon, AlertText, AlertTime,
  RecentPatientRow, PatientAvatar, PatientName, PatientSub,
} from './styles';

const quickActions = [
  { label: 'Novo Agendamento', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>, color: '#BBA188', href: '/agenda' },
  { label: 'Cadastrar Paciente', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg>, color: '#EBD5B0', href: '/patients' },
  { label: 'Lançar Procedimento', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color: '#1b1b1b', href: '/procedures' },
  { label: 'Ver Relatórios', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: '#a8906f', href: '/reports' },
];

const statusMap: Record<string, { label: string; color: string }> = {
  CONFIRMADO: { label: 'Confirmado', color: '#BBA188' },
  AGENDADO:   { label: 'Agendado',   color: '#d4a84b' },
  REALIZADO:  { label: 'Realizado',  color: '#95A5A6' },
  CANCELADO:  { label: 'Cancelado',  color: '#e74c3c' },
  confirmado: { label: 'Confirmado', color: '#BBA188' },
  aguardando: { label: 'Aguardando', color: '#d4a84b' },
  atendida:   { label: 'Atendida',   color: '#95A5A6' },
};

const alertIconColor: Record<string, string> = {
  ESTOQUE_MINIMO:  '#d4a84b',
  ESTOQUE_CRITICO: '#e74c3c',
  VENCIMENTO:      '#BBA188',
};

function formatHora(dataHora: string): string {
  try {
    const d = new Date(dataHora);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch { return '—'; }
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getInitials(nome: string): string {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const [resumo,        setResumo]        = useState<DashboardResumo | null>(null);
  const [agendamentos,  setAgendamentos]  = useState<Agendamento[]>([]);
  const [alertas,       setAlertas]       = useState<AlertaEstoque[]>([]);
  const [loadingResumo, setLoadingResumo] = useState(true);

  useEffect(() => {
    dashboardService.resumo()
      .then(setResumo)
      .catch(() => setResumo(null))
      .finally(() => setLoadingResumo(false));

    agendamentosService.listar()
      .then(data => {
        const hoje = new Date().toDateString();
        const hojeList = data
          .filter(a => new Date(a.dataHora).toDateString() === hoje)
          .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
          .slice(0, 6);
        setAgendamentos(hojeList);
      })
      .catch(() => setAgendamentos([]));

    estoqueService.listarAlertas()
      .then(data => setAlertas(data.slice(0, 4)))
      .catch(() => setAlertas([]));
  }, []);

  const stats = [
    {
      label: 'Agendamentos Hoje',
      value: loadingResumo ? '...' : (resumo?.agendamentosHoje ?? 0),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
      color: '#BBA188',
      trend: { value: 'Hoje', positive: true },
    },
    {
      label: 'Pacientes Ativos',
      value: loadingResumo ? '...' : (resumo?.totalPacientes ?? 0),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      color: '#EBD5B0',
    },
    {
      label: 'Receita Mensal',
      value: loadingResumo ? '...' : `R$ ${formatCurrency(resumo?.receitaMes ?? 0)}`,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      color: '#8a7560',
      trend: { value: 'Este mês', positive: true },
    },
    {
      label: 'Alertas Estoque',
      value: alertas.length,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      color: alertas.length > 0 ? '#e74c3c' : '#8a7560',
      trend: alertas.length > 0 ? { value: 'Atenção!', positive: false } : undefined,
    },
  ];

  const recentPatients = agendamentos.slice(0, 4).map((a, i) => ({
    initials: getInitials(a.pacienteNome ?? 'P'),
    name:     a.pacienteNome ?? 'Paciente',
    sub:      `${a.procedimento} · Hoje ${formatHora(a.dataHora)}`,
    color:    ['#BBA188', '#EBD5B0', '#1b1b1b', '#BBA188'][i % 4],
  }));

  return (
    <Container>
      <DashHeader>
        <div>
          <DashTitle>Dashboard</DashTitle>
          <DateText>{today.charAt(0).toUpperCase() + today.slice(1)}</DateText>
        </div>
      </DashHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <QuickActions>
        {quickActions.map((qa, i) => (
          <Link key={i} href={qa.href} passHref legacyBehavior>
            <QuickAction $color={qa.color}>
              <QuickActionIcon $color={qa.color}>{qa.icon}</QuickActionIcon>
              <QuickActionLabel>{qa.label}</QuickActionLabel>
            </QuickAction>
          </Link>
        ))}
      </QuickActions>

      <ContentGrid>
        <BigCard style={{ gridColumn: 'span 2' }}>
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
            <span style={{ fontSize: '0.82rem', color: '#BBA188', fontWeight: 600 }}>{agendamentos.length} pacientes</span>
          </CardHeader>
          <CardBody>
            {agendamentos.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', padding: '24px 0', fontSize: '0.9rem' }}>
                Nenhum agendamento para hoje
              </div>
            ) : agendamentos.map((apt, i) => (
              <AppointmentItem key={apt.id ?? i}>
                <AppointmentTime>{formatHora(apt.dataHora)}</AppointmentTime>
                <AppointmentInfo>
                  <AppointmentName>{apt.pacienteNome ?? 'Paciente'}</AppointmentName>
                  <AppointmentProcedure>{apt.procedimento}</AppointmentProcedure>
                </AppointmentInfo>
                <AppointmentStatus>
                  <StatusDot $color={statusMap[apt.status]?.color ?? '#BBA188'} />
                  {statusMap[apt.status]?.label ?? apt.status}
                </AppointmentStatus>
              </AppointmentItem>
            ))}
          </CardBody>
        </BigCard>

        <BigCard>
          <CardHeader><CardTitle>Alertas do Sistema</CardTitle></CardHeader>
          <AlertsList>
            {alertas.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', padding: '16px 0', fontSize: '0.88rem' }}>
                Nenhum alerta de estoque
              </div>
            ) : alertas.map((a, i) => (
              <AlertItem key={a.id ?? i} $color={alertIconColor[a.tipo] ?? '#BBA188'}>
                <AlertIcon $color={alertIconColor[a.tipo] ?? '#BBA188'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </AlertIcon>
                <AlertText>
                  {a.mensagem}
                  <AlertTime>{a.criadoEm ? new Date(a.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</AlertTime>
                </AlertText>
              </AlertItem>
            ))}
          </AlertsList>
        </BigCard>

        <BigCard>
          <CardHeader><CardTitle>Últimos Pacientes Agendados</CardTitle></CardHeader>
          <CardBody>
            {recentPatients.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', padding: '16px 0', fontSize: '0.88rem' }}>
                Nenhum agendamento hoje
              </div>
            ) : recentPatients.map((p, i) => (
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
