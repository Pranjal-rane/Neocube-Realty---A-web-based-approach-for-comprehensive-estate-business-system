import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { useAuth } from "../../lib/auth";

const API_BASE = "http://localhost:8080/api";

export default function BrokerProfile() {
  const { user } = useAuth();

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.brokerId) {
      setLoading(false);
      return;
    }

    async function loadBrokerProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/brokers/code/${user.brokerId}`
        );

        if (!response.ok) {
          throw new Error("Broker profile could not be loaded.");
        }

        const data = await response.json();
        setBroker(data);
      } catch (err) {
        console.error("Broker profile error:", err);
        setError(
          err.message || "Unable to load broker profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBrokerProfile();
  }, [user?.brokerId]);

  return (
    <DashboardShell
      role="broker"
      title="Broker Profile"
      subtitle="Your account details"
    >
      {loading && (
        <Card className="max-w-md">
          <p className="text-sm text-muted">
            Loading profile...
          </p>
        </Card>
      )}

      {error && (
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && broker && (
        <Card className="max-w-md">
          <dl className="space-y-3 text-sm">
            <Row
              label="Name"
              value={broker.fullName}
            />

            <Row
              label="Broker ID"
              value={broker.brokerCode}
            />

            <Row
              label="Email"
              value={broker.email}
            />

            <Row
              label="Phone"
              value={broker.phone}
            />

            <Row
              label="Status"
              value={broker.status}
            />
          </dl>
        </Card>
      )}
    </DashboardShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-cream pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">
        {value || "—"}
      </dd>
    </div>
  );
}