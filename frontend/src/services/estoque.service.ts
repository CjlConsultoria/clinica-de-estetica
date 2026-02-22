import { api } from '@/lib/api';

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  unidade: string;
  quantidadeAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  precoUnitario: number;
  fornecedor: string;
  registroAnvisa?: string;
  status: string;
  criadoEm?: string;
}

export interface ProdutoRequest {
  nome: string;
  codigo: string;
  categoria: string;
  unidade: string;
  estoqueMinimo: number;
  estoqueMaximo: number;
  precoUnitario: number;
  fornecedor: string;
  registroAnvisa?: string;
}

export interface LoteProduto {
  id: number;
  produtoId: number;
  produtoNome?: string;
  produtoCategoria?: string;
  produtoUnidade?: string;
  produtoFabricante?: string;
  produtoRegistroAnvisa?: string;
  numeroLote: string;
  dataFabricacao?: string;
  dataValidade: string;
  quantidadeTotal: number;
  quantidadeAtual: number;
  fornecedor?: string;
  notaFiscal?: string;
  status: string;
  ativo: boolean;
  criadoEm?: string;
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

export interface AlertaEstoque {
  id: number;
  produtoId: number;
  produtoNome?: string;
  tipo: string;
  mensagem: string;
  status: string;
  criadoEm?: string;
}

export const estoqueService = {
  listarProdutos(): Promise<Produto[]> {
    return api.get<Produto[]>('/api/produtos');
  },

  criarProduto(data: ProdutoRequest): Promise<Produto> {
    return api.post<Produto>('/api/produtos', data);
  },

  atualizarProduto(id: number, data: ProdutoRequest): Promise<Produto> {
    return api.put<Produto>(`/api/produtos/${id}`, data);
  },

  deletarProduto(id: number): Promise<void> {
    return api.delete<void>(`/api/produtos/${id}`);
  },

  listarLotes(): Promise<LoteProduto[]> {
    return api.get<LoteProduto[]>('/api/estoque/lotes');
  },

  criarLote(data: LoteRequest): Promise<LoteProduto> {
    return api.post<LoteProduto>('/api/estoque/lotes', data);
  },

  baixaLote(id: number, quantidade: number, observacao: string): Promise<LoteProduto> {
    return api.patch<LoteProduto>(`/api/estoque/lotes/${id}/baixa`, { quantidade, observacao });
  },

  listarAlertas(): Promise<AlertaEstoque[]> {
    return api.get<AlertaEstoque[]>('/api/estoque/alertas');
  },

  marcarAlertaLido(id: number): Promise<void> {
    return api.patch<void>(`/api/estoque/alertas/${id}/lido`);
  },
};
