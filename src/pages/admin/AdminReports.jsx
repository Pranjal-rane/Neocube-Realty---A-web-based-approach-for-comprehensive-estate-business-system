import { DashboardShell } from "../../components/DashboardLayout";
import { Card } from "../../components/Bits";
import { useAuth } from "../../lib/auth";
import { loadLeads } from "../../lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";

const MONTHLY = [
  { month: "Apr", leads: 18 },
  { month: "May", leads: 24 },
  { month: "Jun", leads: 21 },
  { month: "Jul", leads: 30 },
  { month: "Aug", leads: 27 },
];

const COLORS = ["#7A2E35", "#C08A3E", "#6B8F71", "#96444B"];

export default function AdminReports() {
  const { allBrokers } = useAuth();
  const brokers = allBrokers();
  const LEADS = loadLeads();

  const brokerPerf = brokers.map((b) => {
    const leads = LEADS.filter((l) => l.brokerId === b.brokerId);
    const deals = leads.filter((l) => l.status === "won").length;
    const conversion = leads.length ? ((deals / leads.length) * 100).toFixed(1) : "0.0";
    return { ...b, leadCount: leads.length, deals, conversion };
  });

  const pieData = brokers.map((b) => ({
    name: b.name,
    value: LEADS.filter((l) => l.brokerId === b.brokerId).length,
  }));

  return (
    <DashboardShell role="admin" title="Reports & Analytics" subtitle="Leads, sales and broker performance">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Leads per month</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2ECE6" />
                <XAxis dataKey="month" stroke="#7A6E6C" fontSize={12} />
                <YAxis stroke="#7A6E6C" fontSize={12} />
                <Tooltip />
                <Bar dataKey="leads" fill="#7A2E35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Leads by broker</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display text-sm uppercase tracking-[0.14em] text-ink">Broker performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2">Broker</th>
                <th className="px-3 py-2">Leads</th>
                <th className="px-3 py-2">Deals</th>
                <th className="px-3 py-2">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {brokerPerf.map((b) => (
                <tr key={b.id}>
                  <td className="px-3 py-2 font-medium text-ink">{b.name}</td>
                  <td className="px-3 py-2 text-muted">{b.leadCount}</td>
                  <td className="px-3 py-2 text-muted">{b.deals}</td>
                  <td className="px-3 py-2 text-muted">{b.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
