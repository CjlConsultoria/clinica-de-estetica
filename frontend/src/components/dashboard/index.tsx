'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/statcard';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import { useCurrentUser } from '@/components/ui/hooks/useCurrentUser';
import { obterDashboard, DashboardAPI } from '@/services/dashboardService';
import { listarAgendamentos, AgendamentoAPI } from '@/services/agendaService';
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
import styled from 'styled-components';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 16px;
  }
`;

const weekData = [
  { day: 'Seg', value: 8,  max: 15 },
  { day: 'Ter', value: 12, max: 15 },
  { day: 'Qua', value: 10, max: 15 },
  { day: 'Qui', value: 15, max: 15 },
  { day: 'Sex', value: 11, max: 15 },
  { day: 'Sáb', value: 6,  max: 15 },
];

const allQuickActions = [
  { key: 'agenda',    label: 'Novo Agendamento',     icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>, color: '#BBA188', href: '/agenda'     },
  { key: 'pacientes', label: 'Cadastrar Paciente',   icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg>, color: '#EBD5B0', href: '/patients'   },
  { key: 'financeiro',label: 'Lançar Financeiro',    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,  color: '#1b1b1b', href: '/finance'    },
  { key: 'reports',   label: 'Ver Relatórios',       icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: '#a8906f', href: '/reports'    },
];

const avatarColors = ['#BBA188', '#EBD5B0', '#1b1b1b', '#a8906f', '#8a7560'];

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function fmtMoeda(value: number): string {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}

function fmtHora(dataHora: string): string {
  if (!dataHora) return '';
  const d = new Date(dataHora);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const { can, isSuperAdmin } = usePermissions();
  const { currentUser } = useCurrentUser();

  const [dashData, setDashData] = useState<DashboardAPI | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<AgendamentoAPI[]>([]);

  useEffect(() => {
    obterDashboard().then(setDashData).catch(() => {});
    listarAgendamentos(0, 50).then(res => {
      const hoje = new Date().toISOString().split('T')[0];
      const agendamentosHoje = (res.content || []).filter(a => a.dataHora.startsWith(hoje));
      setTodayAppointments(agendamentosHoje.slice(0, 6));
    }).catch(() => {});
  }, []);

  const allStats = [
    { key: 'agenda',    label: 'Agendamentos Hoje', value: dashData?.agendamentosHoje ?? '...', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, color: '#BBA188', trend: { value: `${dashData?.agendamentosMes ?? 0} este mês`, positive: true } },
    { key: 'pacientes', label: 'Pacientes Ativos',  value: dashData?.totalPacientes ?? '...', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#EBD5B0', trend: { value: `${dashData?.totalMedicos ?? 0} profissionais`, positive: true } },
    { key: 'financeiro',label: 'Receita Mensal',    value: dashData ? fmtMoeda(Number(dashData.receitaMes)) : '...', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#8a7560', trend: { value: `Pendente: ${dashData ? fmtMoeda(Number(dashData.receitaPendente)) : '...'}`, positive: true } },
    { key: 'estoque',   label: 'Cancelamentos',     value: dashData?.agendamentosCancelados ?? '...', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, color: '#e74c3c', trend: { value: 'Este mês', positive: false } },
  ];

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
    AGENDADO:    { label: 'Agendado',    color: '#d4a84b' },
    CONFIRMADO:  { label: 'Confirmado',  color: '#BBA188' },
    CANCELADO:   { label: 'Cancelado',   color: '#e74c3c' },
    REALIZADO:   { label: 'Atendido',    color: '#95A5A6' },
    FALTA:       { label: 'Falta',       color: '#888' },
    confirmado:  { label: 'Confirmado',  color: '#BBA188' },
    aguardando:  { label: 'Aguardando',  color: '#d4a84b' },
    atendida:    { label: 'Atendida',    color: '#95A5A6' },
  };

  const alertIconMap: Record<string, string> = {
    warning: '#d4a84b', info: '#BBA188', success: '#8a7560', error: '#e74c3c'
  };

  return (
    <Container>
      <DashHeader>
        <div>
          <DashTitle>Dashboard</DashTitle>
          <DateText>{today.charAt(0).toUpperCase() + today.slice(1)}</DateText>
        </div>
      </DashHeader>

      <StatsGrid>
        {visibleStats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} trend={s.trend} />
        ))}
      </StatsGrid>

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
              <span style={{ fontSize: '0.82rem', color: '#BBA188', fontWeight: 600 }}>{todayAppointments.length} pacientes</span>
            </CardHeader>
            <CardBody>
              {todayAppointments.length === 0 && (
                <div style={{ color: '#999', fontSize: '0.9rem', padding: '12px 0' }}>Nenhum agendamento para hoje.</div>
              )}
              {todayAppointments.map((apt, i) => (
                <AppointmentItem key={apt.id}>
                  <AppointmentTime>{fmtHora(apt.dataHora)}</AppointmentTime>
                  <AppointmentInfo>
                    <AppointmentName>{apt.pacienteNome}</AppointmentName>
                    <AppointmentProcedure>{apt.tipoConsulta || apt.medicoNome}</AppointmentProcedure>
                  </AppointmentInfo>
                  <AppointmentStatus>
                    <StatusDot $color={statusMap[apt.status]?.color} />
                    {statusMap[apt.status]?.label || apt.status}
                  </AppointmentStatus>
                </AppointmentItem>
              ))}
            </CardBody>
          </BigCard>
        )}

        <BigCard>
          <CardHeader><CardTitle>Alertas do Sistema</CardTitle></CardHeader>
          <AlertsList>
            <AlertItem $color={alertIconMap['info']}>
              <AlertIcon $color={alertIconMap['info']}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </AlertIcon>
              <AlertText>
                {dashData ? `${dashData.agendamentosAgendados} agendamentos pendentes de confirmação` : 'Carregando alertas...'}
                <AlertTime>Agora</AlertTime>
              </AlertText>
            </AlertItem>
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
          <CardHeader><CardTitle>Últimos Atendimentos</CardTitle></CardHeader>
          <CardBody>
            {todayAppointments.slice(0, 4).map((p, i) => (
              <RecentPatientRow key={p.id}>
                <PatientAvatar $color={avatarColors[i % avatarColors.length]}>{getInitials(p.pacienteNome)}</PatientAvatar>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <PatientName>{p.pacienteNome}</PatientName>
                  <PatientSub>{p.tipoConsulta || 'Consulta'} · {fmtHora(p.dataHora)}</PatientSub>
                </div>
              </RecentPatientRow>
            ))}
            {todayAppointments.length === 0 && (
              <div style={{ color: '#999', fontSize: '0.9rem' }}>Nenhum atendimento hoje.</div>
            )}
          </CardBody>
        </BigCard>
      </ContentGrid>
    </Container>
  );
}
