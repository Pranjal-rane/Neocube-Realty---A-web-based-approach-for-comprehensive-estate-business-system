import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import PhotoUpload from "../../components/PhotoUpload";
import { useAuth } from "../../lib/auth";
import { loadProperties, saveProperties, nextPropertyId, localityCoords, LOCALITY_NAMES, inr } from "../../lib/mockData";
import { Plus, Pencil, X, ExternalLink } from "lucide-react";

const EMPTY_FORM = {
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  title: "",
  locality: LOCALITY_NAMES[0],
  bhk: "2",
  type: "Apartment",
  price: "",
  area: "",
  status: "Available",
  description: "",
};

export default function BrokerListings() {
  const { user } = useAuth();
  const [allProperties, setAllProperties] = useState(loadProperties());
  const listings = allProperties.filter((p) => p.brokerId === user?.brokerId);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photos, setPhotos] = useState([]);
  const [justAdded, setJustAdded] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPhotos([]);
    setJustAdded(null);
    setShowForm(true);
  }

  function openEditForm(property) {
    setEditingId(property.id);
    setForm({
      ownerName: property.ownerName || "",
      ownerPhone: property.ownerPhone || "",
      ownerEmail: property.ownerEmail || "",
      title: property.title,
      locality: property.locality,
      bhk: String(property.bhk),
      type: property.type,
      price: String(property.price),
      area: String(property.area),
      status: property.status,
      description: property.description || "",
    });
    setPhotos(property.images || []);
    setJustAdded(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      const updated = allProperties.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: form.title,
              locality: form.locality,
              bhk: Number(form.bhk),
              price: Number(form.price),
              area: Number(form.area),
              type: form.type,
              status: form.status,
              description: form.description,
              ownerName: form.ownerName,
              ownerPhone: form.ownerPhone,
              ownerEmail: form.ownerEmail,
              images: photos,
              ...localityCoords(form.locality),
            }
          : p
      );
      setAllProperties(updated);
      saveProperties(updated);
      closeForm();
    } else {
      const newProperty = {
        id: nextPropertyId(),
        title: form.title,
        locality: form.locality,
        bhk: Number(form.bhk),
        price: Number(form.price),
        area: Number(form.area),
        type: form.type,
        description: form.description,
        status: form.status,
        brokerId: user?.brokerId,
        // Owner contact is kept for the broker/admin only — never shown on the public site.
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        ownerEmail: form.ownerEmail,
        images: photos,
        ...localityCoords(form.locality),
      };
      const updated = [newProperty, ...allProperties];
      setAllProperties(updated);
      saveProperties(updated);
      setJustAdded(newProperty);
      closeForm();
    }
  }

  return (
    <DashboardShell
      role="broker"
      title="My Listings"
      subtitle="Take the owner's details here — it publishes straight to the customer website"
    >
      <div className="mb-4 flex justify-end">
        <button onClick={openAddForm} className="btn-primary gap-2">
          <Plus size={16} /> New Listing from Owner
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              {editingId ? `Edit Listing — ${editingId}` : "New Listing"}
            </h3>
            <button onClick={closeForm} className="text-muted hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.14em] text-muted">Owner details</h3>
              <p className="mt-1 text-xs text-muted">Kept private — visible only to you and Admin, never shown to customers.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <input required placeholder="Owner name" className="input" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
                <input required placeholder="Owner phone" className="input" value={form.ownerPhone} onChange={(e) => update("ownerPhone", e.target.value)} />
                <input type="email" placeholder="Owner email (optional)" className="input" value={form.ownerEmail} onChange={(e) => update("ownerEmail", e.target.value)} />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.14em] text-muted">Property details</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input required placeholder="Property title" className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
                <select required className="input" value={form.locality} onChange={(e) => update("locality", e.target.value)}>
                  {LOCALITY_NAMES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <select className="input" value={form.bhk} onChange={(e) => update("bhk", e.target.value)}>
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} BHK</option>)}
                </select>
                <select className="input" value={form.type} onChange={(e) => update("type", e.target.value)}>
                  {["Apartment", "Villa", "Penthouse"].map((t) => <option key={t}>{t}</option>)}
                </select>
                <input required type="number" placeholder="Price (INR)" className="input" value={form.price} onChange={(e) => update("price", e.target.value)} />
                <input required type="number" placeholder="Area (sqft)" className="input" value={form.area} onChange={(e) => update("area", e.target.value)} />
                <select className="input" value={form.status} onChange={(e) => update("status", e.target.value)}>
                  {["Available", "Booked"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <textarea rows={3} placeholder="Description for customers (optional)" className="input sm:col-span-2" value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>
            </div>

            <PhotoUpload photos={photos} onChange={setPhotos} />

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">{editingId ? "Save Changes" : "Publish Listing"}</button>
              <button type="button" onClick={closeForm} className="btn-outline">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      {justAdded && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-sage/10 p-3 text-sm text-ink">
          <span>
            <span className="font-medium">{justAdded.title}</span> is live on the customer site — {justAdded.id}
          </span>
          <Link to={`/properties/${justAdded.id}`} target="_blank" className="inline-flex items-center gap-1 text-maroon hover:underline">
            View <ExternalLink size={13} />
          </Link>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Locality</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Live page</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {listings.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted">No listings yet — use &quot;New Listing from Owner&quot; above.</td></tr>
            )}
            {listings.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-cream" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.ownerName || "—"}</td>
                <td className="px-4 py-3 text-muted">{p.locality}</td>
                <td className="px-4 py-3">{inr(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.status}</td>
                <td className="px-4 py-3">
                  <Link to={`/properties/${p.id}`} target="_blank" className="text-maroon hover:underline">View</Link>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEditForm(p)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-maroon hover:underline"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
