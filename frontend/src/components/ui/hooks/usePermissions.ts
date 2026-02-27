import { useCallback } from 'react';
import { Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
  const { currentUser } = useAuth();
  const role      = currentUser?.role      ?? null;
  const companyId = currentUser?.companyId ?? null;

  const can = useCallback((permission: Permission): boolean => {
    if (!role) return false;
    const perms = ROLE_PERMISSIONS[role];
    if (!perms) return false;
    if (perms.includes('*')) return true;
    return perms.includes(permission);
  }, [role]);

  const canAny = useCallback((permissions: Permission[]): boolean =>
    permissions.some(p => can(p)), [can]);

  const canAll = useCallback((permissions: Permission[]): boolean =>
    permissions.every(p => can(p)), [can]);

  return {
    can, canAny, canAll,
    role,
    companyId,
    isSuperAdmin:    role === 'super_admin',
    isCompanyAdmin:  role === 'company_admin',
    isGerente:       role === 'gerente',
    isTecnico:       role === 'tecnico',
    isRecepcionista: role === 'recepcionista',
    isFinanceiro:    role === 'financeiro',

    canAccessCompany: (targetCompanyId: string): boolean => {
      if (role === 'super_admin') return true;
      return companyId === targetCompanyId;
    },
  };
}