import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

export interface ComunicadoAPI {
  id: number;
  titulo: string;
  conteudo: string;
  tipo: string;
  ativo: boolean;
  criadoPor: number;
  nomeAutor: string;
  status: string;            // enviado, agendado, rascunho
  destinatariosJson: string; // "todas" ou JSON array de nomes
  dataAgendamento: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ComunicadoRequest {
  titulo: string;
  conteudo: string;
  tipo?: string;
  status?: string;
  destinatariosJson?: string;
  dataAgendamento?: string | null;
}

export async function listarComunicados(): Promise<ComunicadoAPI[]> {
  return apiGet<ComunicadoAPI[]>('/api/comunicados');
}

export async function listarComunicadosAdmin(): Promise<ComunicadoAPI[]> {
  return apiGet<ComunicadoAPI[]>('/api/comunicados/admin');
}

export async function criarComunicado(data: ComunicadoRequest): Promise<ComunicadoAPI> {
  return apiPost<ComunicadoAPI>('/api/comunicados', data);
}

export async function atualizarComunicado(id: number, data: ComunicadoRequest): Promise<ComunicadoAPI> {
  return apiPut<ComunicadoAPI>(`/api/comunicados/${id}`, data);
}

export async function inativarComunicado(id: number): Promise<void> {
  return apiDelete(`/api/comunicados/${id}`);
}
