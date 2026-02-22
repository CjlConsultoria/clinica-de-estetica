import { api } from '@/lib/api';

export interface TermoConsentimento {
  id: number;
  titulo: string;
  conteudo: string;
  versao: string;
  ativo: boolean;
  criadoEm?: string;
}

export interface AssinaturaConsentimento {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  termoId: number;
  termoTitulo?: string;
  termoVersao?: string;
  hashAssinatura?: string;
  ipOrigem?: string;
  dataAssinatura: string;
  criadoEm?: string;
}

export interface AssinarTermoRequest {
  pacienteId: number;
  termoId: number;
}

export const consentimentoService = {
  listarTermos(apenasAtivos = true): Promise<TermoConsentimento[]> {
    return api.get<TermoConsentimento[]>(`/api/termos?apenasAtivos=${apenasAtivos}`);
  },

  criarTermo(data: { titulo: string; conteudo: string; versao: string }): Promise<TermoConsentimento> {
    return api.post<TermoConsentimento>('/api/termos', data);
  },

  assinarTermo(data: AssinarTermoRequest): Promise<AssinaturaConsentimento> {
    return api.post<AssinaturaConsentimento>('/api/consentimentos/assinar', data);
  },

  listarTodasAssinaturas(): Promise<AssinaturaConsentimento[]> {
    return api.get<AssinaturaConsentimento[]>('/api/consentimentos');
  },

  listarAssinaturasPorPaciente(pacienteId: number): Promise<AssinaturaConsentimento[]> {
    return api.get<AssinaturaConsentimento[]>(`/api/consentimentos/paciente/${pacienteId}`);
  },

  verificarHash(hash: string): Promise<AssinaturaConsentimento> {
    return api.get<AssinaturaConsentimento>(`/api/consentimentos/verificar/${hash}`);
  },
};
