import { apiGet, apiPost, apiPatch } from '@/lib/api';

export interface SuporteTicketAPI {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  prioridade: string;
  criadoPor: number;
  nomeAutor: string;
  empresaId: number | null;
  empresaNome: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface SuporteTicketRequest {
  titulo: string;
  descricao: string;
  categoria?: string;
  prioridade?: string;
  empresaId?: number;
  empresaNome?: string;
}

export interface TicketMensagemAPI {
  id: number;
  ticketId: number;
  autor: string;
  fromSupport: boolean;
  texto: string;
  criadoEm: string;
}

export interface TicketMensagemRequest {
  texto: string;
  fromSupport?: boolean;
}

export async function listarTickets(): Promise<SuporteTicketAPI[]> {
  return apiGet<SuporteTicketAPI[]>('/api/suporte');
}

export async function listarTicketsPorUsuario(usuarioId: number): Promise<SuporteTicketAPI[]> {
  return apiGet<SuporteTicketAPI[]>(`/api/suporte/usuario/${usuarioId}`);
}

export async function listarTicketsPorEmpresa(empresaId: number): Promise<SuporteTicketAPI[]> {
  return apiGet<SuporteTicketAPI[]>(`/api/suporte/empresa/${empresaId}`);
}

export async function criarTicket(data: SuporteTicketRequest): Promise<SuporteTicketAPI> {
  return apiPost<SuporteTicketAPI>('/api/suporte', data);
}

export async function atualizarStatusTicket(id: number, status: string): Promise<SuporteTicketAPI> {
  return apiPatch<SuporteTicketAPI>(`/api/suporte/${id}/status`, { status });
}

export async function listarMensagens(ticketId: number): Promise<TicketMensagemAPI[]> {
  return apiGet<TicketMensagemAPI[]>(`/api/suporte/${ticketId}/mensagens`);
}

export async function criarMensagem(ticketId: number, data: TicketMensagemRequest): Promise<TicketMensagemAPI> {
  return apiPost<TicketMensagemAPI>(`/api/suporte/${ticketId}/mensagens`, data);
}
