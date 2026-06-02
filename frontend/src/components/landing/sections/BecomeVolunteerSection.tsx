import Link from 'next/link'
import { Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { landingImages } from '../landing-data'

export default function BecomeVolunteerSection() {
  return (
    <section className="bg-background px-5 py-24 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1fr]">
        <div className="relative min-h-[560px]">
          <img src={landingImages.volunteer} alt="Volunteers sorting donations" className="absolute left-10 top-0 h-[430px] w-[75%] rounded object-cover" />
          <button className="absolute left-0 top-40 grid h-28 w-28 place-items-center rounded bg-[#ff4b42] text-white" aria-label="Play volunteer video">
            <Play className="h-10 w-10 fill-current" />
          </button>
          <img src={landingImages.volunteerSmall} alt="Volunteer reading with children" className="absolute bottom-0 right-0 h-44 w-[45%] rounded border-4 border-background object-cover shadow-xl" />
        </div>

        <div>
          <p className="mb-2 text-2xl font-extrabold italic text-[#ff4b42]">Become Volunteer</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Become A Volunteer</h2>
          <div className="mt-2 h-3 w-56 rounded-[50%] border-b-4 border-[#ffb52e]" />
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            Share your time, skills, and care with children through education sessions, events, donation drives, and community programs.
          </p>

          <form className="mt-10 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Your Name
              <input className="h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" placeholder="Your Name" />
            </label>
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Your Email
              <input type="email" className="h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" placeholder="Email Address" />
            </label>
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Phone Number
              <input className="h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" placeholder="Phone Number" />
            </label>
            <label className="space-y-2 text-sm font-medium text-muted-foreground">
              Date Of Birth
              <input type="date" className="h-15 w-full rounded border border-border bg-[#fff1ef] px-5 text-base text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" />
            </label>
            <label className="space-y-2 text-sm font-medium text-muted-foreground sm:col-span-2">
              Message
              <textarea className="min-h-32 w-full rounded border border-border bg-[#fff1ef] px-5 py-5 text-base text-foreground outline-none focus:ring-2 focus:ring-[#ff4b42]/30 dark:bg-card" placeholder="Write Your Message" />
            </label>
            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row">
              <Button type="button" className="w-fit">Send Us A Message</Button>
              <Button asChild variant="outline" className="w-fit">
                <Link href="/become-volunteer">View Details</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
