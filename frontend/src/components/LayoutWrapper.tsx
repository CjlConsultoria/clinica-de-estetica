'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <>
      {!isLogin && <Navbar />}
      <div
        style={{
          marginLeft: isLogin ? '0' : '72px',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </>
  );
}