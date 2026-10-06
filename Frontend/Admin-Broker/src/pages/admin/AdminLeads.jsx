import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";

const API_URL = "http://localhost:8080";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingLeadId, setSavingLeadId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [leadsResponse, brokersResponse] = await Promise.all([
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/brokers`),
      ]);

      if (!leadsResponse.ok) {
        throw new Error(
          `Failed to load leads (${leadsResponse.status})`
        );
      }

      if (!brokersResponse.ok) {
        throw new Error(
          `Failed to load brokers (${brokersResponse.status})`
        );
      }

      const leadsData = await leadsResponse.json();
      const brokersData = await brokersResponse.json();

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
    } catch (err) {
      console.error("Leads/Brokers API Error:", err);
      setError(err.message || "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }

  async function reassignBroker(lead, brokerId) {
    const newBrokerId =
      brokerId === "" ? null : Number(brokerId);

    if (newBrokerId === lead.brokerId) {
      return;
    }

    try {
      setSavingLeadId(lead.leadId);
      setError("");

      const updatedLead = {
        ...lead,
        brokerId: newBrokerId,
      };

      const response = await fetch(
        `${API_URL}/api/leads/${lead.leadId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLead),
        }
      );

      const contentType = response.headers.get("content-type");

      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                `Failed to reassign broker (${response.status})`
        );
      }

      setLeads((currentLeads) =>
        currentLeads.map((item) =>
          item.leadId === lead.leadId
            ? {
                ...item,
                brokerId: newBrokerId,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Reassign Broker Error:", err);
      setError(
        err.message || "Unable to reassign broker."
      );
    } finally {
      setSavingLeadId(null);
    }
  }

  function formatBudget(budget) {
    if (
      budget === null ||
      budget === undefined ||
      budget === ""
    ) {
      return "—";
    }

    const value = Number(budget);

    if (Number.isNaN(value)) {
      return "—";
    }

    return `₹${value.toLocaleString("en-IN")}`;
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN");
  }

  function getBrokerName(brokerId) {
    const broker = brokers.find(
      (item) => item.brokerId === brokerId
    );

    return broker
      ? `${broker.fullName} (${broker.brokerCode})`
      : "Unassigned";
  }

  return (
    <DashboardShell
      role="admin"
      title="Lead Management"
      subtitle="Manage and monitor all property leads"
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
              All Leads
            </h2>

            <p className="mt-1 text-xs text-muted">
              Total leads: {leads.length}
            </p>
          </div>

          <button
            onClick={loadData}
            className="btn-outline px-3 py-2 text-xs"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Lead ID</th>
                  <th className="px-4 py-3">Customer ID</th>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Interest</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Broker</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-cream">
                {leads.map((lead) => (
                  <tr key={lead.leadId}>
                    <td className="px-4 py-3 font-medium text-ink">
                      #{lead.leadId}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {lead.customerId
                        ? `#${lead.customerId}`
                        : "—"}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {lead.propertyId
                        ? `#${lead.propertyId}`
                        : "—"}
                    </td>

                    <td className="px-4 py-3 text-ink">
                      {lead.interest || "—"}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {formatBudget(lead.budget)}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {lead.brokerId
                        ? `#${lead.brokerId}`
                        : "Unassigned"}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {formatDate(lead.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        className="input min-w-[190px] py-2 text-xs"
                        value={lead.brokerId ?? ""}
                        disabled={
                          savingLeadId === lead.leadId
                        }
                        onChange={(e) =>
                          reassignBroker(
                            lead,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Unassigned
                        </option>

                        {brokers.map((broker) => (
                          <option
                            key={broker.brokerId}
                            value={broker.brokerId}
                          >
                            {broker.fullName} (
                            {broker.brokerCode})
                          </option>
                        ))}
                      </select>

                      {savingLeadId === lead.leadId && (
                        <p className="mt-1 text-xs text-muted">
                          Saving...
                        </p>
                      )}
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