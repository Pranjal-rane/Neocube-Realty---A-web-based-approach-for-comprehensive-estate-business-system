import { CalendarDays, FileText, Heart, Handshake, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function count(key){ return JSON.parse(localStorage.getItem(key)||'[]').length }

export default function Dashboard(){
  const user=JSON.parse(localStorage.getItem('neoUser')||'{}')
  const stats=[['My Inquiries',count('neoInquiries'),FileText,'/dashboard/inquiries'],['My Site Visits',count('neoVisits'),CalendarDays,'/dashboard/site-visits'],['My Bookings / Deals',0,Handshake,'/dashboard/bookings'],['Favorites',JSON.parse(localStorage.getItem('neoFavorites')||'[]').length,Heart,'/favorites']]
  return <div><p className="text-xs font-bold uppercase tracking-widest text-wine-700">Customer Dashboard</p><h1 className="mt-2 font-display text-4xl font-bold">Welcome{user.name?`, ${user.name}`:''}!</h1><p className="mt-2 text-sm text-gray-500">Manage your property journey from one place.</p>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([title,value,Icon,to])=><Link to={to} key={title} className="card p-5 transition hover:-translate-y-1 hover:shadow-soft"><div className="flex items-center justify-between"><div className="grid h-11 w-11 place-items-center rounded-full bg-wine-50 text-wine-700"><Icon size={20}/></div><ArrowRight size={17} className="text-gray-400"/></div><p className="mt-5 text-sm text-gray-500">{title}</p><p className="mt-1 text-3xl font-extrabold text-wine-700">{value}</p></Link>)}</div>
    <div className="card mt-6 p-6"><h2 className="font-display text-2xl font-bold">Quick Actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link className="btn-primary" to="/properties">Explore Properties</Link><Link className="btn-outline" to="/inquiry">Send Inquiry</Link><Link className="btn-outline" to="/schedule-visit">Schedule Site Visit</Link></div></div>
  </div>
}
