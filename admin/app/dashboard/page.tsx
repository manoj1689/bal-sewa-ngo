'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Calendar, Gift, Loader, Megaphone, Users } from '@/components/icons';
import { useAppSelector } from '@/hooks';
import apiClient from '@/lib/api-client';
import type { Donation, User as AuthUser, Volunteer } from '@/types';

type DashboardStatsResponse = {
  donations: {
    total_donations: number;
    total_amount: number;
    average_amount: number;
    monthly_donations: number;
    monthly_amount: number;
    latest_donation_date?: string | null;
  };
  total_users: number;
  total_volunteers: number;
  total_campaigns: number;
  active_campaigns: number;
  total_blogs: number;
  upcoming_events: number;
};

type ContactMessage = {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
};

type DonationTrendPoint = {
  label: string;
  amount: number;
  count: number;
};

type DonationStatusPoint = {
  status: string;
  count: number;
  amount: number;
};

type TopCampaignPoint = {
  id: string;
  title: string;
  raised_amount: number;
  goal_amount: number;
};

type DashboardActivity =
  | { id: string; label: string; meta: string; createdAt: string; kind: 'donation' }
  | { id: string; label: string; meta: string; createdAt: string; kind: 'volunteer' }
  | { id: string; label: string; meta: string; createdAt: string; kind: 'contact' };

const PIE_COLORS = ['#a855f7', '#60a5fa', '#34d399', '#f59e0b'];

function formatActivityDate(date: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function formatCompactAmount(value: number) {
  try {
    return new Intl.NumberFormat('en-IN', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

function formatCurrencyValue(value: number) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `INR ${value}`;
  }
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user) as AuthUser | null;

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [recentVolunteers, setRecentVolunteers] = useState<Volunteer[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [donationTrend, setDonationTrend] = useState<DonationTrendPoint[]>([]);
  const [donationStatusData, setDonationStatusData] = useState<DonationStatusPoint[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<TopCampaignPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [
          statsResponse,
          donationsResponse,
          volunteersResponse,
          messagesResponse,
          trendResponse,
          statusResponse,
          campaignsResponse,
        ] = await Promise.all([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/dashboard/recent-donations'),
          apiClient.get('/dashboard/recent-volunteers'),
          apiClient.get('/dashboard/recent-contact-messages'),
          apiClient.get('/dashboard/charts/donations'),
          apiClient.get('/dashboard/charts/donation-status'),
          apiClient.get('/dashboard/charts/top-campaigns'),
        ]);

        if (!mounted) {
          return;
        }

        setStats(statsResponse.data.data || null);
        setRecentDonations(donationsResponse.data.data || []);
        setRecentVolunteers(volunteersResponse.data.data || []);
        setRecentMessages(messagesResponse.data.data || []);
        setDonationTrend(trendResponse.data.data || []);
        setDonationStatusData(statusResponse.data.data || []);
        setTopCampaigns(campaignsResponse.data.data || []);
      } catch (err: any) {
        if (!mounted) {
          return;
        }
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const activityItems = useMemo<DashboardActivity[]>(() => {
    const donations: DashboardActivity[] = recentDonations.map((donation) => ({
      id: donation.id,
      label: `${donation.donor_name} donated ${donation.currency} ${donation.amount}`,
      meta: donation.status,
      createdAt: donation.donation_date,
      kind: 'donation',
    }));

    const volunteers: DashboardActivity[] = recentVolunteers.map((volunteer) => ({
      id: volunteer.id,
      label: `${volunteer.first_name} ${volunteer.last_name} registered as a volunteer`,
      meta: volunteer.status,
      createdAt: volunteer.createdAt,
      kind: 'volunteer',
    }));

    const messages: DashboardActivity[] = recentMessages.map((message) => ({
      id: message.id,
      label: `${message.name} sent a contact message`,
      meta: message.subject,
      createdAt: message.createdAt,
      kind: 'contact',
    }));

    return [...donations, ...volunteers, ...messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [recentDonations, recentVolunteers, recentMessages]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: 'bg-primary',
    },
    {
      title: 'Active Campaigns',
      value: stats?.active_campaigns ?? 0,
      icon: Megaphone,
      color: 'bg-secondary',
    },
    {
      title: 'Total Donations',
      value: stats?.donations.total_donations ?? 0,
      icon: Gift,
      color: 'bg-accent',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcoming_events ?? 0,
      icon: Calendar,
      color: 'bg-sidebar',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name || user?.email}</h1>
        <p className="mt-2 text-muted-foreground">Here&apos;s your dashboard overview</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {loading ? <Loader size={28} className="animate-spin" /> : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3 text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Donation Trend</h2>
            <p className="text-sm text-muted-foreground">Completed donations over the last 6 months</p>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader size={20} className="animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="label" stroke="#a1a1aa" tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" tickLine={false} axisLine={false} tickFormatter={formatCompactAmount} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrencyValue(value), 'Amount']}
                    contentStyle={{
                      backgroundColor: '#241b47',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Donation Status</h2>
            <p className="text-sm text-muted-foreground">Breakdown by current donation status</p>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader size={20} className="animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {donationStatusData.map((entry, index) => (
                      <Cell key={entry.status} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, _name, props) => [
                      `${value} donations`,
                      props.payload?.status || 'Status',
                    ]}
                    contentStyle={{
                      backgroundColor: '#241b47',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground">Top Campaigns</h2>
            <p className="text-sm text-muted-foreground">Top 5 campaigns by raised amount</p>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader size={20} className="animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCampaigns} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis type="number" stroke="#a1a1aa" tickLine={false} axisLine={false} tickFormatter={formatCompactAmount} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={110}
                    stroke="#a1a1aa"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) => (value.length > 14 ? `${value.slice(0, 14)}...` : value)}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrencyValue(value), name === 'raised_amount' ? 'Raised' : 'Goal']}
                    contentStyle={{
                      backgroundColor: '#241b47',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="goal_amount" fill="#43306f" radius={[0, 8, 8, 0]} name="Goal" />
                  <Bar dataKey="raised_amount" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Raised" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-foreground">Recent Activity</h2>
          {loading ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader size={18} className="animate-spin" />
              <span>Loading recent activity...</span>
            </div>
          ) : activityItems.length === 0 ? (
            <p className="text-muted-foreground">No recent activity yet</p>
          ) : (
            <div className="space-y-3">
              {activityItems.map((activity) => (
                <div key={`${activity.kind}-${activity.id}`} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <p className="text-sm font-medium text-foreground">{activity.label}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{activity.meta}</span>
                    <span>{formatActivityDate(activity.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-foreground">Quick Links</h2>
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
  );
}
