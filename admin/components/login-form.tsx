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
    <div className="w-full max-w-sm mx-auto">
      <div className="w-full">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground">Sign-in</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {formError && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs tracking-[0.18em] text-muted-foreground mb-2 uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-foreground placeholder:text-muted-foreground/75 focus:outline-none focus:border-primary"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs tracking-[0.18em] text-muted-foreground mb-2 uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-foreground placeholder:text-muted-foreground/75 focus:outline-none focus:border-primary"
              disabled={loading}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Secure access for authorized NGO administrators.
          </p>
        </form>
      </div>
    </div>
  );
}
