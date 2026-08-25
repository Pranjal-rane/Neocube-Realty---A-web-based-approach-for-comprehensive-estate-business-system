import { useMemo, useState } from "react";
import PublicNav from "../../components/PublicNav";
import { inr } from "../../lib/mockData";

export default function EmiCalculator() {
  const [price, setPrice] = useState(7000000);
  const [downPayment, setDownPayment] = useState(1400000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const emi = useMemo(() => {
    const principal = Math.max(price - downPayment, 0);
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    if (!principal || !monthlyRate || !months) return 0;
    const value = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(value);
  }, [price, downPayment, rate, years]);

  return (
    <div className="min-h-screen bg-offwhite">
      <PublicNav />
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-display text-xl uppercase tracking-[0.08em] text-ink">EMI Calculator</h1>
        <p className="mt-1 text-sm text-muted">Estimate your monthly home loan payment.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-cream bg-white p-5 shadow-card">
            <NumberField label="Property price (INR)" value={price} onChange={setPrice} />
            <NumberField label="Down payment (INR)" value={downPayment} onChange={setDownPayment} />
            <NumberField label="Interest rate (% p.a.)" value={rate} onChange={setRate} step="0.1" />
            <NumberField label="Loan tenure (years)" value={years} onChange={setYears} />
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-cream bg-white p-5 shadow-card">
            <p className="text-xs uppercase tracking-wide text-muted">Estimated monthly EMI</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-maroon">{inr(emi)}</p>
            <p className="mt-4 text-center text-xs text-muted">This is an estimate only, not a loan approval.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, step = "1" }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <input type="number" step={step} className="input" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
