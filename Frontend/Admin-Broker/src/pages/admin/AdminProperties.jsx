import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import PhotoUpload from "../../components/PhotoUpload";
import { useAuth } from "../../lib/auth";
import { loadProperties, saveProperties, nextPropertyId, localityCoords, LOCALITY_NAMES, inr } from "../../lib/mockData";
import { Plus, Pencil, X } from "lucide-react";

const EMPTY_FORM = { title: "", locality: LOCALITY_NAMES[0], bhk: "2", price: "", area: "", type: "Apartment", status: "Available" };

export default function AdminProperties() {
  const { allBrokers } = useAuth();
  const brokers = allBrokers();
  const [properties, setProperties] = useState(loadProperties());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photos, setPhotos] = useState([]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPhotos([]);
    setShowForm(true);
  }

  function openEditForm(property) {
    setEditingId(property.id);
    setForm({
      title: property.title,
      locality: property.locality,
      bhk: String(property.bhk),
      price: String(property.price),
      area: String(property.area),
      type: property.type,
      status: property.status,
    });
    setPhotos(property.images || []);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      const updated = properties.map((p) =>
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
              images: photos,
              ...localityCoords(form.locality),
            }
          : p
      );
      setProperties(updated);
      saveProperties(updated);
    } else {
      const newProperty = {
        id: nextPropertyId(),
        title: form.title,
        locality: form.locality,
        bhk: Number(form.bhk),
        price: Number(form.price),
        area: Number(form.area),
        type: form.type,
        status: form.status,
        brokerId: "",
        images: photos,
        ...localityCoords(form.locality),
      };
      const updated = [newProperty, ...properties];
      setProperties(updated);
      saveProperties(updated);
    }
    closeForm();
  }

  function brokerName(brokerId) {
    if (!brokerId) return "Admin";
    return brokers.find((b) => b.brokerId === brokerId)?.name || brokerId;
  }

  return (
    <DashboardShell role="admin" title="Property Management" subtitle="Properties added here go live on the customer site instantly">
      <div className="mb-4 flex justify-end">
        <button onClick={openAddForm} className="btn-primary gap-2">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              {editingId ? `Edit Property — ${editingId}` : "New Property"}
            </h3>
            <button onClick={closeForm} className="text-muted hover:text-ink">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <PhotoUpload photos={photos} onChange={setPhotos} />

            <div className="flex gap-2">
              <button type="submit" className="btn-primary">{editingId ? "Save Changes" : "Save Property"}</button>
              <button type="button" onClick={closeForm} className="btn-outline">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Locality</th>
              <th className="px-4 py-3">BHK</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added by</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-cream" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.locality}</td>
                <td className="px-4 py-3 text-muted">{p.bhk} BHK</td>
                <td className="px-4 py-3">{inr(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.status}</td>
                <td className="px-4 py-3 text-muted">{brokerName(p.brokerId)}</td>
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
