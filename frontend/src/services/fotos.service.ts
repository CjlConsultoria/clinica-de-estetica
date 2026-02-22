import { api } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface FotoPaciente {
  id: number;
  pacienteId: number;
  tipo: string;
  descricao?: string;
  procedimento?: string;
  dataFoto?: string;
  arquivoNome?: string;
  criadoEm?: string;
}

export const fotosService = {
  listarPorPaciente(pacienteId: number): Promise<FotoPaciente[]> {
    return api.get<FotoPaciente[]>(`/api/fotos/paciente/${pacienteId}`);
  },

  upload(pacienteId: number, tipo: string, file: File, descricao?: string, procedimento?: string): Promise<FotoPaciente> {
    const form = new FormData();
    form.append('arquivo', file);
    form.append('pacienteId', String(pacienteId));
    form.append('tipo', tipo);
    if (descricao) form.append('descricao', descricao);
    if (procedimento) form.append('procedimento', procedimento);
    return api.upload<FotoPaciente>('/api/fotos', form);
  },

  deletar(id: number): Promise<void> {
    return api.delete<void>(`/api/fotos/${id}`);
  },

  getArquivoUrl(id: number): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem('clinica_token') : '';
    return `${BASE_URL}/api/fotos/${id}/arquivo`;
  },
};
