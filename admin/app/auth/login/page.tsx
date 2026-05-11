import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-sidebar via-[#9a3412] to-primary" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.28),_transparent_28%)]" />
          <div className="relative flex w-full flex-col justify-between p-10 text-white xl:p-14">
            <div className="max-w-lg">
              <div className="inline-flex items-center rounded-full bg-white/14 px-4 py-1.5 text-sm font-medium backdrop-blur">
                NGO Admin Portal
              </div>
              <h1 className="mt-8 text-4xl font-bold leading-tight xl:text-5xl">
                Manage donations, campaigns, and outreach from one place.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/82">
                A warm, focused workspace for your NGO team to coordinate operations,
                review updates, and keep every program moving smoothly.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/72">Fundraising</p>
                <p className="mt-3 text-2xl font-semibold">Campaigns</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/72">Community</p>
                <p className="mt-3 text-2xl font-semibold">Volunteers</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-white/72">Impact</p>
                <p className="mt-3 text-2xl font-semibold">Donations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                NGO Admin Portal
              </div>
              <h1 className="mt-5 text-3xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Sign in to manage campaigns, donations, users, and operations in one
                secure dashboard.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
