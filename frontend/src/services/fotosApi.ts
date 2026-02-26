import { apiFetch } from './api';

export interface FotoPacienteResponse {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  tipoFoto: 'ANTES' | 'DEPOIS' | 'EVOLUCAO';
  descricao: string | null;
  criadoEm: string;
  urlArquivo: string;
}

export const listarFotosPorPaciente = (pacienteId: number) =>
  apiFetch<FotoPacienteResponse[]>(`/api/fotos/paciente/${pacienteId}`);

export const uploadFoto = (formData: FormData): Promise<FotoPacienteResponse> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('clinica_token') : null;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return fetch(`${base}/api/fotos`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async (r) => {
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.mensagem || `Erro ${r.status}`);
    }
    return r.json();
  });
};

export const excluirFoto = (id: number) =>
  apiFetch<void>(`/api/fotos/${id}`, { method: 'DELETE' });

export const fetchFotoBlob = (id: number): Promise<string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('clinica_token') : null;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return fetch(`${base}/api/fotos/${id}/arquivo`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then(async (r) => {
    if (!r.ok) throw new Error(`Erro ao carregar imagem ${id}`);
    const blob = await r.blob();
    return URL.createObjectURL(blob);
  });
};
