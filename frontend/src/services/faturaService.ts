import { apiGet, apiPost, apiPatch } from '@/lib/api';

export interface FaturaAPI {
  id: number;
  empresaId: number;
  empresaNome: string;
  competencia: string;
  valor: number;
  plano: string;
  vencimento: string;
  pagamento: string | null;
  status: string;
  observacoes: string | null;
  criadoEm: string;
}

export interface FaturaRequest {
  empresaId: number;
  competencia: string;
  valor?: number;
  plano?: string;
  vencimento?: string;
  observacoes?: string;
}

export async function listarFaturas(): Promise<FaturaAPI[]> {
  return apiGet<FaturaAPI[]>('/api/faturas');
}

export async function listarFaturasPorEmpresa(empresaId: number): Promise<FaturaAPI[]> {
  return apiGet<FaturaAPI[]>(`/api/faturas/empresa/${empresaId}`);
}

export async function criarFatura(data: FaturaRequest): Promise<FaturaAPI> {
  return apiPost<FaturaAPI>('/api/faturas', data);
}

export async function pagarFatura(id: number): Promise<FaturaAPI> {
  return apiPatch<FaturaAPI>(`/api/faturas/${id}/pagar`, {});
}
