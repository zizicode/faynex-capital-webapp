import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import AdminLogin from "@/modules/admin/pages/AdminLogin";
import AdminDashboard from "@/modules/admin/pages/AdminDashboard";
import Home from "@/pages/Home";
import useVerifyTokenOnRouteChange from "@/hooks/useVerifyTokenOnRouteChange";
import useUserDataStore from "./zustand/isAuthenticate";

function App() {
  useVerifyTokenOnRouteChange()
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    currentUser,
    isAuthenticate, 
    isAdminAuthenticate, 
    logout 
  } = useUserDataStore();

  const handleLogout = () => {
    logout();
    toast({ description: "Sesión cerrada correctamente." });
    navigate("/");
  };

  const handleAdminLogout = () => {
    logout();
    toast({ description: "Sesión de administrador cerrada." });
    navigate("/admin/login");
  };

  return (
    <>
      <Routes>
        {/* Rutas Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {isAdminAuthenticate  ? (
          <Route
            path="/admin/*"
            element={<AdminDashboard onLogout={handleAdminLogout} />}
          />
        ) : (
          <Route
            path="/admin/*"
            element={<Navigate to="/admin/login" replace />}
          />
        )}

        {/* Rutas Usuario */}
        {isAuthenticate && !isAdminAuthenticate ? (
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
          </Route>
        ) : (
          <Route path="*" element={<Home />} />
        )}
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
