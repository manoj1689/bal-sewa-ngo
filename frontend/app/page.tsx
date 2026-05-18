'use client';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Users, BookOpen, Camera, Zap, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Making a Difference,<br />One Child at a Time
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join Bal Sewa Ashram in our mission to provide education, healthcare, and hope to underprivileged children.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns">
              <Button size="lg" className="gap-2">
                <Heart className="w-5 h-5" />
                Donate Now
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline">
                Volunteer With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How We Help</h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive approach to child welfare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Education',
                description: 'Quality education for underprivileged children to build a better future.',
              },
              {
                icon: Heart,
                title: 'Healthcare',
                description: 'Access to medical care and health programs for children in need.',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Building strong communities through support and empowerment programs.',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="border-primary/20">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-primary mb-4" />
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Real numbers, real change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '2000+', label: 'Children Helped' },
              { number: '500+', label: 'Active Volunteers' },
              { number: '100+', label: 'Donations Received' },
              { number: '15+', label: 'Years of Service' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Be Part of the Change</h2>
          <p className="text-lg mb-8 opacity-90">
            Whether you donate, volunteer, or share our mission, every contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns">
              <Button size="lg" variant="secondary">
                View Campaigns
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Join Us Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
