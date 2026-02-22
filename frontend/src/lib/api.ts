const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('clinica_token');
}

export function setToken(token: string) {
  localStorage.setItem('clinica_token', token);
}

export function removeToken() {
  localStorage.removeItem('clinica_token');
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  isFormData?: boolean;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, isFormData, ...rest } = options;
  const token = getToken();

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(rest.headers as Record<string, string> | undefined ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const err = await res.json();
      message = err.message ?? err.error ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string, opts?: FetchOptions)              => request<T>(path, { ...opts, method: 'GET' }),
  post:   <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'POST', body }),
  put:    <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'PUT', body }),
  patch:  <T>(path: string, body?: unknown, opts?: FetchOptions) => request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: FetchOptions)              => request<T>(path, { ...opts, method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData, opts?: FetchOptions) =>
    request<T>(path, { ...opts, method: 'POST', body: formData, isFormData: true }),
};
