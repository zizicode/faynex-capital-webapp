import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanById } from '@/services/api/plans/getPlansById';
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useCountdown } from '@/hooks/useCountdown';

const CountdownTimer = () => {
  const [planEndTime, setPlanEndTime] = useState(0);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const id_plan = currentUser?.id_plan;
    const activePlan = currentUser?.active_plan === 'active';

    const getPlan = async () => {
      if (id_plan && activePlan) {
        try {
          const res = await getPlanById(id_plan);
          if (res?.success && res?.data?.plan_time_end) {
            setPlanEndTime(new Date(res.data.plan_time_end).getTime());
          } else {
            setPlanEndTime(0);
          }
        } catch (err) {
          setPlanEndTime(0);
        }
      } else {
        setPlanEndTime(0);
      }
    };

    getPlan();
  }, []);

  const timeLeft = useCountdown(planEndTime);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const activePlan = currentUser?.active_plan === 'active';

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
