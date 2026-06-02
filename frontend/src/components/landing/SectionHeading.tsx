export default function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="mb-2 text-2xl font-extrabold italic text-[#ff4b42]">{eyebrow}</p>
      <h2 className={`text-4xl font-extrabold tracking-tight md:text-5xl ${light ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h2>
      <div className="mx-auto mt-2 h-3 w-48 rounded-[50%] border-b-4 border-[#ffb52e]" />
      {description && (
        <p className={`mx-auto mt-7 max-w-2xl text-lg leading-8 ${light ? 'text-white/85' : 'text-muted-foreground'}`}>
          {description}
        </p>
      )}
    </div>
  )
}
