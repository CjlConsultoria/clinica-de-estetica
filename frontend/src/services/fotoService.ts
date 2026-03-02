import { apiGet, apiDelete, apiUpload } from '@/lib/api';

export interface FotoAPI {
  id: number;
  pacienteId: number;
  agendamentoId: number | null;
  tipoFoto: string;
  descricao: string;
  nomeArquivo: string;
  dataRegistro: string;
  criadoEm: string;
}

export interface ComparativoFotoAPI {
  pacienteId: number;
  fotoAntes: FotoAPI | null;
  fotoDepois: FotoAPI | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function listarFotosPorPaciente(pacienteId: number): Promise<FotoAPI[]> {
  return apiGet<FotoAPI[]>(`/api/fotos/paciente/${pacienteId}`);
}

export async function comparativoFotos(pacienteId: number): Promise<ComparativoFotoAPI> {
  return apiGet<ComparativoFotoAPI>(`/api/fotos/paciente/${pacienteId}/comparativo`);
}

export async function uploadFoto(
  pacienteId: number,
  tipoFoto: string,
  descricao: string,
  arquivo: File,
  agendamentoId?: number
): Promise<FotoAPI> {
  const formData = new FormData();
  formData.append('pacienteId', String(pacienteId));
  formData.append('tipoFoto', tipoFoto);
  formData.append('descricao', descricao);
  formData.append('arquivo', arquivo);
  if (agendamentoId) formData.append('agendamentoId', String(agendamentoId));
  return apiUpload<FotoAPI>('/api/fotos', formData);
}

export async function excluirFoto(id: number): Promise<void> {
  return apiDelete(`/api/fotos/${id}`);
}

export function urlFoto(id: number): string {
  return `${API_BASE}/api/fotos/${id}/arquivo`;
}
