import { STATUS_LABELS, STATUS_STYLES } from "../lib/mockData";

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] || ""}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-cream bg-white p-5 shadow-card">
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-cream bg-white p-5 shadow-card ${className}`}>{children}</div>
  );
}
