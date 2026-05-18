import RegisterForm from '@/components/features/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Bal Sewa Ashram',
  description: 'Create your Bal Sewa Ashram account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bal Sewa Ashram</h1>
          <p className="text-muted-foreground mt-2">Join our mission to help children</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
