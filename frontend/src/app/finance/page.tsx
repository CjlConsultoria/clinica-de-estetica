'use client';

import { usePermissions } from '@/components/ui/hooks/usePermissions';
import FinanceSuperAdmin from '@/components/finance-superadmin';
import FinanceEmpresa    from '@/components/finance-empresa';

export default function FinancePage() {
  const { isSuperAdmin } = usePermissions();
  if (isSuperAdmin) return <FinanceSuperAdmin />;
  return <FinanceEmpresa />;
}