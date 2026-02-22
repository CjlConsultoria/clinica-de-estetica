'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { setToken, removeToken } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller';
  cargo?: string;
  cargoDescricao?: string;
  areaProfissional?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'clinica_user';
const TOKEN_KEY = 'clinica_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setTokenState(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login({ email: credentials.email, senha: credentials.password });

      const userData: User = {
        id:    String(data.usuarioId),
        name:  data.nome,
        email: data.email,
        role:  data.role === 'ADMIN' ? 'admin' : 'seller',
      };

      setUser(userData);
      setTokenState(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login.';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setTokenState(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}