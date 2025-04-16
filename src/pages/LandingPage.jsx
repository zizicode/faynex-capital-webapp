
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import RegisterDialog from "@/components/RegisterDialog";
import PricingCard from "@/components/PricingCard";

function LandingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRegister, setShowRegister] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleGetStarted = () => {
    setShowRegister(true);
  };

  const handleRegister = (userData) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setShowPricing(true);
  };

  const plans = [
    {
      name: "Plan Centurión",
      price: "69",
      period: "Mensual",
      features: [
        "Acceso a cursos (forex, binarias, futuros, índices)",
        "Señales en vivo",
        "Copy Trading automatizado",
        "Mentorías en vivo",
        "Programa de afiliados (50% comisión)",
        "Certificado de trader rentable",
      ],
    },
    {
      name: "Plan Gladiador",
      price: "120",
      period: "Bimestral",
      savings: "18",
      features: [
        "Todo en Centurión",
        "Mentorías personalizadas",
        "Acceso prioritario a nuevas herramientas",
      ],
      isPopular: true,
    },
    {
      name: "Plan Titanio",
      price: "360",
      period: "Semestral",
      savings: "54",
      features: [
        "Todo en Gladiador",
        "Soporte técnico avanzado",
        "Más recursos promocionales en afiliados",
      ],
    },
    {
      name: "Plan Leyenda",
      price: "740",
      period: "Anual",
      savings: "123.96",
      features: [
        "Todo en Titanio",
        "Beneficios exclusivos y herramientas premium",
        "Acceso VIP a eventos y mentorías avanzadas",
      ],
    },
  ];

  const handleSelectPlan = (plan, price) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    const subscription = {
      userId: currentUser.id,
      plan,
      price: Number(price),
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    subscriptions.push(subscription);
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

    toast({
      title: "¡Suscripción exitosa!",
      description: `Has adquirido el ${plan}`,
    });

    navigate("/dashboard");
  };

  // Rest of the LandingPage component code remains the same as in the previous App.jsx
  // Just copy all the JSX from the previous App.jsx here
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Copy the rest of the JSX from App.jsx here */}
    </div>
  );
}

export default LandingPage;
