import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import useAuthState from "@/hooks/useAuthState";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleAdminLogout,
} from "@/handlers/authHandlers";

import RegisterDialog from "@/components/RegisterDialog";
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
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import PublicLayout from "@/layouts";

export default function AppRoutes() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    showRegister,
    setShowRegister,
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    isAdmin,
    setIsAdmin,
  } = useAuthState();

  const onGetStarted = () => setShowRegister(true);

  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        {isAdmin ? (
          <Route path="/admin/*" element={<AdminDashboard onLogout={() => handleAdminLogout({ setIsAdmin, navigate, toast })} />} />
        ) : (
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
        )}

        {isAuthenticated ? (
          <Route path="/" element={<DashboardLayout onLogout={() => handleLogout({ setCurrentUser, setIsAuthenticated, navigate, toast })} />}>
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
          <Route
            path="*"
            element={
              <PublicLayout onGetStarted={onGetStarted} />
            }
          />
        )}
      </Routes>

      <RegisterDialog
        open={showRegister}
        onOpenChange={setShowRegister}
        onRegister={(userData) => handleRegister({ userData, setCurrentUser, setIsAuthenticated, setShowRegister })}
        onLogin={(userData) => handleLogin({ userData, setCurrentUser, setIsAuthenticated, setShowRegister })}
      />
    </>
  );
}
