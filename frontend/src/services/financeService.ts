import { apiGet, apiPost, apiPatch } from '@/lib/api';
import { PageResponse } from './pacienteService';

export interface LancamentoAPI {
  id: number;
  agendamentoId: number | null;
  pacienteId: number;
  valor: number;
  valorDesconto: number;
  formaPagamento: string;
  status: string;
  dataVencimento: string;
  dataPagamento: string | null;
  descricao: string;
  numeroRecibo: string;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface LancamentoRequest {
  pacienteId?: number;
  agendamentoId?: number;
  valor: number;
  valorDesconto?: number;
  formaPagamento: string;
  dataVencimento: string;
  descricao: string;
  observacoes?: string;
}

export async function listarLancamentos(page = 0, size = 100): Promise<PageResponse<LancamentoAPI>> {
  return apiGet<PageResponse<LancamentoAPI>>(`/api/financeiro/lancamentos?page=${page}&size=${size}`);
}

export async function criarLancamento(data: LancamentoRequest): Promise<LancamentoAPI> {
  return apiPost<LancamentoAPI>('/api/financeiro/lancamentos', data);
}

export async function pagarLancamento(id: number, formaPagamento: string): Promise<LancamentoAPI> {
  return apiPatch<LancamentoAPI>(`/api/financeiro/lancamentos/${id}/pagar`, {
    formaPagamento,
    dataPagamento: new Date().toISOString().split('T')[0],
  });
}

export async function cancelarLancamento(id: number): Promise<LancamentoAPI> {
  return apiPatch<LancamentoAPI>(`/api/financeiro/lancamentos/${id}/cancelar`);
}
