import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { useAuth } from "../../lib/auth";

export default function BrokerProfile() {
  const { user } = useAuth();

  return (
    <DashboardShell role="broker" title="Broker Profile" subtitle="Your account details">
      <Card className="max-w-md">
        <dl className="space-y-3 text-sm">
          <Row label="Name" value={user?.name} />
          <Row label="Broker ID" value={user?.brokerId} />
          <Row label="Email" value={user?.email} />
          <Row label="Phone" value={user?.phone} />
        </dl>
      </Card>
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
