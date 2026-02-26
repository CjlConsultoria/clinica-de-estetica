'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PaymentBlockedModal from '@/components/modals/paymentBlockedModal';
import SystemUnavailableModal from '@/components/modals/systemUnavailableModal';
import { usePaymentStatus } from '@/components/ui/hooks/usePaymentStatus';
import { usePermissions } from '@/components/ui/hooks/usePermissions';

interface PaymentGuardProps {
  children: React.ReactNode;
}

export default function PaymentGuard({ children }: PaymentGuardProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const { isSuperAdmin, isCompanyAdmin, isGerente } = usePermissions();
  const { isBlocked, companyName } = usePaymentStatus();

  if (isSuperAdmin) return <>{children}</>;

  if (!isBlocked) return <>{children}</>;

  const isOnFinancePage = pathname === '/finance' || pathname.startsWith('/finance/');
  if (isOnFinancePage) return <>{children}</>;

  const canSeePaymentInfo = isCompanyAdmin || isGerente;

  return (
    <>
      {children}

      {canSeePaymentInfo ? (
        <PaymentBlockedModal
          isOpen={true}
          companyName={companyName}
          onPayNow={() => {
            router.push('/finance');
          }}
        />
      ) : (
        <SystemUnavailableModal isOpen={true} />
      )}
    </>
  );
}