import { useEffect, useMemo, useState } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PropertyCard from '../components/PropertyCard'
import { propertyTypes } from '../data/properties'

export default function Properties({ favorites, toggleFavorite, compare, toggleCompare }) {
  const [params] = useSearchParams()
  const [properties, setProperties] = useState([])

  const [q,setQ] = useState(params.get('q') || '')
  const [type,setType] = useState(params.get('type') || '')
  const [bhk,setBhk] = useState(params.get('bhk') || '')
  const [budget,setBudget] = useState(params.get('budget') || '')

  useEffect(() => {
  fetch('http://localhost:8080/api/properties')
    .then(response => response.json())
    .then(data => {
      console.log("Backend properties:", data)
    const mappedProperties = data.map(p => ({
      
    id: p.propertyId,
    name: p.propertyName,
    location: p.location,
    type: p.propertyType,
    bhk: p.bhk,
    bathrooms: p.bathrooms,
    price: Number(p.price),
    area: Number(p.areaSqft),
    description: p.description,
    image: p.imagePath,
    status: p.status,
    featured: p.featured
  }))

  setProperties(mappedProperties)
  console.log("Mapped properties:", mappedProperties)
})
    .catch(error => {
      console.error('Error fetching properties:', error)
    })
}, [])

  const filtered = useMemo(() => properties.filter((p) => {
    const text = `${p.name} ${p.location}`.toLowerCase()
    return (!q || text.includes(q.toLowerCase()))
      && (!type || p.type === type)
      && (!bhk || String(p.bhk) === bhk)
      && (!budget || p.price <= Number(budget))
  }), [properties, q, type, bhk, budget])

  console.log("Filters:", { q, type, bhk, budget })
  console.log("Filtered properties:", filtered)

  const reset = () => { setQ(''); setType(''); setBhk(''); setBudget('') }

  return (
    <>
      <PageHero title="Find Your Perfect Property" description="Browse verified residential and commercial properties with powerful search and filters." />
      <section className="py-12 md:py-16">
        <div className="container-page grid gap-7 lg:grid-cols-[260px_1fr]">
          <aside className="card h-max p-5 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between"><h2 className="font-bold">Search & Filter</h2><SlidersHorizontal size={18} className="text-wine-700"/></div>
            <label className="field-label">Location / Keyword</label>
            <input className="field-control" value={q} onChange={e=>setQ(e.target.value)} placeholder="Amravati, villa..." />
            <label className="field-label mt-4">Property Type</label>
            <select className="field-control" value={type} onChange={e=>setType(e.target.value)}><option value="">All Types</option>{propertyTypes.map(t=><option key={t}>{t}</option>)}</select>
            <label className="field-label mt-4">BHK</label>
            <select className="field-control" value={bhk} onChange={e=>setBhk(e.target.value)}><option value="">Any BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option></select>
            <label className="field-label mt-4">Maximum Budget</label>
            <select className="field-control" value={budget} onChange={e=>setBudget(e.target.value)}><option value="">Any Budget</option><option value="5000000">₹50 Lakh</option><option value="7500000">₹75 Lakh</option><option value="10000000">₹1 Cr</option><option value="20000000">₹2 Cr</option></select>
            <button onClick={reset} className="mt-5 flex items-center gap-2 text-xs font-bold text-wine-700"><RotateCcw size={14}/> Reset Filters</button>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between"><div><p className="text-lg font-bold">{filtered.length} Properties Found</p><p className="text-xs text-gray-500">Showing verified NeoCube listings</p></div><span className="rounded-full bg-wine-50 px-3 py-1 text-xs font-bold text-wine-700">Verified</span></div>
            {filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(p=><PropertyCard key={p.id} property={p} isFavorite={favorites.includes(p.id)} onFavorite={toggleFavorite} isCompared={compare.includes(p.id)} onCompare={toggleCompare}/>)}</div> : <div className="card p-12 text-center text-gray-500">No properties match your current filters.</div>}
          </div>
        </div>
      </section>
    </>
  )
}
