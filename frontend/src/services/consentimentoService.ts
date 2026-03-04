import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

export interface TermoAPI {
  id: number;
  titulo: string;
  conteudo: string;
  versao: string;
  ativo: boolean;
  pacienteNome: string | null;
  profissionalNome: string | null;
  assinado: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AssinaturaAPI {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  termoId: number;
  termoTitulo: string;
  hashAssinatura: string;
  ipOrigem: string;
  dataAssinatura: string;
  criadoEm: string;
}

export interface TermoRequest {
  titulo: string;
  conteudo: string;
  versao: string;
  pacienteNome?: string;
  profissionalNome?: string;
}

export async function listarTermos(apenasAtivos = false): Promise<TermoAPI[]> {
  return apiGet<TermoAPI[]>(`/api/termos?apenasAtivos=${apenasAtivos}`);
}

export async function criarTermo(data: TermoRequest): Promise<TermoAPI> {
  return apiPost<TermoAPI>('/api/termos', data);
}

export async function atualizarTermo(id: number, data: TermoRequest): Promise<TermoAPI> {
  return apiPut<TermoAPI>(`/api/termos/${id}`, data);
}

export async function inativarTermo(id: number): Promise<void> {
  return apiDelete(`/api/termos/${id}`);
}

export async function listarAssinaturas(): Promise<AssinaturaAPI[]> {
  return apiGet<AssinaturaAPI[]>('/api/consentimentos');
}

export async function listarAssinaturasPorPaciente(pacienteId: number): Promise<AssinaturaAPI[]> {
  return apiGet<AssinaturaAPI[]>(`/api/consentimentos/paciente/${pacienteId}`);
}

export async function assinarTermo(pacienteId: number, termoId: number): Promise<AssinaturaAPI> {
  return apiPost<AssinaturaAPI>('/api/consentimentos/assinar', { pacienteId, termoId });
}
