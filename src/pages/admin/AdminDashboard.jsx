import { DashboardShell } from "../../components/DashboardLayout";
import { StatCard, Card, StatusBadge } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads, loadProperties, inr, commissionFor } from "../../lib/mockData";

export default function AdminDashboard() {
  const { user, allBrokers } = useAuth();
  const brokers = allBrokers();
  const LEADS = loadLeads();
  const PROPERTIES = loadProperties();
  const revenue = LEADS.filter((l) => l.status === "won").reduce((s, l) => s + commissionFor(l), 0);
  const dealsClosed = LEADS.filter((l) => l.status === "won").length;

  return (
    <DashboardShell role="admin" title={`Welcome, ${user?.name}`} subtitle={user?.firm}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Properties" value={PROPERTIES.length} />
        <StatCard label="Active leads" value={LEADS.filter((l) => l.status !== "won" && l.status !== "lost").length} />
        <StatCard label="Brokers" value={brokers.length} />
        <StatCard label="Deals closed" value={dealsClosed} />
        <StatCard label="Commission earned" value={inr(revenue)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Recent leads</h2>
          <ul className="mt-4 divide-y divide-cream">
            {LEADS.slice(0, 5).map((l) => (
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

        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Broker snapshot</h2>
          <ul className="mt-4 divide-y divide-cream">
            {brokers.map((b) => {
              const count = LEADS.filter((l) => l.brokerId === b.brokerId).length;
              return (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{b.name}</p>
                    <p className="text-xs text-muted">{b.brokerId}</p>
                  </div>
                  <span className="text-xs text-muted">{count} leads</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
