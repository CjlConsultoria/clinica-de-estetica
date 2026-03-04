import { apiGet, apiPatch, apiPost } from '@/lib/api';

export interface ComissaoAPI {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  lancamentoId: number;
  agendamentoId: number;
  valorBase: number;
  percentual: number;
  valorComissao: number;
  status: string;
  dataPagamento: string | null;
  criadoEm: string;
}

export interface ComissaoResumoAPI {
  usuarioId: number;
  totalComissoes: number;
  totalPago: number;
  totalPendente: number;
  percentualMedio: number;
}

export interface ComissaoConfigAPI {
  id: number;
  percentualPadrao: number;
  ativo: boolean;
}

export async function listarComissoes(): Promise<ComissaoAPI[]> {
  return apiGet<ComissaoAPI[]>('/api/comissoes');
}

export async function listarComissoesPorMedico(medicoId: number): Promise<ComissaoAPI[]> {
  return apiGet<ComissaoAPI[]>(`/api/comissoes/medico/${medicoId}`);
}

export async function resumoComissoes(medicoId: number): Promise<ComissaoResumoAPI> {
  return apiGet<ComissaoResumoAPI>(`/api/comissoes/medico/${medicoId}/resumo`);
}

export async function pagarComissao(id: number): Promise<ComissaoAPI> {
  return apiPatch<ComissaoAPI>(`/api/comissoes/${id}/pagar`);
}

export async function buscarComissaoConfig(usuarioId: number): Promise<ComissaoConfigAPI | null> {
  try {
    return await apiGet<ComissaoConfigAPI>(`/api/comissoes/config/${usuarioId}`);
  } catch {
    return null;
  }
}

export async function salvarComissaoConfig(usuarioId: number, percentualPadrao: number): Promise<void> {
  await apiPost('/api/comissoes/config', { usuarioId, percentualPadrao });
}
