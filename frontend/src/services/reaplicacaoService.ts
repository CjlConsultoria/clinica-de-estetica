import { apiGet, apiPost } from '@/lib/api';

export interface AplicacaoAPI {
  id: number;
  pacienteId: number;
  lote: {
    id: number;
    produto: { id: number; nome: string; categoria: string };
    numeroLote: string;
    dataValidade: string;
  };
  quantidade: number;
  dataAplicacao: string;
  dataProximaAplicacao: string | null;
  observacoes: string;
  criadoEm: string;
}

export interface AplicacaoRequest {
  pacienteId: number;
  prontuarioId?: number;
  loteId: number;
  quantidade: number;
  dataAplicacao: string;
  dataProximaAplicacao?: string;
  observacoes?: string;
}

export async function listarAplicacoesVencendo(dias = 30): Promise<AplicacaoAPI[]> {
  return apiGet<AplicacaoAPI[]>(`/api/aplicacoes/vencendo?dias=${dias}`);
}

export async function listarAplicacoesPorPaciente(pacienteId: number): Promise<AplicacaoAPI[]> {
  return apiGet<AplicacaoAPI[]>(`/api/aplicacoes/paciente/${pacienteId}`);
}

export async function registrarAplicacao(data: AplicacaoRequest): Promise<AplicacaoAPI> {
  return apiPost<AplicacaoAPI>('/api/aplicacoes', data);
}
