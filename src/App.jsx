import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { RequireRole } from "./components/DashboardLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Home from "./pages/customer/Home";
import Listing from "./pages/customer/Listing";
import PropertyDetails from "./pages/customer/PropertyDetails";
import EmiCalculator from "./pages/customer/EmiCalculator";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminSiteVisits from "./pages/admin/AdminSiteVisits";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminCommission from "./pages/admin/AdminCommission";
import AdminReports from "./pages/admin/AdminReports";

import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerLeads from "./pages/broker/BrokerLeads";
import BrokerListings from "./pages/broker/BrokerListings";
import BrokerLeadDetail from "./pages/broker/BrokerLeadDetail";
import BrokerCommission from "./pages/broker/BrokerCommission";
import BrokerProfile from "./pages/broker/BrokerProfile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public customer site */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Listing />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
          <Route path="/admin/properties" element={<RequireRole role="admin"><AdminProperties /></RequireRole>} />
          <Route path="/admin/brokers" element={<RequireRole role="admin"><AdminBrokers /></RequireRole>} />
          <Route path="/admin/leads" element={<RequireRole role="admin"><AdminLeads /></RequireRole>} />
          <Route path="/admin/site-visits" element={<RequireRole role="admin"><AdminSiteVisits /></RequireRole>} />
          <Route path="/admin/bookings" element={<RequireRole role="admin"><AdminBookings /></RequireRole>} />
          <Route path="/admin/commission" element={<RequireRole role="admin"><AdminCommission /></RequireRole>} />
          <Route path="/admin/reports" element={<RequireRole role="admin"><AdminReports /></RequireRole>} />

          {/* Broker */}
          <Route path="/broker/dashboard" element={<RequireRole role="broker"><BrokerDashboard /></RequireRole>} />
          <Route path="/broker/leads" element={<RequireRole role="broker"><BrokerLeads /></RequireRole>} />
          <Route path="/broker/listings" element={<RequireRole role="broker"><BrokerListings /></RequireRole>} />
          <Route path="/broker/leads/:id" element={<RequireRole role="broker"><BrokerLeadDetail /></RequireRole>} />
          <Route path="/broker/commission" element={<RequireRole role="broker"><BrokerCommission /></RequireRole>} />
          <Route path="/broker/profile" element={<RequireRole role="broker"><BrokerProfile /></RequireRole>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
