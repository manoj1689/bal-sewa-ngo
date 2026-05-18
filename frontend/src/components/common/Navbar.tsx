'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAppHooks';
import { Heart, Menu, Search, UserRound, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/campaigns', label: 'Causes' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Portfolio' },
    { href: '/blogs', label: 'Blog' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[#1b1b1b] text-white shadow-sm">
      <div className="mx-auto flex h-[82px] max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-28">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center">
            <span className="absolute left-1 top-6 h-4 w-4 rounded-full bg-[#00b56f]" />
            <span className="absolute left-5 top-8 h-4 w-4 rounded-full bg-[#ffb52e]" />
            <span className="absolute left-6 top-1 h-4 w-4 rounded-full bg-[#ff4b42]" />
            <Heart className="relative z-10 h-8 w-8 text-white" strokeWidth={2.2} />
          </span>
          <span className="leading-none">
            <span className="block text-[26px] font-extrabold uppercase tracking-wide">Bal Sewa</span>
            <span className="block text-xs font-bold uppercase tracking-[0.08em] text-white/85">Help the Poor</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[17px] font-semibold transition-colors hover:text-[#ff4b42] ${
                isActive(item.href) ? 'text-[#ff4b42]' : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <Link
              href="/blogs"
              className={`text-[17px] font-semibold transition-colors hover:text-[#ff4b42] ${
                isActive('/blogs') ? 'text-[#ff4b42]' : 'text-white'
              }`}
            >
              Blog
            </Link>
            <div className="invisible absolute left-0 top-10 w-52 translate-y-2 bg-white py-1 text-[#111632] opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {['Blog', 'Blog Classic', 'Blog Slider', 'Blog Details'].map((label) => (
                <Link
                  key={label}
                  href="/blogs"
                  className="block border-b border-slate-100 px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-slate-50 hover:text-[#ff4b42]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden items-center gap-7 lg:flex">
          <button className="text-white transition-colors hover:text-[#ff4b42]" aria-label="Search">
            <Search className="h-7 w-7" strokeWidth={1.7} />
          </button>

          {isAuthenticated && user ? (
            <button
              onClick={handleLogout}
              className="text-white transition-colors hover:text-[#ff4b42]"
              aria-label="Logout"
              title="Logout"
            >
              <UserRound className="h-8 w-8" strokeWidth={1.6} />
            </button>
          ) : (
            <Link href="/login" className="text-white transition-colors hover:text-[#ff4b42]" aria-label="Login">
              <UserRound className="h-8 w-8" strokeWidth={1.6} />
            </Link>
          )}

          <Link
            href="/campaigns"
            className="rounded px-7 py-4 text-[15px] font-extrabold uppercase tracking-wide text-white transition-colors"
            style={{ backgroundColor: '#ff4b42' }}
          >
            Donate Now
          </Link>
        </div>

        <div className="flex items-center gap-7 lg:hidden">
          <button className="text-white" aria-label="Search">
            <Search className="h-8 w-8" strokeWidth={1.6} />
          </button>
          <button
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#1b1b1b] px-5 pb-6 lg:hidden">
          <nav className="mx-auto flex max-w-[1680px] flex-col py-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`border-b border-white/10 py-3 text-base font-semibold transition-colors hover:text-[#ff4b42] ${
                  isActive(item.href) ? 'text-[#ff4b42]' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto flex max-w-[1680px] flex-col gap-3">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded border border-white/20 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded border border-white/20 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
              >
                Login
              </Link>
            )}
            <Link
              href="/campaigns"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded bg-[#ff4b42] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white"
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
