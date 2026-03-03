'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { listarComunicados } from '@/services/comunicadoService';
import { useAuth } from '@/contexts/AuthContext';

interface ComunicadosContextValue {
  unreadComunicados: number;
  markOneRead:       (id: number) => void;
  markAllRead:       () => void;
  refreshComunicados: () => Promise<void>;
}

const ComunicadosContext = createContext<ComunicadosContextValue>({
  unreadComunicados:  0,
  markOneRead:        () => {},
  markAllRead:        () => {},
  refreshComunicados: async () => {},
});

export function ComunicadosProvider({ children }: { children: ReactNode }) {
  const [readIds,   setReadIds]   = useState<Set<number>>(new Set());
  const [totalIds,  setTotalIds]  = useState<number[]>([]);
  const { user } = useAuth();

  const refreshComunicados = useCallback(async () => {
    try {
      const data = await listarComunicados();
      const ativos = (data ?? []).filter(c => c.ativo);
      setTotalIds(ativos.map(c => c.id));
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setTotalIds([]);
      setReadIds(new Set());
      return;
    }
    refreshComunicados();
  }, [user, refreshComunicados]);

  const markOneRead = useCallback((id: number) => {
    setReadIds(prev => new Set(prev).add(id));
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds(new Set(totalIds));
  }, [totalIds]);

  const unreadComunicados = totalIds.filter(id => !readIds.has(id)).length;

  return (
    <ComunicadosContext.Provider value={{ unreadComunicados, markOneRead, markAllRead, refreshComunicados }}>
      {children}
    </ComunicadosContext.Provider>
  );
}

export function useComunicadosContext() {
  return useContext(ComunicadosContext);
}