'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CurrentUser, Role, MOCK_USERS as PERMISSION_USERS } from '@/types/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  companyId: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; role?: string }>;
  logout: () => void;
  currentUser: CurrentUser | null;
  switchUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendRole(backendRole: string): Role {
  switch (backendRole) {
    case 'ADMIN':         return 'super_admin';
    case 'GERENTE':       return 'gerente';
    case 'TECNICO':       return 'tecnico';
    case 'RECEPCIONISTA': return 'recepcionista';
    case 'FINANCEIRO':    return 'financeiro';
    default:              return 'tecnico';
  }
}

function mapBackendArea(areaProfissional: string | null, role: string): 'tecnica' | 'administrativa' | 'sistema' {
  if (role === 'ADMIN') return 'sistema';
  if (areaProfissional === 'TECNICA') return 'tecnica';
  return 'administrativa';
}

function mapBackendCargo(cargo: string | null, role: string): string {
  if (!cargo) {
    if (role === 'ADMIN') return 'super_admin';
    return role.toLowerCase();
  }
  // Normalizar cargo backend para lowercase (ESTETICISTA → esteticista)
  const cargoMap: Record<string, string> = {
    MEDICO: 'medico', ENFERMEIRO: 'enfermeiro', FISIOTERAPEUTA: 'fisioterapeuta',
    NUTRICIONISTA: 'nutricionista', PSICOLOGO: 'psicologo', ESTETICISTA: 'esteticista',
    BIOMEDICO: 'biomedico', DERMATOLOGO: 'dermatologista',
    RECEPCIONISTA: 'recepcionista', GERENTE: 'gerente', FINANCEIRO: 'financeiro',
    TI: 'ti', RH: 'rh',
  };
  return cargoMap[cargo] ?? cargo.toLowerCase();
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [token, setToken]             = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('clinica_token');
    const storedUser  = localStorage.getItem('clinica_user');
    if (storedToken && storedUser) {
      try {
        const parsedUser: CurrentUser = JSON.parse(storedUser);
        setToken(storedToken);
        setCurrentUser(parsedUser);
        setUser({ id: String(parsedUser.id), name: parsedUser.name, email: parsedUser.email, role: 'admin', companyId: parsedUser.companyId });
      } catch {
        localStorage.removeItem('clinica_token');
        localStorage.removeItem('clinica_user');
      }
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, senha: credentials.password }),
      });

      if (!response.ok) {
        let errorMsg = 'E-mail ou senha incorretos.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.mensagem || errorData.message || errorMsg;
        } catch {}
        return { success: false, error: errorMsg };
      }

      const data = await response.json();
      const frontendRole = mapBackendRole(data.role);
      const area         = mapBackendArea(data.areaProfissional, data.role);
      const cargo        = mapBackendCargo(data.cargo, data.role);

      const currentUserData: CurrentUser = {
        id: data.usuarioId, name: data.nome, email: data.email,
        role: frontendRole, cargo, area,
        companyId: data.empresaId != null ? String(data.empresaId) : null,
      };
      const userData: User = {
        id: String(data.usuarioId), name: data.nome, email: data.email,
        role: 'admin', companyId: data.empresaId != null ? String(data.empresaId) : null,
      };

      localStorage.setItem('clinica_token', data.token);
      localStorage.setItem('clinica_user', JSON.stringify(currentUserData));

      setToken(data.token);
      setUser(userData);
      setCurrentUser(currentUserData);
      return { success: true, role: frontendRole };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro de conexão com o servidor.';
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('clinica_token');
    localStorage.removeItem('clinica_user');
    setUser(null);
    setToken(null);
    setCurrentUser(null);
  }, []);

  const switchUser = useCallback((userId: number) => {
    const found = PERMISSION_USERS.find((u) => u.id === userId) ?? null;
    setCurrentUser(found);
    if (found) localStorage.setItem('clinica_user', JSON.stringify(found));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, currentUser, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
