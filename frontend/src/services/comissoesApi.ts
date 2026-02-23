import { apiFetch } from './api';

export interface ComissaoResponse {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  lancamentoId: number | null;
  agendamentoId: number | null;
  procedimento: string | null;
  pacienteNome: string | null;
  valorBase: number;
  percentual: number;
  valorComissao: number;
  status: string;
  dataPagamento: string | null;
  criadoEm: string;
}

export const listarComissoes = () =>
  apiFetch<ComissaoResponse[]>('/api/comissoes');

export const pagarComissao = (id: number) =>
  apiFetch<ComissaoResponse>(`/api/comissoes/${id}/pagar`, { method: 'PATCH' });
