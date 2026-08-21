import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";
import { loadLeads, saveLeads, loadProperties, inr } from "../../lib/mockData";

export default function BrokerLeadDetail() {
  const { id } = useParams();
  const [leads, setLeads] = useState(loadLeads());
  const lead = leads.find((l) => l.id === id);
  const property = loadProperties().find((p) => p.id === lead?.propertyId);
  const [notes, setNotes] = useState(lead?.notes || "");
  const [followUp, setFollowUp] = useState(lead?.nextFollowUp || "");
  const [saved, setSaved] = useState(false);

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

  return (
    <DashboardShell role="broker" title={lead.name} subtitle={`Lead ${lead.id} · ${property?.title || lead.interest}`}>
      <Link to="/broker/leads" className="mb-4 inline-block text-sm text-maroon hover:underline">← Back to My Leads</Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Customer details</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Mobile" value={lead.phone} />
            <Row label="Email" value={lead.email} />
            <Row label="Budget" value={inr(lead.budget)} />
            <Row label="Interested property" value={property?.title || lead.interest} />
            <Row label="Status" value={<StatusBadge status={lead.status} />} />
          </dl>
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
