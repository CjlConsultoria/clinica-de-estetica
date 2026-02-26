'use client';
<<<<<<< HEAD
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { CurrentUser, Role, MOCK_USERS as PERMISSION_USERS } from '@/types/auth';
import { loginApi, AuthApiResponse } from '@/services/authApi';
import { getApiErrorMessage } from '@/utils/apiError';

// ─── Mapeamento Backend → Frontend ──────────────────────────────────────────

function mapBackendRoleToFrontend(
  backendRole: AuthApiResponse['role'],
): Role {
  switch (backendRole) {
    case 'ADMIN':         return 'super_admin';
    case 'GERENTE':       return 'gerente';
    case 'TECNICO':       return 'tecnico';
    case 'RECEPCIONISTA': return 'recepcionista';
    case 'FINANCEIRO':    return 'financeiro';
    default:              return 'recepcionista';
  }
=======
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CurrentUser, MOCK_USERS as PERMISSION_USERS } from '@/types/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  companyId: string | null; 
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
}

function mapAreaToFrontend(
  area: AuthApiResponse['areaProfissional'],
  role: Role,
): CurrentUser['area'] {
  if (role === 'super_admin') return 'sistema';
  if (area === 'TECNICA') return 'tecnica';
  return 'administrativa';
}

function buildCurrentUser(data: AuthApiResponse): CurrentUser {
  const role = mapBackendRoleToFrontend(data.role);
  return {
    id: data.usuarioId,
    name: data.nome,
    email: data.email,
    role,
    cargo: data.cargo ? data.cargo.toLowerCase() : role,
    area: mapAreaToFrontend(data.areaProfissional, role),
  };
}

// ─── Persistência ────────────────────────────────────────────────────────────

const TOKEN_KEY   = 'clinica_token';
const USER_KEY    = 'clinica_user';

function persistSession(token: string, user: CurrentUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function loadSession(): { token: string; user: CurrentUser } | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw   = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    return { token, user: JSON.parse(raw) as CurrentUser };
  } catch {
    return null;
  }
}

// ─── Tipos do contexto ───────────────────────────────────────────────────────

interface LoginCredentials {
  email: string;
  password: string;
}

const MOCK_LOGIN_USERS = [
  { id: '1', name: 'Administrador', email: 'admin@gmail.com', password: '12345678', role: 'admin' as const, companyId: null },
];

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  currentUser: CurrentUser | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
<<<<<<< HEAD
  /** Apenas para o painel de debug de desenvolvimento */
=======
  currentUser: CurrentUser | null;
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  switchUser: (userId: number) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const [token, setToken]             = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Restaura sessão salva no localStorage ao montar
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setToken(saved.token);
      setCurrentUser(saved.user);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const data = await loginApi({
        email: credentials.email.trim(),
        senha: credentials.password,
      });

      const user = buildCurrentUser(data);

      setToken(data.token);
      setCurrentUser(user);
      persistSession(data.token, user);

=======
  const [user, setUser]               = useState<User | null>(null);
  const [token, setToken]             = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(PERMISSION_USERS[0]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const found = MOCK_LOGIN_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (found) {
      const { password, ...userData } = found;
      setUser(userData);
      setToken('mock-token');
      setCurrentUser(PERMISSION_USERS[0]);
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
      return { success: true };
    } catch (err) {
      return { success: false, error: getApiErrorMessage(err, 'login') };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
<<<<<<< HEAD
    clearSession();
  }, []);

  /** Troca de usuário pelo painel de debug (só em desenvolvimento) */
=======
  }, []);

>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
  const switchUser = useCallback((userId: number) => {
    const found = PERMISSION_USERS.find((u) => u.id === userId) ?? null;
    setCurrentUser(found);
  }, []);

  return (
    <AuthContext.Provider
      value={{
<<<<<<< HEAD
        token,
        isAuthenticated: !!token && !!currentUser,
        currentUser,
        login,
        logout,
=======
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        currentUser,
>>>>>>> f28813edf0f1c78aa8233460f31ac36892245d4a
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}