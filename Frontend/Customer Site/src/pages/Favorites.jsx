import PageHero from '../components/PageHero'
import PropertyCard from '../components/PropertyCard'
import { properties } from '../data/properties'

export default function Favorites({favorites,toggleFavorite,compare,toggleCompare}) {
  const saved = properties.filter(p=>favorites.includes(p.id))
  return <><PageHero title="Favorites" description="Your saved NeoCube properties."/><section className="py-12"><div className="container-page">{saved.length?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{saved.map(p=><PropertyCard key={p.id} property={p} isFavorite onFavorite={toggleFavorite} isCompared={compare.includes(p.id)} onCompare={toggleCompare}/>)}</div>:<div className="card p-12 text-center text-gray-500">No favorites yet. Click the heart on any property to save it.</div>}</div></section></>
}
