'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAppHooks';
import { Button } from '@/components/ui/button';
import { ChevronDown, CircleUserRound, Heart, LayoutDashboard, LogOut, Menu, Search, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, hydrated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/campaigns', label: 'Causes' },
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/blogs', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
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

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((item) => (
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
        </nav>

        <div className="hidden items-center gap-4 xl:gap-5 lg:flex">
          <ThemeToggle className="text-white hover:bg-white/10 hover:text-[#ff4b42]" />

          <button className="text-white transition-colors hover:text-[#ff4b42]" aria-label="Search">
            <Search className="h-7 w-7" strokeWidth={1.7} />
          </button>

          {!hydrated ? (
            <span className="h-11 w-[112px]" aria-hidden="true" />
          ) : isAuthenticated && user ? (
            <div ref={profileMenuRef} className="relative">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="border-white/35 text-white hover:border-[#ff4b42]"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <UserRound className="h-4 w-4" />
                Profile
                <ChevronDown className={`h-4 w-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </Button>
              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-52 overflow-hidden rounded border border-white/10 bg-white py-2 text-[#111632] shadow-xl"
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors hover:bg-slate-50 hover:text-[#ff4b42]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-slate-50 hover:text-[#ff4b42]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-[#ff4b42] text-white hover:bg-white hover:text-[#ff4b42]"
            >
              <Link href="/login">
                <CircleUserRound className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-7 lg:hidden">
          <ThemeToggle className="text-white hover:bg-white/10 hover:text-[#ff4b42]" />

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
            {!hydrated ? null : isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded border border-white/20 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
                >
                  <LayoutDashboard className="mr-2 inline h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
                >
                  <LogOut className="mr-2 inline h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded bg-[#ff4b42] px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-[#ff4b42]"
              >
                <CircleUserRound className="mr-2 inline h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
