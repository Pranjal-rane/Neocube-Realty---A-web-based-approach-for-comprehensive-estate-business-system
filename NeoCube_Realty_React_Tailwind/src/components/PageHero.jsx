export default function PageHero({ eyebrow = 'NeoCube Realty', title, description }) {
  return (
    <section className="border-b border-stone-200 bg-cream py-12 md:py-16">
      <div className="container-page">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-wine-700">{eyebrow}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">{description}</p>}
      </div>
    </section>
  )
}
