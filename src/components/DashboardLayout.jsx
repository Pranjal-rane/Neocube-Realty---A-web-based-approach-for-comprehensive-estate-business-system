import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { LogoLockup } from "./Logo";
import { useAuth } from "../lib/auth";
import { LogOut } from "lucide-react";

const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/properties", label: "Properties" },
  { to: "/admin/brokers", label: "Brokers" },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/site-visits", label: "Site Visits" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/commission", label: "Commission" },
  { to: "/admin/reports", label: "Reports" },
];

const BROKER_NAV = [
  { to: "/broker/dashboard", label: "Dashboard" },
  { to: "/broker/leads", label: "My Leads" },
  { to: "/broker/listings", label: "My Listings" },
  { to: "/broker/commission", label: "My Commission" },
  { to: "/broker/profile", label: "Profile" },
];

export function RequireRole({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export function DashboardShell({ role, title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = role === "admin" ? ADMIN_NAV : BROKER_NAV;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-offwhite">
      <aside className="hidden w-64 flex-col bg-maroon-deep px-4 py-6 text-offwhite md:flex">
        <div className="px-2">
          <LogoLockup size={34} dark />
        </div>
        <nav className="mt-8 flex-1 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-maroon text-white border-l-4 border-cream pl-2" : "text-offwhite/80 hover:bg-maroon/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-offwhite/60">{user?.name}</p>
          <p className="px-3 text-[11px] uppercase tracking-widest text-offwhite/40">{user?.role}{user?.brokerId ? ` · ${user.brokerId}` : ""}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-offwhite/80 hover:bg-maroon/60"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <LogoLockup size={30} />
          <button onClick={handleLogout} className="text-sm text-maroon">Log out</button>
        </div>
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
