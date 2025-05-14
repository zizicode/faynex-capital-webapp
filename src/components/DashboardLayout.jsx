
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  LayoutDashboard,
  BookOpen,
  Signal,
  Copy,
  Library,
  Newspaper,
  Wallet,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  CreditCard,
  Lock,
} from "lucide-react";

const DashboardLayout = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", restricted: false },
    { icon: CreditCard, label: "Planes", path: "/plans", restricted: false },
    { icon: BookOpen, label: "Campus Virtual", path: "/campus", restricted: true },
    { icon: Signal, label: "Señales", path: "/signals", restricted: true },
    { icon: Copy, label: "Copy Trading", path: "/copy-trading", restricted: true },
    { icon: Library, label: "Biblioteca", path: "/library", restricted: true },
    { icon: Newspaper, label: "Noticias", path: "/news", restricted: false },
    { icon: Wallet, label: "Wallet", path: "/wallet", restricted: false },
    { icon: Users, label: "Afiliados", path: "/affiliates", restricted: false },
    { icon: MessageSquare, label: "Soporte", path: "/support", restricted: false },
  ];

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsCollapsed(isMobile);
      setShowMenuButton(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  }, [location.pathname]);

  const handleRestrictedAccess = (restricted) => {
    if (restricted && (!currentUser.id_plan || !currentUser.active_plan === 'active')) {
      toast({
        title: "Acceso restringido",
        description: "Necesitas un plan activo para acceder a esta función",
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            {isCollapsed ? (
              <Menu className="h-6 w-6" />
            ) : (
              <X className="h-6 w-6" />
            )}
          </Button>
        )}

        <AnimatePresence mode="wait">
          {(!isCollapsed || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-gradient-to-b from-gray-900 to-gray-800 p-4 z-40 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 mt-14 lg:mt-0">
                <Link to="/dashboard" className="text-2xl font-bold text-blue-500">
                  Faynex
                </Link>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const isRestricted = item.restricted && (!currentUser.id_plan || !currentUser.active_plan === 'active');

                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "hover:bg-gray-800"
                      } ${isRestricted ? "opacity-50" : ""}`}
                      onClick={() => {
                        if (!handleRestrictedAccess(item.restricted)) {
                          navigate(item.path);
                          if (window.innerWidth < 1024) {
                            setIsCollapsed(true);
                          }
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                      {isRestricted && <Lock className="h-4 w-4 ml-2" />}
                    </Button>
                  );
                })}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800 mt-8"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className={`flex-1 p-4 lg:p-8 mt-14 lg:mt-0 w-full ${!isCollapsed ? "lg:ml-[280px]" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
