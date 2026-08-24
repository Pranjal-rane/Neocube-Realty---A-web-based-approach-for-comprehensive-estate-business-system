import { Search, MapPin, Home, IndianRupee, BedDouble } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PropertySearchBar({ compact = false }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const [bhk, setBhk] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type) params.set('type', type)
    if (budget) params.set('budget', budget)
    if (bhk) params.set('bhk', bhk)
    navigate(`/properties?${params.toString()}`)
  }

  const field = compact ? 'rounded-lg border border-stone-200 bg-white px-3 py-3' : 'px-4 py-2'

  return (
    <form onSubmit={submit} className={`grid gap-0 rounded-2xl bg-white p-3 shadow-soft ${compact ? 'md:grid-cols-5' : 'md:grid-cols-5'}`}>
      <div className={`${field} border-b md:border-b-0 md:border-r`}><label className="flex items-center gap-2 text-xs font-bold"><MapPin size={16} className="text-wine-700"/> Location</label><input value={query} onChange={e=>setQuery(e.target.value)} className="mt-1 w-full border-0 bg-transparent text-sm outline-none" placeholder="Enter Location"/></div>
      <div className={`${field} border-b md:border-b-0 md:border-r`}><label className="flex items-center gap-2 text-xs font-bold"><Home size={16} className="text-wine-700"/> Property Type</label><select value={type} onChange={e=>setType(e.target.value)} className="mt-1 w-full border-0 bg-transparent text-sm outline-none"><option value="">Select Type</option><option>Apartment</option><option>Villa</option><option>Office</option><option>Shop</option></select></div>
      <div className={`${field} border-b md:border-b-0 md:border-r`}><label className="flex items-center gap-2 text-xs font-bold"><IndianRupee size={16} className="text-wine-700"/> Budget Range</label><select value={budget} onChange={e=>setBudget(e.target.value)} className="mt-1 w-full border-0 bg-transparent text-sm outline-none"><option value="">Select Budget</option><option value="5000000">Under ₹50 Lakh</option><option value="10000000">₹50 Lakh – ₹1 Cr</option><option value="20000000">₹1 Cr+</option></select></div>
      <div className={`${field} border-b md:border-b-0 md:border-r`}><label className="flex items-center gap-2 text-xs font-bold"><BedDouble size={16} className="text-wine-700"/> BHK</label><select value={bhk} onChange={e=>setBhk(e.target.value)} className="mt-1 w-full border-0 bg-transparent text-sm outline-none"><option value="">Any BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4 BHK</option></select></div>
      <button className="btn-primary m-1"><Search size={17}/> Search Properties</button>
    </form>
  )
}
