
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
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

function App() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check user authentication
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }

    // Check admin authentication
    const adminAuth = localStorage.getItem("adminAuthenticated");
    const adminUser = localStorage.getItem("adminUser");
    if (adminAuth === "true" && adminUser) {
      setIsAdmin(true);
    }
  }, []);

  const handleGetStarted = () => {
    setShowRegister(true);
  };

  const handleRegister = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowRegister(true);
    navigate("/");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    setIsAdmin(false);
    navigate("/admin/login");
    toast({
      title: "Sesión administrativa cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        {isAdmin ? (
          <Route path="/admin/*" element={<AdminDashboard onLogout={handleAdminLogout} />} />
        ) : (
          <Route
            path="/admin/*"
            element={<Navigate to="/admin/login" replace />}
          />
        )}
        {isAuthenticated ? (
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
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
                <nav className="container mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold text-blue-500"
                    >
                      Faynex Capital
                    </motion.div>
                    <div className="hidden md:flex space-x-6">
                      <Button variant="ghost">Inicio</Button>
                      <Button variant="ghost">Servicios</Button>
                      <Button variant="ghost">Sobre Nosotros</Button>
                      <Button variant="ghost">Contacto</Button>
                    </div>
                    <Button
                      onClick={handleGetStarted}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Comenzar
                    </Button>
                  </div>
                </nav>

                <main className="container mx-auto px-6 py-12">
                  <section className="text-center mb-20">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
                    >
                      Tu Éxito en Trading Comienza Aquí
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl text-gray-300 mb-8"
                    >
                      Descubre el poder del trading profesional con nuestra
                      academia líder
                    </motion.p>
                  </section>

                  <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl"
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Copy Trading Automático
                      </h3>
                      <p className="text-gray-300">
                        Replica las operaciones de traders expertos de forma
                        automática y genera ingresos pasivos.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl"
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Señales en Vivo
                      </h3>
                      <p className="text-gray-300">
                        Recibe alertas de trading en tiempo real de nuestro
                        equipo de analistas profesionales.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-xl"
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Campus Virtual
                      </h3>
                      <p className="text-gray-300">
                        Accede a cursos completos y material educativo para
                        dominar el trading.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gradient-to-br from-cyan-900 to-cyan-800 p-6 rounded-xl"
                    >
                      <h3 className="text-xl font-bold mb-4">
                        Programa de Afiliados
                      </h3>
                      <p className="text-gray-300">
                        Gana hasta un 65% en comisiones por recomendaciones en
                        tres niveles.
                      </p>
                    </motion.div>
                  </section>

                  <section className="text-center mb-20">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="max-w-2xl mx-auto"
                    >
                      <h2 className="text-3xl font-bold mb-6">
                        Programa de Afiliados Premium
                      </h2>
                      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-xl">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-400">
                              50%
                            </div>
                            <div className="text-sm text-gray-300">
                              Nivel 1
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-purple-400">
                              10%
                            </div>
                            <div className="text-sm text-gray-300">
                              Nivel 2
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold text-cyan-400">
                              5%
                            </div>
                            <div className="text-sm text-gray-300">
                              Nivel 3
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">
                          Genera ingresos pasivos recomendando Faynex Capital y
                          gana por cada referido hasta el tercer nivel.
                        </p>
                      </div>
                    </motion.div>
                  </section>

                  <section className="text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
                      >
                        Únete a Faynex Capital Ahora
                      </Button>
                    </motion.div>
                  </section>
                </main>
              </div>
            }
          />
        )}
      </Routes>

      <RegisterDialog
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={handleRegister}
      />

      <Toaster />
    </>
  );
}

export default App;
