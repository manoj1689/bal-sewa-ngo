import LoginForm from '@/components/features/auth/LoginForm';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In | Bal Sewa Ashram',
  description: 'Sign in to your Bal Sewa Ashram account',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[#ff4b42] hover:text-[#ff4b42] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bal Sewa Ashram</h1>
          <p className="text-muted-foreground mt-2">Making a difference, one child at a time</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
