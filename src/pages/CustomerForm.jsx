import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { properties } from '../data/properties'

export default function CustomerForm({mode='inquiry'}) {
  const [params] = useSearchParams()
  const propertyId = Number(params.get('property'))
  const selectedProperty = properties.find(p=>p.id===propertyId)
  const [done,setDone] = useState(false)

  const submit = e => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const record = Object.fromEntries(form.entries())
    record.createdAt = new Date().toLocaleString()
    const key = mode === 'visit' ? 'neoVisits' : 'neoInquiries'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    localStorage.setItem(key, JSON.stringify([...existing, record]))
    setDone(true)
  }

  const visit = mode === 'visit'
  return <>
    <PageHero title={visit ? 'Schedule a Site Visit' : 'Property Inquiry'} description={visit ? 'Choose your preferred date and time for a property visit.' : 'Tell us what you are looking for and our team will contact you.'}/>
    <section className="py-12"><div className="container-page">
      {done ? <div className="card p-12 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50 text-2xl text-green-700">✓</div><h2 className="mt-5 font-display text-3xl font-bold">{visit?'Site visit request submitted!':'Inquiry submitted successfully!'}</h2><p className="mt-2 text-sm text-gray-500">Your request has been saved in the customer dashboard.</p></div> :
      <form onSubmit={submit} className="card grid gap-5 p-6 md:grid-cols-2 md:p-8">
        {selectedProperty && <div className="md:col-span-2 rounded-xl bg-wine-50 p-4 text-sm"><b>Selected Property:</b> {selectedProperty.name} — {selectedProperty.location}</div>}
        <div><label className="field-label">Full Name</label><input name="name" required className="field-control"/></div>
        <div><label className="field-label">Phone</label><input name="phone" required className="field-control"/></div>
        <div><label className="field-label">Email</label><input name="email" type="email" required className="field-control"/></div>
        <div><label className="field-label">Property</label><select name="property" className="field-control" defaultValue={selectedProperty?.id || 1}>{properties.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></div>
        {visit ? <><div><label className="field-label">Preferred Date</label><input name="date" type="date" required className="field-control"/></div><div><label className="field-label">Preferred Time</label><select name="time" className="field-control"><option>10:00 AM</option><option>12:00 PM</option><option>3:00 PM</option><option>5:00 PM</option></select></div></> : <><div><label className="field-label">Budget</label><select name="budget" className="field-control"><option>Under ₹50 Lakh</option><option>₹50 Lakh – ₹1 Cr</option><option>₹1 Cr+</option></select></div><div><label className="field-label">BHK</label><select name="bhk" className="field-control"><option>Any</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK</option></select></div></>}
        <div className="md:col-span-2"><label className="field-label">Message</label><textarea name="message" rows="5" className="field-control"/></div>
        <div className="md:col-span-2"><button className="btn-primary">{visit?'Schedule Visit':'Submit Inquiry'}</button></div>
      </form>}
    </div></section>
  </>
}
