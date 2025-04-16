
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Affiliates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliates, setAffiliates] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  useEffect(() => {
    // Get all direct referrals
    const directReferrals = users.filter(user => user.referredBy === currentUser.username);
    
    // Get second level referrals
    const secondLevel = users.filter(user => 
      directReferrals.some(dr => dr.username === user.referredBy)
    );

    // Get third level referrals
    const thirdLevel = users.filter(user =>
      secondLevel.some(sl => sl.username === user.referredBy)
    );

    const allAffiliates = [
      ...directReferrals.map(user => ({ ...user, level: 1 })),
      ...secondLevel.map(user => ({ ...user, level: 2 })),
      ...thirdLevel.map(user => ({ ...user, level: 3 }))
    ];

    setAffiliates(allAffiliates);
  }, [currentUser.username]);

  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    adaptiveHeight: true,
    prevArrow: <Button variant="ghost" size="icon"><ArrowUp className="h-4 w-4" /></Button>,
    nextArrow: <Button variant="ghost" size="icon"><ArrowDown className="h-4 w-4" /></Button>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Red de Afiliados</h1>

      {/* Search and Affiliates List */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Afiliados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por usuario o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-[400px] overflow-hidden">
            {filteredAffiliates.length > 0 ? (
              <Slider {...sliderSettings}>
                {filteredAffiliates.map(affiliate => (
                  <div key={affiliate.id} className="p-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{affiliate.username}</h3>
                          <p className="text-sm text-gray-400">{affiliate.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              affiliate.level === 1 ? 'bg-blue-500/20 text-blue-300' :
                              affiliate.level === 2 ? 'bg-purple-500/20 text-purple-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              Nivel {affiliate.level}
                            </span>
                            {affiliate.activePlan && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                {affiliate.activePlan}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Registrado: {new Date(affiliate.joinDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-400">Última actividad: {new Date(affiliate.lastActiveDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-400">No se encontraron afiliados</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Estructura de Comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-blue-400">50%</h3>
              <p className="text-sm text-gray-400">Nivel 1 - Referidos Directos</p>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400">10%</h3>
              <p className="text-sm text-gray-400">Nivel 2 - Referidos Indirectos</p>
            </div>
            <div className="bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-green-400">5%</h3>
              <p className="text-sm text-gray-400">Nivel 3 - Referidos Indirectos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Affiliates;
