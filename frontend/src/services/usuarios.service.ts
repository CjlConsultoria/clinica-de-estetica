import { api } from '@/lib/api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  cargo?: string;
  cargoDescricao?: string;
  areaProfissional?: string;
  areaDescricao?: string;
  telefone?: string;
  especialidade?: string;
  registro?: string;
  observacoes?: string;
  atendimentos?: number;
  ativo: boolean;
  criadoEm?: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  role?: string;
  cargo?: string;
  telefone?: string;
  especialidade?: string;
  registro?: string;
  observacoes?: string;
}

export const usuariosService = {
  listar(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/api/usuarios');
  },

  listarMedicos(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/api/usuarios/medicos');
  },

  listarAreaTecnica(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/api/usuarios/area/tecnica');
  },

  listarAreaAdministrativa(): Promise<Usuario[]> {
    return api.get<Usuario[]>('/api/usuarios/area/administrativa');
  },

  criar(data: UsuarioRequest): Promise<Usuario> {
    return api.post<Usuario>('/api/usuarios', data);
  },

  atualizar(id: number, data: UsuarioRequest): Promise<Usuario> {
    return api.put<Usuario>(`/api/usuarios/${id}`, data);
  },

  inativar(id: number): Promise<void> {
    return api.delete<void>(`/api/usuarios/${id}`);
  },
};
