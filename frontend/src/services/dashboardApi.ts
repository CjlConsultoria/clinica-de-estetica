import { apiFetch } from './api';

export interface DashboardResponse {
  totalPacientes: number;
  agendamentosHoje: number;
  agendamentosMes: number;
  agendamentosAgendados: number;
  agendamentosCancelados: number;
  receitaMes: number;
  receitaPendente: number;
  totalMedicos: number;
}

export const obterDashboard = () =>
  apiFetch<DashboardResponse>('/api/dashboard');
