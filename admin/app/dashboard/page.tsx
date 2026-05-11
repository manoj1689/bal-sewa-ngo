'use client';

import Link from 'next/link';
import { useAppSelector } from '@/hooks';
import { Calendar, Gift, Megaphone, Users } from '@/components/icons';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const userCount = useAppSelector((state) => state.users.items.length);

  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      icon: Users,
      color: 'bg-primary',
    },
    {
      title: 'Active Campaigns',
      value: 0,
      icon: Megaphone,
      color: 'bg-secondary',
    },
    {
      title: 'Total Donations',
      value: 0,
      icon: Gift,
      color: 'bg-accent',
    },
    {
      title: 'Upcoming Events',
      value: 0,
      icon: Calendar,
      color: 'bg-sidebar',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name || user?.email}</h1>
        <p className="text-gray-600 mt-2">Here&apos;s your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity yet</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link href="/dashboard/users" className="block text-primary hover:underline">
              Manage Users
            </Link>
            <Link href="/dashboard/donations" className="block text-primary hover:underline">
              View Donations
            </Link>
            <Link href="/dashboard/campaigns" className="block text-primary hover:underline">
              Manage Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
