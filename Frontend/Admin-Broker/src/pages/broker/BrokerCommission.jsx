import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { useAuth } from "../../lib/auth";

const API_BASE = "http://localhost:8080/api";

function inr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function BrokerCommission() {
  const { user } = useAuth();

  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.brokerId) {
      setLoading(false);
      return;
    }

    const loadCommissions = async () => {
      try {
        setLoading(true);
        setError("");

        // auth.jsx uses broker code such as B001/B002.
        // Backend commission API needs numeric brokerId.
        const brokerResponse = await fetch(
          `${API_BASE}/brokers/code/${user.brokerId}`
        );

        if (!brokerResponse.ok) {
          throw new Error("Broker details could not be loaded.");
        }

        const broker = await brokerResponse.json();

        const commissionResponse = await fetch(
          `${API_BASE}/commissions/broker/${broker.brokerId}`
        );

        if (!commissionResponse.ok) {
          throw new Error("Commission data could not be loaded.");
        }

        const data = await commissionResponse.json();

        setCommissions(data);
      } catch (err) {
        console.error("Commission loading error:", err);
        setError(err.message || "Unable to load commission data.");
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, [user?.brokerId]);

  const total = commissions.reduce(
    (sum, commission) =>
      sum + Number(commission.commissionAmount || 0),
    0
  );

  return (
    <DashboardShell
      role="broker"
      title="My Commission"
      subtitle="Commission earned from your closed deals"
    >
      <div className="mb-6 rounded-xl border border-cream bg-white p-5 shadow-card">
        <p className="text-xs uppercase tracking-wide text-muted">
          Total commission
        </p>

        <p className="mt-2 font-display text-2xl font-semibold text-ink">
          {loading ? "Loading..." : inr(total)}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                  Loading commission...
                </td>
              </tr>
            )}

            {!loading && !error && commissions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                  No closed deals yet.
                </td>
              </tr>
            )}

            {!loading &&
              commissions.map((commission) => (
                <tr key={commission.commissionId}>
                  <td className="px-4 py-3 font-medium text-ink">
                    Deal #{commission.dealId}
                  </td>

                  <td className="px-4 py-3">
                    {inr(commission.commissionAmount)}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {commission.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

