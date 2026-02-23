import { apiFetch } from './api';

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
  cargo: string | null;
  cargoDescricao: string | null;
  areaProfissional: string | null;
  areaDescricao: string | null;
  telefone: string | null;
  especialidade: string | null;
  registro: string | null;
  observacoes: string | null;
  atendimentos: number;
  ativo: boolean;
  criadoEm: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  role?: string;
  cargo?: string;
  telefone?: string;
  especialidade?: string;
  registro?: string;
  observacoes?: string;
}

/** Maps backend Cargo enum to frontend cargo string */
export const mapBackendCargo = (cargo: string | null): string => {
  if (!cargo) return '';
  const map: Record<string, string> = {
    ESTETICISTA:    'esteticista',
    MEDICO:         'biomedico',
    ENFERMEIRO:     'enfermeiro',
    FISIOTERAPEUTA: 'fisioterapeuta',
    NUTRICIONISTA:  'esteticista',
    PSICOLOGO:      'esteticista',
    RECEPCIONISTA:  'recepcionista',
    GERENTE:        'gerente',
    FINANCEIRO:     'financeiro',
    TI:             'recepcionista',
    RH:             'recepcionista',
  };
  return map[cargo] ?? cargo.toLowerCase();
};

/** Maps frontend cargo string to backend Cargo enum */
export const mapFrontendCargo = (cargo: string): string => {
  const map: Record<string, string> = {
    esteticista:    'ESTETICISTA',
    biomedico:      'MEDICO',
    enfermeiro:     'ENFERMEIRO',
    dermatologista: 'MEDICO',
    fisioterapeuta: 'FISIOTERAPEUTA',
    recepcionista:  'RECEPCIONISTA',
    gerente:        'GERENTE',
    financeiro:     'FINANCEIRO',
  };
  return map[cargo] ?? cargo.toUpperCase();
};

export const listarUsuarios = () =>
  apiFetch<UsuarioResponse[]>('/api/usuarios');

export const listarMedicos = () =>
  apiFetch<UsuarioResponse[]>('/api/usuarios/medicos');

export const criarUsuario = (data: UsuarioRequest) =>
  apiFetch<UsuarioResponse>('/api/usuarios', { method: 'POST', body: JSON.stringify(data) });

export const atualizarUsuario = (id: number, data: UsuarioRequest) =>
  apiFetch<UsuarioResponse>(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const inativarUsuario = (id: number) =>
  apiFetch<void>(`/api/usuarios/${id}`, { method: 'DELETE' });
