// Base API configuration with JWT authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('clinica_token');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.erros && typeof errorData.erros === 'object') {
        const fieldErrors = Object.entries(errorData.erros as Record<string, string>)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(' | ');
        errorMsg = fieldErrors || errorData.mensagem || errorMsg;
      } else {
        errorMsg = errorData.mensagem || errorData.message || errorMsg;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'GET' });
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch<void>(path, { method: 'DELETE' });
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.mensagem || errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return response.json();
}
