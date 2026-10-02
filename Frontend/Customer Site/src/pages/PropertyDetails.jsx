import { useEffect, useState } from 'react'
import { BedDouble, Bath, Ruler, MapPin, Heart, CalendarDays, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'


export default function PropertyDetails({favorites, toggleFavorite}) {
  const { id } = useParams()
const [property, setProperty] = useState(null)

useEffect(() => {
  fetch(`http://localhost:8080/api/properties/${id}`)
    .then(response => response.json())
    .then(data => {
      setProperty({
        id: data.propertyId,
        name: data.propertyName,
        location: data.location,
        type: data.propertyType,
        bhk: data.bhk,
        baths: data.bathrooms,
        price: Number(data.price),
        area: Number(data.areaSqft),
        description: data.description,
        image: data.imagePath,
        status: data.status,
        featured: data.featured
      })
    })
    .catch(error => {
      console.error('Error fetching property:', error)
    })
}, [id])

if (!property) {
  return <div className="p-10 text-center">Loading property...</div>
}

const favorite = favorites.includes(property.id)

  return (
    <>
      <PageHero title="Property Details" description={`${property.name} • ${property.location}`} />
      <section className="py-12 md:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            <img src={property.image} alt={property.name} className="h-[360px] w-full rounded-2xl object-cover md:h-[520px]" />
            <div className="mt-8 border-b border-stone-200 pb-8"><h2 className="font-display text-3xl font-bold">Property Overview</h2><p className="mt-3 text-sm leading-7 text-gray-600">{property.description}</p></div>
            <div className="pt-8"><h2 className="font-display text-3xl font-bold">Amenities</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">{['Covered Parking','24×7 Security','Power Backup','Lift','Water Supply','Modern Kitchen'].map(a=><div key={a} className="flex items-center gap-2 rounded-lg bg-wine-50 p-3 text-sm"><CheckCircle2 size={17} className="text-wine-700"/>{a}</div>)}</div></div>
          </div>

          <aside className="card h-max p-6 lg:sticky lg:top-24">
            <span className="inline-flex rounded-full bg-wine-700 px-3 py-1 text-xs font-bold text-white">{property.status}</span>
            <h2 className="mt-4 font-display text-3xl font-bold">{property.name}</h2>
            <p className="mt-2 flex items-center gap-1 text-sm text-gray-500"><MapPin size={15}/>{property.location}</p>
            <p className="mt-5 text-3xl font-extrabold text-wine-700">
  ₹{property.price.toLocaleString('en-IN')}
            </p>            
            <div className="my-6 grid grid-cols-3 gap-2">{[[BedDouble,property.bhk||'—','BHK'],[Bath,property.baths,'Bath'],[Ruler,property.area,'Sq.Ft.']].map(([Icon,value,label])=><div key={label} className="rounded-lg bg-wine-50 p-3 text-center"><Icon size={18} className="mx-auto text-wine-700"/><b className="mt-1 block text-sm">{value}</b><small className="text-xs text-gray-500">{label}</small></div>)}</div>
            <div className="space-y-2"><Link className="btn-primary w-full" to={`/inquiry?property=${property.id}`}>Enquire Now</Link><Link className="btn-outline w-full" to={`/schedule-visit?property=${property.id}`}><CalendarDays size={17}/> Schedule Site Visit</Link><button className="btn-outline w-full" onClick={()=>toggleFavorite(property.id)}><Heart size={17} fill={favorite?'currentColor':'none'}/>{favorite?'Remove Favorite':'Add to Favorites'}</button></div>
          </aside>
        </div>
      </section>
    </>
  )
}
