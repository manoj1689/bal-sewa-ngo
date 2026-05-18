'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCampaigns } from '@/redux/thunks/campaignThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Loader2, Heart } from 'lucide-react';

export default function CampaignsPage() {
  const dispatch = useAppDispatch();
  const { campaigns, loading } = useAppSelector((state) => state.campaign);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCampaigns());
  }, [dispatch]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Active Campaigns</h1>
            <p className="text-lg text-muted-foreground">
              Support our campaigns and make a direct impact on children&apos;s lives
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No campaigns available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const progress = (campaign.current_amount / campaign.target_amount) * 100;
                return (
                  <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition">
                    {campaign.image_url && (
                      <div className="h-48 bg-muted overflow-hidden">
                        <img
                          src={campaign.image_url}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">{campaign.title}</CardTitle>
                          <CardDescription>{campaign.category}</CardDescription>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {campaign.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{campaign.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raised</span>
                          <span className="font-semibold">
                            ₹{campaign.current_amount.toLocaleString()} / ₹{campaign.target_amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">
                          {Math.round(progress)}% funded
                        </p>
                      </div>

                      <Link href={`/campaigns/${campaign.id}`} className="block">
                        <Button className="w-full gap-2">
                          <Heart className="w-4 h-4" />
                          Donate Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
