import { useEffect, useState } from "react";
import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

const API_URL = "http://localhost:8080";

const THEME = {
  burgundy: "#70242B",
  burgundyLight: "#8B343D",
  cream: "#F5F1EC",
  ink: "#241F1F",
  muted: "#756B68",
  border: "#E8DED6",
};

const CHART_COLORS = [
  "#70242B",
  "#8B343D",
  "#A94B53",
  "#C17A7F",
  "#D6A3A5",
];

export default function AdminReports() {
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [deals, setDeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const [
        propertiesResponse,
        leadsResponse,
        brokersResponse,
        bookingsResponse,
        dealsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/properties`),
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/brokers`),
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/deals`),
      ]);

      if (
        !propertiesResponse.ok ||
        !leadsResponse.ok ||
        !brokersResponse.ok ||
        !bookingsResponse.ok ||
        !dealsResponse.ok
      ) {
        throw new Error("Failed to load report data");
      }

      const [
        propertiesData,
        leadsData,
        brokersData,
        bookingsData,
        dealsData,
      ] = await Promise.all([
        propertiesResponse.json(),
        leadsResponse.json(),
        brokersResponse.json(),
        bookingsResponse.json(),
        dealsResponse.json(),
      ]);

      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setBrokers(Array.isArray(brokersData) ? brokersData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
    } catch (err) {
      console.error("Reports API Error:", err);
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }

  const leadStatuses = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "SITE_VISIT",
    "NEGOTIATION",
    "BOOKED",
    "CLOSED",
    "LOST",
  ];

  const leadChartData = leadStatuses.map((status) => ({
    status: status.replace("_", " "),
    count: leads.filter(
      (lead) =>
        String(lead.status || "").toUpperCase() === status
    ).length,
  }));

  const bookingStatuses = [
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ];

  const bookingChartData = bookingStatuses
    .map((status) => ({
      name: status,
      value: bookings.filter(
        (booking) =>
          String(booking.status || "").toUpperCase() === status
      ).length,
    }))
    .filter((item) => item.value > 0);

  const businessChartData = [
    {
      name: "Properties",
      count: properties.length,
    },
    {
      name: "Leads",
      count: leads.length,
    },
    {
      name: "Brokers",
      count: brokers.length,
    },
    {
      name: "Bookings",
      count: bookings.length,
    },
    {
      name: "Deals",
      count: deals.length,
    },
  ];

  const dealStatusData = [
    "OPEN",
    "CLOSED",
    "WON",
    "LOST",
    "CANCELLED",
  ]
    .map((status) => ({
      name: status,
      value: deals.filter(
        (deal) =>
          String(deal.status || "").toUpperCase() === status
      ).length,
    }))
    .filter((item) => item.value > 0);

  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  }

  const totalDealValue = deals.reduce(
    (total, deal) => total + Number(deal.dealAmount || 0),
    0
  );

  const tooltipStyle = {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${THEME.border}`,
    borderRadius: "8px",
    color: THEME.ink,
  };

  if (loading) {
    return (
      <DashboardShell
        role="admin"
        title="Reports"
        subtitle="Business analytics from real database data"
      >
        <div className="py-10 text-center text-sm text-muted">
          Loading reports...
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title="Reports"
      subtitle="Business analytics from real database data"
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Properties", properties.length],
          ["Leads", leads.length],
          ["Brokers", brokers.length],
          ["Bookings", bookings.length],
          ["Deal Value", formatAmount(totalDealValue)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border bg-white p-5 shadow-sm"
            style={{ borderColor: THEME.border }}
          >
            <p
              className="text-xs uppercase tracking-[0.12em]"
              style={{ color: THEME.muted }}
            >
              {label}
            </p>

            <p
              className="mt-2 text-2xl font-semibold"
              style={{ color: THEME.ink }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Business Overview */}
        <Card>
          <h2
            className="font-display text-sm uppercase tracking-[0.14em]"
            style={{ color: THEME.ink }}
          >
            Business Overview
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: THEME.muted }}
          >
            Real records currently available in the system
          </p>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={businessChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={THEME.border}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: THEME.muted,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: THEME.border,
                  }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: THEME.muted,
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Bar
                  dataKey="count"
                  name="Records"
                  fill={THEME.burgundy}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Status */}
        <Card>
          <h2
            className="font-display text-sm uppercase tracking-[0.14em]"
            style={{ color: THEME.ink }}
          >
            Lead Status
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: THEME.muted }}
          >
            Distribution of leads by current status
          </p>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leadChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={THEME.border}
                />

                <XAxis
                  dataKey="status"
                  angle={-25}
                  textAnchor="end"
                  height={65}
                  tick={{
                    fill: THEME.muted,
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: THEME.border,
                  }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: THEME.muted,
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Bar
                  dataKey="count"
                  name="Leads"
                  fill={THEME.burgundyLight}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Booking Status */}
        <Card>
          <h2
            className="font-display text-sm uppercase tracking-[0.14em]"
            style={{ color: THEME.ink }}
          >
            Booking Status
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: THEME.muted }}
          >
            Current booking distribution
          </p>

          <div className="mt-6 h-[320px]">
            {bookingChartData.length === 0 ? (
              <div
                className="flex h-full items-center justify-center text-sm"
                style={{ color: THEME.muted }}
              >
                No booking data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {bookingChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          CHART_COLORS[
                            index % CHART_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend
                    wrapperStyle={{
                      color: THEME.muted,
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Deal Status */}
        <Card>
          <h2
            className="font-display text-sm uppercase tracking-[0.14em]"
            style={{ color: THEME.ink }}
          >
            Deal Status
          </h2>

          <p
            className="mt-1 text-xs"
            style={{ color: THEME.muted }}
          >
            Current deal distribution
          </p>

          <div className="mt-6 h-[320px]">
            {dealStatusData.length === 0 ? (
              <div
                className="flex h-full items-center justify-center text-sm"
                style={{ color: THEME.muted }}
              >
                No deal data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {dealStatusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          CHART_COLORS[
                            index % CHART_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />

                  <Legend
                    wrapperStyle={{
                      color: THEME.muted,
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}