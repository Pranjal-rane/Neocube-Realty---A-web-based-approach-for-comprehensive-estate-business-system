import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads, saveLeads, inr } from "../../lib/mockData";
import { Pencil, Check, X } from "lucide-react";

export default function AdminLeads() {
  const { allBrokers } = useAuth();
  const brokers = allBrokers();
  const [leads, setLeads] = useState(loadLeads());
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", budget: "" });

  function reassign(leadId, newBrokerId) {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, brokerId: newBrokerId } : l));
    setLeads(updated);
    saveLeads(updated);
  }

  function startEdit(lead) {
    setEditingId(lead.id);
    setForm({ name: lead.name, phone: lead.phone, email: lead.email, budget: lead.budget });
  }

  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function saveEdit(leadId) {
    const updated = leads.map((l) =>
      l.id === leadId
        ? { ...l, name: form.name, phone: form.phone, email: form.email, budget: Number(form.budget) || 0 }
        : l
    );
    setLeads(updated);
    saveLeads(updated);
    setEditingId(null);
  }

  return (
    <DashboardShell role="admin" title="Lead Management" subtitle="All leads across every broker">
      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Reassign</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {leads.map((l) =>
              editingId === l.id ? (
                <tr key={l.id} className="bg-cream/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{l.id}</td>
                  <td className="px-4 py-3">
                    <input className="input py-1.5 text-xs" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Name" />
                    <input className="input mt-1.5 py-1.5 text-xs" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="Phone" />
                    <input className="input mt-1.5 py-1.5 text-xs" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="Email" />
                  </td>
                  <td className="px-4 py-3 text-muted">{l.interest}</td>
                  <td className="px-4 py-3">
                    <input type="number" className="input py-1.5 text-xs" value={form.budget} onChange={(e) => updateForm("budget", e.target.value)} />
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-muted">{l.brokerId || "Unassigned"}</td>
                  <td className="px-4 py-3 text-muted">—</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(l.id)} className="rounded-lg border border-sage/40 p-1.5 text-sage hover:bg-sage/10">
                        <Check size={14} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="rounded-lg border border-cream p-1.5 text-muted hover:bg-cream/60">
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{l.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{l.name}</p>
                    <p className="text-xs text-muted">{l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.interest}</td>
                  <td className="px-4 py-3">{inr(l.budget)}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-muted">{l.brokerId || <span className="italic text-rustred">Unassigned</span>}</td>
                  <td className="px-4 py-3">
                    <select
                      className="input py-1.5 text-xs"
                      value={l.brokerId || ""}
                      onChange={(e) => reassign(l.id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {brokers.map((b) => (
                        <option key={b.brokerId} value={b.brokerId}>
                          {b.name} ({leads.filter((x) => x.brokerId === b.brokerId).length} leads)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => startEdit(l)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-maroon hover:underline"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
