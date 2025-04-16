
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReferralStats = ({ stats }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const getPlanBadge = (plan) => {
    switch (plan) {
      case "Plan Centurión":
        return "bg-blue-500/20 text-blue-300";
      case "Plan Gladiador":
        return "bg-purple-500/20 text-purple-300";
      case "Plan Titanio":
        return "bg-yellow-500/20 text-yellow-300";
      case "Plan Leyenda":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const handlePlanClick = () => {
    if (!currentUser.activePlan) {
      navigate("/plans");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-blue-900 to-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Referidos Activos</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeReferrals}</div>
          <p className="text-xs text-gray-400">
            +{stats.newReferrals} este mes
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900 to-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalEarnings}</div>
          <p className="text-xs text-gray-400">
            +${stats.monthlyEarnings} este mes
          </p>
        </CardContent>
      </Card>

      <Card 
        className={`bg-gradient-to-br from-cyan-900 to-cyan-800 ${!currentUser.activePlan ? 'cursor-pointer' : ''}`}
        onClick={handlePlanClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan Activo</CardTitle>
          <Award className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          {currentUser.activePlan ? (
            <>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getPlanBadge(currentUser.activePlan)}`}>
                {currentUser.activePlan}
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-400">Sin plan activo</div>
              <p className="text-xs text-gray-500">Click para activar un plan</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralStats;
