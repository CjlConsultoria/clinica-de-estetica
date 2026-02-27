'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from './usePermissions';
import { Permission } from '@/types/auth';

const DEFAULT_ROUTE_BY_ROLE: Record<string, string> = {
  super_admin:   '/dashboard-admin',
  company_admin: '/dashboard',
  gerente:       '/dashboard',
  tecnico:       '/agenda',
  recepcionista: '/agenda',
  financeiro:    '/finance',
};

interface UseRoleRedirectOptions {
  permission?: Permission;
  permissionAlt?: Permission;
  superAdminOnly?: boolean;
  blockSuperAdmin?: boolean;
}

export function useRoleRedirect({
  permission,
  permissionAlt,
  superAdminOnly = false,
  blockSuperAdmin = false,
}: UseRoleRedirectOptions = {}): boolean {
  const router = useRouter();
  const { can, isSuperAdmin, role } = usePermissions();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (role !== null && role !== undefined) {
      setReady(true);
    }
  }, [role]);

  const hasAccess = (() => {
    if (!ready) return true; 

    if (superAdminOnly)                  return isSuperAdmin;
    if (blockSuperAdmin && isSuperAdmin) return false;
    if (isSuperAdmin)                    return true;
    if (!permission)                     return true;

    return can(permission) || (!!permissionAlt && can(permissionAlt));
  })();

  useEffect(() => {
    if (!ready) return;
    if (!hasAccess && role) {
      const destination = DEFAULT_ROUTE_BY_ROLE[role] ?? '/dashboard';
      router.replace(destination);
    }
  }, [ready, hasAccess, role, router]);

  return hasAccess;
}