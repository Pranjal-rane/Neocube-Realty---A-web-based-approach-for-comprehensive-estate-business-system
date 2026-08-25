import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads } from "../../lib/mockData";
import { Plus, Trash2 } from "lucide-react";

export default function AdminBrokers() {
  const { allBrokers, addBroker, deleteBroker } = useAuth();
  const [brokers, setBrokers] = useState(allBrokers());
  const [leads, setLeads] = useState(loadLeads());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();
    setError("");
    const result = addBroker(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBrokers(allBrokers());
    setCreated(result);
    setForm({ name: "", email: "", phone: "" });
  }

  function handleDelete(broker) {
    const assignedCount = leads.filter((l) => l.brokerId === broker.brokerId).length;
    const warning =
      assignedCount > 0
        ? `Delete ${broker.name} (${broker.brokerId})? Their ${assignedCount} assigned lead(s) will become "Unassigned" and can be reassigned from the Leads page. This can't be undone.`
        : `Delete ${broker.name} (${broker.brokerId})? Their login will stop working immediately. This can't be undone.`;
    if (!window.confirm(warning)) return;

    deleteBroker(broker.brokerId);
    setBrokers(allBrokers());
    setLeads(loadLeads());
    if (created?.broker?.brokerId === broker.brokerId) setCreated(null);
  }

  return (
    <DashboardShell role="admin" title="Broker Management" subtitle="Add brokers here — they sign in from the same login page with these credentials">
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setShowForm((s) => !s); setCreated(null); }} className="btn-primary gap-2">
          <Plus size={16} /> Add Broker
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3">
            <input required placeholder="Full name" className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <input required type="email" placeholder="Email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
            <input required placeholder="Phone" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <div className="sm:col-span-3">
              <button type="submit" className="btn-primary">Create Broker Login</button>
            </div>
          </form>
          {error && <p className="mt-3 text-sm text-rustred">{error}</p>}
          {created && (
            <div className="mt-4 rounded-lg bg-sage/10 p-3 text-sm text-ink">
              <p className="font-medium">Broker account created — {created.broker.brokerId}</p>
              <p className="text-muted">Email: {created.broker.email}</p>
              <p className="text-muted">Temporary password: <span className="font-mono">{created.tempPassword}</span></p>
            </div>
          )}
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Broker ID</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Assigned leads</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {brokers.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No brokers yet — add one above.</td></tr>
            )}
            {brokers.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium text-ink">{b.name}</td>
                <td className="px-4 py-3 text-muted">{b.brokerId}</td>
                <td className="px-4 py-3 text-muted">{b.email}</td>
                <td className="px-4 py-3 text-muted">{leads.filter((l) => l.brokerId === b.brokerId).length}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(b)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rustred/30 px-3 py-1.5 text-xs font-medium text-rustred transition hover:bg-rustred/10"
                  >
                    <Trash2 size={14} /> Delete
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
