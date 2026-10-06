import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card, StatusBadge } from "../../components/Bits";

const API_URL = "http://localhost:8080";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/bookings`);

      if (!response.ok) {
        throw new Error(`Failed to load bookings (${response.status})`);
      }

      const data = await response.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Bookings API Error:", err);
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  function formatAmount(amount) {
    if (amount === null || amount === undefined || amount === "") {
      return "—";
    }

    const value = Number(amount);

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

  return (
    <DashboardShell
      role="admin"
      title="Booking Management"
      subtitle="View and monitor property bookings"
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
              All Bookings
            </h2>

            <p className="mt-1 text-xs text-muted">
              Total bookings: {bookings.length}
            </p>
          </div>

          <button
            onClick={loadBookings}
            className="btn-outline px-3 py-2 text-xs"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            No bookings found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer ID</th>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Broker ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Booking Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-cream">
                {bookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="px-4 py-3 font-medium text-ink">
                      #{booking.bookingId}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      #{booking.customerId}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      #{booking.propertyId}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {booking.brokerId
                        ? `#${booking.brokerId}`
                        : "Unassigned"}
                    </td>

                    <td className="px-4 py-3 font-medium text-ink">
                      {formatAmount(booking.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={booking.paymentStatus} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {formatDate(booking.bookingDate)}
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