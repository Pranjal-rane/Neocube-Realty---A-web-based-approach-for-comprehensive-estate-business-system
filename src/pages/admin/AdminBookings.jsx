import { DashboardShell } from "../../components/DashboardLayout";
import { loadLeads, loadProperties, inr } from "../../lib/mockData";

export default function AdminBookings() {
  const LEADS = loadLeads();
  const PROPERTIES = loadProperties();
  const booked = LEADS.filter((l) => l.status === "won");

  return (
    <DashboardShell role="admin" title="Booking Management" subtitle="Deals that have moved to Closed / Won">
      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {booked.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted">No bookings yet.</td></tr>
            )}
            {booked.map((l) => {
              const property = PROPERTIES.find((p) => p.id === l.propertyId);
              return (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                  <td className="px-4 py-3 text-muted">{property?.title}</td>
                  <td className="px-4 py-3 text-muted">{l.brokerId}</td>
                  <td className="px-4 py-3">{inr(500000)}</td>
                  <td className="px-4 py-3 text-sage">Successful</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
