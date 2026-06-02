import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const heroImage = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80';

const contactItems = [
  {
    icon: MapPin,
    title: 'Visit Our Ashram',
    lines: ['Bal Sewa Ashram Sansthan', 'Ashram Address, City, India'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 98765 43210', '+91 91234 56780'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@balsewa.org', 'support@balsewa.org'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#2d2d32] dark:bg-background dark:text-foreground">
      <Navbar />

      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#161616] px-5 text-center text-white">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">Contact Us</h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-lg font-bold">
            <Link href="/" className="hover:text-[#ff4b42]">
              Home
            </Link>
            <span>//</span>
            <span>Contact Us</span>
          </div>
        </div>
      </section>

      <main className="flex-1 px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-2xl font-extrabold italic text-[#ff4b42]">Get In Touch</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">We Are Ready To Help</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Reach out for donations, volunteering, events, partnerships, or any support related to Bal Sewa Ashram.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded border border-border bg-card p-7">
                  <span className="grid h-14 w-14 place-items-center rounded bg-[#ff4b42] text-white">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold">{item.title}</h3>
                  <div className="mt-3 space-y-1 text-muted-foreground">
                    {item.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_460px]">
            <section className="rounded bg-[#fff1ef] p-6 sm:p-8 dark:bg-[#2a1d1b]">
              <p className="text-xl font-extrabold italic text-[#ff4b42]">Send Message</p>
              <h3 className="mt-2 text-3xl font-extrabold">Tell Us How We Can Help</h3>

              <form className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-muted-foreground">
                  Your Name
                  <Input className="h-14 border-0 bg-white dark:bg-background" placeholder="Your Name" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-muted-foreground">
                  Your Email
                  <Input className="h-14 border-0 bg-white dark:bg-background" type="email" placeholder="Email Address" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-muted-foreground">
                  Phone Number
                  <Input className="h-14 border-0 bg-white dark:bg-background" placeholder="Phone Number" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-muted-foreground">
                  Subject
                  <Input className="h-14 border-0 bg-white dark:bg-background" placeholder="Subject" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-muted-foreground sm:col-span-2">
                  Message
                  <Textarea className="min-h-40 resize-none border-0 bg-white dark:bg-background" placeholder="Write Your Message" />
                </label>
                <div className="sm:col-span-2">
                  <Button type="button">Send Us A Message</Button>
                </div>
              </form>
            </section>

            <aside className="space-y-6">
              <div className="rounded border border-border bg-card p-7">
                <h3 className="border-l-4 border-[#ff4b42] pl-4 text-2xl font-extrabold">Contact Information</h3>
                <div className="mt-7 space-y-5">
                  {contactItems.slice(0, 3).map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="flex gap-4">
                        <Icon className="mt-1 h-6 w-6 flex-shrink-0 text-[#ff4b42]" />
                        <div>
                          <p className="font-extrabold">{item.title}</p>
                          {item.lines.map((line) => (
                            <p key={line} className="text-sm text-muted-foreground">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="overflow-hidden rounded border border-border bg-card">
                <iframe
                  title="Bal Sewa Ashram location"
                  src="https://www.google.com/maps?q=New%20Delhi%2C%20India&output=embed"
                  className="h-[340px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
