
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, CheckCircle, Clock, History, Search, ArrowUp, ArrowDown } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdminPayments = () => {
  const { toast } = useToast();
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
    setWithdrawalRequests(requests);
  }, []);

  const filterRequests = (requests) => {
    return requests.filter(request => {
      const matchesSearch = 
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
        new Date(request.status === "completed" ? request.completedDate : request.requestDate)
          .toLocaleDateString()
          .includes(dateFilter);

      return matchesSearch && matchesDate;
    });
  };

  const pendingRequests = filterRequests(withdrawalRequests.filter(r => r.status === "pending"));
  const completedRequests = filterRequests(withdrawalRequests.filter(r => r.status === "completed"));

  const handlePaymentComplete = (requestId) => {
    const updatedRequests = withdrawalRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: "completed",
          completedDate: new Date().toISOString()
        };
      }
      return request;
    });

    setWithdrawalRequests(updatedRequests);
    localStorage.setItem("withdrawalRequests", JSON.stringify(updatedRequests));

    const completedRequest = updatedRequests.find(r => r.id === requestId);

    console.log("Email sent to:", completedRequest.email, {
      subject: "Retiro Procesado",
      body: `Tu retiro de ${completedRequest.amount} USDT ha sido procesado exitosamente.`
    });

    toast({
      title: "Pago completado",
      description: "El usuario ha sido notificado por correo electrónico",
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestión de Pagos</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{withdrawalRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{completedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por email o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <Button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <History className="h-4 w-4 mr-2" />
          {showHistory ? "Ver Solicitudes Pendientes" : "Ver Historial"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {showHistory ? "Historial de Retiros" : "Solicitudes de Retiro"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(showHistory ? completedRequests : pendingRequests).length > 0 ? (
            <div className="max-h-[600px] overflow-hidden">
              <Slider {...sliderSettings}>
                {(showHistory ? completedRequests : pendingRequests).map(request => (
                  <div key={request.id} className="p-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold">{request.username}</h3>
                          <p className="text-sm text-gray-400">{request.email}</p>
                          <p className="text-sm text-gray-400">
                            Wallet: {request.walletAddress}
                          </p>
                          <p className="text-sm text-blue-400">
                            Monto: ${request.amount} USDT
                          </p>
                          <p className="text-sm text-gray-400">
                            {request.status === "completed" ? (
                              <>Completado: {new Date(request.completedDate).toLocaleString()}</>
                            ) : (
                              <>Solicitado: {new Date(request.requestDate).toLocaleString()}</>
                            )}
                          </p>
                        </div>
                        {request.status === "pending" ? (
                          <Button
                            onClick={() => handlePaymentComplete(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Pago pendiente
                          </Button>
                        ) : (
                          <span className="text-green-500 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Pago realizado
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p className="text-center text-gray-400">
              {showHistory ? "No hay retiros completados" : "No hay solicitudes pendientes"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
