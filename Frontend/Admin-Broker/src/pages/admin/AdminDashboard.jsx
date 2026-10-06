import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { StatCard, Card, StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";

const API_URL = "http://localhost:8080";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [deals, setDeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [
        propertiesResponse,
        leadsResponse,
        brokersResponse,
        dealsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/properties`),
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/brokers`),
        fetch(`${API_URL}/api/deals`),
      ]);

      if (!propertiesResponse.ok) {
        throw new Error("Failed to load properties");
      }

      if (!leadsResponse.ok) {
        throw new Error("Failed to load leads");
      }

      if (!brokersResponse.ok) {
        throw new Error("Failed to load brokers");
      }

      if (!dealsResponse.ok) {
        throw new Error("Failed to load deals");
      }

      const propertiesData = await propertiesResponse.json();
      const leadsData = await leadsResponse.json();
      const brokersData = await brokersResponse.json();
      const dealsData = await dealsResponse.json();

      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(
        err.message ||
          "Unable to load dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const activeLeads = leads.filter((lead) => {
    const status = String(lead.status || "").toUpperCase();

    return status !== "CLOSED" && status !== "LOST";
  }).length;

  const closedDeals = deals.filter((deal) => {
    const status = String(deal.status || "").toUpperCase();

    return (
      status === "CLOSED" ||
      status === "CLOSED_WON" ||
      status === "WON"
    );
  }).length;

  const totalDealAmount = deals.reduce((total, deal) => {
    const amount = Number(deal.dealAmount || 0);

    return total + (Number.isNaN(amount) ? 0 : amount);
  }, 0);

  function formatAmount(amount) {
    if (!amount) return "₹0";

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  }

  if (loading) {
    return (
      <DashboardShell
        role="admin"
        title={`Welcome, ${user?.name || "Admin"}`}
        subtitle={user?.firm}
      >
        <div className="py-10 text-center text-sm text-muted">
          Loading dashboard...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title={`Welcome, ${user?.name || "Admin"}`}
      subtitle={user?.firm}
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Real database statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Properties"
          value={properties.length}
        />

        <StatCard
          label="Active Leads"
          value={activeLeads}
        />

        <StatCard
          label="Brokers"
          value={brokers.length}
        />

        <StatCard
          label="Deals Closed"
          value={closedDeals}
        />

        <StatCard
          label="Deal Value"
          value={formatAmount(totalDealAmount)}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Recent Leads */}
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
            Recent Leads
          </h2>

          <ul className="mt-4 divide-y divide-cream">
            {leads.slice(0, 5).map((lead) => (
              <li
                key={lead.leadId}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    Lead #{lead.leadId}
                  </p>

                  <p className="text-xs text-muted">
                    {lead.interest || "General interest"}
                    {lead.budget
                      ? ` · ₹${Number(lead.budget).toLocaleString("en-IN")}`
                      : ""}
                  </p>
                </div>

                <StatusBadge status={lead.status} />
              </li>
            ))}

            {leads.length === 0 && (
              <li className="py-6 text-center text-sm text-muted">
                No leads found.
              </li>
            )}
          </ul>
        </Card>

        {/* Broker Snapshot */}
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
            Broker Snapshot
          </h2>

          <ul className="mt-4 divide-y divide-cream">
            {brokers.map((broker) => {
              const brokerLeadCount = leads.filter(
                (lead) => lead.brokerId === broker.brokerId
              ).length;

              return (
                <li
                  key={broker.brokerId}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {broker.fullName}
                    </p>

                    <p className="text-xs text-muted">
                      {broker.brokerCode}
                    </p>
                  </div>

                  <span className="text-xs text-muted">
                    {brokerLeadCount} leads
                  </span>
                </li>
              );
            })}

            {brokers.length === 0 && (
              <li className="py-6 text-center text-sm text-muted">
                No brokers found.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}