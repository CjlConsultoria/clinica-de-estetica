import { api } from '@/lib/api';

export interface Agendamento {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  medicoId?: number;
  medicoNome?: string;
  dataHora: string;
  tipoConsulta?: string;
  procedimento?: string;
  duracaoMinutos?: number;
  status: string;
  observacoes?: string;
  motivoCancelamento?: string;
  criadoEm?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AgendamentoRequest {
  pacienteId?: number;
  medicoId?: number;
  dataHora: string;
  tipoConsulta?: string;
  procedimento?: string;
  status: string;
  observacoes?: string;
  nomePaciente?: string;
  telefonePaciente?: string;
}

export const agendamentosService = {
  listar(page = 0, size = 20): Promise<PageResponse<Agendamento>> {
    return api.get<PageResponse<Agendamento>>(`/api/agendamentos?page=${page}&size=${size}`);
  },

  listarTodos(size = 300): Promise<Agendamento[]> {
    return api.get<PageResponse<Agendamento>>(`/api/agendamentos?page=0&size=${size}`)
      .then(r => r.content);
  },

  listarPorPaciente(pacienteId: number, page = 0, size = 50): Promise<PageResponse<Agendamento>> {
    return api.get<PageResponse<Agendamento>>(`/api/agendamentos/paciente/${pacienteId}?page=${page}&size=${size}`);
  },

  listarHoje(): Promise<Agendamento[]> {
    return api.get<PageResponse<Agendamento>>('/api/agendamentos?hoje=true&size=50')
      .then(r => r.content ?? r as unknown as Agendamento[]);
  },

  buscarPorId(id: number): Promise<Agendamento> {
    return api.get<Agendamento>(`/api/agendamentos/${id}`);
  },

  criar(data: AgendamentoRequest): Promise<Agendamento> {
    return api.post<Agendamento>('/api/agendamentos', data);
  },
};
