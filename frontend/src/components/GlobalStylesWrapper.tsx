'use client';
import React from 'react';
import { GlobalStyles } from '@/styles/GlobalStyles';

export function GlobalStylesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
}