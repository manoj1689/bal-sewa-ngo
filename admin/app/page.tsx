'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { getToken } from '@/lib/auth-storage';

export default function Home() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const authToken = token || getToken();
    if (authToken) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}
