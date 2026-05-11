import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_28px_80px_rgba(30,27,75,0.10)]">
          <div className="grid min-h-[720px] lg:grid-cols-[320px_1fr]">
            <div className="flex flex-col justify-between bg-primary/20 px-7 py-10 sm:px-9 lg:px-7">
              <div className="max-w-[220px]">
                <h1 className="text-4xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-5xl">
                  <span className="block">Create,</span>
                  <span className="block">Manage</span>
                  <span className="block">&amp; Grow</span>
                  <span className="mt-2 block text-primary">Your Impact</span>
                </h1>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="relative h-14 w-14 rounded-full border-[10px] border-secondary border-r-transparent" />
                  <div className="relative -ml-5 h-14 w-14 rounded-full border-[10px] border-primary border-l-transparent" />
                  <div className="-ml-2 h-4 w-4 rounded-full bg-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-[1.4rem] font-semibold tracking-[0.08em] text-secondary">
                    NGO
                  </p>
                  <p className="text-base tracking-[0.22em] text-foreground/80">
                    ADMIN PORTAL
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
