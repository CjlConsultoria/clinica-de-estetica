import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api';
import { PageResponse } from './pacienteService';

export interface AgendamentoAPI {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  medicoId: number;
  medicoNome: string;
  dataHora: string;
  duracaoMinutos: number;
  status: string;
  tipoConsulta: string;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AgendamentoRequest {
  pacienteId: number;
  medicoId: number;
  dataHora: string;
  duracaoMinutos?: number;
  tipoConsulta?: string;
  observacoes?: string;
}

export async function listarAgendamentos(page = 0, size = 100): Promise<PageResponse<AgendamentoAPI>> {
  return apiGet<PageResponse<AgendamentoAPI>>(`/api/agendamentos?page=${page}&size=${size}`);
}

export async function listarAgendaPorMedico(medicoId: number, inicio: string, fim: string): Promise<AgendamentoAPI[]> {
  return apiGet<AgendamentoAPI[]>(`/api/agendamentos/agenda/${medicoId}?inicio=${inicio}&fim=${fim}`);
}

export async function criarAgendamento(data: AgendamentoRequest): Promise<AgendamentoAPI> {
  return apiPost<AgendamentoAPI>('/api/agendamentos', data);
}

export async function atualizarAgendamento(id: number, data: AgendamentoRequest): Promise<AgendamentoAPI> {
  return apiPut<AgendamentoAPI>(`/api/agendamentos/${id}`, data);
}

export async function atualizarStatusAgendamento(id: number, status: string): Promise<AgendamentoAPI> {
  return apiPatch<AgendamentoAPI>(`/api/agendamentos/${id}/status`, { status });
}
