import { apiFetch } from './api';

export interface ProdutoResponse {
  id: number;
  nome: string;
  fabricante: string;
  categoria: string | null;
  unidade: string | null;
  registroAnvisa: string | null;
  descricao: string | null;
  ativo: boolean;
  totalLotes: number;
  estoqueTotal: number;
  criadoEm: string;
}

export interface ProdutoRequest {
  nome: string;
  fabricante: string;
  categoria?: string;
  unidade?: string;
  registroAnvisa?: string;
  descricao?: string;
}

export const listarProdutos = (busca?: string) => {
  const q = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  return apiFetch<ProdutoResponse[]>(`/api/produtos${q}`);
};

export const criarProduto = (data: ProdutoRequest) =>
  apiFetch<ProdutoResponse>('/api/produtos', { method: 'POST', body: JSON.stringify(data) });

export const atualizarProduto = (id: number, data: ProdutoRequest) =>
  apiFetch<ProdutoResponse>(`/api/produtos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const inativarProduto = (id: number) =>
  apiFetch<void>(`/api/produtos/${id}`, { method: 'DELETE' });
