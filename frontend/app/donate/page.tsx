'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, Loader2, Search, Target, TrendingUp } from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAppHooks';
import { getMediaUrl } from '@/lib/media';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCampaigns } from '@/redux/thunks/campaignThunks';
import { createDonation } from '@/redux/thunks/donationThunks';

const fallbackImages = {
  hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  cause: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80',
  cta: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
};

const donationAmounts = [50, 100, 200, 300, 400];

export default function DonatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { campaigns, loading: campaignsLoading } = useAppSelector((state) => state.campaign);
  const { loading: donationLoading, successMessage, error } = useAppSelector((state) => state.donation);
  const [mounted, setMounted] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [donationAmount, setDonationAmount] = useState('50');
  const [frequency, setFrequency] = useState('one_time');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCampaigns({ limit: 3, status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCampaignId && campaigns.length > 0) {
      setSelectedCampaignId(campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  const recentCampaigns = useMemo(() => campaigns.slice(0, 3), [campaigns]);

  const handleDonate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!selectedCampaignId) {
      return;
    }

    await dispatch(
      createDonation({
        campaign_id: selectedCampaignId,
        amount: Number(donationAmount),
        payment_method: paymentMethod,
      }),
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={fallbackImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">Donate Now</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">Home</Link>
            <span>//</span>
            <span>Donate Now</span>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded border border-border bg-[#fff1ef] p-6 sm:p-8 dark:bg-card">
            <h2 className="text-xl font-extrabold text-foreground">How Much Would You Like To Donate?</h2>

            {successMessage && (
              <div className="mt-5 flex items-center gap-2 rounded border border-green-300 bg-green-100 p-3 text-sm text-green-800">
                <Check className="h-4 w-4" />
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleDonate} className="mt-6 space-y-7">
              <div className="flex flex-wrap gap-3">
                {donationAmounts.map((amount) => (
                  <button
                    type="button"
                    key={amount}
                    onClick={() => setDonationAmount(String(amount))}
                    className={`h-11 rounded px-5 text-sm font-extrabold ${
                      donationAmount === String(amount)
                        ? 'bg-[#ff4b42] text-white'
                        : 'border border-border bg-background text-foreground hover:bg-[#ff4b42]/10'
                    }`}
                  >
                    {amount}$
                  </button>
                ))}
                <Input
                  type="number"
                  min="1"
                  value={donationAmount}
                  onChange={(event) => setDonationAmount(event.target.value)}
                  className="h-11 w-44 border-border bg-background text-foreground"
                  placeholder="Other amount"
                />
              </div>

              <div>
                <p className="mb-3 font-extrabold text-foreground">I want like to make</p>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  {[
                    ['one_time', 'One Time'],
                    ['monthly', 'Monthly'],
                    ['yearly', 'Yearly'],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="frequency"
                        checked={frequency === value}
                        onChange={() => setFrequency(value)}
                        className="accent-[#ff4b42]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 font-extrabold text-foreground">Choose Cause</p>
                <select
                  value={selectedCampaignId}
                  onChange={(event) => setSelectedCampaignId(event.target.value)}
                  className="h-13 w-full rounded border border-border bg-background px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={campaignsLoading || campaigns.length === 0}
                  required
                >
                  {campaigns.length === 0 ? (
                    <option value="">No active causes available</option>
                  ) : (
                    campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <p className="mb-4 font-extrabold text-foreground">Personal Info</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input className="h-13 border-border bg-background text-foreground" placeholder="Your First Name" defaultValue={user?.first_name || ''} />
                  <Input className="h-13 border-border bg-background text-foreground" placeholder="Your Last Name" defaultValue={user?.last_name || ''} />
                  <Input className="h-13 border-border bg-background text-foreground sm:col-span-2" placeholder="Your Email Address" defaultValue={user?.email || ''} />
                </div>
              </div>

              <div>
                <p className="mb-3 font-extrabold text-foreground">Select Payment Method</p>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  {[
                    ['credit_card', 'Credit Card'],
                    ['wallet', 'PayPal'],
                    ['bank_transfer', 'Bank Transfer'],
                  ].map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        className="accent-[#ff4b42]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 font-extrabold text-foreground">Credit Card Info</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input className="h-13 border-border bg-background text-foreground" placeholder="Card Number" />
                  <Input className="h-13 border-border bg-background text-foreground" placeholder="CVC" />
                  <Input className="h-13 border-border bg-background text-foreground" placeholder="Cardholder Name" />
                  <Input className="h-13 border-border bg-background text-foreground" type="date" />
                </div>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-extrabold text-foreground">Total donation</p>
                  <p className="text-3xl font-extrabold text-[#ff4b42]">${donationAmount || 0}</p>
                </div>
                <Button type="submit" disabled={donationLoading || !donationAmount || !selectedCampaignId}>
                  {donationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Donation Now'
                  )}
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-10">
            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-lg font-extrabold text-foreground">Search Causes</h3>
              <div className="mt-6 flex">
                <Input className="h-13 rounded-r-none border-border bg-card text-foreground" placeholder="Search key word" />
                <button className="grid h-13 w-14 place-items-center rounded-r bg-[#ff4b42] text-white" aria-label="Search causes">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-lg font-extrabold text-foreground">Recent Causes</h3>
              <div className="mt-6 space-y-4">
                {recentCampaigns.map((campaign) => {
                  const raisedAmount = campaign.current_amount ?? campaign.raised_amount ?? 0;
                  const targetAmount = campaign.target_amount ?? campaign.goal_amount ?? 0;

                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.id}`}
                      className="flex gap-4 rounded border border-border bg-card p-3 transition hover:border-[#ff4b42]/40"
                    >
                      <img src={getMediaUrl(campaign.image_url) || fallbackImages.cause} alt={campaign.title} className="h-20 w-20 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-foreground">{campaign.title}</p>
                        <p className="mt-2 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-[#ff4b42]" />
                          Raised: Rs. {raisedAmount.toLocaleString()}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <Target className="h-3 w-3 text-[#ff4b42]" />
                          Goal: Rs. {targetAmount.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-lg font-extrabold text-foreground">Tags</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Charity', 'Children', 'Community', 'Food', 'Clean Water', 'Education', 'Health', 'Volunteers', 'Homeless child'].map((tag) => (
                  <span key={tag} className="rounded border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded bg-[#161616] p-8 text-center text-white">
              <img src={fallbackImages.cta} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="relative z-10">
                <p className="text-xl font-extrabold">We have provided financial help to 5 million people</p>
                <Button asChild className="mt-6">
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
