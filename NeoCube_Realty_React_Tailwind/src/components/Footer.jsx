import { Link } from 'react-router-dom'
import logo from '../assets/neocube-logo.png'

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#241d1e] text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt="NeoCube Realty" className="mb-4 h-14 w-auto brightness-0 invert" />
          <p className="max-w-sm text-sm leading-6 text-stone-300">
            Premium residential and commercial property discovery with trusted experts.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Explore</h3>
          <div className="space-y-2 text-sm text-stone-300">
            <Link className="block hover:text-white" to="/">Home</Link>
            <Link className="block hover:text-white" to="/properties">Properties</Link>
            <Link className="block hover:text-white" to="/compare">Compare</Link>
            <Link className="block hover:text-white" to="/favorites">Favorites</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Customer</h3>
          <div className="space-y-2 text-sm text-stone-300">
            <Link className="block hover:text-white" to="/login">Login</Link>
            <Link className="block hover:text-white" to="/register">Register</Link>
            <Link className="block hover:text-white" to="/dashboard">Dashboard</Link>
            <Link className="block hover:text-white" to="/schedule-visit">Site Visit</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Contact</h3>
          <div className="space-y-2 text-sm text-stone-300">
            <p>📍 Amravati, Maharashtra</p>
            <p>📞 +91 98765 43210</p>
            <p>✉ hello@neocuberealty.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 NeoCube Realty. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  )
}
