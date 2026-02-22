import { api } from '@/lib/api';

export interface Procedimento {
  id: number;
  nome: string;
  codigo: string;
  categoria: string;
  valor: number;
  duracaoMinutos?: number;
  percentualComissao?: number;
  descricao?: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ProcedimentoRequest {
  nome: string;
  codigo: string;
  categoria: string;
  valor: number;
  duracaoMinutos?: number;
  percentualComissao?: number;
  descricao?: string;
}

export const procedimentosService = {
  listar(apenasAtivos = true): Promise<Procedimento[]> {
    return api.get<Procedimento[]>(`/api/procedimentos?apenasAtivos=${apenasAtivos}`);
  },

  buscarPorId(id: number): Promise<Procedimento> {
    return api.get<Procedimento>(`/api/procedimentos/${id}`);
  },

  criar(data: ProcedimentoRequest): Promise<Procedimento> {
    return api.post<Procedimento>('/api/procedimentos', data);
  },

  atualizar(id: number, data: ProcedimentoRequest): Promise<Procedimento> {
    return api.put<Procedimento>(`/api/procedimentos/${id}`, data);
  },

  inativar(id: number): Promise<void> {
    return api.patch<void>(`/api/procedimentos/${id}/inativar`, {});
  },

  ativar(id: number): Promise<void> {
    return api.patch<void>(`/api/procedimentos/${id}/ativar`, {});
  },
};
