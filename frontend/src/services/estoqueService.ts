import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';

export interface ProdutoAPI {
  id: number;
  nome: string;
  fabricante: string;
  categoria: string;
  unidade: string;
  registroAnvisa: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
}

export interface LoteAPI {
  id: number;
  produto: ProdutoAPI;
  numeroLote: string;
  dataFabricacao: string;
  dataValidade: string;
  quantidadeTotal: number;
  quantidadeAtual: number;
  fornecedor: string;
  notaFiscal: string;
  status: string;
  ativo: boolean;
  criadoEm: string;
}

export interface ProdutoRequest {
  nome: string;
  fabricante: string;
  categoria: string;
  unidade: string;
  registroAnvisa?: string;
  descricao?: string;
}

export interface LoteRequest {
  produtoId: number;
  numeroLote: string;
  dataFabricacao?: string;
  dataValidade: string;
  quantidadeTotal: number;
  fornecedor?: string;
  notaFiscal?: string;
}

export async function listarProdutos(busca = ''): Promise<ProdutoAPI[]> {
  const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  return apiGet<ProdutoAPI[]>(`/api/produtos${query}`);
}

export async function criarProduto(data: ProdutoRequest): Promise<ProdutoAPI> {
  return apiPost<ProdutoAPI>('/api/produtos', data);
}

export async function atualizarProduto(id: number, data: ProdutoRequest): Promise<ProdutoAPI> {
  return apiPut<ProdutoAPI>(`/api/produtos/${id}`, data);
}

export async function inativarProduto(id: number): Promise<void> {
  return apiDelete(`/api/produtos/${id}`);
}

export async function listarLotes(produtoId?: number): Promise<LoteAPI[]> {
  const query = produtoId ? `?produtoId=${produtoId}` : '';
  return apiGet<LoteAPI[]>(`/api/estoque/lotes${query}`);
}

export async function criarLote(data: LoteRequest): Promise<LoteAPI> {
  return apiPost<LoteAPI>('/api/estoque/lotes', data);
}

export async function darBaixaEstoque(loteId: number, quantidade: number): Promise<LoteAPI> {
  return apiPatch<LoteAPI>(`/api/estoque/lotes/${loteId}/baixa`, { quantidade });
}
