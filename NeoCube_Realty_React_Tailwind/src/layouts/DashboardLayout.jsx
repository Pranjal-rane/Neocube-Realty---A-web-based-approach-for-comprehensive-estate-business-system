import { NavLink, Outlet, Link } from 'react-router-dom'
import { BarChart3, Heart, CalendarDays, FileText, Handshake, LayoutDashboard, LogOut } from 'lucide-react'
import logo from '../assets/neocube-logo.png'

const links = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/dashboard/inquiries', 'My Inquiries', FileText],
  ['/dashboard/site-visits', 'My Site Visits', CalendarDays],
  ['/dashboard/bookings', 'My Bookings / Deals', Handshake],
  ['/favorites', 'Favorites', Heart],
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b bg-white">
        <div className="container-page flex h-20 items-center justify-between">
          <Link to="/"><img src={logo} alt="NeoCube Realty" className="h-12 w-auto"/></Link>
          <Link to="/" className="text-sm font-semibold text-wine-700">← Back to Website</Link>
        </div>
      </header>
      <div className="container-page grid gap-6 py-7 lg:grid-cols-[245px_1fr]">
        <aside className="h-max rounded-2xl border border-stone-200 bg-white p-3 lg:sticky lg:top-5">
          <div className="mb-4 rounded-xl bg-wine-50 p-4"><p className="text-xs text-gray-500">Customer Account</p><p className="mt-1 font-bold">Welcome back 👋</p></div>
          <nav className="space-y-1">
            {links.map(([to,label,Icon]) => (
              <NavLink key={to} to={to} end={to==='/dashboard'} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${isActive?'bg-wine-700 text-white':'text-gray-700 hover:bg-wine-50 hover:text-wine-700'}`}>
                <Icon size={17}/>{label}
              </NavLink>
            ))}
          </nav>
          <button onClick={()=>localStorage.removeItem('neoLoggedIn')} className="mt-5 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600"><LogOut size={17}/> Logout</button>
        </aside>
        <section><Outlet /></section>
      </div>
    </div>
  )
}
