
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Search,
  Video,
  BookOpen,
  DollarSign,
  Menu,
  X,
  Power,
  User,
} from "lucide-react";
import AdminCopyTrading from "./AdminCopyTrading";
import AdminLibrary from "./AdminLibrary";
import AdminPayments from "./AdminPayments";

const AdminDashboard = ({ onLogout }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers();
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('join_date', { ascending: false });

      if (error) throw error;

      setUsers(data);
      setFilteredUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .order('join_date', { ascending: false });

      if (error) throw error;

      setFilteredUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Error al buscar usuarios",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: Users },
    { path: "/admin/copy-trading", label: "Copy Trading", icon: Video },
    { path: "/admin/library", label: "Biblioteca", icon: BookOpen },
    { path: "/admin/payments", label: "Pagos", icon: DollarSign },
  ];

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  const activatePlan = async (userId, plan) => {
    try {
      const endDate = new Date();
      switch (plan) {
        case "Plan Centurión":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "Plan Gladiador":
          endDate.setMonth(endDate.getMonth() + 2);
          break;
        case "Plan Titanio":
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case "Plan Leyenda":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      const { error } = await supabase
        .from('users')
        .update({
          active_plan: plan,
          plan_end_date: endDate.toISOString(),
          restricted_access: false,
          is_active: true,
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            active_plan: plan,
            plan_end_date: endDate.toISOString(),
            restricted_access: false,
            is_active: true,
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      toast({
        title: "Plan activado",
        description: `Plan activado correctamente para el usuario`,
      });
    } catch (error) {
      console.error('Error activating plan:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el plan",
        variant: "destructive",
      });
    }
  };

  const deactivatePlan = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          active_plan: null,
          plan_end_date: null,
          restricted_access: true,
          is_active: false,
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            active_plan: null,
            plan_end_date: null,
            restricted_access: true,
            is_active: false,
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      toast({
        title: "Plan desactivado",
        description: `Plan desactivado correctamente para el usuario`,
      });
    } catch (error) {
      console.error('Error deactivating plan:', error);
      toast({
        title: "Error",
        description: "No se pudo desactivar el plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="flex">
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

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isCollapsed ? 0 : 280,
            opacity: isCollapsed ? 0 : 1,
          }}
          className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 p-4 z-40 overflow-hidden transition-all duration-300 ${
            isCollapsed ? "w-0" : "w-[280px]"
          }`}
        >
          <div className="flex items-center justify-between mb-8 mt-14 lg:mt-0">
            <span className="text-2xl font-bold text-blue-500">
              Panel Admin
            </span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      setIsCollapsed(true);
                    }
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800 mt-8"
            >
              Cerrar Sesión
            </Button>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-4 lg:p-8 mt-14 lg:mt-0 transition-all duration-300 ${
            !isCollapsed ? "lg:ml-[280px]" : ""
          }`}
        >
          <Routes>
            <Route
              index
              element={
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Usuarios</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar por email o usuario..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="space-y-4">
                        {isLoading ? (
                          <p className="text-center text-gray-400">Cargando usuarios...</p>
                        ) : filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-gray-800 p-4 rounded-lg"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                  <h3 className="font-semibold">{user.name}</h3>
                                  <p className="text-sm text-gray-400">
                                    {user.email}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    Usuario: {user.username}
                                  </p>
                                  {user.referred_by && (
                                    <p className="text-sm text-blue-400 flex items-center gap-1">
                                      <User className="h-4 w-4" />
                                      Patrocinador: {user.referred_by}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-400">
                                    Plan actual:{" "}
                                    {user.active_plan || "Sin plan activo"}
                                  </p>
                                  {user.plan_end_date && (
                                    <p className="text-sm text-gray-400">
                                      Vence: {new Date(user.plan_end_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {user.active_plan ? (
                                    <Button
                                      onClick={() => deactivatePlan(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      <Power className="h-4 w-4 mr-2" />
                                      Desactivar
                                    </Button>
                                  ) : (
                                    ["Plan Centurión", "Plan Gladiador", "Plan Titanio", "Plan Leyenda"].map((plan) => (
                                      <Button
                                        key={plan}
                                        onClick={() => activatePlan(user.id, plan)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        {plan}
                                      </Button>
                                    ))
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-center text-gray-400">
                            No se encontraron usuarios
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              }
            />
            <Route path="/copy-trading" element={<AdminCopyTrading />} />
            <Route path="/library" element={<AdminLibrary />} />
            <Route path="/payments" element={<AdminPayments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
