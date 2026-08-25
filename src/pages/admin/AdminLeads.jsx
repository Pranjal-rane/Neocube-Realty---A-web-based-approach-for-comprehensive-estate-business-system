import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads, saveLeads, inr } from "../../lib/mockData";

export default function AdminLeads() {
  const { allBrokers } = useAuth();
  const brokers = allBrokers();
  const [leads, setLeads] = useState(loadLeads());

  function reassign(leadId, newBrokerId) {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, brokerId: newBrokerId } : l));
    setLeads(updated);
    saveLeads(updated);
  }

  return (
    <DashboardShell role="admin" title="Lead Management" subtitle="All leads across every broker">
      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Reassign</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {leads.map((l) => (
              <tr key={l.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
