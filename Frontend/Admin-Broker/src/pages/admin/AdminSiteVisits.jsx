import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";

const API_URL = "http://localhost:8080";

export default function AdminSiteVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVisits();
  }, []);

  async function loadVisits() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/site-visits`);

      if (!response.ok) {
        throw new Error(`Failed to load site visits (${response.status})`);
      }

      const data = await response.json();

      setVisits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Site Visits API Error:", err);
      setError(err.message || "Unable to load site visits.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN");
  }

  return (
    <DashboardShell
      role="admin"
      title="Site Visits"
      subtitle="View and monitor property site visits"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              All Site Visits
            </h2>

            <p className="mt-1 text-xs text-muted">
              Total visits: {visits.length}
            </p>
          </div>

          <button
            onClick={loadVisits}
            className="btn-outline px-3 py-2 text-xs"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">
            Loading site visits...
          </div>
        ) : visits.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            No site visits found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Visit ID</th>
                  <th className="px-4 py-3">Customer ID</th>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Broker ID</th>
                  <th className="px-4 py-3">Visit Date</th>
                  <th className="px-4 py-3">Visit Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-cream">
                {visits.map((visit) => (
                  <tr key={visit.visitId}>
                    <td className="px-4 py-3 font-medium text-ink">
                      #{visit.visitId}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {visit.customerId ? `#${visit.customerId}` : "—"}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {visit.propertyId ? `#${visit.propertyId}` : "—"}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {visit.brokerId ? `#${visit.brokerId}` : "Unassigned"}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {formatDate(visit.visitDate || visit.preferredDate)}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {visit.visitTime || visit.preferredTime || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          visit.visitStatus ||
                          visit.status ||
                          "PENDING"
                        }
                      />
                    </td>

                    <td className="max-w-[220px] truncate px-4 py-3 text-muted">
                      {visit.message || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}