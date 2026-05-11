'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser } from '@/store/authSlice';
import { LoginRequest } from '@/types';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    const result = await dispatch(loginUser({ email, password } as LoginRequest));
    
    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard');
    } else {
      setFormError(error || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-[0_20px_60px_rgba(124,45,18,0.12)] sm:p-10">
        <div className="mb-8 hidden lg:block">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/80">
            Secure Access
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground">Admin Login</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Use your admin credentials to access the NGO dashboard and continue your work.
          </p>
        </div>

        <div className="mb-8 text-center lg:hidden">
          <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-3 font-medium shadow-lg shadow-primary/20 hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
