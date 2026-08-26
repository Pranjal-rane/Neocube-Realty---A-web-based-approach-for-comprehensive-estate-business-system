import { createContext, useContext, useEffect, useState } from "react";
import {
  loadUsers,
  saveUsers,
  SESSION_KEY,
  BROKER_SEQ_KEY,
  nextSeq,
  loadLeads,
  saveLeads,
  loadProperties,
  saveProperties,
} from "./mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) setUser(JSON.parse(raw));
    setReady(true);
  }, []);

  function persistSession(u) {
    setUser(u);
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    else localStorage.removeItem(SESSION_KEY);
  }

  function login(email, password) {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Incorrect email or password." };
    persistSession(found);
    return { ok: true, user: found };
  }

  function signupAdmin({ name, email, password, firm }) {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newAdmin = {
      id: "U-ADMIN-" + Date.now(),
      role: "admin",
      name,
      email,
      password,
      firm,
    };
    const updated = [...users, newAdmin];
    saveUsers(updated);
    persistSession(newAdmin);
    return { ok: true, user: newAdmin };
  }

  function addBroker({ name, email, phone }) {
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    // Sequence counter never resets on delete, so broker IDs never collide/get reused.
    const brokerId = "B" + String(nextSeq(BROKER_SEQ_KEY, 2)).padStart(3, "0");
    const tempPassword = "welcome" + Math.floor(1000 + Math.random() * 9000);
    const newBroker = {
      id: "U-" + brokerId,
      role: "broker",
      brokerId,
      name,
      email,
      phone,
      password: tempPassword,
    };
    const updated = [...users, newBroker];
    saveUsers(updated);
    return { ok: true, broker: newBroker, tempPassword };
  }

  // Deletes a broker's login. Any leads/properties assigned to them are set to
  // "Unassigned" (brokerId: "") rather than deleted, so admin can hand them to someone else.
  function deleteBroker(brokerId) {
    const users = loadUsers();
    const updatedUsers = users.filter((u) => u.brokerId !== brokerId);
    saveUsers(updatedUsers);

    const leads = loadLeads();
    saveLeads(leads.map((l) => (l.brokerId === brokerId ? { ...l, brokerId: "" } : l)));

    const properties = loadProperties();
    saveProperties(properties.map((p) => (p.brokerId === brokerId ? { ...p, brokerId: "" } : p)));

    // If the deleted broker is currently logged in on this device, sign them out.
    if (user?.brokerId === brokerId) persistSession(null);

    return { ok: true };
  }

  function logout() {
    persistSession(null);
  }

  function allBrokers() {
    return loadUsers().filter((u) => u.role === "broker");
  }

  function roleHome(role) {
    if (role === "admin") return "/admin/dashboard";
    if (role === "broker") return "/broker/dashboard";
    return "/";
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, login, signupAdmin, addBroker, deleteBroker, logout, allBrokers, roleHome }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
