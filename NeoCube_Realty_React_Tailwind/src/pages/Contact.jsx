import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import PageHero from '../components/PageHero'

export default function Contact() {
  const [sent,setSent] = useState(false)
  const submit = e => { e.preventDefault(); setSent(true) }
  return <>
    <PageHero title="Contact Us" description="Our team is ready to help you find the right property."/>
    <section className="py-12 md:py-16"><div className="container-page grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
      <div className="card bg-wine-700 p-7 text-white">
        <h2 className="font-display text-3xl font-bold">Let's talk</h2><p className="mt-2 text-sm text-white/80">Connect with NeoCube Realty for property discovery and expert guidance.</p>
        <div className="mt-8 space-y-5 text-sm"><p className="flex gap-3"><MapPin/> Amravati, Maharashtra</p><p className="flex gap-3"><Phone/> +91 98765 43210</p><p className="flex gap-3"><Mail/> hello@neocuberealty.com</p></div>
      </div>
      <div className="card p-6 md:p-8">
        {sent ? <div className="rounded-xl bg-green-50 p-8 text-center text-green-800"><h2 className="font-display text-2xl font-bold">✓ Message sent</h2><p className="mt-2 text-sm">Thank you. Our team will contact you shortly.</p></div> :
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {['Full Name','Email','Phone','Subject'].map(label=><div key={label}><label className="field-label">{label}</label><input required={label!=='Subject'} className="field-control" type={label==='Email'?'email':'text'} /></div>)}
          <div className="md:col-span-2"><label className="field-label">Message</label><textarea required rows="6" className="field-control resize-y"/></div>
          <div className="md:col-span-2"><button className="btn-primary">Send Message</button></div>
        </form>}
      </div>
    </div></section>
  </>
}
