import { apiFetch } from './api';

export interface TermoResponse {
  id: number;
  titulo: string;
  conteudo: string;
  versao: string;
  ativo: boolean;
  criadoEm: string;
}

export interface AssinaturaResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  termoId: number;
  termoTitulo: string;
  termoVersao: string;
  hashAssinatura: string;
  ipOrigem: string;
  dataAssinatura: string;
  criadoEm: string;
}

export interface TermoRequest {
  titulo: string;
  conteudo: string;
  versao: string;
}

export interface AssinarTermoRequest {
  pacienteId: number;
  termoId: number;
  assinatura: string;
}

export const listarTermos = (apenasAtivos = true) =>
  apiFetch<TermoResponse[]>(`/api/termos?apenasAtivos=${apenasAtivos}`);

export const criarTermo = (data: TermoRequest) =>
  apiFetch<TermoResponse>('/api/termos', { method: 'POST', body: JSON.stringify(data) });

export const atualizarTermo = (id: number, data: TermoRequest) =>
  apiFetch<TermoResponse>(`/api/termos/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const inativarTermo = (id: number) =>
  apiFetch<void>(`/api/termos/${id}`, { method: 'DELETE' });

export const listarAssinaturas = () =>
  apiFetch<AssinaturaResponse[]>('/api/consentimentos');

export const listarAssinaturasPorPaciente = (pacienteId: number) =>
  apiFetch<AssinaturaResponse[]>(`/api/consentimentos/paciente/${pacienteId}`);

export const assinarTermo = (data: AssinarTermoRequest) =>
  apiFetch<AssinaturaResponse>('/api/consentimentos/assinar', { method: 'POST', body: JSON.stringify(data) });
