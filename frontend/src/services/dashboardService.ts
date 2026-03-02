import { apiGet } from '@/lib/api';

export interface DashboardAPI {
  totalPacientes: number;
  agendamentosHoje: number;
  agendamentosMes: number;
  agendamentosAgendados: number;
  agendamentosCancelados: number;
  receitaMes: number;
  receitaPendente: number;
  totalMedicos: number;
}

export async function obterDashboard(): Promise<DashboardAPI> {
  return apiGet<DashboardAPI>('/api/dashboard');
}
