'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAppHooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchMyApplications } from '@/redux/thunks/volunteerThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const { applications, loading } = useAppSelector((state) => state.volunteer);

  useEffect(() => {
    setMounted(true);
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    dispatch(fetchMyApplications());
  }, [dispatch, hydrated, isAuthenticated, router]);

  if (!mounted || !hydrated || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const approvedApps = applications.filter((a) => a.status === 'approved');
  const pendingApps = applications.filter((a) => a.status === 'pending');
  const rejectedApps = applications.filter((a) => a.status === 'rejected');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Event Applications</h1>
          <p className="text-muted-foreground">Track your volunteer event registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedApps.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Confirmed registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingApps.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground mt-2">All applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center pb-8">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">You haven&apos;t applied to any events yet.</p>
              <Link href="/events">
                <Button>Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getStatusIcon(app.status)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Event Application</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Applied on{' '}
                          {new Date(app.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded capitalize ${
                            app.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <Link href={`/events/${app.event_id}`}>
                        <Button variant="outline" size="sm">
                          View Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
