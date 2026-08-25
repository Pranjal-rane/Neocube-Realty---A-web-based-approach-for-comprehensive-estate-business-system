import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { loadProperties, inr } from "../../lib/mockData";

const LOCALITIES = ["Koregaon Park", "Baner", "Hinjewadi", "Kharadi", "Wakad"];

export default function Home() {
  const navigate = useNavigate();
  const [locality, setLocality] = useState("");
  const [properties] = useState(loadProperties());

  function handleSearch(e) {
    e.preventDefault();
    navigate(locality ? `/properties?locality=${encodeURIComponent(locality)}` : "/properties");
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <PublicNav />

      <section className="relative overflow-hidden bg-maroon-deep px-5 py-20 text-offwhite">
        <SkylineBackdrop />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] sm:text-4xl">
            Find your next home in Pune
          </h1>
          <p className="mt-3 text-offwhite/80">Verified listings across Pune's most sought-after localities.</p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 rounded-xl bg-white p-3 shadow-card sm:flex-row">
            <select
              className="input flex-1 border-none text-ink"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            >
              <option value="">Any locality</option>
              {LOCALITIES.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="font-display text-lg uppercase tracking-[0.1em] text-ink">Featured properties</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              to={`/properties/${p.id}`}
              className="group overflow-hidden rounded-xl border border-cream bg-white shadow-card transition hover:-translate-y-0.5"
            >
              <div className="relative h-40 bg-cream">
                <span className="absolute right-2 top-2 rounded-full border-2 border-maroon bg-white/90 px-2 py-1 text-[10px] font-mono text-maroon">
                  {p.id}
                </span>
              </div>
              <div className="p-4">
                <p className="font-medium text-ink">{p.title}</p>
                <p className="text-sm text-muted">{p.locality} · {p.bhk} BHK</p>
                <p className="mt-2 font-mono text-sm font-semibold text-maroon">{inr(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SkylineBackdrop() {
  return (
    <svg className="pointer-events-none absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 800 160" fill="none">
      <path
        d="M0 160 L60 160 L60 110 L100 80 L140 110 L140 160 L200 160 L200 70 L250 40 L300 70 L300 160 L360 160 L360 95 L400 60 L440 95 L440 160 L500 160 L500 50 L540 15 L580 50 L580 160 L800 160"
        stroke="#FAF8F5"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}
