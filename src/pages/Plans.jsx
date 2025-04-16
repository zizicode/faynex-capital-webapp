
import React, { useState } from "react";
import { motion } from "framer-motion";
import PricingCard from "@/components/PricingCard";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

const Plans = () => {
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

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
    setSelectedPlan({ name: plan, price });
    setShowPaymentDialog(true);
  };

  const handleCopyWallet = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "Dirección copiada al portapapeles",
    });
  };

  const handleSendProof = () => {
    const message = encodeURIComponent(
      `¡Hola! Soy ${currentUser.username} y he realizado el pago del ${selectedPlan.name} por $${selectedPlan.price} USDT.\n\nAdjunto el comprobante de pago a continuación.`
    );
    window.open(`https://wa.me/18496528322?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Planes de Membresía</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan.name}
            price={plan.price}
            features={plan.features}
            savings={plan.savings}
            isPopular={plan.isPopular}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Realizar Pago - {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monto a pagar: ${selectedPlan?.price} USDT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src="https://storage.googleapis.com/hostinger-horizons-assets-prod/8784fc5f-649e-4604-90d7-aa89c92c1e62/23c342c24c21fbeb66ab1d0cc5a7580c.jpg"
                    alt="QR Code USDT TRC20" 
                    className="w-48 h-48 object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">USDT (TRC20)</label>
                    <div className="flex items-center gap-2 bg-gray-800 rounded-md p-2">
                      <code className="text-sm flex-1">TL68hdBPibv1cErYF2asNu1UvtNVZ4KrYb</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyWallet("TL68hdBPibv1cErYF2asNu1UvtNVZ4KrYb")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Binance Pay ID</label>
                    <div className="flex items-center gap-2 bg-gray-800 rounded-md p-2">
                      <code className="text-sm flex-1">112967833</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyWallet("112967833")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={handleSendProof}
                >
                  Enviar Comprobante por WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plans;
