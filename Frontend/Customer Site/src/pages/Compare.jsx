import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { properties } from '../data/properties'

export default function Compare({compare, toggleCompare}) {
  const selected = properties.filter(p=>compare.includes(p.id))
  return (
    <>
      <PageHero title="Compare Properties" description="Compare up to three selected properties side by side." />
      <section className="py-12"><div className="container-page">
        {selected.length < 2 ? <div className="card p-12 text-center"><h2 className="font-display text-2xl font-bold">Select at least 2 properties</h2><p className="mt-2 text-sm text-gray-500">Use the Compare button on property cards.</p><Link to="/properties" className="btn-primary mt-5">Browse Properties</Link></div> : <div className="card overflow-x-auto p-4 md:p-6"><table className="min-w-[720px] w-full border-collapse text-left text-sm"><thead><tr><th className="border-b p-3">Feature</th>{selected.map(p=><th key={p.id} className="border-b p-3">{p.name}</th>)}</tr></thead><tbody>{[['Price',p=>p.priceText],['Type',p=>p.type],['Location',p=>p.location],['BHK',p=>p.bhk||'—'],['Bathrooms',p=>p.baths],['Area',p=>`${p.area} Sq.Ft.`],['Status',p=>p.status]].map(([label,fn])=><tr key={label}><td className="border-b bg-wine-50/60 p-3 font-bold">{label}</td>{selected.map(p=><td key={p.id} className="border-b p-3">{fn(p)}</td>)}</tr>)}</tbody></table><button onClick={()=>selected.forEach(p=>toggleCompare(p.id))} className="btn-outline mt-5">Clear Comparison</button></div>}
      </div></section>
    </>
  )
}
