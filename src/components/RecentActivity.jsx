
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, UserPlus, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecentActivity = ({ currentUser }) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");

  // Get all activities and sort by date
  const activities = [
    // Referral registrations
    ...users
      .filter(user => user.referrer?.id === currentUser.id)
      .map(user => ({
        type: "referral",
        date: user.joinDate,
        user: user.username,
        details: "Nuevo referido registrado"
      })),

    // Plan activations
    ...users
      .filter(user => user.referrer?.id === currentUser.id && user.activePlan)
      .map(user => ({
        type: "plan",
        date: user.planEndDate, // Using planEndDate as activation date
        user: user.username,
        details: `Activó ${user.activePlan}`
      })),

    // Completed withdrawals
    ...withdrawalRequests
      .filter(req => req.userId === currentUser.id && req.status === "completed")
      .map(req => ({
        type: "withdrawal",
        date: req.completedDate,
        amount: req.amount,
        details: "Retiro procesado exitosamente"
      }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    prevArrow: <Button variant="ghost" size="icon"><ArrowUp className="h-4 w-4" /></Button>,
    nextArrow: <Button variant="ghost" size="icon"><ArrowDown className="h-4 w-4" /></Button>,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "referral":
        return <UserPlus className="h-5 w-5 text-blue-400" />;
      case "plan":
        return <Award className="h-5 w-5 text-purple-400" />;
      case "withdrawal":
        return <DollarSign className="h-5 w-5 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="max-h-[300px] overflow-hidden">
            <Slider {...sliderSettings}>
              {activities.map((activity, index) => (
                <div key={index} className="p-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.type === "withdrawal"
                            ? `Retiro de $${activity.amount} USDT`
                            : activity.details}
                        </p>
                        {activity.user && (
                          <p className="text-sm text-gray-400">
                            Usuario: {activity.user}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <p className="text-center text-gray-400">No hay actividad reciente</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
