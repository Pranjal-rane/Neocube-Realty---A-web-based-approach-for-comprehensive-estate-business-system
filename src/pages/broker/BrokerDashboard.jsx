import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/DashboardLayout";
import { StatCard, Card, StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads, loadProperties, inr } from "../../lib/mockData";

export default function BrokerDashboard() {
  const { user } = useAuth();
  const leads = loadLeads().filter((l) => l.brokerId === user?.brokerId);
  const listings = loadProperties().filter((p) => p.brokerId === user?.brokerId);
  const won = leads.filter((l) => l.status === "won");
  const pipeline = leads.filter((l) => l.status !== "lost" && l.status !== "won").reduce((s, l) => s + l.budget, 0);

  return (
    <DashboardShell role="broker" title={`Welcome, ${user?.name}`} subtitle={`Broker ID ${user?.brokerId}`}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My leads" value={leads.length} hint="Assigned to you" />
        <StatCard label="My listings" value={listings.length} />
        <StatCard label="Closed won" value={won.length} />
        <StatCard label="Pipeline value" value={inr(pipeline)} hint="Excludes closed/lost" />
      </div>

      {leads.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-cream bg-white p-10 text-center shadow-card">
          <h2 className="font-display text-lg uppercase tracking-[0.1em] text-ink">No assignments yet</h2>
          <p className="mt-2 text-sm text-muted">
            Your admin hasn&apos;t assigned any leads to {user?.brokerId} yet. They&apos;ll appear here as soon as they do.
          </p>
        </div>
      ) : (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Recent leads</h2>
            <Link to="/broker/leads" className="text-sm font-medium text-maroon hover:underline">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-cream">
            {leads.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{l.name}</p>
                  <p className="text-xs text-muted">{l.interest} · {inr(l.budget)}</p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">My listings</h2>
          <Link to="/broker/listings" className="text-sm font-medium text-maroon hover:underline">
            {listings.length === 0 ? "Submit a property" : "View all"}
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Got a property from an owner? Submit their details and it goes straight to the customer website.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-cream">
            {listings.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-muted">{p.locality} · {p.bhk} BHK</p>
                </div>
                <span className="text-xs font-mono text-muted">{inr(p.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardShell>
  );
}
