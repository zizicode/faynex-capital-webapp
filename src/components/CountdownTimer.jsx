
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const endDate = currentUser.planEndDate;
  const activePlan = currentUser.activePlan;

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!endDate) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`bg-gradient-to-br ${activePlan ? 'from-purple-900 to-purple-800' : 'from-gray-800 to-gray-700'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Tiempo Restante de Membresía
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePlan ? (
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-3xl font-bold">{timeLeft.days}</div>
                <div className="text-xs text-gray-400">Días</div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-3xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs text-gray-400">Horas</div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-400">Minutos</div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-400">Segundos</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">No tienes un plan activo</p>
              <p className="text-sm text-gray-500">Adquiere un plan para acceder a todas las funcionalidades</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CountdownTimer;
