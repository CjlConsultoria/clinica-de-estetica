import { apiFetch } from './api';

export interface AlertaResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  aplicacaoId: number | null;
  produtoNome: string;
  dataAlerta: string;
  mensagem: string;
  status: string;
  lido: boolean;
}

export interface AplicacaoVencendoResponse {
  id: number;
  pacienteNome: string;
  loteId: number;
  numeroLote: string;
  produtoNome: string;
  quantidade: number;
  dataAplicacao: string;
  dataProximaAplicacao: string | null;
}

export const listarAlertasPendentes = () =>
  apiFetch<AlertaResponse[]>('/api/alertas/pendentes');

export const marcarAlertaLido = (id: number) =>
  apiFetch<AlertaResponse>(`/api/alertas/${id}/lido`, { method: 'PATCH' });

export const listarAplicacoesVencendo = (dias = 30) =>
  apiFetch<AplicacaoVencendoResponse[]>(`/api/aplicacoes/vencendo?dias=${dias}`);
