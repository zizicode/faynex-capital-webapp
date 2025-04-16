
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Clock, AlertTriangle } from "lucide-react";

const Signals = () => {
  const handleJoinChannel = () => {
    window.open("https://t.me/+K2A0HIXM1z43ZWEx", "_blank");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Señales de Trading XAUUSD</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-yellow-900 to-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Canal de Señales XAUUSD (Oro)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300">
              Recibe señales precisas del par XAUUSD (Oro) directamente en tu teléfono a través de nuestro canal exclusivo de Telegram.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>Señales en tiempo real 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span>Gestión de riesgo incluida</span>
              </div>
            </div>

            <Button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              onClick={handleJoinChannel}
            >
              Unirse al Canal de Señales
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Información Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Señales exclusivas para XAUUSD (Oro)</li>
            <li>Análisis técnico detallado</li>
            <li>Puntos de entrada y salida precisos</li>
            <li>Stop Loss y Take Profit incluidos</li>
            <li>Actualizaciones de mercado en tiempo real</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signals;
