import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import News from "@/pages/News";
import Signals from "@/pages/Signals";
import CopyTrading from "@/pages/CopyTrading";
import Wallet from "@/pages/Wallet";
import Plans from "@/pages/Plans";
import Support from "@/pages/Support";
import Affiliates from "@/pages/Affiliates";
import Home from "@/pages/Home";

import useVerifyTokenOnRouteChange from "@/hooks/useVerifyTokenOnRouteChange";
import useUserDataStore from "./zustand/isAuthenticate";

function App() {
  useVerifyTokenOnRouteChange();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticate, logout } = useUserDataStore();

  const handleLogout = () => {
    logout();
    toast({ description: "Sesión cerrada correctamente." });
    navigate("/");
  };

  // Redirigir si se intenta acceder a /admin
  if (location.pathname.startsWith("/admin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Routes>
        {isAuthenticate ? (
          <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="plans" element={<Plans />} />
            <Route path="library" element={<Library />} />
            <Route path="news" element={<News />} />
            <Route path="signals" element={<Signals />} />
            <Route path="copy-trading" element={<CopyTrading />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="affiliates" element={<Affiliates />} />
            <Route path="support" element={<Support />} />
            {/* Si estando autenticado entran a una ruta inexistente, redirigir a dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <>
            {/* Si no está autenticado, Home es la página principal */}
            <Route path="/" element={<Home />} />
            {/* Si no está autenticado y entra a una ruta inexistente, llevarlo al Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
