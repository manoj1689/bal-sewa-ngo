'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchCampaignDetail } from '@/redux/thunks/campaignThunks';
import { createDonation } from '@/redux/thunks/donationThunks';
import { useAuth } from '@/hooks/useAppHooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, Check } from 'lucide-react';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedCampaign, loading } = useAppSelector((state) => state.campaign);
  const { loading: donationLoading, successMessage, error } = useAppSelector(
    (state) => state.donation
  );
  const [mounted, setMounted] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCampaignDetail(params.id));
  }, [dispatch, params.id]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const result = await dispatch(
      createDonation({
        campaign_id: params.id,
        amount: parseFloat(donationAmount),
        payment_method: paymentMethod,
      })
    );

    if (result.payload) {
      setDonationAmount('');
      setShowDonationForm(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedCampaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const progress = (selectedCampaign.current_amount / selectedCampaign.target_amount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Image */}
          {selectedCampaign.image_url && (
            <div className="rounded-lg overflow-hidden mb-8 h-96 bg-muted">
              <img
                src={selectedCampaign.image_url}
                alt={selectedCampaign.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded inline-block mb-4">
                  {selectedCampaign.category}
                </span>
                <h1 className="text-4xl font-bold mb-2">{selectedCampaign.title}</h1>
                <p className="text-lg text-muted-foreground">{selectedCampaign.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Fundraising Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Raised</span>
                        <span className="font-semibold">
                          ₹{selectedCampaign.current_amount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Goal: ₹{selectedCampaign.target_amount.toLocaleString()}</span>
                        <span>{Math.round(progress)}% funded</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold capitalize">{selectedCampaign.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Goal Amount</p>
                      <p className="font-semibold">₹{selectedCampaign.target_amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                    <p className="text-sm">
                      {new Date(selectedCampaign.start_date).toLocaleDateString()} -{' '}
                      {new Date(selectedCampaign.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Donation Form */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-2xl">Help This Cause</CardTitle>
                  <CardDescription>Your donation makes a difference</CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" />
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  {showDonationForm ? (
                    <form onSubmit={handleDonate} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Donation Amount (₹)</label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          disabled={donationLoading}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          disabled={donationLoading}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="credit_card">Credit Card</option>
                          <option value="debit_card">Debit Card</option>
                          <option value="upi">UPI</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="wallet">Wallet</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Button type="submit" className="w-full" disabled={donationLoading || !donationAmount}>
                          {donationLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Donate Now'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowDonationForm(false)}
                          disabled={donationLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {[100, 500, 1000, 5000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setDonationAmount(amount.toString());
                            setShowDonationForm(true);
                          }}
                        >
                          Donate ₹{amount}
                        </Button>
                      ))}
                      <Button
                        className="w-full"
                        onClick={() => {
                          if (!isAuthenticated) {
                            router.push('/login');
                          } else {
                            setShowDonationForm(true);
                          }
                        }}
                      >
                        Custom Amount
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
