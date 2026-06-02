'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAppHooks';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCampaigns } from '@/redux/thunks/campaignThunks';
import { fetchUserDonations } from '@/redux/thunks/donationThunks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Megaphone } from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

export default function SupportedCampaignsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const { campaigns, loading: campaignsLoading } = useAppSelector((state) => state.campaign);
  const { donations, loading: donationsLoading } = useAppSelector((state) => state.donation);

  useEffect(() => {
    setMounted(true);
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(fetchCampaigns({ limit: 100 }));
    dispatch(fetchUserDonations());
  }, [dispatch, hydrated, isAuthenticated, router]);

  const supportedCampaigns = useMemo(() => {
    const donationTotals = donations.reduce<Record<string, number>>((acc, donation) => {
      if (!donation.campaign_id) return acc;
      acc[donation.campaign_id] = (acc[donation.campaign_id] || 0) + donation.amount;
      return acc;
    }, {});

    return campaigns
      .filter((campaign) => donationTotals[campaign.id])
      .map((campaign) => ({
        ...campaign,
        userDonationTotal: donationTotals[campaign.id],
      }));
  }, [campaigns, donations]);

  if (!mounted || !hydrated || campaignsLoading || donationsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const totalSupported = supportedCampaigns.reduce((sum, campaign) => sum + campaign.userDonationTotal, 0);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Supported Campaigns</h1>
          <p className="text-muted-foreground">Campaigns you have contributed to.</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{supportedCampaigns.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalSupported.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Donation Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{donations.length}</div>
            </CardContent>
          </Card>
        </div>

        {supportedCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Megaphone className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-60" />
              <p className="mb-4 text-muted-foreground">You have not supported any campaign yet.</p>
              <Link href="/campaigns">
                <Button>Browse Campaigns</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {supportedCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="aspect-[16/9] bg-muted">
                  {campaign.image_url ? (
                    <img
                      src={getMediaUrl(campaign.image_url)}
                      alt={campaign.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Megaphone className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <h2 className="mb-2 text-lg font-semibold">{campaign.title}</h2>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{campaign.description}</p>
                  <div className="mb-4 rounded-lg bg-muted p-3 text-sm">
                    <p className="text-muted-foreground">Your contribution</p>
                    <p className="text-xl font-bold">₹{campaign.userDonationTotal.toLocaleString()}</p>
                  </div>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="outline" className="w-full">View Campaign</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
