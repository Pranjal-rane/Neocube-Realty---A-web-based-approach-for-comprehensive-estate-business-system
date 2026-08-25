import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";
import { loadLeads, saveLeads, loadProperties, inr } from "../../lib/mockData";
import { Pencil, Check, X } from "lucide-react";

export default function BrokerLeadDetail() {
  const { id } = useParams();
  const [leads, setLeads] = useState(loadLeads());
  const lead = leads.find((l) => l.id === id);
  const property = loadProperties().find((p) => p.id === lead?.propertyId);

  const [notes, setNotes] = useState(lead?.notes || "");
  const [followUp, setFollowUp] = useState(lead?.nextFollowUp || "");
  const [saved, setSaved] = useState(false);

  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    budget: lead?.budget || "",
  });
  const [detailsSaved, setDetailsSaved] = useState(false);

  if (!lead) {
    return (
      <DashboardShell role="broker" title="Lead not found">
        <Link to="/broker/leads" className="text-maroon hover:underline">Back to My Leads</Link>
      </DashboardShell>
    );
  }

  function handleSave(e) {
    e.preventDefault();
    const updated = leads.map((l) => (l.id === lead.id ? { ...l, notes, nextFollowUp: followUp } : l));
    setLeads(updated);
    saveLeads(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateDetailsForm(key, value) {
    setDetailsForm((f) => ({ ...f, [key]: value }));
  }

  function startEditingDetails() {
    setDetailsForm({ name: lead.name, phone: lead.phone, email: lead.email, budget: lead.budget });
    setEditingDetails(true);
  }

  function handleSaveDetails(e) {
    e.preventDefault();
    const updated = leads.map((l) =>
      l.id === lead.id
        ? { ...l, name: detailsForm.name, phone: detailsForm.phone, email: detailsForm.email, budget: Number(detailsForm.budget) || 0 }
        : l
    );
    setLeads(updated);
    saveLeads(updated);
    setEditingDetails(false);
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 2000);
  }

  return (
    <DashboardShell role="broker" title={lead.name} subtitle={`Lead ${lead.id} · ${property?.title || lead.interest}`}>
      <Link to="/broker/leads" className="mb-4 inline-block text-sm text-maroon hover:underline">← Back to My Leads</Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Customer details</h2>
            {!editingDetails && (
              <button
                onClick={startEditingDetails}
                className="inline-flex items-center gap-1 text-xs font-medium text-maroon hover:underline"
              >
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>

          {editingDetails ? (
            <form onSubmit={handleSaveDetails} className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Name</span>
                <input required className="input" value={detailsForm.name} onChange={(e) => updateDetailsForm("name", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Mobile</span>
                <input required className="input" value={detailsForm.phone} onChange={(e) => updateDetailsForm("phone", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Email</span>
                <input required type="email" className="input" value={detailsForm.email} onChange={(e) => updateDetailsForm("email", e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Budget (INR)</span>
                <input required type="number" className="input" value={detailsForm.budget} onChange={(e) => updateDetailsForm("budget", e.target.value)} />
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary gap-1.5">
                  <Check size={14} /> Save
                </button>
                <button type="button" onClick={() => setEditingDetails(false)} className="btn-outline gap-1.5">
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Mobile" value={lead.phone} />
              <Row label="Email" value={lead.email} />
              <Row label="Budget" value={inr(lead.budget)} />
              <Row label="Interested property" value={property?.title || lead.interest} />
              <Row label="Status" value={<StatusBadge status={lead.status} />} />
            </dl>
          )}
          {detailsSaved && <p className="mt-3 text-sm text-sage">Customer details updated.</p>}
        </Card>

        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Follow-up & call notes</h2>
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Call notes</span>
              <textarea rows={4} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">Next follow-up date</span>
              <input type="date" className="input" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
            </label>
            <button type="submit" className="btn-primary">Save</button>
            {saved && <span className="ml-3 text-sm text-sage">Saved.</span>}
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-cream pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
