
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin credentials validation
    if (
      credentials.username === "AdminFaynex07" &&
      credentials.password === "@Nalucy25"
    ) {
      // Store admin session
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminUser", JSON.stringify({
        username: credentials.username,
        role: "admin",
        lastLogin: new Date().toISOString()
      }));

      toast({
        title: "¡Bienvenido administrador!",
        description: "Has iniciado sesión correctamente",
      });

      // Navigate using navigate instead of window.location
      navigate("/admin");
    } else {
      toast({
        title: "Error de acceso",
        description: "Credenciales administrativas incorrectas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Panel Administrativo - Faynex Capital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Usuario Administrativo"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  required
                  className="bg-gray-800/50"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Contraseña Administrativa"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                  className="bg-gray-800/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Acceder al Panel Administrativo
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
