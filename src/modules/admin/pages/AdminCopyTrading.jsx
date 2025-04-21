
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Video, Link as LinkIcon, Search, Phone, UserCheck, UserX } from "lucide-react";

const AdminCopyTrading = () => {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCode, setVideoCode] = useState("");
  const [contractLink, setContractLink] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const savedVideo = localStorage.getItem("copyTradingVideo");
    if (savedVideo) {
      const { url, code, contract, whatsapp } = JSON.parse(savedVideo);
      setVideoUrl(url || "");
      setVideoCode(code || "");
      setContractLink(contract || "");
      setWhatsappNumber(whatsapp || "");
    }

    // Load users
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
    setFilteredUsers(storedUsers);
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSave = () => {
    if (!videoUrl && !videoCode) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL o código de video",
        variant: "destructive",
      });
      return;
    }

    if (!contractLink) {
      toast({
        title: "Error",
        description: "Por favor ingresa el enlace del contrato",
        variant: "destructive",
      });
      return;
    }

    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Por favor ingresa el número de WhatsApp",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("copyTradingVideo", JSON.stringify({
      url: videoUrl,
      code: videoCode,
      contract: contractLink,
      whatsapp: whatsappNumber,
      updatedAt: new Date().toISOString()
    }));

    toast({
      title: "Contenido actualizado",
      description: "La configuración ha sido actualizada correctamente",
    });
  };

  const toggleUserActivation = (userId, activate) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          copyTradingActive: activate
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(
      updatedUsers.find(u => u.id === userId)
    ));

    toast({
      title: activate ? "Usuario activado" : "Usuario desactivado",
      description: `El usuario ha sido ${activate ? "activado" : "desactivado"} correctamente`,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestión de Copy Trading</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              Configuración de Copy Trading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL del Video</label>
                <Input
                  placeholder="https://ejemplo.com/video"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Inserción</label>
                <textarea
                  placeholder="<iframe>...</iframe>"
                  value={videoCode}
                  onChange={(e) => setVideoCode(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border border-input bg-gray-800 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enlace del Contrato</label>
                <Input
                  placeholder="https://ejemplo.com/contrato"
                  value={contractLink}
                  onChange={(e) => setContractLink(e.target.value)}
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número de WhatsApp</label>
                <Input
                  placeholder="+1234567890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="bg-gray-800"
                />
                <p className="text-sm text-gray-400">
                  Ingresa el número con código de país (ej: +1234567890)
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      </motion.div>

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
            {filteredUsers.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-400">Usuario: {user.username}</p>
                  </div>
                  <Button
                    onClick={() => toggleUserActivation(user.id, !user.copyTradingActive)}
                    className={user.copyTradingActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {user.copyTradingActive ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activar
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCopyTrading;
