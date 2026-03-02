import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api';

export interface ProcedimentoAPI {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  valor: number;
  duracaoMinutos: number;
  percentualComissao: number;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
}

export interface ProcedimentoRequest {
  nome: string;
  codigo: string;
  categoria: string;
  valor: number;
  duracaoMinutos?: number;
  percentualComissao?: number;
  descricao?: string;
}

export async function listarProcedimentos(apenasAtivos = true): Promise<ProcedimentoAPI[]> {
  return apiGet<ProcedimentoAPI[]>(`/api/procedimentos?apenasAtivos=${apenasAtivos}`);
}

export async function buscarProcedimento(id: number): Promise<ProcedimentoAPI> {
  return apiGet<ProcedimentoAPI>(`/api/procedimentos/${id}`);
}

export async function criarProcedimento(data: ProcedimentoRequest): Promise<ProcedimentoAPI> {
  return apiPost<ProcedimentoAPI>('/api/procedimentos', data);
}

export async function atualizarProcedimento(id: number, data: ProcedimentoRequest): Promise<ProcedimentoAPI> {
  return apiPut<ProcedimentoAPI>(`/api/procedimentos/${id}`, data);
}

export async function inativarProcedimento(id: number): Promise<void> {
  return apiPatch<void>(`/api/procedimentos/${id}/inativar`);
}

export async function ativarProcedimento(id: number): Promise<void> {
  return apiPatch<void>(`/api/procedimentos/${id}/ativar`);
}
