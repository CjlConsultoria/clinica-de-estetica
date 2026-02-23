'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CurrentUser, MOCK_USERS as PERMISSION_USERS } from '@/types/auth';

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

const MOCK_LOGIN_USERS = [
  { id: '1', name: 'Administrador', email: 'admin@gmail.com', password: '12345678', role: 'admin' as const, companyId: null },
];

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  currentUser: CurrentUser | null;
  switchUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      return { success: true };
    }
    return { success: false, error: 'E-mail ou senha incorretos.' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setCurrentUser(null);
  }, []);

  const switchUser = useCallback((userId: number) => {
    const found = PERMISSION_USERS.find((u) => u.id === userId) ?? null;
    setCurrentUser(found);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        currentUser,
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