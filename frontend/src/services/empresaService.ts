import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api';

export interface EmpresaAPI {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  responsavel: string;
  plano: string;
  valor: number;
  status: string;
  dataInicio: string;
  vencimento: string;
  proximaCobranca: string;
  usuarios: number;
  observacoes: string;
  adminNome: string;
  adminEmail: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EmpresaRequest {
  nome: string;
  email: string;
  telefone?: string;
  cnpj?: string;
  responsavel?: string;
  plano?: string;
  valor?: number;
  status?: string;
  observacoes?: string;
  adminNome?: string;
  adminEmail?: string;
}

export async function listarEmpresas(): Promise<EmpresaAPI[]> {
  return apiGet<EmpresaAPI[]>('/api/empresas');
}

export async function buscarEmpresa(id: number): Promise<EmpresaAPI> {
  return apiGet<EmpresaAPI>(`/api/empresas/${id}`);
}

export async function criarEmpresa(data: EmpresaRequest): Promise<EmpresaAPI> {
  return apiPost<EmpresaAPI>('/api/empresas', data);
}

export async function atualizarEmpresa(id: number, data: EmpresaRequest): Promise<EmpresaAPI> {
  return apiPut<EmpresaAPI>(`/api/empresas/${id}`, data);
}

export async function atualizarStatusEmpresa(id: number, status: string): Promise<EmpresaAPI> {
  return apiPatch<EmpresaAPI>(`/api/empresas/${id}/status`, { status });
}
