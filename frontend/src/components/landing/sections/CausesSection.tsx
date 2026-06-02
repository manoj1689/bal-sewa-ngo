import Link from 'next/link'
import { Target, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SectionHeading from '../SectionHeading'
import { landingImages } from '../landing-data'

export default function CausesSection() {
  const causes = [
    {
      title: 'Clean Water For Children',
      image: landingImages.water,
      progress: 80,
      color: '#ff4b42',
      button: 'default' as const,
      description: 'Help provide safe drinking water and hygiene support for children in underserved communities.',
    },
    {
      title: 'Education For Every Child',
      image: landingImages.school,
      progress: 50,
      color: '#18bd72',
      button: 'secondary' as const,
      description: 'Support books, school supplies, tutoring, and learning spaces for children who need continuity.',
    },
    {
      title: 'Food And Family Support',
      image: landingImages.family,
      progress: 70,
      color: '#ffb52e',
      button: 'default' as const,
      description: 'Fund nutrition kits, emergency essentials, and family support for vulnerable children.',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#1b1b1b] px-5 py-24 sm:px-8 lg:px-10">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/5" />
      <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-white/5" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Our causes"
          title="Our Latest Causes"
          description="Choose a cause and help us turn small, steady gifts into visible change for children."
          light
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {causes.map((cause) => (
            <Card key={cause.title} className="overflow-hidden rounded border-border bg-card p-0">
              <div className="relative h-64 overflow-hidden">
                <img src={cause.image} alt={cause.title} className="h-full w-full object-cover" />
                <div className="absolute bottom-0 left-0 h-2" style={{ width: `${cause.progress}%`, backgroundColor: cause.color }} />
                <span
                  className="absolute bottom-4 right-16 rounded px-2 py-1 text-sm font-extrabold text-white"
                  style={{ backgroundColor: cause.color }}
                >
                  {cause.progress}%
                </span>
              </div>
              <CardContent className="space-y-6 p-8">
                <h3 className="text-3xl font-extrabold text-foreground">{cause.title}</h3>
                <p className="leading-7 text-muted-foreground">{cause.description}</p>
                <div className="grid gap-4 text-sm font-bold text-muted-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: cause.color }} />
                    Raised: Rs. 23,785
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" style={{ color: cause.color }} />
                    Goal: Rs. 87,563
                  </div>
                </div>
                <Button asChild variant={cause.button} className={cause.color === '#ffb52e' ? 'bg-[#ffb52e] hover:bg-[#f0a828]' : ''}>
                  <Link href="/campaigns">Donation Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
