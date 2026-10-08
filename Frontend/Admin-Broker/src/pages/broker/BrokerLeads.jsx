import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardShell } from "../../components/DashboardLayout";
import { StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { inr } from "../../lib/mockData";

const STATUS_LABELS = {
  NEW: "New",
  CONTACT: "Contacted",
  SITE_VISITS: "Site Visit",
  NEGOTIATION: "Negotiation",
  BOOKED: "Booked",
  CLOSED_WON: "Closed / Won",
  LOST: "Lost",
};

export default function BrokerLeads() {
  const { user } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBrokerLeads() {
      try {
        setLoading(true);
        setError("");

        // 1. Frontend has broker code like B001/B002
        const brokerCode = user?.brokerId;

        if (!brokerCode) {
          setError("Broker information not found.");
          return;
        }

        // 2. Get broker from backend using broker code
        const brokerResponse = await fetch(
          `http://localhost:8080/api/brokers/code/${encodeURIComponent(
            brokerCode
          )}`
        );

        if (!brokerResponse.ok) {
          throw new Error("Broker not found in database.");
        }

        const broker = await brokerResponse.json();

        // 3. Get leads assigned to this broker
        const leadsResponse = await fetch(
          `http://localhost:8080/api/leads/broker/${broker.brokerId}`
        );

        if (!leadsResponse.ok) {
          throw new Error("Unable to load broker leads.");
        }

        const backendLeads = await leadsResponse.json();

        // 4. Get customer details for each lead
        const leadsWithCustomer = await Promise.all(
          backendLeads.map(async (lead) => {
            let customer = null;

            if (lead.customerId) {
              try {
                const customerResponse = await fetch(
                  `http://localhost:8080/api/customers/${lead.customerId}`
                );

                if (customerResponse.ok) {
                  customer = await customerResponse.json();
                }
              } catch (customerError) {
                console.error(
                  "Customer details could not be loaded:",
                  customerError
                );
              }
            }

            return {
              ...lead,
              name: customer?.fullName || "Unknown Customer",
              phone: customer?.phone || "—",
              email: customer?.email || "—",
            };
          })
        );

        setLeads(leadsWithCustomer);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadBrokerLeads();
  }, [user?.brokerId]);

  async function updateStatus(leadId, status) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/leads/${leadId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lead status.");
      }

      const updatedLead = await response.json();

      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          lead.leadId === leadId
            ? {
                ...lead,
                status: updatedLead.status,
              }
            : lead
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to update status.");
    }
  }

  if (loading) {
    return (
      <DashboardShell
        role="broker"
        title="My Leads"
        subtitle={`Records assigned to ${user?.brokerId || "broker"}`}
      >
        <div className="rounded-xl border border-cream bg-white p-10 text-center text-sm text-muted shadow-card">
          Loading leads...
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        role="broker"
        title="My Leads"
        subtitle={`Records assigned to ${user?.brokerId || "broker"}`}
      >
        <div className="rounded-xl border border-red-200 bg-white p-10 text-center text-sm text-red-600 shadow-card">
          {error}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="broker"
      title="My Leads"
      subtitle={`Only records assigned to ${user?.brokerId || "broker"}`}
    >
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
              {leads.map((lead) => (
                <tr key={lead.leadId}>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {lead.leadId}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/broker/leads/${lead.leadId}`}
                      className="font-medium text-ink hover:text-maroon"
                    >
                      {lead.name}
                    </Link>

                    <p className="text-xs text-muted">
                      {lead.phone}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {lead.interest || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {lead.budget != null ? inr(lead.budget) : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      status={STATUS_LABELS[lead.status] || lead.status}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <select
                      className="input py-1.5 text-xs"
                      value={lead.status || "NEW"}
                      onChange={(e) =>
                        updateStatus(
                          lead.leadId,
                          e.target.value
                        )
                      }
                    >
                      {Object.entries(STATUS_LABELS).map(
                        ([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        )
                      )}
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