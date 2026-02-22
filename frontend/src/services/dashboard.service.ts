import { api } from '@/lib/api';

export interface DashboardResumo {
  totalPacientes: number;
  agendamentosHoje: number;
  agendamentosMes: number;
  agendamentosAgendados: number;
  agendamentosCancelados: number;
  receitaMes: number;
  receitaPendente: number;
  totalMedicos: number;
}

export const dashboardService = {
  resumo(): Promise<DashboardResumo> {
    return api.get<DashboardResumo>('/api/dashboard/resumo');
  },
};
