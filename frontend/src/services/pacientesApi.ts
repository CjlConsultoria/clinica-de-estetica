import { apiFetch, PageResponse } from './api';

export interface PacienteResponse {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string | null;
  sexo: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  convenio: string | null;
  numeroCarteirinha: string | null;
  observacoes: string | null;
  ativo: boolean;
  criadoEm: string;
}

export interface PacienteRequest {
  nome: string;
  cpf: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  celular?: string;
  email?: string;
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

export const listarPacientes = (busca?: string, page = 0, size = 100) => {
  const q = busca ? `&busca=${encodeURIComponent(busca)}` : '';
  return apiFetch<PageResponse<PacienteResponse>>(`/api/pacientes?page=${page}&size=${size}${q}`);
};

export const criarPaciente = (data: PacienteRequest) =>
  apiFetch<PacienteResponse>('/api/pacientes', { method: 'POST', body: JSON.stringify(data) });

export const atualizarPaciente = (id: number, data: PacienteRequest) =>
  apiFetch<PacienteResponse>(`/api/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const inativarPaciente = (id: number) =>
  apiFetch<void>(`/api/pacientes/${id}`, { method: 'DELETE' });
