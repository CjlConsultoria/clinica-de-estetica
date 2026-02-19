'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    router.push(isAuthenticated ? '/agenda' : '/login');
  }, [isAuthenticated, router]);

  return null;
}
