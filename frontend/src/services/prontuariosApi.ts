import { apiFetch } from './api';

export interface ProntuarioResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  medicoId: number;
  medicoNome: string;
  agendamentoId: number | null;
  anamnese: string;
  exameFisico: string | null;
  diagnostico: string | null;
  cid10: string | null;
  prescricao: string | null;
  examesSolicitados: string | null;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProntuarioRequest {
  pacienteId: number;
  medicoId: number;
  agendamentoId?: number;
  anamnese: string;
  exameFisico?: string;
  diagnostico?: string;
  cid10?: string;
  prescricao?: string;
  examesSolicitados?: string;
  observacoes?: string;
}

export const listarProntuariosPorPaciente = (pacienteId: number, page = 0, size = 50) =>
  apiFetch<{ content: ProntuarioResponse[]; totalElements: number }>(
    `/api/prontuarios/paciente/${pacienteId}?page=${page}&size=${size}`
  );

export const buscarProntuario = (id: number) =>
  apiFetch<ProntuarioResponse>(`/api/prontuarios/${id}`);

export const criarProntuario = (data: ProntuarioRequest) =>
  apiFetch<ProntuarioResponse>('/api/prontuarios', { method: 'POST', body: JSON.stringify(data) });

export const atualizarProntuario = (id: number, data: ProntuarioRequest) =>
  apiFetch<ProntuarioResponse>(`/api/prontuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
