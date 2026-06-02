'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchEvents } from '@/redux/thunks/eventThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Calendar, MapPin, Users } from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.event);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchEvents());
  }, [dispatch]);

  if (!mounted) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
            <p className="text-lg text-muted-foreground">
              Join us in making a difference. Volunteer at our events.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No events scheduled at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => {
                const registered = event.attendees_count ?? event.volunteers_registered ?? 0;
                const needed = event.max_attendees ?? event.volunteers_needed ?? 0;
                const remaining = needed > 0 ? Math.max(needed - registered, 0) : 0;
                const progress = needed > 0 ? Math.min((registered / needed) * 100, 100) : 0;
                const eventImage = getMediaUrl(event.image_url);

                return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition">
                  {eventImage && (
                    <div className="h-48 bg-muted overflow-hidden">
                      <img
                        src={eventImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                        {event.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{event.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          {needed > 0 ? `${registered} / ${needed} volunteers` : `${registered} registered`}
                        </span>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded">
                      <div className="text-xs text-muted-foreground">
                        {needed > 0 ? `Volunteers Needed: ${remaining}` : 'Open registration'}
                      </div>
                      <div className="w-full bg-background rounded h-2 mt-2">
                        <div
                          className="bg-primary h-full rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <Link href={`/events/${event.id}`} className="block">
                      <Button className="w-full">Learn More & Register</Button>
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
