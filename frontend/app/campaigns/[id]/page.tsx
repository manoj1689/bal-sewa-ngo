'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  CircleDollarSign,
  HeartHandshake,
  Loader2,
  Search,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAppHooks';
import { getMediaUrl } from '@/lib/media';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCampaignDetail, fetchCampaigns } from '@/redux/thunks/campaignThunks';
import { createDonation } from '@/redux/thunks/donationThunks';

const fallbackImages = {
  hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  main: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80',
  family: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80',
  hope: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
  cta: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
};

const donationAmounts = [50, 100, 200, 300, 400];

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const { campaigns, selectedCampaign, loading } = useAppSelector((state) => state.campaign);
  const { loading: donationLoading, successMessage, error } = useAppSelector((state) => state.donation);
  const [mounted, setMounted] = useState(false);
  const [donationAmount, setDonationAmount] = useState('50');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [frequency, setFrequency] = useState('one_time');
  const [detailSettled, setDetailSettled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDetailSettled(false);
    dispatch(fetchCampaignDetail(id)).finally(() => setDetailSettled(true));
    dispatch(fetchCampaigns({ limit: 3 }));
  }, [dispatch, id]);

  const recentCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.id !== id).slice(0, 3),
    [campaigns, id],
  );

  const handleDonate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    await dispatch(
      createDonation({
        campaign_id: id,
        amount: Number(donationAmount),
        payment_method: paymentMethod,
      }),
    );
  };

  if (!mounted) return null;

  const campaign = selectedCampaign?.id === id
    ? selectedCampaign
    : campaigns.find((item) => item.id === id) || selectedCampaign;

  if (loading || (!detailSettled && !campaign)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-[#ff4b42]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const raisedAmount = campaign.current_amount ?? campaign.raised_amount ?? 0;
  const targetAmount = campaign.target_amount ?? campaign.goal_amount ?? 0;
  const progress = targetAmount > 0 ? Math.min(Math.round((raisedAmount / targetAmount) * 100), 100) : 0;
  const image = getMediaUrl(campaign.image_url) || fallbackImages.main;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={fallbackImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight">Cause Details</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">Home</Link>
            <span>//</span>
            <span>Cause Details</span>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article>
            <img src={image} alt={campaign.title} className="h-[430px] w-full rounded object-cover" />

            <div className="mt-8">
              <span className="mb-4 inline-flex rounded bg-[#ff4b42]/10 px-3 py-1 text-sm font-bold uppercase text-[#ff4b42]">
                {campaign.category || 'Campaign'}
              </span>
              <h2 className="text-4xl font-extrabold text-foreground">{campaign.title}</h2>
              <p className="mt-5 leading-8 text-muted-foreground">{campaign.description}</p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
                <span>Raised: Rs. {raisedAmount.toLocaleString()}</span>
                <span>Goal: Rs. {targetAmount.toLocaleString()}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-right text-sm font-bold text-[#ff4b42]">{progress}% funded</p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <img src={fallbackImages.family} alt="Children receiving support" className="h-52 w-full rounded object-cover" />
              <img src={fallbackImages.hope} alt="Volunteer helping children" className="h-52 w-full rounded object-cover" />
            </div>

            <div className="mt-10 space-y-6 leading-8 text-muted-foreground">
              <p>
                Your support helps provide school supplies, learning sessions, nutrition, and safe spaces for children who need consistent care. Each contribution is directed toward practical needs that strengthen a child&apos;s daily life.
              </p>
              <p>
                Bal Sewa works with volunteers and local teams to identify urgent needs, support families, and keep children connected to education and community care.
              </p>
            </div>

            <section className="mt-14">
              <h3 className="text-3xl font-extrabold text-foreground">Why Donate for Child Education</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {[
                  { icon: HeartHandshake, title: 'Donate and Help', color: '#ff4b42' },
                  { icon: Users, title: 'With Big Strength', color: '#18bd72' },
                  { icon: CircleDollarSign, title: 'Full Inspiration', color: '#ffb52e' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded border border-border bg-card p-6">
                      <div className="mb-5 grid h-11 w-11 place-items-center rounded-full text-white" style={{ backgroundColor: item.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-lg font-extrabold text-foreground">{item.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Support children with the resources, encouragement, and care they need to keep moving forward.
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="donate" className="mt-14 rounded border border-border bg-[#fff1ef] p-6 sm:p-8 dark:bg-card">
              <h3 className="text-xl font-extrabold text-foreground">How Much Would You Like To Donate?</h3>

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
                  <Button type="submit" disabled={donationLoading || !donationAmount}>
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
          </article>

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
                {(recentCampaigns.length ? recentCampaigns : [campaign]).map((campaign) => {
                  const campaignRaised = campaign.current_amount ?? campaign.raised_amount ?? 0;
                  const campaignTarget = campaign.target_amount ?? campaign.goal_amount ?? 0;

                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.id}`}
                      className="flex gap-4 rounded border border-border bg-card p-3 transition hover:border-[#ff4b42]/40"
                    >
                      <img src={getMediaUrl(campaign.image_url) || fallbackImages.main} alt={campaign.title} className="h-20 w-20 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-extrabold text-foreground">{campaign.title}</p>
                        <p className="mt-2 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-[#ff4b42]" />
                          Raised: Rs. {campaignRaised.toLocaleString()}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                          <Target className="h-3 w-3 text-[#ff4b42]" />
                          Goal: Rs. {campaignTarget.toLocaleString()}
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
                {['Charity', 'Children', 'Community', 'Food', 'Clean Water', 'Education', 'Health', 'Volunteers'].map((tag) => (
                  <span key={tag} className="rounded border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded bg-[#161616] p-8 text-center text-white">
              <img src={fallbackImages.cta} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
              <div className="relative z-10">
                <p className="text-xl font-extrabold">We have provided support to thousands of children</p>
                <Button asChild className="mt-6">
                  <Link href="#donate">Donate Now</Link>
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
