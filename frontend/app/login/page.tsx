import LoginForm from '@/components/features/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Bal Sewa Ashram',
  description: 'Sign in to your Bal Sewa Ashram account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
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
