import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { loadProperties, LOCALITY_NAMES, inr } from "../../lib/mockData";

const TYPES = ["Apartment", "Villa", "Penthouse"];

export default function Listing() {
  const [params] = useSearchParams();
  const [locality, setLocality] = useState(params.get("locality") || "");
  const [bhk, setBhk] = useState("");
  const [type, setType] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [properties] = useState(loadProperties());

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (locality && p.locality !== locality) return false;
      if (bhk && p.bhk !== Number(bhk)) return false;
      if (type && p.type !== type) return false;
      if (maxBudget && p.price > Number(maxBudget)) return false;
      return true;
    });
  }, [locality, bhk, type, maxBudget, properties]);

  return (
    <div className="min-h-screen bg-offwhite">
      <PublicNav />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="font-display text-xl uppercase tracking-[0.08em] text-ink">Properties in Pune</h1>

        <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="space-y-4 rounded-xl border border-cream bg-white p-4 shadow-card">
            <FilterSelect label="Locality" value={locality} onChange={setLocality} options={LOCALITY_NAMES} />
            <FilterSelect label="BHK" value={bhk} onChange={setBhk} options={["1", "2", "3", "4"]} />
            <FilterSelect label="Type" value={type} onChange={setType} options={TYPES} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Max budget</span>
              <input type="number" className="input" placeholder="e.g. 8000000" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} />
            </label>
          </aside>

          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.length === 0 && (
              <p className="text-muted">No properties match these filters.</p>
            )}
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className="overflow-hidden rounded-xl border border-cream bg-white shadow-card transition hover:-translate-y-0.5"
              >
                <div className="relative h-36 bg-cream">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                  )}
                  <span className="absolute right-2 top-2 rounded-full border-2 border-maroon bg-white/90 px-2 py-1 text-[10px] font-mono text-maroon">
                    {p.id}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="text-sm text-muted">{p.locality} · {p.bhk} BHK · {p.area} sqft</p>
                  <p className="mt-2 font-mono text-sm font-semibold text-maroon">{inr(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
