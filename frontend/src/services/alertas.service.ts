import { api } from '@/lib/api';

export interface AlertaReaplicacao {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  pacienteTelefone?: string;
  pacienteEmail?: string;
  procedimento: string;
  ultimaAplicacao?: string;
  proximaReaplicacao: string;
  intervaloDias: number;
  status: string;
  profissionalId?: number;
  profissionalNome?: string;
}

export const alertasService = {
  listar(): Promise<AlertaReaplicacao[]> {
    return api.get<AlertaReaplicacao[]>('/api/alertas');
  },

  executarVerificacao(): Promise<void> {
    return api.post<void>('/api/alertas/executar-verificacao');
  },
};
