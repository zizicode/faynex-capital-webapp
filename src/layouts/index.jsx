import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PublicLayout({ onGetStarted }) {
  return (
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
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Comenzar
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Aquí continúa el contenido promocional que ya tienes */}
        {/* Puedes seguir dividiéndolo en secciones si lo deseas más adelante */}
      </main>
    </div>
  );
}
