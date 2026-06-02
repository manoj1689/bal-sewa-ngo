'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAppHooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchMyApplications, fetchMyVolunteerProfile } from '@/redux/thunks/volunteerThunks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, HandHeart, Loader2, XCircle } from 'lucide-react';

function StatusBadge({ status }: { status?: string }) {
  const normalized = status || 'not registered';
  const classes =
    normalized === 'approved'
      ? 'bg-green-100 text-green-700'
      : normalized === 'rejected'
        ? 'bg-red-100 text-red-700'
        : normalized === 'pending'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-muted text-muted-foreground';

  return <span className={`rounded px-3 py-1 text-sm font-medium capitalize ${classes}`}>{normalized}</span>;
}

function StatusIcon({ status }: { status?: string }) {
  if (status === 'approved') return <CheckCircle2 className="h-6 w-6 text-green-600" />;
  if (status === 'rejected') return <XCircle className="h-6 w-6 text-red-600" />;
  if (status === 'pending') return <Clock className="h-6 w-6 text-yellow-600" />;
  return <HandHeart className="h-6 w-6 text-primary" />;
}

export default function VolunteerPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const { volunteer, applications, loading } = useAppSelector((state) => state.volunteer);

  useEffect(() => {
    setMounted(true);
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(fetchMyVolunteerProfile());
    dispatch(fetchMyApplications());
  }, [dispatch, hydrated, isAuthenticated, router]);

  if (!mounted || !hydrated || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const pendingApplications = applications.filter((item) => item.status === 'pending').length;
  const approvedApplications = applications.filter((item) => item.status === 'approved').length;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Volunteer Status</h1>
          <p className="text-muted-foreground">Track your volunteer profile and applications.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <StatusBadge status={volunteer?.status} />
              <StatusIcon status={volunteer?.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{approvedApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingApplications}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {volunteer ? (
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <StatusBadge status={volunteer.status} />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Skills</p>
                    <p className="font-medium">{Array.isArray(volunteer.skills) ? volunteer.skills.join(', ') : volunteer.skills || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="font-medium">{volunteer.availability || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <HandHeart className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-60" />
                  <p className="mb-4 text-muted-foreground">You have not created a volunteer profile yet.</p>
                  <Link href="/become-volunteer">
                    <Button>Become a Volunteer</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Apply for events that match your availability.</p>
              <p>Keep your contact information updated from the profile page.</p>
              <Link href="/events">
                <Button className="mt-2 w-full">Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
