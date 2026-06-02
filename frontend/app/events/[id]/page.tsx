'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckSquare,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAppHooks';
import { getMediaUrl } from '@/lib/media';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { applyForEventThunk, fetchEventDetail, fetchEvents } from '@/redux/thunks/eventThunks';

const fallbackImages = {
  hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  main: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=1200&q=80',
  cta: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
  upcomingOne: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=500&q=80',
  upcomingTwo: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=500&q=80',
};

const formControlClass =
  'h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#ff4b42] focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedEvent, events, loading } = useAppSelector((state) => state.event);
  const [mounted, setMounted] = useState(false);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchEventDetail(id));
    dispatch(fetchEvents({ limit: 2, status: 'upcoming' }));
  }, [dispatch, id]);

  const upcomingEvents = useMemo(
    () => events.filter((event) => event.id !== id).slice(0, 2),
    [events, id],
  );

  const handleApply = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      await dispatch(applyForEventThunk(id));
      setSuccess(true);
    } finally {
      setApplying(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
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

  if (!selectedEvent) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Event not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(selectedEvent.event_date);
  const dateLabel = eventDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeLabel = eventDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const registered = selectedEvent.attendees_count ?? selectedEvent.volunteers_registered ?? 0;
  const capacity = selectedEvent.max_attendees ?? selectedEvent.volunteers_needed ?? 0;
  const volunteersNeeded = capacity > 0 ? Math.max(capacity - registered, 0) : 1;
  const mainImage = getMediaUrl(selectedEvent.image_url) || fallbackImages.main;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={fallbackImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">Event Details</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">Home</Link>
            <span>//</span>
            <Link href="/events" className="hover:text-[#ff4b42]">Events</Link>
            <span>//</span>
            <span>Event Details</span>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article>
            <img
              src={mainImage}
              alt={selectedEvent.title}
              className="h-[430px] w-full rounded object-cover"
            />

            <div className="mt-8">
              <span className="mb-4 inline-flex rounded bg-[#ff4b42]/10 px-3 py-1 text-sm font-bold uppercase text-[#ff4b42]">
                {selectedEvent.status}
              </span>
              <h2 className="text-4xl font-extrabold text-foreground">{selectedEvent.title}</h2>
              <p className="mt-5 leading-8 text-muted-foreground">{selectedEvent.description}</p>
            </div>

            <div className="mt-10 space-y-6 leading-8 text-muted-foreground">
              <p>
                This event brings volunteers, donors, and community members together to support children through direct service, awareness, and care. Your participation helps create a steady support system around children and families.
              </p>
              <p>
                Join us for a meaningful day of service. Volunteers can help with coordination, child activities, distribution support, documentation, and community outreach.
              </p>
            </div>

            <section className="mt-10">
              <h3 className="text-2xl font-extrabold text-foreground">Pelhabita morbi tristique</h3>
              <p className="mt-4 leading-8 text-muted-foreground">
                Every volunteer role matters. Whether you can help for one hour or the full event, your presence adds care and confidence to the children we serve.
              </p>
              <div className="mt-7 grid gap-4 text-muted-foreground sm:grid-cols-2">
                {[
                  'Event coordination support',
                  'Food help for children',
                  'Community registration',
                  'Support homeless people',
                  'Volunteer guidance',
                  'Donation support',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckSquare className="h-4 w-4 text-[#ff4b42]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <h3 className="text-3xl font-extrabold text-foreground">Join With Us</h3>

              {success && (
                <div className="mt-5 flex items-center gap-2 rounded border border-green-300 bg-green-100 p-3 text-sm text-green-800">
                  <Check className="h-4 w-4" />
                  Successfully applied for this event.
                </div>
              )}

              {volunteersNeeded <= 0 && !success && (
                <div className="mt-5 flex items-center gap-2 rounded border border-yellow-300 bg-yellow-100 p-3 text-sm text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  This event is fully booked.
                </div>
              )}

              <form onSubmit={handleApply} className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Your Name
                  <Input className={formControlClass} placeholder="Your Name" defaultValue={user?.name || (user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '')} />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Your Email
                  <Input className={formControlClass} type="email" placeholder="Email Address" defaultValue={user?.email || ''} />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Phone Number
                  <Input className={formControlClass} placeholder="Phone Number" defaultValue={user?.phone || ''} />
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground">
                  Subject
                  <select className={formControlClass}>
                    <option>Select One</option>
                    <option>Volunteer Registration</option>
                    <option>Donation Support</option>
                    <option>Event Partnership</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-muted-foreground sm:col-span-2">
                  Message
                  <textarea
                    className="min-h-36 w-full rounded border border-border bg-[#fff1ef] px-5 py-5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#ff4b42] focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card"
                    placeholder="Write Your Messages"
                  />
                </label>
                <Button className="w-fit" type="submit" disabled={applying || volunteersNeeded <= 0 || success}>
                  {applying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    'Send Us A Message'
                  )}
                </Button>
              </form>
            </section>
          </article>

          <aside className="space-y-10">
            <div className="rounded border border-border bg-card p-8">
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-2xl font-extrabold text-foreground">Event Info</h3>
              <div className="mt-8 space-y-7">
                <div className="flex gap-4">
                  <CalendarDays className="mt-1 h-6 w-6 text-[#ff4b42]" />
                  <div>
                    <p className="font-extrabold text-foreground">Event Date & Time</p>
                    <p className="mt-1 text-sm text-muted-foreground">{dateLabel} {timeLabel}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-6 w-6 text-[#ff4b42]" />
                  <div>
                    <p className="font-extrabold text-foreground">Event Venue</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-1 h-6 w-6 text-[#ff4b42]" />
                  <div>
                    <p className="font-extrabold text-foreground">Contact Number</p>
                    <p className="mt-1 text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 h-6 w-6 text-[#ff4b42]" />
                  <div>
                    <p className="font-extrabold text-foreground">Volunteers Needed</p>
                    <p className="mt-1 text-sm text-muted-foreground">{volunteersNeeded} spots remaining</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-2xl font-extrabold text-foreground">Upcoming Event</h3>
              <div className="mt-6 space-y-4">
                {(upcomingEvents.length ? upcomingEvents : [selectedEvent]).map((event, index) => {
                  const upcomingDate = new Date(event.event_date);
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex gap-4 rounded border border-border bg-card p-3 transition hover:border-[#ff4b42]/40"
                    >
                      <img
                        src={getMediaUrl(event.image_url) || (index === 0 ? fallbackImages.upcomingOne : fallbackImages.upcomingTwo)}
                        alt={event.title}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-extrabold text-foreground">{event.title}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#ff4b42]" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-[#ff4b42]" />
                            {upcomingDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-[#ff4b42] pl-4 text-2xl font-extrabold text-foreground">Event Location</h3>
              <div className="mt-6 overflow-hidden rounded border border-border">
                <iframe
                  title="Event location map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent.location)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                  className="h-48 w-full"
                  loading="lazy"
                />
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

            <div className="rounded border border-border bg-[#fff1ef] p-6 dark:bg-card">
              <div className="flex items-center gap-3 text-foreground">
                <Mail className="h-5 w-5 text-[#ff4b42]" />
                <p className="font-extrabold">Need help?</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                For event questions, email info@balsewa.org or call us before registering.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
