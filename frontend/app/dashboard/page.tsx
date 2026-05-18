'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAppHooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchMyVolunteerProfile, fetchMyApplications } from '@/redux/thunks/volunteerThunks';
import { fetchUserDonations } from '@/redux/thunks/donationThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Heart, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const { volunteer, applications, loading: volunteerLoading } = useAppSelector(
    (state) => state.volunteer
  );
  const { donations, loading: donationLoading } = useAppSelector((state) => state.donation);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    dispatch(fetchMyVolunteerProfile());
    dispatch(fetchMyApplications());
    dispatch(fetchUserDonations());
  }, [dispatch, isAuthenticated, router]);

  if (!mounted || volunteerLoading || donationLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const approvedApplications = applications.filter((a) => a.status === 'approved').length;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            {volunteer?.status === 'approved'
              ? 'Thank you for volunteering with us!'
              : volunteer?.status === 'pending'
              ? 'Your volunteer application is being reviewed.'
              : 'Start your volunteer journey with us!'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalDonated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{donations.length} donation(s)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Registered</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedApplications}</div>
              <p className="text-xs text-muted-foreground">
                {applications.filter((a) => a.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volunteer Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {volunteer?.status || 'Not registered'}
              </div>
              <p className="text-xs text-muted-foreground">Keep making an impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your contribution history</CardDescription>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No donations yet. Start giving today!</p>
              ) : (
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">₹{donation.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Event Applications</CardTitle>
              <CardDescription>Your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No event registrations yet. Browse available events!
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between pb-4 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">Event Application</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded capitalize ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
