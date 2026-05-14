'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopNavbar } from '@/components/top-navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        desktopCollapsed={desktopCollapsed}
        onDesktopToggle={() => setDesktopCollapsed((value) => !value)}
      />
      <main
        className={`flex-1 ml-0 overflow-auto transition-[margin] duration-300 ${
          desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <TopNavbar />
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
