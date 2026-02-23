import { apiFetch, PageResponse } from './api';

export interface AgendamentoResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  medicoId: number;
  medicoNome: string;
  dataHora: string;
  duracaoMinutos: number;
  status: string;
  tipoConsulta: string | null;
  observacoes: string | null;
  motivoCancelamento: string | null;
  criadoEm: string;
}

export interface AgendamentoRequest {
  pacienteId: number;
  medicoId: number;
  dataHora: string;
  duracaoMinutos?: number;
  tipoConsulta?: string;
  observacoes?: string;
}

export interface AgendamentoStatusRequest {
  status: string;
  motivoCancelamento?: string;
}

export const listarAgendamentos = (page = 0, size = 200) =>
  apiFetch<PageResponse<AgendamentoResponse>>(`/api/agendamentos?page=${page}&size=${size}`);

export const criarAgendamento = (data: AgendamentoRequest) =>
  apiFetch<AgendamentoResponse>('/api/agendamentos', { method: 'POST', body: JSON.stringify(data) });

export const atualizarAgendamento = (id: number, data: AgendamentoRequest) =>
  apiFetch<AgendamentoResponse>(`/api/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const atualizarStatusAgendamento = (id: number, data: AgendamentoStatusRequest) =>
  apiFetch<AgendamentoResponse>(`/api/agendamentos/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) });
