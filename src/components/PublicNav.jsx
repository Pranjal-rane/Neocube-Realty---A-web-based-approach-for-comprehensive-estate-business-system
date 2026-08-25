import { Link } from "react-router-dom";
import { LogoLockup } from "./Logo";

export default function PublicNav() {
  return (
    <header className="border-b border-cream bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/"><LogoLockup size={32} /></Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink md:flex">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <Link to="/properties" className="hover:text-maroon">Properties</Link>
          <Link to="/emi-calculator" className="hover:text-maroon">EMI Calculator</Link>
        </nav>
        <Link to="/login" className="btn-outline px-4 py-2 text-sm">Sign In</Link>
      </div>
    </header>
  );
}
