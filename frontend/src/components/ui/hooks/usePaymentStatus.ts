'use client';

import { useAuth } from '@/contexts/AuthContext';
import { MOCK_COMPANIES, CompanyPaymentStatus } from '@/types/auth';

/**
 * Retorna o status de pagamento da empresa do usuário logado.
 * - Super Admin e usuários sem empresa: sempre 'ativo' (não bloqueados).
 * - Usuários de empresa: verifica MOCK_COMPANIES.
 */
export function usePaymentStatus(): {
  paymentStatus: CompanyPaymentStatus;
  isBlocked: boolean;
  companyName: string | null;
} {
  const { currentUser } = useAuth();

  // Super admin e sem empresa nunca são bloqueados
  if (!currentUser || !currentUser.companyId || currentUser.role === 'super_admin') {
    return { paymentStatus: 'ativo', isBlocked: false, companyName: null };
  }

  const company = MOCK_COMPANIES.find(c => c.id === currentUser.companyId);

  if (!company) {
    return { paymentStatus: 'ativo', isBlocked: false, companyName: null };
  }

  const isBlocked = company.paymentStatus === 'vencido' || company.paymentStatus === 'suspenso';

  return {
    paymentStatus: company.paymentStatus,
    isBlocked,
    companyName: company.name,
  };
}