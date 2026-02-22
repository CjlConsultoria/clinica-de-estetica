import { api } from '@/lib/api';

export interface Comissao {
  id: number;
  usuarioId: number;
  usuarioNome?: string;
  lancamentoId?: number;
  agendamentoId?: number;
  procedimento?: string;
  pacienteNome?: string;
  valorBase: number;
  percentual: number;
  valorComissao: number;
  status: string;  // PENDENTE | PAGO
  criadoEm?: string;
  dataPagamento?: string;
}

export interface ComissaoConfig {
  id?: number;
  usuarioId: number;
  percentual: number;
}

export const comissoesService = {
  listarTodas(): Promise<Comissao[]> {
    return api.get<Comissao[]>('/api/comissoes');
  },

  listarPorUsuario(usuarioId: number): Promise<Comissao[]> {
    return api.get<Comissao[]>(`/api/comissoes/medico/${usuarioId}`);
  },

  pagar(id: number): Promise<Comissao> {
    return api.patch<Comissao>(`/api/comissoes/${id}/pagar`);
  },

  buscarConfig(usuarioId: number): Promise<ComissaoConfig> {
    return api.get<ComissaoConfig>(`/api/comissoes/config/${usuarioId}`);
  },

  salvarConfig(data: ComissaoConfig): Promise<ComissaoConfig> {
    return api.post<ComissaoConfig>('/api/comissoes/config', data);
  },
};
