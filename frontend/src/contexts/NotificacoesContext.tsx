'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { contarNaoLidas } from '@/services/notificacaoService';
import { useAuth } from '@/contexts/AuthContext';

interface NotificacoesContextValue {
  unreadCount:     number;
  setUnreadCount:  (count: number) => void;
  decrementUnread: () => void;
  resetUnread:     () => void;
  refreshCount:    () => Promise<void>;
}

const NotificacoesContext = createContext<NotificacoesContextValue>({
  unreadCount:     0,
  setUnreadCount:  () => {},
  decrementUnread: () => {},
  resetUnread:     () => {},
  refreshCount:    async () => {},
});

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const refreshCount = useCallback(async () => {
    try {
      const { total } = await contarNaoLidas();
      setUnreadCount(total ?? 0);
    } catch {
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    refreshCount();
  }, [user, refreshCount]);

  const decrementUnread = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <NotificacoesContext.Provider value={{ unreadCount, setUnreadCount, decrementUnread, resetUnread, refreshCount }}>
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoesContext() {
  return useContext(NotificacoesContext);
}