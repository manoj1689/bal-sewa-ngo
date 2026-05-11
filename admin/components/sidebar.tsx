'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppSelector } from '@/hooks';
import {
  Calendar,
  File,
  FileText,
  Gift,
  Image,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  Users,
  Users2,
  X,
} from '@/components/icons';

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/donations', icon: Gift, label: 'Donations' },
  { href: '/dashboard/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/dashboard/volunteers', icon: Users2, label: 'Volunteers' },
  { href: '/dashboard/blogs', icon: FileText, label: 'Blogs' },
  { href: '/dashboard/events', icon: Calendar, label: 'Events' },
  { href: '/dashboard/gallery', icon: Image, label: 'Gallery' },
  { href: '/dashboard/documents', icon: File, label: 'Documents' },
  { href: '/dashboard/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/dashboard/contact', icon: Mail, label: 'Contact Messages' },
];

type SidebarProps = {
  desktopCollapsed: boolean;
  onDesktopToggle: () => void;
};

export function Sidebar({ desktopCollapsed, onDesktopToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground transform transition-all duration-300 ease-in-out z-30 ${
          desktopCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`flex items-center ${desktopCollapsed ? 'justify-center px-3 py-5 lg:py-6' : 'justify-between p-6'}`}>
          <div className={`${desktopCollapsed ? 'hidden' : 'block'}`}>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="mt-2 text-sm text-sidebar-foreground/70">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onDesktopToggle}
            className={`hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-foreground transition hover:bg-sidebar-primary/25 hover:text-sidebar-foreground ${
              desktopCollapsed ? '' : 'shrink-0'
            }`}
            title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {desktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className={`space-y-2 ${desktopCollapsed ? 'px-3 py-6' : 'px-4 py-8'}`}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              title={desktopCollapsed ? item.label : undefined}
              className={`flex items-center rounded-xl transition ${
                pathname === item.href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-primary/15 hover:text-sidebar-foreground'
              } ${
                desktopCollapsed
                  ? 'justify-center px-3 py-3'
                  : 'gap-3 px-4 py-2.5'
              }`}
            >
              <item.icon size={20} />
              <span className={desktopCollapsed ? 'hidden' : 'block'}>{item.label}</span>
            </Link>
          ))}
        </nav>

      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}
    </>
  );
}
