import { useState } from 'react'
import { Heart, Menu, X, ChevronDown } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/neocube-logo.png'

const mainLinks = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties', dropdown: true },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
  { label: 'Developers', to: '/developers' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1 py-3 text-sm font-semibold transition ${
      isActive ? 'text-wine-700' : 'text-gray-800 hover:text-wine-700'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[76px] items-center justify-between gap-6">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src={logo} alt="NeoCube Realty" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainLinks.map((item) => (
            <div key={item.to} className="relative">
              <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
                {item.dropdown && <ChevronDown size={14} />}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/favorites" className="grid h-10 w-10 place-items-center rounded-full text-wine-700 hover:bg-wine-50" title="Favorites">
            <Heart size={20} />
          </Link>
          <Link to="/login" className="btn-outline px-5 py-2.5">Login</Link>
          <Link to="/register" className="btn-primary px-5 py-2.5">Register</Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-stone-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-100 bg-white lg:hidden">
          <div className="container-page flex flex-col py-3">
            {mainLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className="border-b border-stone-100 py-3 text-sm font-semibold"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex gap-2 py-4">
              <Link to="/favorites" onClick={() => setOpen(false)} className="btn-outline flex-1">♡ Favorites</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Register</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
