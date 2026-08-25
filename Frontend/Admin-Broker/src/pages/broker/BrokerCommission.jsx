import { DashboardShell } from "../../components/DashboardLayout";
import { useAuth } from "../../lib/auth";
import { loadLeads, inr, commissionFor } from "../../lib/mockData";

export default function BrokerCommission() {
  const { user } = useAuth();
  const LEADS = loadLeads();
  const won = LEADS.filter((l) => l.brokerId === user?.brokerId && l.status === "won");
  const total = won.reduce((s, l) => s + commissionFor(l), 0);

  return (
    <DashboardShell role="broker" title="My Commission" subtitle="Commission earned from your closed deals">
      <div className="mb-6 rounded-xl border border-cream bg-white p-5 shadow-card">
        <p className="text-xs uppercase tracking-wide text-muted">Total commission</p>
        <p className="mt-2 font-display text-2xl font-semibold text-ink">{inr(total)}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {won.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">No closed deals yet.</td></tr>
            )}
            {won.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium text-ink">{l.interest}</td>
                <td className="px-4 py-3">{inr(commissionFor(l))}</td>
                <td className="px-4 py-3 text-muted">Pending</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
