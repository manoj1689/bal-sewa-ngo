'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckSquare,
  Check,
  Gift,
  HandHeart,
  HeartHandshake,
  Loader2,
  Play,
  Quote,
  Star,
  Users,
} from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

const images = {
  hero: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80',
  volunteerMain: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
  volunteerSmall: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=700&q=80',
  benefitVideo: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
  testimonial: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
  gridOne: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=500&q=80',
  gridTwo: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=500&q=80',
  gridThree: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=500&q=80',
  gridFour: 'https://images.unsplash.com/photo-1489760176169-fd3d32805239?auto=format&fit=crop&w=500&q=80',
};

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  skills: '',
  availability: '',
  motivation: '',
};

const inputClass =
  'h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-[#ff4b42] focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card';

export default function BecomeVolunteerPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      await api.post('/volunteers', {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date_of_birth: formData.date_of_birth || undefined,
        skills: formData.skills || undefined,
        availability: formData.availability || undefined,
        motivation: formData.motivation || undefined,
      });
      setSuccess('Volunteer registration submitted successfully.');
      setFormData(initialForm);
    } catch (requestError: any) {
      setError(requestError.response?.data?.detail || requestError.response?.data?.message || 'Failed to submit volunteer registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={images.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">Become Volunteers</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">Home</Link>
            <span>//</span>
            <span>Become Volunteers</span>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { icon: HeartHandshake, title: 'Become A Volunteer', color: '#ff4b42' },
            { icon: Gift, title: 'Get Involved', color: '#18bd72' },
            { icon: HandHeart, title: 'Adopt A Child', color: '#ffb52e' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="relative overflow-hidden rounded p-10 text-center text-white" style={{ backgroundColor: item.color }}>
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative">
                  <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-white text-[#ff4b42]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-extrabold">{item.title}</h2>
                  <p className="mx-auto mt-4 max-w-64 text-sm leading-7 text-white/90">
                    Join hands with us to support learning, health, food, and hope for children.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-7 border-white bg-white text-[#ff4b42] hover:bg-white/90 hover:text-[#ff4b42]">
                    <Link href="#volunteer-form">Join Us Now</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="volunteer-form" className="bg-background px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1fr]">
          <div className="grid grid-cols-6 gap-4">
            <img src={images.gridOne} alt="Volunteers" className="col-span-2 mt-14 h-36 w-full rounded object-cover" />
            <img src={images.volunteerMain} alt="Volunteer group" className="col-span-4 h-72 w-full rounded object-cover" />
            <img src={images.gridTwo} alt="Volunteer support" className="col-span-3 h-32 w-full rounded object-cover" />
            <img src={images.gridThree} alt="Children" className="col-span-3 h-32 w-full rounded object-cover" />
            <img src={images.gridFour} alt="Children smiling" className="col-span-2 h-28 w-full rounded object-cover" />
            <img src={images.volunteerSmall} alt="Volunteer reading" className="col-span-4 h-28 w-full rounded object-cover" />
          </div>

          <div>
            <p className="mb-2 text-2xl font-extrabold italic text-[#ff4b42]">Our Volunteer</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Become A Volunteer</h2>
            <div className="mt-2 h-3 w-56 rounded-[50%] border-b-4 border-[#ffb52e]" />
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              Share your time, skills, and care with children through education sessions, events, donation drives, and community programs.
            </p>

            {success && (
              <div className="mt-8 flex items-center gap-2 rounded border border-green-300 bg-green-100 p-3 text-sm text-green-800">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {error && (
              <div className="mt-8 flex items-center gap-2 rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                First Name
                <input name="first_name" value={formData.first_name} onChange={handleChange} className={inputClass} placeholder="First Name" required />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Last Name
                <input name="last_name" value={formData.last_name} onChange={handleChange} className={inputClass} placeholder="Last Name" required />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Your Email
                <input name="email" value={formData.email} onChange={handleChange} type="email" className={inputClass} placeholder="Email Address" required />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Phone Number
                <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Phone Number" required minLength={10} />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Date Of Birth
                <input name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground">
                Skills
                <input name="skills" value={formData.skills} onChange={handleChange} className={inputClass} placeholder="Teaching, events, fundraising" />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground sm:col-span-2">
                Availability
                <input name="availability" value={formData.availability} onChange={handleChange} className={inputClass} placeholder="Weekends, evenings, monthly camps" />
              </label>
              <label className="space-y-2 text-sm font-medium text-muted-foreground sm:col-span-2">
                Motivation
                <textarea name="motivation" value={formData.motivation} onChange={handleChange} className="min-h-32 w-full rounded border border-border bg-[#fff1ef] px-5 py-5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-[#ff4b42] focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" placeholder="Why do you want to volunteer?" maxLength={500} />
              </label>
              <Button className="w-fit" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  'Send Us A Message'
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-2xl font-extrabold italic text-[#ff4b42]">Be Come Volunteer</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#2d2d32] md:text-5xl">Member Benefit</h2>
            <div className="mt-2 h-3 w-56 rounded-[50%] border-b-4 border-[#ffb52e]" />
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              Volunteers receive guidance, event experience, community exposure, and the joy of seeing their time create visible change.
            </p>
            <div className="mt-8 grid gap-4 text-muted-foreground sm:grid-cols-2">
              {[
                'Event coordination experience',
                'Food help for children',
                'Community leadership',
                'Support homeless people',
                'Volunteer certificate',
                'Donation drives',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckSquare className="h-4 w-4 text-[#ff4b42]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded">
            <img src={images.benefitVideo} alt="Volunteers packing donation kits" className="h-[380px] w-full object-cover" />
            <div className="absolute inset-0 bg-black/25" />
            <button className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ff4b42] text-white" aria-label="Play volunteer benefits video">
              <Play className="h-9 w-9 fill-current" />
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1b1b1b] px-5 py-24 text-center text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">Welcome To Save Life And Make A Positive Impact</h2>
          <div className="mx-auto mt-2 h-3 w-56 rounded-[50%] border-b-4 border-[#ffb52e]" />
          <p className="mx-auto mt-7 max-w-2xl leading-8 text-white/80">
            Only when the society comes together and contributes will we be able to make an impact.
          </p>
          <Button asChild className="mt-8">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-5xl items-center gap-14 md:grid-cols-[0.8fr_1fr]">
          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-[#ff4b42]/10" />
            <img src={images.testimonial} alt="Volunteer testimonial" className="relative mx-auto h-96 w-80 object-cover" />
          </div>
          <div>
            <Quote className="mb-6 h-14 w-14 text-[#ff4b42]" />
            <p className="text-2xl font-semibold italic leading-10 text-muted-foreground">
              Available, but the majority have suffered alteration. Volunteering here made me feel useful, connected, and close to real community change.
            </p>
            <div className="mt-6 flex gap-1 text-[#ffb52e]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-[#2d2d32]">Robart Jonson</h3>
            <p className="text-muted-foreground">Donor, Canada</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f3f3] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 text-center text-2xl font-extrabold text-muted-foreground sm:grid-cols-2 lg:grid-cols-5">
          {['Gava', 'Animal Charity', 'Art Focus', 'Charity', 'Human Charity'].map((partner) => (
            <div key={partner}>{partner}</div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
