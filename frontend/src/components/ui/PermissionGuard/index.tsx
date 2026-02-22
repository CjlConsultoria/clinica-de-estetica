'use client';
import React from 'react';
import { Permission } from '@/types/auth';
import { usePermissions } from '@/components/ui/hooks/usePermissions';
import AccessDenied from '@/components/ui/AccessDenied';

interface PermissionGuardProps {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  showDenied?: boolean;
  fallback?: React.ReactNode;
  children?: React.ReactNode; 
}

export default function PermissionGuard({ permission, anyOf, allOf, showDenied = false, fallback, children }: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermissions();
  let hasAccess = true;
  if (permission) hasAccess = can(permission);
  else if (anyOf)  hasAccess = canAny(anyOf);
  else if (allOf)  hasAccess = canAll(allOf);
  if (hasAccess) return <>{children ?? null}</>;
  if (fallback !== undefined) return <>{fallback}</>;
  if (showDenied) return <AccessDenied />;
  return null;
}