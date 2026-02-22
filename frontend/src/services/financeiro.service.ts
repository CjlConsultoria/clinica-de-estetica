import { api } from '@/lib/api';

export interface Lancamento {
  id: number;
  agendamentoId?: number;
  pacienteId?: number;
  pacienteNome?: string;
  valor: number;
  valorDesconto?: number;
  valorLiquido?: number;
  formaPagamento?: string;
  status?: string;  // PENDENTE | PAGO | CANCELADO
  dataVencimento?: string;
  dataPagamento?: string;
  descricao?: string;
  numeroRecibo?: string;
  observacoes?: string;
  criadoEm?: string;
}

export interface LancamentoRequest {
  pacienteId?: number;
  agendamentoId?: number;
  valor: number;
  valorDesconto?: number;
  formaPagamento?: string;
  dataVencimento?: string;
  descricao?: string;
  observacoes?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const financeiroService = {
  listar(page = 0, size = 50): Promise<PageResponse<Lancamento>> {
    return api.get<PageResponse<Lancamento>>(`/api/financeiro/lancamentos?page=${page}&size=${size}`);
  },

  criar(data: LancamentoRequest): Promise<Lancamento> {
    return api.post<Lancamento>('/api/financeiro/lancamentos', data);
  },
};
