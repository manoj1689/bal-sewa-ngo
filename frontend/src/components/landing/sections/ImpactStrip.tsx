import { BookOpen, CheckCircle2, Heart, Users } from 'lucide-react'

export default function ImpactStrip() {
  const stats = [
    { number: '2,000+', label: 'Children supported', icon: Users },
    { number: '500+', label: 'Active volunteers', icon: Heart },
    { number: '100+', label: 'Donation drives', icon: CheckCircle2 },
    { number: '15+', label: 'Years of service', icon: BookOpen },
  ]

  return (
    <section className="bg-[#ff4b42] px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex items-center gap-5">
              <Icon className="h-10 w-10" />
              <div>
                <p className="text-4xl font-extrabold">{stat.number}</p>
                <p className="font-semibold text-white/85">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
