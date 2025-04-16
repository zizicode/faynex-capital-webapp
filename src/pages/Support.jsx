
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";

const Support = () => {
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe tu mensaje",
        variant: "destructive",
      });
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `Usuario: ${currentUser.username}\nCorreo: ${currentUser.email}\nMensaje: ${message}`
    );
    const whatsappUrl = `https://wa.me/18496528322?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank");

    setMessage("");
    toast({
      title: "Mensaje enviado",
      description: "Te redirigiremos a WhatsApp para continuar",
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Soporte Técnico</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Contacta con Soporte
            </CardTitle>
            <CardDescription>
              Envíanos tu consulta y te responderemos lo antes posible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input
                  value={currentUser.username}
                  disabled
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <Input
                  value={currentUser.email}
                  disabled
                  className="bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu mensaje</label>
                <textarea
                  className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Escribe tu consulta aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Enviar Mensaje
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Support;
