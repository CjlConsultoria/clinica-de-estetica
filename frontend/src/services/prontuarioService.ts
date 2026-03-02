import { apiGet, apiPost, apiPut } from '@/lib/api';
import { PageResponse } from './pacienteService';

export interface ProntuarioAPI {
  id: number;
  pacienteId: number;
  medicoId: number;
  medicoNome: string;
  agendamentoId: number | null;
  anamnese: string;
  exameFisico: string;
  diagnostico: string;
  cid10: string;
  prescricao: string;
  examesSolicitados: string;
  observacoes: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProntuarioRequest {
  pacienteId: number;
  medicoId: number;
  agendamentoId?: number;
  anamnese?: string;
  exameFisico?: string;
  diagnostico?: string;
  cid10?: string;
  prescricao?: string;
  examesSolicitados?: string;
  observacoes?: string;
}

export async function listarProntuariosPorPaciente(pacienteId: number, page = 0, size = 50): Promise<PageResponse<ProntuarioAPI>> {
  return apiGet<PageResponse<ProntuarioAPI>>(`/api/prontuarios/paciente/${pacienteId}?page=${page}&size=${size}`);
}

export async function criarProntuario(data: ProntuarioRequest): Promise<ProntuarioAPI> {
  return apiPost<ProntuarioAPI>('/api/prontuarios', data);
}

export async function atualizarProntuario(id: number, data: ProntuarioRequest): Promise<ProntuarioAPI> {
  return apiPut<ProntuarioAPI>(`/api/prontuarios/${id}`, data);
}
