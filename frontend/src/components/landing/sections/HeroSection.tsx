import Link from 'next/link'
import { Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { landingImages } from '../landing-data'

export default function HeroSection() {
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[#161616]">
      <img src={landingImages.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-10">
        <div className="max-w-3xl text-white">
          <p className="mb-4 text-2xl font-extrabold italic text-[#ff4b42]">Help the children</p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Give children the care, learning, and hope they deserve
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-white/88">
            Bal Sewa supports education, nutrition, healthcare, and volunteer-led programs for children who need steady hands beside them.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/campaigns">
                <Heart className="h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/events">Know More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
