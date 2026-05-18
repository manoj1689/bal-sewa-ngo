'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchEventDetail, applyForEventThunk } from '@/redux/thunks/eventThunks';
import { useAuth } from '@/hooks/useAppHooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check, Calendar, MapPin, Users, Clock } from 'lucide-react';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedEvent, loading } = useAppSelector((state) => state.event);
  const [mounted, setMounted] = useState(false);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchEventDetail(params.id));
  }, [dispatch, params.id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      await dispatch(applyForEventThunk(params.id));
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error applying for event:', error);
    } finally {
      setApplying(false);
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

  if (!selectedEvent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const volunteersNeeded = selectedEvent.volunteers_needed - selectedEvent.volunteers_registered;
  const volunteerPercentage = (selectedEvent.volunteers_registered / selectedEvent.volunteers_needed) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Image */}
          {selectedEvent.image_url && (
            <div className="rounded-lg overflow-hidden mb-8 h-96 bg-muted">
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded inline-block mb-4 capitalize">
                  {selectedEvent.status}
                </span>
                <h1 className="text-4xl font-bold mb-2">{selectedEvent.title}</h1>
                <p className="text-lg text-muted-foreground">{selectedEvent.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {new Date(selectedEvent.event_date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {new Date(selectedEvent.event_date).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Volunteer Registrations
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Registered</span>
                        <span className="font-semibold">
                          {selectedEvent.volunteers_registered} / {selectedEvent.volunteers_needed}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${volunteerPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {volunteersNeeded} volunteer{volunteersNeeded !== 1 ? 's' : ''} still needed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Card */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-2xl">Join This Event</CardTitle>
                  <CardDescription>Make a difference by volunteering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {success && (
                    <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" />
                      Successfully applied! Redirecting...
                    </div>
                  )}

                  {volunteersNeeded <= 0 && !success && (
                    <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      This event is fully booked
                    </div>
                  )}

                  <Button
                    onClick={handleApply}
                    disabled={applying || volunteersNeeded <= 0 || success}
                    className="w-full"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      'Register to Volunteer'
                    )}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => router.back()}>
                    Go Back
                  </Button>

                  <div className="pt-4 border-t space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Date & Time</p>
                      <p className="font-medium">
                        {new Date(selectedEvent.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Volunteers Needed</p>
                      <p className="font-medium">{volunteersNeeded}</p>
                    </div>
                  </div>
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
