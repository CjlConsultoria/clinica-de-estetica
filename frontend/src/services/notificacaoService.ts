import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export interface NotificacaoAPI {
  id: number;
  tipo: string;       // ticket, pagamento, sistema, empresa, seguranca, relatorio
  prioridade: string; // alta, media, baixa
  titulo: string;
  descricao: string;
  empresaId: number | null;
  empresaNome: string | null;
  lida: boolean;
  criadoEm: string;
}

export interface NotificacaoRequest {
  titulo: string;
  descricao?: string;
  tipo: string;
  prioridade?: string;
  empresaId?: number;
  empresaNome?: string;
}

export async function listarNotificacoes(): Promise<NotificacaoAPI[]> {
  return apiGet<NotificacaoAPI[]>('/api/notificacoes');
}

export async function contarNaoLidas(): Promise<{ total: number }> {
  return apiGet<{ total: number }>('/api/notificacoes/count-nao-lidas');
}

export async function criarNotificacao(data: NotificacaoRequest): Promise<NotificacaoAPI> {
  return apiPost<NotificacaoAPI>('/api/notificacoes', data);
}

export async function marcarComoLida(id: number): Promise<NotificacaoAPI> {
  return apiPatch<NotificacaoAPI>(`/api/notificacoes/${id}/lida`, {});
}

export async function marcarTodasComoLidas(): Promise<void> {
  return apiPatch('/api/notificacoes/marcar-todas-lidas', {});
}

export async function deletarNotificacao(id: number): Promise<void> {
  return apiDelete(`/api/notificacoes/${id}`);
}

export async function limparLidas(): Promise<void> {
  return apiDelete('/api/notificacoes/limpar-lidas');
}
