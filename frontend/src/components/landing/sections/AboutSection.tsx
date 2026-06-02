import { landingImages } from '../landing-data'

export default function AboutSection() {
  const points = [
    'Daily learning support',
    'Nutritious meals and essentials',
    'Healthcare awareness camps',
    'Safe spaces for children',
    'Volunteer mentorship',
    'Transparent community programs',
  ]

  return (
    <section className="bg-background px-5 py-24 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="mb-4 text-2xl font-extrabold italic text-[#ff4b42]">About us</p>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
            We make a different life for children in need
          </h2>
          <div className="mt-2 h-3 w-72 rounded-[50%] border-b-4 border-[#ffb52e]" />
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            Our work focuses on practical care: education, health, food, and emotional support. Every campaign is built around a real child welfare need and supported by donors, volunteers, and local teams.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point} className="flex items-center gap-3 text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-[#ff4b42]" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1b1b1b] text-white dark:bg-card dark:ring-1 dark:ring-border">
              BS
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground">Bal Sewa Ashram</p>
              <p className="text-muted-foreground">Care, education, and dignity for every child</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <img src={landingImages.childOne} alt="Child smiling" className="col-span-3 h-36 w-full rounded object-cover" />
          <img src={landingImages.childTwo} alt="Children together" className="col-span-3 h-36 w-full rounded object-cover" />
          <img src={landingImages.childThree} alt="Child portrait" className="col-span-2 h-44 w-full rounded object-cover" />
          <img src={landingImages.water} alt="Child receiving support" className="col-span-4 h-44 w-full rounded object-cover" />
          <img src={landingImages.childFour} alt="Child smiling outside" className="col-span-3 h-44 w-full rounded object-cover" />
          <img src={landingImages.family} alt="Family support" className="col-span-3 h-44 w-full rounded object-cover" />
        </div>
      </div>
    </section>
  )
}
