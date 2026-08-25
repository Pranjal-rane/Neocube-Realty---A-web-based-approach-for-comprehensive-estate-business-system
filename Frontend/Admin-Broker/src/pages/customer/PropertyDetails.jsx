import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicNav from "../../components/PublicNav";
import { loadProperties, inr } from "../../lib/mockData";

export default function PropertyDetails() {
  const { id } = useParams();
  const property = loadProperties().find((p) => p.id === id);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!property) {
    return (
      <div className="min-h-screen bg-offwhite">
        <PublicNav />
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="text-muted">Property not found.</p>
          <Link to="/properties" className="mt-2 inline-block text-maroon hover:underline">Back to listings</Link>
        </div>
      </div>
    );
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // In the real app: POST /api/inquiries — this becomes a Lead behind the scenes
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <PublicNav />
      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link to="/properties" className="text-sm text-maroon hover:underline">← Back to listings</Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="relative h-72 overflow-hidden rounded-xl bg-cream">
              {property.images?.length > 0 ? (
                <img src={property.images[activePhoto]} alt={property.title} className="h-full w-full object-cover" />
              ) : null}
              <span className="absolute right-3 top-3 rounded-full border-2 border-maroon bg-white/90 px-3 py-1 text-xs font-mono text-maroon">
                Verified · {property.id}
              </span>
            </div>
            {property.images?.length > 1 && (
              <div className="mt-3 flex gap-2">
                {property.images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === activePhoto ? "border-maroon" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt={`${property.title} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <h1 className="mt-5 font-display text-2xl uppercase tracking-[0.05em] text-ink">{property.title}</h1>
            <p className="text-muted">{property.locality}, Pune</p>
            <p className="mt-2 font-mono text-xl font-semibold text-maroon">{inr(property.price)}</p>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-cream bg-white p-4 shadow-card">
              <Spec label="BHK" value={property.bhk} />
              <Spec label="Area" value={`${property.area} sqft`} />
              <Spec label="Type" value={property.type} />
            </div>

            <div className="mt-6 rounded-xl border border-cream bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">Location</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-maroon hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              {property.lat && property.lng ? (
                <iframe
                  title="Property location map"
                  className="mt-3 h-64 w-full rounded-lg border border-cream"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&z=15&output=embed`}
                />
              ) : (
                <p className="mt-2 text-sm text-muted">Location not available for this property.</p>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-cream bg-white p-5 shadow-card">
              <h2 className="font-display text-sm uppercase tracking-[0.12em] text-ink">Send Inquiry</h2>
              {submitted ? (
                <p className="mt-4 rounded-lg bg-sage/10 p-3 text-sm text-ink">
                  Your inquiry has been received. A broker will contact you shortly.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <input required placeholder="Name" className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
                  <input required placeholder="Mobile" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  <input required type="email" placeholder="Email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  <textarea rows={3} placeholder="Message" className="input" value={form.message} onChange={(e) => update("message", e.target.value)} />
                  <button type="submit" className="btn-primary w-full">Submit Inquiry</button>
                </form>
              )}
              <button className="btn-outline mt-3 w-full">Schedule Site Visit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg font-semibold text-ink">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
