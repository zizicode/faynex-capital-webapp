
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Send, Download, PlayCircle } from "lucide-react";

const CopyTrading = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [videoData, setVideoData] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const isConnected = currentUser.copyTradingActive || false;

  useEffect(() => {
    const savedVideo = localStorage.getItem("copyTradingVideo");
    if (savedVideo) {
      setVideoData(JSON.parse(savedVideo));
    }
  }, []);

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
    
    if (videoData?.whatsapp) {
      window.open(`https://wa.me/${videoData.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`, "_blank");
    } else {
      toast({
        title: "Error",
        description: "No se ha configurado el número de WhatsApp",
        variant: "destructive",
      });
      return;
    }

    setMessage("");
    toast({
      title: "Mensaje enviado",
      description: "Te redirigiremos a WhatsApp para continuar",
    });
  };

  const handleDownloadContract = () => {
    if (videoData?.contract) {
      window.open(videoData.contract, "_blank");
    } else {
      toast({
        title: "Error",
        description: "El enlace del contrato no está disponible",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Copy Trading</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tutorial de Configuración</CardTitle>
              <CardDescription>
                Aprende cómo configurar el copy trading paso a paso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full pb-[56.25%]">
                {videoData?.code ? (
                  <div 
                    className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ 
                      __html: videoData.code.replace(
                        /<iframe/g, 
                        '<iframe style="width:100%;height:100%;position:absolute;top:0;left:0"'
                      ) 
                    }} 
                  />
                ) : videoData?.url ? (
                  <iframe
                    src={videoData.url}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <PlayCircle className="h-16 w-16 text-blue-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Estado de Conexión</CardTitle>
              <CardDescription>
                Estado actual de tu copy trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Conectado' : 'No conectado'}</span>
              </div>
              {isConnected && (
                <div className="text-sm text-gray-400">
                  Último sincronización: {new Date().toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Contrato de Servicio</CardTitle>
              <CardDescription>
                Descarga y firma el contrato de copy trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDownloadContract}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Download className="mr-2 h-4 w-4" />
                {videoData?.contract ? "Descargar Contrato" : "Contrato no disponible"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Enviar Datos</CardTitle>
              <CardDescription>
                Envía tus datos para la configuración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beneficios del Copy Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Operaciones automatizadas 24/7",
              "Gestión profesional del riesgo",
              "Sin necesidad de experiencia previa",
              "Resultados verificables",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CopyTrading;
