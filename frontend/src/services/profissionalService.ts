import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';

export interface ProfissionalAPI {
  id: number;
  nome: string;
  email: string;
  role: string;
  cargo: string;
  cargoDescricao: string;
  areaProfissional: string;
  areaDescricao: string;
  telefone: string;
  especialidade: string;
  registro: string;
  observacoes: string;
  atendimentos: number;
  ativo: boolean;
  criadoEm: string;
}

export interface ProfissionalRequest {
  nome: string;
  email: string;
  senha?: string;
  role?: string;
  cargo?: string;
  telefone?: string;
  especialidade?: string;
  registro?: string;
  observacoes?: string;
  empresaId?: number;
  ativo?: boolean;
}

export async function listarProfissionais(): Promise<ProfissionalAPI[]> {
  return apiGet<ProfissionalAPI[]>('/api/usuarios');
}

export async function listarAreaTecnica(): Promise<ProfissionalAPI[]> {
  return apiGet<ProfissionalAPI[]>('/api/usuarios/area/tecnica');
}

export async function listarAreaAdministrativa(): Promise<ProfissionalAPI[]> {
  return apiGet<ProfissionalAPI[]>('/api/usuarios/area/administrativa');
}

export async function buscarProfissional(id: number): Promise<ProfissionalAPI> {
  return apiGet<ProfissionalAPI>(`/api/usuarios/${id}`);
}

export async function criarProfissional(data: ProfissionalRequest): Promise<ProfissionalAPI> {
  return apiPost<ProfissionalAPI>('/api/usuarios', data);
}

export async function atualizarProfissional(id: number, data: ProfissionalRequest): Promise<ProfissionalAPI> {
  return apiPut<ProfissionalAPI>(`/api/usuarios/${id}`, data);
}

export async function inativarProfissional(id: number): Promise<void> {
  return apiPatch<void>(`/api/usuarios/${id}/inativar`);
}

export async function deletarProfissional(id: number): Promise<void> {
  return apiDelete(`/api/usuarios/${id}`);
}

export async function ativarProfissional(id: number): Promise<void> {
  return apiPatch<void>(`/api/usuarios/${id}/ativar`);
}

export async function buscarPerfil(): Promise<ProfissionalAPI> {
  return apiGet<ProfissionalAPI>('/api/usuarios/me');
}
