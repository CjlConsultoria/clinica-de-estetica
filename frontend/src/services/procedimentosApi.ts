import { apiFetch } from './api';

export interface ProcedimentoResponse {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  valor: number;
  duracaoMinutos: number | null;
  percentualComissao: number | null;
  descricao: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string | null;
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

export const listarProcedimentos = (apenasAtivos = false) =>
  apiFetch<ProcedimentoResponse[]>(`/api/procedimentos?apenasAtivos=${apenasAtivos}`);

export const criarProcedimento = (data: ProcedimentoRequest) =>
  apiFetch<ProcedimentoResponse>('/api/procedimentos', { method: 'POST', body: JSON.stringify(data) });

export const atualizarProcedimento = (id: number, data: ProcedimentoRequest) =>
  apiFetch<ProcedimentoResponse>(`/api/procedimentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const inativarProcedimento = (id: number) =>
  apiFetch<void>(`/api/procedimentos/${id}/inativar`, { method: 'PATCH' });

export const ativarProcedimento = (id: number) =>
  apiFetch<void>(`/api/procedimentos/${id}/ativar`, { method: 'PATCH' });
