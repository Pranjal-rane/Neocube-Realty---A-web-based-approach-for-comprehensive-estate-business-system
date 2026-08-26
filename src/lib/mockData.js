export const inr = (n) => {
  if (n == null) return "₹0";
  return "₹" + Number(n).toLocaleString("en-IN");
};

const LOCALITIES = [
  { name: "Koregaon Park", lat: 18.5362, lng: 73.8938 },
  { name: "Baner", lat: 18.5590, lng: 73.7868 },
  { name: "Hinjewadi", lat: 18.5912, lng: 73.7389 },
  { name: "Kharadi", lat: 18.5515, lng: 73.9436 },
  { name: "Wakad", lat: 18.5978, lng: 73.7649 },
];

export const SEED_USERS_KEY = "neocube_users";
export const SESSION_KEY = "neocube_session";
export const PROPERTIES_KEY = "neocube_properties";
export const LEADS_KEY = "neocube_leads";
export const BROKER_SEQ_KEY = "neocube_broker_seq";
export const PROPERTY_SEQ_KEY = "neocube_property_seq";

const defaultUsers = [
  { id: "U-ADMIN-1", role: "admin", name: "Priya Deshmukh", email: "priya@neocube.com", password: "admin123", firm: "Neocube Realty" },
  { id: "U-B001", role: "broker", brokerId: "B001", name: "Rahul Sharma", email: "rahul@neocube.com", password: "broker123", phone: "9876543210" },
  { id: "U-B002", role: "broker", brokerId: "B002", name: "Amit Verma", email: "amit@neocube.com", password: "broker123", phone: "9822011223" },
];

export function loadUsers() {
  const raw = localStorage.getItem(SEED_USERS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(SEED_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveUsers(users) {
  localStorage.setItem(SEED_USERS_KEY, JSON.stringify(users));
}

// ---- Sequence counters (survive deletes so IDs never collide) ----
export function nextSeq(key, startAt) {
  const raw = localStorage.getItem(key);
  let seq = raw ? parseInt(raw, 10) : startAt;
  seq += 1;
  localStorage.setItem(key, String(seq));
  return seq;
}

const SEED_PROPERTIES = [
  { id: "P001", title: "Skyline Residency", locality: "Koregaon Park", bhk: 3, price: 12500000, area: 1450, type: "Apartment", status: "Available", brokerId: "B001", ...LOCALITIES[0] },
  { id: "P002", title: "Aster Villa", locality: "Baner", bhk: 4, price: 21000000, area: 2400, type: "Villa", status: "Available", brokerId: "B002", ...LOCALITIES[1] },
  { id: "P003", title: "Tech Park View", locality: "Hinjewadi", bhk: 2, price: 6800000, area: 980, type: "Apartment", status: "Available", brokerId: "B001", ...LOCALITIES[2] },
  { id: "P004", title: "Riverside Heights", locality: "Kharadi", bhk: 3, price: 9500000, area: 1320, type: "Apartment", status: "Booked", brokerId: "B002", ...LOCALITIES[3] },
  { id: "P005", title: "Wakad Greens", locality: "Wakad", bhk: 2, price: 5900000, area: 900, type: "Apartment", status: "Available", brokerId: "B001", ...LOCALITIES[4] },
  { id: "P006", title: "Palm Grove Penthouse", locality: "Koregaon Park", bhk: 4, price: 32000000, area: 3100, type: "Penthouse", status: "Available", brokerId: "B002", ...LOCALITIES[0] },
];

const SEED_LEADS = [
  { id: "L001", name: "Sumit Kapoor", phone: "9876543210", email: "muskan@gmail.com", propertyId: "P001", interest: "Skyline Residency", budget: 7000000, brokerId: "B001", status: "site-visit", notes: "Wants weekend visit.", nextFollowUp: "2026-08-25" },
  { id: "L002", name: "Rohan Iyer", phone: "9911223344", email: "rohan@gmail.com", propertyId: "P003", interest: "Tech Park View", budget: 6800000, brokerId: "B001", status: "contacted", notes: "Comparing with 2 more options.", nextFollowUp: "2026-08-22" },
  { id: "L003", name: "Sneha Patil", phone: "9823456712", email: "sneha@gmail.com", propertyId: "P005", interest: "Wakad Greens", budget: 5900000, brokerId: "B001", status: "new", notes: "", nextFollowUp: "" },
  { id: "L004", name: "Aman Gupta", phone: "9845123456", email: "aman@gmail.com", propertyId: "P002", interest: "Aster Villa", budget: 21000000, brokerId: "B002", status: "negotiation", notes: "Negotiating price, expects 20L.", nextFollowUp: "2026-08-24" },
  { id: "L005", name: "Ruhan Shah", phone: "9834567890", email: "riya@gmail.com", propertyId: "P004", interest: "Riverside Heights", budget: 9500000, brokerId: "B002", status: "won", notes: "Booking done.", nextFollowUp: "" },
  { id: "L006", name: "Kiran Mehta", phone: "9867123450", email: "karan@gmail.com", propertyId: "P006", interest: "Palm Grove Penthouse", budget: 30000000, brokerId: "B002", status: "lost", notes: "Went with another builder.", nextFollowUp: "" },
];

// ---- Properties: shared, persisted store (source of truth for admin, broker & customer site) ----
export function loadProperties() {
  const raw = localStorage.getItem(PROPERTIES_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(SEED_PROPERTIES));
  return SEED_PROPERTIES;
}

export function saveProperties(properties) {
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
  return properties;
}

export function nextPropertyId() {
  return "P" + String(nextSeq(PROPERTY_SEQ_KEY, SEED_PROPERTIES.length)).padStart(3, "0");
}

export const LOCALITY_NAMES = LOCALITIES.map((l) => l.name);
export function localityCoords(name) {
  return LOCALITIES.find((l) => l.name === name) || { lat: 18.5204, lng: 73.8567 };
}

// ---- Leads: shared, persisted store ----
export function loadLeads() {
  const raw = localStorage.getItem(LEADS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(LEADS_KEY, JSON.stringify(SEED_LEADS));
  return SEED_LEADS;
}

export function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  return leads;
}

export const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  "site-visit": "Site Visit",
  negotiation: "Negotiation",
  booked: "Booked",
  won: "Closed / Won",
  lost: "Lost",
};

export const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  contacted: "bg-amber-50 text-amber-800 border border-amber-200",
  "site-visit": "bg-purple-50 text-purple-700 border border-purple-200",
  negotiation: "bg-orange-50 text-orange-800 border border-orange-200",
  booked: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  won: "bg-sage/10 text-sage border border-sage/30",
  lost: "bg-rustred/10 text-rustred border border-rustred/30",
};

export function commissionFor(lead, properties) {
  const list = properties || loadProperties();
  const property = list.find((p) => p.id === lead.propertyId);
  if (!property) return 0;
  return Math.round(property.price * 0.02);
}
