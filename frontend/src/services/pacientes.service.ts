import { api } from '@/lib/api';

export interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  celular?: string;
  dataNascimento?: string;
  cpf?: string;
  ativo: boolean;
  observacoes?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PacienteRequest {
  nome: string;
  email: string;
  telefone?: string;
  celular?: string;
  dataNascimento?: string;
  cpf?: string;
  observacoes?: string;
}

export const pacientesService = {
  listar(page = 0, size = 10, search?: string): Promise<PageResponse<Paciente>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.set('busca', search);
    return api.get<PageResponse<Paciente>>(`/api/pacientes?${params}`);
  },

  listarTodos(size = 200): Promise<Paciente[]> {
    return api.get<PageResponse<Paciente>>(`/api/pacientes?page=0&size=${size}`)
      .then(r => r.content);
  },

  criar(data: PacienteRequest): Promise<Paciente> {
    return api.post<Paciente>('/api/pacientes', data);
  },

  atualizar(id: number, data: PacienteRequest): Promise<Paciente> {
    return api.put<Paciente>(`/api/pacientes/${id}`, data);
  },

  deletar(id: number): Promise<void> {
    return api.delete<void>(`/api/pacientes/${id}`);
  },
};
