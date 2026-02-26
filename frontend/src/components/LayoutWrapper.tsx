'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import styled from 'styled-components';

const PageContent = styled.div<{ $isLogin: boolean }>`
  margin-left: ${({ $isLogin }) => ($isLogin ? '0' : '64px')};
  min-height: 100vh;
  transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <>
      {!isLogin && <Navbar />}
      <PageContent $isLogin={isLogin}>
        {children}
      </PageContent>
    </>
  );
}