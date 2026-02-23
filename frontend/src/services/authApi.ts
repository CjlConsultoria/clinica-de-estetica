const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthApiResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'GERENTE' | 'TECNICO' | 'RECEPCIONISTA' | 'FINANCEIRO';
  cargo: string | null;
  areaProfissional: 'TECNICA' | 'ADMINISTRATIVA' | null;
}

export async function loginApi(payload: LoginPayload): Promise<AuthApiResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message: string =
      body?.mensagem ?? body?.message ?? 'E-mail ou senha incorretos.';
    throw new Error(message);
  }

  return res.json() as Promise<AuthApiResponse>;
}
