import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardShell } from "../../components/DashboardLayout";
import { StatCard, Card, StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";

const API_BASE = "http://localhost:8080/api";

function inr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function BrokerDashboard() {
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.brokerId) {
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        // B003 -> numeric broker ID (7)
        const brokerResponse = await fetch(
          `${API_BASE}/brokers/code/${user.brokerId}`
        );

        if (!brokerResponse.ok) {
          throw new Error("Broker details could not be loaded.");
        }

        const broker = await brokerResponse.json();

        // Load all backend leads
        const leadsResponse = await fetch(`${API_BASE}/leads`);

        if (!leadsResponse.ok) {
          throw new Error("Leads could not be loaded.");
        }

        const allLeads = await leadsResponse.json();

        // Show only this broker's leads
        const brokerLeads = allLeads.filter(
          (lead) => Number(lead.brokerId) === Number(broker.brokerId)
        );

        setLeads(brokerLeads);

        // Load backend properties
        const propertiesResponse = await fetch(`${API_BASE}/properties`);

        if (!propertiesResponse.ok) {
          throw new Error("Properties could not be loaded.");
        }

        const allProperties = await propertiesResponse.json();

        // Keep only properties linked to this broker when brokerId exists.
        // If backend properties don't have brokerId, dashboard listings stay empty.
        const brokerProperties = allProperties.filter(
          (property) =>
            property.brokerId != null &&
            Number(property.brokerId) === Number(broker.brokerId)
        );

        setListings(brokerProperties);
      } catch (err) {
        console.error("Broker dashboard loading error:", err);
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user?.brokerId]);

  const won = leads.filter(
    (lead) =>
      lead.status === "CLOSED_WON" ||
      lead.status === "won"
  );

  const pipeline = leads
    .filter(
      (lead) =>
        lead.status !== "LOST" &&
        lead.status !== "CLOSED_WON" &&
        lead.status !== "lost" &&
        lead.status !== "won"
    )
    .reduce(
      (sum, lead) => sum + Number(lead.budget || 0),
      0
    );

  return (
    <DashboardShell
      role="broker"
      title={`Welcome, ${user?.name}`}
      subtitle={`Broker ID ${user?.brokerId}`}
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My leads"
          value={loading ? "..." : leads.length}
          hint="Assigned to you"
        />

        <StatCard
          label="My listings"
          value={loading ? "..." : listings.length}
        />

        <StatCard
          label="Closed won"
          value={loading ? "..." : won.length}
        />

        <StatCard
          label="Pipeline value"
          value={loading ? "..." : inr(pipeline)}
          hint="Excludes closed/lost"
        />
      </div>

      {loading ? (
        <div className="mt-6 rounded-xl border border-cream bg-white p-10 text-center shadow-card">
          <p className="text-sm text-muted">
            Loading broker data...
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-cream bg-white p-10 text-center shadow-card">
          <h2 className="font-display text-lg uppercase tracking-[0.1em] text-ink">
            No assignments yet
          </h2>

          <p className="mt-2 text-sm text-muted">
            No leads are currently assigned to {user?.brokerId}.
          </p>
        </div>
      ) : (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              Recent leads
            </h2>

            <Link
              to="/broker/leads"
              className="text-sm font-medium text-maroon hover:underline"
            >
              View all
            </Link>
          </div>

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
                    {lead.interest || "Property inquiry"} ·{" "}
                    {inr(lead.budget)}
                  </p>
                </div>

                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
            My listings
          </h2>

          <Link
            to="/broker/listings"
            className="text-sm font-medium text-maroon hover:underline"
          >
            {listings.length === 0 ? "Submit a property" : "View all"}
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No broker-linked listings are available yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-cream">
            {listings.slice(0, 5).map((property) => (
              <li
                key={property.propertyId}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {property.title}
                  </p>

                  <p className="text-xs text-muted">
                    {property.locality} · {property.bhk || ""} BHK
                  </p>
                </div>

                <span className="text-xs font-mono text-muted">
                  {inr(property.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardShell>
  );
}