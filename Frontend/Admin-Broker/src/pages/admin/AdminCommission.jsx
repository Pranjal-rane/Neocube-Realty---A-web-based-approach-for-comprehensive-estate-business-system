import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";

const API_URL = "http://localhost:8080";
const COMMISSION_RATE = 0.02;

export default function AdminCommission() {
  const [deals, setDeals] = useState([]);
  const [brokers, setBrokers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCommissionData();
  }, []);

  async function loadCommissionData() {
    try {
      setLoading(true);
      setError("");

      const [dealsResponse, brokersResponse] = await Promise.all([
        fetch(`${API_URL}/api/deals`),
        fetch(`${API_URL}/api/brokers`),
      ]);

      if (!dealsResponse.ok || !brokersResponse.ok) {
        throw new Error("Failed to load commission data");
      }

      const dealsData = await dealsResponse.json();
      const brokersData = await brokersResponse.json();

      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
    } catch (err) {
      console.error("Commission API Error:", err);
      setError(err.message || "Unable to load commission data.");
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  }

  function getBrokerName(brokerId) {
    if (!brokerId) return "Unassigned";

    const broker = brokers.find(
      (item) => item.brokerId === brokerId
    );

    return broker ? broker.fullName : `Broker #${brokerId}`;
  }

  // Group deals broker-wise
  const brokerCommissionMap = {};

  deals.forEach((deal) => {
    const brokerId = deal.brokerId || "unassigned";
    const dealAmount = Number(deal.dealAmount || 0);

    if (!brokerCommissionMap[brokerId]) {
      brokerCommissionMap[brokerId] = {
        brokerId,
        brokerName: getBrokerName(deal.brokerId),
        deals: 0,
        dealValue: 0,
        commission: 0,
      };
    }

    brokerCommissionMap[brokerId].deals += 1;
    brokerCommissionMap[brokerId].dealValue += dealAmount;
    brokerCommissionMap[brokerId].commission +=
      dealAmount * COMMISSION_RATE;
  });

  const brokerCommission = Object.values(brokerCommissionMap);

  const totalDealValue = brokerCommission.reduce(
    (total, broker) => total + broker.dealValue,
    0
  );

  const totalCommission = brokerCommission.reduce(
    (total, broker) => total + broker.commission,
    0
  );

  if (loading) {
    return (
      <DashboardShell
        role="admin"
        title="Commission"
        subtitle="Broker-wise commission from real deals"
      >
        <div className="py-10 text-center text-sm text-muted">
          Loading commission data...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title="Commission"
      subtitle="Broker-wise commission from real deals"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-cream bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            Total Brokers
          </p>

          <p className="mt-2 text-2xl font-semibold text-ink">
            {brokerCommission.length}
          </p>
        </div>

        <div className="rounded-xl border border-cream bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            Total Deal Value
          </p>

          <p className="mt-2 text-2xl font-semibold text-ink">
            {formatAmount(totalDealValue)}
          </p>
        </div>

        <div className="rounded-xl border border-cream bg-white p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">
            Total Commission
          </p>

          <p className="mt-2 text-2xl font-semibold text-ink">
            {formatAmount(totalCommission)}
          </p>

          <p className="mt-1 text-xs text-muted">
            Commission rate: 2%
          </p>
        </div>
      </div>

      {/* Broker-wise Commission */}
      <Card className="mt-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              Broker-wise Commission
            </h2>

            <p className="mt-1 text-xs text-muted">
              Commission calculated from each broker's deals
            </p>
          </div>

          <button
            onClick={loadCommissionData}
            className="btn-outline px-3 py-2 text-xs"
          >
            Refresh
          </button>
        </div>

        {brokerCommission.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            No deals found. Commission will appear when deals are created.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Broker</th>
                  <th className="px-4 py-3">Deals</th>
                  <th className="px-4 py-3">Total Deal Value</th>
                  <th className="px-4 py-3">Commission Rate</th>
                  <th className="px-4 py-3">Commission Earned</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-cream">
                {brokerCommission.map((broker) => (
                  <tr key={broker.brokerId}>
                    <td className="px-4 py-3 font-medium text-ink">
                      {broker.brokerName}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {broker.deals}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {formatAmount(broker.dealValue)}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      2%
                    </td>

                    <td className="px-4 py-3 font-semibold text-ink">
                      {formatAmount(broker.commission)}
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