import { BedDouble, Bath, Heart, MapPin, Ruler, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ property, isFavorite, onFavorite, isCompared, onCompare }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative h-56 overflow-hidden">
        <img src={property.image} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {property.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-wine-700 px-3 py-1 text-[11px] font-bold text-white">Featured</span>
        )}
        <button
          onClick={() => onFavorite(property.id)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow ${
            isFavorite ? 'text-wine-700' : 'text-gray-800'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart size={19} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-[15px]">{property.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={14} />{property.location}</p>
        <p className="mt-2 text-lg font-extrabold text-wine-700">{property.priceText}</p>

        <div className="mt-3 flex items-center gap-3 border-t border-stone-100 pt-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1"><BedDouble size={14}/>{property.bhk || 'Office'}</span>
          <span className="flex items-center gap-1"><Bath size={14}/>{property.baths} Bath</span>
          <span className="flex items-center gap-1"><Ruler size={14}/>{property.area} Sq.Ft.</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to={`/properties/${property.id}`} className="btn-primary flex-1 px-3 py-2.5 text-xs">View Details</Link>
          <button
            onClick={() => onCompare(property.id)}
            className={`btn-outline px-3 py-2.5 text-xs ${isCompared ? 'bg-wine-50' : ''}`}
            title="Compare property"
          >
            <Scale size={14} /> {isCompared ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </article>
  )
}
