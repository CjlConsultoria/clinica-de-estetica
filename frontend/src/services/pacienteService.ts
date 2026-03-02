import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

export interface PacienteAPI {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  telefone: string;
  celular: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  convenio: string;
  numeroCarteirinha: string;
  observacoes: string;
  ativo: boolean;
  criadoEm: string;
}

export interface PacienteRequest {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  telefone: string;
  celular?: string;
  email: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  convenio?: string;
  numeroCarteirinha?: string;
  observacoes?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export async function listarPacientes(busca = '', page = 0, size = 100): Promise<PageResponse<PacienteAPI>> {
  const query = busca ? `?busca=${encodeURIComponent(busca)}&page=${page}&size=${size}` : `?page=${page}&size=${size}`;
  return apiGet<PageResponse<PacienteAPI>>(`/api/pacientes${query}`);
}

export async function buscarPaciente(id: number): Promise<PacienteAPI> {
  return apiGet<PacienteAPI>(`/api/pacientes/${id}`);
}

export async function criarPaciente(data: PacienteRequest): Promise<PacienteAPI> {
  return apiPost<PacienteAPI>('/api/pacientes', data);
}

export async function atualizarPaciente(id: number, data: PacienteRequest): Promise<PacienteAPI> {
  return apiPut<PacienteAPI>(`/api/pacientes/${id}`, data);
}

export async function inativarPaciente(id: number): Promise<void> {
  return apiDelete(`/api/pacientes/${id}`);
}
