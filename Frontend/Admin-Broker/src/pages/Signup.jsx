import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, Field } from "./Login";
import { useAuth } from "../lib/auth";

export default function Signup() {
  const { signupAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", firm: "" });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    const result = signupAdmin(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/admin/dashboard");
  }

  return (
    <AuthShell>
      <h2 className="text-center font-display text-lg uppercase tracking-[0.1em] text-ink">Create your Admin account</h2>
      <p className="mt-1 text-center text-sm text-muted">Brokers are added later, from inside the Admin dashboard</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Full name">
          <input required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>
        <Field label="Firm / company name">
          <input required className="input" value={form.firm} onChange={(e) => update("firm", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" required className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="Password">
          <input type="password" required className="input" value={form.password} onChange={(e) => update("password", e.target.value)} />
        </Field>
        <Field label="Confirm password">
          <input type="password" required className="input" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} />
        </Field>

        {error && <p className="text-sm text-rustred">{error}</p>}

        <button type="submit" className="btn-primary w-full">Create Account</button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="font-medium text-maroon hover:underline">Sign In</Link>
      </p>
    </AuthShell>
  );
}
