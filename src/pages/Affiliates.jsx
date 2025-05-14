import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getReferralsTree } from "@/services/api/referrals/getReferralsTree";

const Affiliates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [affiliates, setAffiliates] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  useEffect(() => {
    const fetchAffiliates = async () => {
      if (!currentUser?.id) return;

      try {
        const res = await getReferralsTree(currentUser.id);
        if (!res.success || !res.data) {
          setAffiliates([]);
          return;
        }

        const { level1 = {}, level2 = {}, level3 = {} } = res.data;

        const formatLevel = (levelObj, levelNum) =>
          Object.values(levelObj)
            .flat()
            .map((user) => ({ ...user, level: levelNum }));

        const allAffiliates = [
          ...formatLevel(level1, 1),
          ...formatLevel(level2, 2),
          ...formatLevel(level3, 3),
        ];

        setAffiliates(allAffiliates);
      } catch (error) {
        console.error("Error loading referral tree:", error);
        setAffiliates([]);
      }
    };

    fetchAffiliates();
  }, [currentUser?.id]);

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
          <p className="text-sm text-gray-400">
            Mostrando {filteredAffiliates.filter(a => a.level === 1).length} afiliados de nivel 1
          </p>
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

          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scroll">
            {filteredAffiliates.filter(a => a.level === 1).length > 0 ? (
              filteredAffiliates
                .filter(a => a.level === 1)
                .map(affiliate => {
                  const level2 = filteredAffiliates.filter(b => b.level === 2 && b.referrer_id === affiliate.id);
                  return (
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
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                Nivel 1
                              </span>
                              {affiliate.active_plan && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                  Plan {affiliate.active_plan}
                                </span>
                              )}
                            </div>
                            {level2.length > 0 && (
                              <div className="mt-2 text-sm text-gray-400">
                                <span className="font-medium text-purple-300">Referidos de {affiliate.full_name}:</span>{' '}
                                {level2.map(user => user.username).join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              Registrado: {new Date(affiliate.created_at || 0).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-400">
                              Última actividad: {new Date(affiliate.updated_at || 0).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })
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
