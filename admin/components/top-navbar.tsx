'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Search,
  LogOut,
  Settings,
  User as UserIcon,
  Moon,
  Sun,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logoutUser } from '@/store/authSlice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || 'Admin User';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function TopNavbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.email, user?.name]
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('admin-theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      return;
    }

    setTheme('light');
    document.documentElement.classList.remove('dark');
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/auth/login');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    window.localStorage.setItem('admin-theme', nextTheme);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-4 lg:gap-4 lg:px-8">
        <div className="min-w-0 flex-1 pl-12 lg:pl-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users, campaigns, donations, events..."
              className="h-10 rounded-2xl border-transparent bg-card pl-9 pr-4 text-sm shadow-sm hover:shadow-md focus-visible:border-transparent focus-visible:ring-ring/30"
            />
          </div>
        </div>

        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-10 gap-2 rounded-2xl border-transparent bg-card px-2.5 py-2 shadow-sm hover:bg-muted hover:shadow-md focus-visible:border-transparent focus-visible:ring-ring/30 lg:px-3"
                />
              }
            >
              <Avatar size="lg" className="bg-linear-to-br from-primary to-accent text-primary-foreground">
                <AvatarFallback className="bg-transparent font-bold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left xl:block">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.role || user?.email}</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={10}
              className="!w-64 min-w-0 rounded-2xl border-transparent bg-card p-2 ring-0 shadow-xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="rounded-xl bg-muted px-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="mt-1 text-xs font-normal text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 py-2 text-foreground hover:bg-muted hover:text-foreground">
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 text-foreground hover:bg-muted hover:text-foreground">
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl px-3 py-2 text-foreground hover:bg-muted hover:text-foreground"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun /> : <Moon />}
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
