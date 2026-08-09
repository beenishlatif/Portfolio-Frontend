import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

// Simple inline guard - keeps the dashboard separate from the public site
const RequireAuth = ({ children }) => {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      {/* ===== Public main website - shows the owner's portfolio directly, no login shown ===== */}
      <Route path="/" element={<Home />} />

      {/* Any other admin's portfolio, viewable by anyone with the link, no login needed */}
      <Route path="/:slug" element={<Portfolio />} />

      {/* ===== Admin panel - completely separate, hidden area (not linked from public site) ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
