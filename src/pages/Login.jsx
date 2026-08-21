import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoLockup } from "../components/Logo";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, roleHome } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(roleHome(result.user.role));
  }

  return (
    <AuthShell>
      <h2 className="text-center font-display text-lg uppercase tracking-[0.1em] text-ink">Sign In</h2>
      <p className="mt-1 text-center text-sm text-muted">Access your Neocube Realty dashboard</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@neocube.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </Field>

        {error && <p className="text-sm text-rustred">{error}</p>}

        <button type="submit" className="btn-primary w-full">Sign In</button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account? <Link to="/signup" className="font-medium text-maroon hover:underline">Sign Up</Link>
      </p>

      <div className="mt-6 rounded-lg bg-cream/70 p-3 text-xs text-muted">
        <p className="font-medium text-ink">Demo logins</p>
        <p>Admin — priya@neocube.com / admin123</p>
        <p>Broker — rahul@neocube.com / broker123</p>
        <p>Broker — amit@neocube.com / broker123</p>
      </div>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-offwhite px-4">
      <SkylineBackdrop />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-cream bg-white p-8 shadow-card">
        <div className="flex justify-center">
          <LogoLockup size={48} />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function SkylineBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.06]"
      viewBox="0 0 800 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 200 L60 200 L60 140 L110 100 L160 140 L160 200 L220 200 L220 90 L270 50 L320 90 L320 200 L380 200 L380 120 L420 80 L460 120 L460 200 L520 200 L520 60 L560 20 L600 60 L600 200 L800 200"
        stroke="#7A2E35"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
