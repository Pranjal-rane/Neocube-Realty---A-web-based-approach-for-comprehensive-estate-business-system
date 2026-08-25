import { DashboardShell } from "../../components/DashboardLayout";
import { loadLeads, loadProperties } from "../../lib/mockData";

const VISITS = [
  { id: "V001", leadId: "L001", date: "2026-08-25", time: "11:00 AM", status: "Scheduled" },
  { id: "V002", leadId: "L004", date: "2026-08-24", time: "02:00 PM", status: "Completed" },
  { id: "V003", leadId: "L002", date: "2026-08-26", time: "04:00 PM", status: "Scheduled" },
];

export default function AdminSiteVisits() {
  const LEADS = loadLeads();
  const PROPERTIES = loadProperties();
  return (
    <DashboardShell role="admin" title="Site Visit Management" subtitle="All scheduled visits across every broker">
      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Map</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {VISITS.map((v) => {
              const lead = LEADS.find((l) => l.id === v.leadId);
              const property = PROPERTIES.find((p) => p.id === lead?.propertyId);
              return (
                <tr key={v.id}>
                  <td className="px-4 py-3 font-medium text-ink">{lead?.name}</td>
                  <td className="px-4 py-3 text-muted">{property?.title}</td>
                  <td className="px-4 py-3 text-muted">{v.date}</td>
                  <td className="px-4 py-3 text-muted">{v.time}</td>
                  <td className="px-4 py-3 text-muted">{v.status}</td>
                  <td className="px-4 py-3">
                    {property ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-maroon underline"
                      >
                        View on map
                      </a>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
