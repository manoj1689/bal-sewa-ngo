'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAppHooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchUserDonations } from '@/redux/thunks/donationThunks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DonationsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const { donations, loading } = useAppSelector((state) => state.donation);

  useEffect(() => {
    setMounted(true);
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    dispatch(fetchUserDonations());
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

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const completedDonations = donations.filter((d) => d.status === 'completed').length;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Donations</h1>
          <p className="text-muted-foreground">Track your contributions to our campaigns</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalDonated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{donations.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Number of donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedDonations}</div>
              <p className="text-xs text-muted-foreground mt-2">Successful transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>Complete list of your donations</CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven&apos;t made any donations yet.</p>
                <Link href="/campaigns">
                  <Button>Browse Campaigns</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="text-sm">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{donation.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {donation.payment_method.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-3 py-1 rounded capitalize font-medium ${
                              donation.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : donation.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {donation.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {donation.transaction_id || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
