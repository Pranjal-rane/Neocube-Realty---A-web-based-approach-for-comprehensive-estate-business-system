import { ArrowRight, CalendarDays, FileCheck, ShieldCheck, Tag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertySearchBar from '../components/PropertySearchBar'
import PropertyCard from '../components/PropertyCard'
import { properties } from '../data/properties'

export default function Home({ favorites, toggleFavorite, compare, toggleCompare }) {
  const featured = properties.filter((p) => p.featured)

  return (
    <>
      <section className="relative min-h-[500px] overflow-hidden bg-[#fdf8f5]">
        <div className="absolute inset-0 bg-[url('/src/assets/property-showcase.png')] bg-cover bg-[65%_center] md:bg-[right_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf7] via-[#fffaf7e8] via-45% to-transparent" />
        <div className="container-page relative py-20 md:py-24">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-wide"><span className="h-5 w-1 bg-wine-700"/> Welcome to NeoCube Realty</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] md:text-7xl">Find Your<br/><span className="text-wine-700">Perfect</span> Space</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">Discover premium residential and commercial properties with trusted experts.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/properties" className="btn-primary">Explore Properties <ArrowRight size={17}/></Link>
              <Link to="/schedule-visit" className="btn-outline">Schedule a Visit <CalendarDays size={17}/></Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page relative -mt-16 z-10">
        <PropertySearchBar />
      </div>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div><h2 className="section-title">Featured <span className="text-wine-700">Properties</span></h2><p className="mt-2 text-sm text-gray-500">Handpicked premium properties for you</p></div>
            <Link to="/properties" className="hidden items-center gap-2 text-sm font-bold text-wine-700 sm:flex">View All Properties <ArrowRight size={16}/></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p)=><PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)} onFavorite={toggleFavorite} isCompared={compare.includes(p.id)} onCompare={toggleCompare}/>)}
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container-page rounded-2xl bg-gradient-to-r from-wine-50 to-[#fbf1ee] p-7 md:p-9">
          <div className="grid items-center gap-7 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
            <div><h2 className="font-display text-3xl font-bold">Why Choose<br/><span className="text-wine-700">NeoCube Realty?</span></h2></div>
            {[
              [ShieldCheck,'Verified Properties','100% verified and legally compliant'],
              [UserRound,'Expert Guidance','Professional consultants at every step'],
              [Tag,'Best Price Guarantee','Get the best deals and offers'],
              [FileCheck,'Complete Transparency','Transparent process with no hidden charges'],
            ].map(([Icon,title,text])=><div key={title}><div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-wine-100 text-wine-700"><Icon size={21}/></div><p className="font-bold text-sm">{title}</p><p className="mt-1 text-xs leading-5 text-gray-600">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page rounded-2xl bg-wine-700 p-8 text-white md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div><h2 className="font-display text-3xl font-bold md:text-4xl">Ready to find your dream property?</h2><p className="mt-2 text-sm text-white/80">Talk to our experts and take the next step.</p></div>
            <Link to="/contact" className="btn-outline border-white bg-white text-wine-700 hover:bg-wine-50">Talk to an Expert <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>
    </>
  )
}
