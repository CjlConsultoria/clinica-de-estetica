import { api, setToken, removeToken } from '@/lib/api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nome: string;
  email: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>('/api/auth/login', credentials);
    setToken(data.token);
    return data;
  },

  logout() {
    removeToken();
  },
};