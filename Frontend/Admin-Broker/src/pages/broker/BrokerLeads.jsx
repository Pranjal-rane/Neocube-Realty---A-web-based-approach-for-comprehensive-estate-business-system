import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads, saveLeads, inr, STATUS_LABELS } from "../../lib/mockData";

export default function BrokerLeads() {
  const { user } = useAuth();
  const [allLeads, setAllLeads] = useState(loadLeads());
  const leads = allLeads.filter((l) => l.brokerId === user?.brokerId);

  function updateStatus(id, status) {
    const updated = allLeads.map((l) => (l.id === id ? { ...l, status } : l));
    setAllLeads(updated);
    saveLeads(updated);
  }

  return (
    <DashboardShell role="broker" title="My Leads" subtitle={`Only records assigned to ${user?.brokerId}`}>
      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-cream bg-white p-10 text-center text-sm text-muted shadow-card">
          No leads assigned to you yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{l.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/broker/leads/${l.id}`} className="font-medium text-ink hover:text-maroon">{l.name}</Link>
                    <p className="text-xs text-muted">{l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.interest}</td>
                  <td className="px-4 py-3">{inr(l.budget)}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      className="input py-1.5 text-xs"
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
