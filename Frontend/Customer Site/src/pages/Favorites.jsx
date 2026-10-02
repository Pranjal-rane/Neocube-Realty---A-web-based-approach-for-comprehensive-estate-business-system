import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import PropertyCard from '../components/PropertyCard'

export default function Favorites({
  favorites,
  toggleFavorite,
  compare,
  toggleCompare
}) {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/properties')
      .then(response => response.json())
      .then(data => {
        const mappedProperties = data.map(p => ({
          id: p.propertyId,
          name: p.propertyName,
          location: p.location,
          type: p.propertyType,
          bhk: p.bhk,
          baths: p.bathrooms,
          price: Number(p.price),
          area: Number(p.areaSqft),
          description: p.description,
          image: p.imagePath,
          status: p.status,
          featured: p.featured
        }))

        setProperties(mappedProperties)
      })
      .catch(error => {
        console.error('Error fetching properties:', error)
      })
  }, [])

  const saved = properties.filter(p =>
    favorites.includes(p.id)
  )

  return (
    <>
      <PageHero
        title="Favorites"
        description="Your saved NeoCube properties."
      />

      <section className="py-12">
        <div className="container-page">
          {saved.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map(p => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavorite={favorites.includes(p.id)}
                  onFavorite={toggleFavorite}
                  isCompared={compare.includes(p.id)}
                  onCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center text-gray-500">
              No favorites yet. Click the heart on any property to save it.
            </div>
          )}
        </div>
      </section>
    </>
  )
}