import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadProperties, saveProperties, nextPropertyId, localityCoords, inr } from "../../lib/mockData";
import { Plus } from "lucide-react";

export default function AdminProperties() {
  const { allBrokers } = useAuth();
  const brokers = allBrokers();
  const [properties, setProperties] = useState(loadProperties());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", locality: "", bhk: "2", price: "", area: "", type: "Apartment" });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();
    const newProperty = {
      id: nextPropertyId(),
      title: form.title,
      locality: form.locality,
      bhk: Number(form.bhk),
      price: Number(form.price),
      area: Number(form.area),
      type: form.type,
      status: "Available",
      brokerId: "",
      ...localityCoords(form.locality),
    };
    const updated = [newProperty, ...properties];
    setProperties(updated);
    saveProperties(updated);
    setForm({ title: "", locality: "", bhk: "2", price: "", area: "", type: "Apartment" });
    setShowForm(false);
  }

  function brokerName(brokerId) {
    if (!brokerId) return "Admin";
    return brokers.find((b) => b.brokerId === brokerId)?.name || brokerId;
  }

  return (
    <DashboardShell role="admin" title="Property Management" subtitle="Properties added here go live on the customer site instantly">
      <div className="mb-4 flex justify-end">
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary gap-2">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Property title" className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
            <input required placeholder="Locality (e.g. Baner)" className="input" value={form.locality} onChange={(e) => update("locality", e.target.value)} />
            <select className="input" value={form.bhk} onChange={(e) => update("bhk", e.target.value)}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} BHK</option>)}
            </select>
            <select className="input" value={form.type} onChange={(e) => update("type", e.target.value)}>
              {["Apartment", "Villa", "Penthouse"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <input required type="number" placeholder="Price (INR)" className="input" value={form.price} onChange={(e) => update("price", e.target.value)} />
            <input required type="number" placeholder="Area (sqft)" className="input" value={form.area} onChange={(e) => update("area", e.target.value)} />
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">Save Property</button>
            </div>
          </form>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Locality</th>
              <th className="px-4 py-3">BHK</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.locality}</td>
                <td className="px-4 py-3 text-muted">{p.bhk} BHK</td>
                <td className="px-4 py-3">{inr(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.status}</td>
                <td className="px-4 py-3 text-muted">{brokerName(p.brokerId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
