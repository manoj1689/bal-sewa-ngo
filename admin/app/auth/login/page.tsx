import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_28px_80px_rgba(30,27,75,0.10)]">
          <div className="grid min-h-[640px] md:min-h-[640px] lg:min-h-[720px] md:grid-cols-[2fr_3fr]">
            <div className="flex flex-col justify-between bg-primary/18 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-12">
              <div className="max-w-[78%] lg:max-w-[76%]">
                <div className="inline-flex items-center rounded-full bg-card/70 px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
                  NGO Admin Portal
                </div>
                <h1 className="mt-6 text-[clamp(1.9rem,3.4vw,3.8rem)] font-bold leading-[1.02] tracking-tight text-foreground">
                  Support Communities
                  <span className="mt-2 block text-primary">Manage Every Program</span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-foreground/72 sm:text-[0.95rem] lg:mt-5 lg:leading-7">
                  Sign in to manage donations, campaigns, volunteers, and daily NGO operations from one secure workspace.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-2">
                  <div className="relative h-12 w-12 rounded-full border-[9px] border-secondary border-r-transparent sm:h-14 sm:w-14 sm:border-[10px]" />
                  <div className="relative -ml-4 h-12 w-12 rounded-full border-[9px] border-primary border-l-transparent sm:-ml-5 sm:h-14 sm:w-14 sm:border-[10px]" />
                  <div className="-ml-2 h-3.5 w-3.5 rounded-full bg-accent sm:h-4 sm:w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold tracking-[0.08em] text-secondary sm:text-[1.25rem]">
                    NGO
                  </p>
                  <p className="text-xs tracking-[0.22em] text-foreground/80 sm:text-sm">
                    ADMIN PORTAL
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-16 xl:px-20">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
