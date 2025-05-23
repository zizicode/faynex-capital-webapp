
import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, UserPlus, Award, DollarSign } from "lucide-react";
import {getActivitiesByUserId} from '@/services/api/activities/getAllActivities';
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecentActivity = ({ currentUser }) => {
  const [activity, setActivity] = useState({});

  useEffect( () => {
    const handleFetchActivity = async () => {
      if(currentUser?.id){
        let res = await getActivitiesByUserId(currentUser?.id)
        res.success ? setActivity(res.data) : null
        return
      }
    }

    handleFetchActivity();
  },[])

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
        {activity.length > 0 ? (
          <div className="max-h-[300px] overflow-hidden">
            <Slider {...sliderSettings}>
              {activity.map((activity, index) => (
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
                            : activity.description}
                        </p>
                        {activity.user && (
                          <p className="text-sm text-gray-400">
                            Usuario: {activity.user_id}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
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
