import Link from 'next/link'

import { Button } from '@/components/ui/button'
import SectionHeading from '../SectionHeading'

export default function VolunteersSection() {
  const volunteers = [
    { name: 'Ravi Sharma', role: 'Education Volunteer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Anita Verma', role: 'Health Camp Lead', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
    { name: 'Manoj Kumar', role: 'Community Mentor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Priya Singh', role: 'Child Support Volunteer', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  ]

  return (
    <section className="bg-background px-5 py-24 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our Volunteers"
          title="Meet With Volunteers"
          description="A committed volunteer network helps children learn, play, feel heard, and stay connected to opportunity."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {volunteers.map((volunteer) => (
            <div key={volunteer.name} className="group overflow-hidden rounded bg-background">
              <img src={volunteer.image} alt={volunteer.name} className="h-88 w-full rounded object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="pt-5">
                <h3 className="text-xl font-extrabold text-foreground">{volunteer.name}</h3>
                <p className="text-muted-foreground">{volunteer.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/volunteers">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
