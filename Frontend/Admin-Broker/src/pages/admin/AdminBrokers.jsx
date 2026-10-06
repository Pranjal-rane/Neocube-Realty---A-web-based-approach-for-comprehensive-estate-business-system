import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { Plus, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080";

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    passwordHash: "",
  });

  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrokers();
    loadLeads();
  }, []);

  async function loadBrokers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/brokers`);

      if (!response.ok) {
        throw new Error(`Failed to load brokers (${response.status})`);
      }

      const data = await response.json();
      setBrokers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Brokers API Error:", err);
      setError(err.message || "Unable to load brokers.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLeads() {
    try {
      const response = await fetch(`${API_URL}/api/leads`);

      if (!response.ok) {
        throw new Error(`Failed to load leads (${response.status})`);
      }

      const data = await response.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Leads API Error:", err);
    }
  }

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function getNextBrokerCode() {
    const numbers = brokers
      .map((broker) => {
        const match = String(broker.brokerCode || "").match(/^B(\d+)$/);
        return match ? Number(match[1]) : 0;
      })
      .filter((number) => number > 0);

    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

    return `B${String(nextNumber).padStart(3, "0")}`;
  }

  function validateForm() {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!form.fullName.trim()) {
      return "Full name is required.";
    }

    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!phoneRegex.test(form.phone.trim())) {
      return "Phone number must be a valid 10-digit Indian mobile number.";
    }

    if (form.passwordHash && form.passwordHash.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setCreated(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const brokerCode = getNextBrokerCode();

    try {
      const response = await fetch(`${API_URL}/api/brokers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brokerCode,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          passwordHash: form.passwordHash || "temp123",
          status: "ACTIVE",
        }),
      });

      const contentType = response.headers.get("content-type");

      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || `Failed to create broker (${response.status})`
        );
      }

      setCreated({
        broker: data,
        tempPassword: form.passwordHash || "temp123",
      });

      setForm({
        fullName: "",
        email: "",
        phone: "",
        passwordHash: "",
      });

      await loadBrokers();
      await loadLeads();
    } catch (err) {
      console.error("Create Broker Error:", err);
      setError(err.message || "Unable to create broker.");
    }
  }

  async function handleDelete(broker) {
    const assignedCount = leads.filter(
      (lead) => lead.brokerId === broker.brokerId
    ).length;

    const warning =
      assignedCount > 0
        ? `Delete ${broker.fullName} (${broker.brokerCode})? Their ${assignedCount} assigned lead(s) will become "Unassigned" and can be reassigned from the Leads page. This can't be undone.`
        : `Delete ${broker.fullName} (${broker.brokerCode})? Their login will stop working immediately. This can't be undone.`;

    if (!window.confirm(warning)) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/brokers/${broker.brokerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.text();

        throw new Error(
          data || `Failed to delete broker (${response.status})`
        );
      }

      setCreated((current) =>
        current?.broker?.brokerId === broker.brokerId
          ? null
          : current
      );

      await loadBrokers();
      await loadLeads();
    } catch (err) {
      console.error("Delete Broker Error:", err);
      setError(err.message || "Unable to delete broker.");
    }
  }

  return (
    <DashboardShell
      role="admin"
      title="Broker Management"
      subtitle="Add brokers here — they sign in from the same login page with these credentials"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setShowForm((current) => !current);
            setCreated(null);
            setError("");
          }}
          className="btn-primary gap-2"
        >
          <Plus size={16} /> Add Broker
        </button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3">
            <input
              required
              placeholder="Full name"
              className="input"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />

            <input
              required
              type="email"
              placeholder="Email"
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit phone"
              className="input"
              value={form.phone}
              onChange={(e) =>
                update(
                  "phone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              minLength={6}
              className="input"
              value={form.passwordHash}
              onChange={(e) =>
                update("passwordHash", e.target.value)
              }
            />

            <div className="sm:col-span-3">
              <button type="submit" className="btn-primary">
                Create Broker Login
              </button>
            </div>
          </form>

          {created && (
            <div className="mt-4 rounded-lg bg-sage/10 p-3 text-sm text-ink">
              <p className="font-medium">
                Broker account created —{" "}
                {created.broker.brokerCode}
              </p>

              <p className="text-muted">
                Email: {created.broker.email}
              </p>

              <p className="text-muted">
                Temporary password:{" "}
                <span className="font-mono">
                  {created.tempPassword}
                </span>
              </p>
            </div>
          )}
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-cream bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Broker ID</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Assigned leads</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-cream">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted"
                >
                  Loading brokers...
                </td>
              </tr>
            ) : brokers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted"
                >
                  No brokers yet — add one above.
                </td>
              </tr>
            ) : (
              brokers.map((broker) => (
                <tr key={broker.brokerId}>
                  <td className="px-4 py-3 font-medium text-ink">
                    {broker.fullName}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {broker.brokerCode}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {broker.email}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {
                      leads.filter(
                        (lead) =>
                          lead.brokerId === broker.brokerId
                      ).length
                    }
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(broker)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rustred/30 px-3 py-1.5 text-xs font-medium text-rustred transition hover:bg-rustred/10"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}