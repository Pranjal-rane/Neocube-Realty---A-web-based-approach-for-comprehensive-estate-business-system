import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";
import { Pencil, Check, X } from "lucide-react";

const API_BASE = "http://localhost:8080/api";

function inr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function BrokerLeadDetail() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const [saved, setSaved] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);

  const [detailsForm, setDetailsForm] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
  });

  useEffect(() => {
    async function loadLeadDetails() {
      try {
        setLoading(true);
        setError("");

        // Load all leads from backend
        const leadsResponse = await fetch(`${API_BASE}/leads`);

        if (!leadsResponse.ok) {
          throw new Error("Leads could not be loaded.");
        }

        const allLeads = await leadsResponse.json();

        // URL id is string, backend leadId is number
        const foundLead = allLeads.find(
          (item) => String(item.leadId) === String(id)
        );

        if (!foundLead) {
          setLead(null);
          return;
        }

        setLead(foundLead);

        setDetailsForm({
          name: foundLead.name || `Customer #${foundLead.customerId}`,
          phone: foundLead.phone || "",
          email: foundLead.email || "",
          budget: foundLead.budget || "",
        });

        // Load properties from backend
        const propertiesResponse = await fetch(
          `${API_BASE}/properties`
        );

        if (propertiesResponse.ok) {
          const properties = await propertiesResponse.json();

          const foundProperty = properties.find(
            (item) =>
              Number(item.propertyId) === Number(foundLead.propertyId)
          );

          setProperty(foundProperty || null);
        }
      } catch (err) {
        console.error("Lead detail loading error:", err);
        setError(
          err.message || "Unable to load lead details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeadDetails();
  }, [id]);

  function updateDetailsForm(key, value) {
    setDetailsForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEditingDetails() {
    setDetailsForm({
      name: lead?.name || `Customer #${lead?.customerId || ""}`,
      phone: lead?.phone || "",
      email: lead?.email || "",
      budget: lead?.budget || "",
    });

    setEditingDetails(true);
  }

  function handleSaveDetails(event) {
    event.preventDefault();

    // Backend customer update API is not being changed here.
    // Keep this as frontend display state only for now.
    setLead((current) => ({
      ...current,
      name: detailsForm.name,
      phone: detailsForm.phone,
      email: detailsForm.email,
      budget: Number(detailsForm.budget) || 0,
    }));

    setEditingDetails(false);
    setDetailsSaved(true);

    setTimeout(() => {
      setDetailsSaved(false);
    }, 2000);
  }

  function handleSave(event) {
    event.preventDefault();

    // Follow-up/notes backend integration will use the
    // existing FollowUp API separately.
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  if (loading) {
    return (
      <DashboardShell
        role="broker"
        title="Loading lead..."
      >
        <div className="rounded-xl border border-cream bg-white p-10 text-center shadow-card">
          <p className="text-sm text-muted">
            Loading lead details...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell
        role="broker"
        title="Unable to load lead"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>

        <Link
          to="/broker/leads"
          className="mt-4 inline-block text-maroon hover:underline"
        >
          ← Back to My Leads
        </Link>
      </DashboardShell>
    );
  }

  if (!lead) {
    return (
      <DashboardShell
        role="broker"
        title="Lead not found"
      >
        <Link
          to="/broker/leads"
          className="text-maroon hover:underline"
        >
          Back to My Leads
        </Link>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="broker"
      title={lead.name || `Customer #${lead.customerId}`}
      subtitle={`Lead ${lead.leadId} · ${
        property?.title || lead.interest || "Property inquiry"
      }`}
    >
      <Link
        to="/broker/leads"
        className="mb-4 inline-block text-sm text-maroon hover:underline"
      >
        ← Back to My Leads
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Customer details */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
              Customer details
            </h2>

            {!editingDetails && (
              <button
                onClick={startEditingDetails}
                className="inline-flex items-center gap-1 text-xs font-medium text-maroon hover:underline"
              >
                <Pencil size={13} />
                Edit
              </button>
            )}
          </div>

          {editingDetails ? (
            <form
              onSubmit={handleSaveDetails}
              className="mt-4 space-y-3"
            >
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                  Name
                </span>

                <input
                  required
                  className="input"
                  value={detailsForm.name}
                  onChange={(event) =>
                    updateDetailsForm(
                      "name",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                  Mobile
                </span>

                <input
                  className="input"
                  value={detailsForm.phone}
                  onChange={(event) =>
                    updateDetailsForm(
                      "phone",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                  Email
                </span>

                <input
                  type="email"
                  className="input"
                  value={detailsForm.email}
                  onChange={(event) =>
                    updateDetailsForm(
                      "email",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                  Budget (INR)
                </span>

                <input
                  required
                  type="number"
                  className="input"
                  value={detailsForm.budget}
                  onChange={(event) =>
                    updateDetailsForm(
                      "budget",
                      event.target.value
                    )
                  }
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary gap-1.5"
                >
                  <Check size={14} />
                  Save
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditingDetails(false)
                  }
                  className="btn-outline gap-1.5"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-4 space-y-2 text-sm">
              <Row
                label="Customer ID"
                value={lead.customerId}
              />

              <Row
                label="Mobile"
                value={lead.phone || "Not available"}
              />

              <Row
                label="Email"
                value={lead.email || "Not available"}
              />

              <Row
                label="Budget"
                value={inr(lead.budget)}
              />

              <Row
                label="Interested property"
                value={
                  property?.title ||
                  lead.interest ||
                  "Not available"
                }
              />

              <Row
                label="Status"
                value={
                  <StatusBadge status={lead.status} />
                }
              />
            </dl>
          )}

          {detailsSaved && (
            <p className="mt-3 text-sm text-sage">
              Customer details updated.
            </p>
          )}
        </Card>

        {/* Follow-up */}
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">
            Follow-up & call notes
          </h2>

          <form
            onSubmit={handleSave}
            className="mt-4 space-y-4"
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Call notes
              </span>

              <textarea
                rows={4}
                className="input"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                Next follow-up date
              </span>

              <input
                type="date"
                className="input"
                value={followUp}
                onChange={(event) =>
                  setFollowUp(event.target.value)
                }
              />
            </label>

            <button
              type="submit"
              className="btn-primary"
            >
              Save
            </button>

            {saved && (
              <span className="ml-3 text-sm text-sage">
                Saved.
              </span>
            )}
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-cream pb-2">
      <dt className="text-muted">
        {label}
      </dt>

      <dd className="font-medium text-ink">
        {value}
      </dd>
    </div>
  );
}