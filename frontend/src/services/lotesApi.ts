import { apiFetch } from './api';

export interface LoteResponse {
  id: number;
  numeroLote: string;
  produtoId: number;
  produtoNome: string;
  produtoCategoria: string | null;
  produtoFabricante: string | null;
  produtoRegistroAnvisa: string | null;
  dataFabricacao: string | null;
  dataValidade: string | null;
  quantidadeTotal: number;
  quantidadeAtual: number;
  fornecedor: string | null;
  notaFiscal: string | null;
  status: 'ATIVO' | 'VENCIDO' | 'ESGOTADO' | 'RECOLHIDO';
  ativo: boolean;
  criadoEm: string;
}

export interface LoteProdutoRequest {
  produtoId: number;
  numeroLote: string;
  dataFabricacao?: string;
  dataValidade?: string;
  quantidadeTotal: number;
  fornecedor?: string;
  notaFiscal?: string;
}

export interface BaixaEstoqueRequest {
  quantidade: number;
  motivo?: string;
}

export const listarLotes = () =>
  apiFetch<LoteResponse[]>('/api/estoque/lotes');

export const adicionarLote = (data: LoteProdutoRequest) =>
  apiFetch<LoteResponse>('/api/estoque/lotes', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const darBaixa = (id: number, data: BaixaEstoqueRequest) =>
  apiFetch<LoteResponse>(`/api/estoque/lotes/${id}/baixa`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
