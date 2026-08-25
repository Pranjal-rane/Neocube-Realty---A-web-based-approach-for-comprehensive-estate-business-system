import { useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { loadLeads, inr, commissionFor } from "../../lib/mockData";

export default function AdminCommission() {
  const LEADS = loadLeads();
  const won = LEADS.filter((l) => l.status === "won");
  const [states, setStates] = useState(Object.fromEntries(won.map((l) => [l.id, "Pending"])));

  function advance(id) {
    setStates((s) => ({
      ...s,
      [id]: s[id] === "Pending" ? "Approved" : s[id] === "Approved" ? "Released" : "Released",
    }));
  }

  return (
    <DashboardShell role="admin" title="Commission Management" subtitle="Pending → Approved → Released">
      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {won.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No closed deals yet.</td></tr>
            )}
            {won.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium text-ink">{l.brokerId}</td>
                <td className="px-4 py-3 text-muted">{l.interest}</td>
                <td className="px-4 py-3">{inr(commissionFor(l))}</td>
                <td className="px-4 py-3 text-muted">{states[l.id]}</td>
                <td className="px-4 py-3">
                  {states[l.id] !== "Released" ? (
                    <button onClick={() => advance(l.id)} className="btn-outline px-3 py-1.5 text-xs">
                      Mark {states[l.id] === "Pending" ? "Approved" : "Released"}
                    </button>
                  ) : (
                    <span className="text-xs text-sage">Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
