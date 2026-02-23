import { apiFetch, PageResponse } from './api';

export interface LancamentoResponse {
  id: number;
  agendamentoId: number | null;
  pacienteId: number | null;
  pacienteNome: string | null;
  valor: number;
  valorDesconto: number;
  valorLiquido: number;
  formaPagamento: string | null;
  status: string;
  dataVencimento: string | null;
  dataPagamento: string | null;
  descricao: string | null;
  numeroRecibo: string | null;
  observacoes: string | null;
  criadoEm: string;
}

export interface LancamentoRequest {
  pacienteId: number;
  valor: number;
  valorDesconto?: number;
  formaPagamento?: string;
  dataVencimento?: string;
  descricao?: string;
  observacoes?: string;
  agendamentoId?: number;
}

export const listarLancamentos = (page = 0, size = 200) =>
  apiFetch<PageResponse<LancamentoResponse>>(`/api/financeiro/lancamentos?page=${page}&size=${size}`);

export const criarLancamento = (data: LancamentoRequest) =>
  apiFetch<LancamentoResponse>('/api/financeiro/lancamentos', { method: 'POST', body: JSON.stringify(data) });

export const registrarPagamento = (id: number, formaPagamento: string) =>
  apiFetch<LancamentoResponse>(`/api/financeiro/lancamentos/${id}/pagar`, {
    method: 'PATCH',
    body: JSON.stringify({ formaPagamento }),
  });

export const cancelarLancamento = (id: number) =>
  apiFetch<LancamentoResponse>(`/api/financeiro/lancamentos/${id}/cancelar`, { method: 'PATCH' });
