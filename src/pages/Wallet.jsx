
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Wallet as WalletIcon, AlertCircle, Clock, CheckCircle, ArrowDown, ArrowUp } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Wallet = () => {
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [completedWithdrawals, setCompletedWithdrawals] = useState([]);
  const [netAmount, setNetAmount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const minimumWithdrawal = 50;
  const feePercentage = 6;

  useEffect(() => {
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
    const userWithdrawals = withdrawalRequests.filter(request => request.userId === currentUser.id);
    setPendingWithdrawals(userWithdrawals.filter(request => request.status === "pending"));
    setCompletedWithdrawals(userWithdrawals.filter(request => request.status === "completed"));
  }, [currentUser.id]);

  useEffect(() => {
    if (withdrawalAmount) {
      const amount = parseFloat(withdrawalAmount);
      const fee = (amount * feePercentage) / 100;
      setNetAmount(amount - fee);
    } else {
      setNetAmount(0);
    }
  }, [withdrawalAmount]);

  const handleWithdrawal = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);

    if (!amount || amount < minimumWithdrawal) {
      toast({
        title: "Error",
        description: `El monto mínimo de retiro es ${minimumWithdrawal} USDT`,
        variant: "destructive",
      });
      return;
    }

    if (amount > currentUser.availableBalance) {
      toast({
        title: "Error",
        description: "El monto excede tu saldo disponible",
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Por favor ingresa una dirección de wallet válida",
        variant: "destructive",
      });
      return;
    }

    const fee = (amount * feePercentage) / 100;
    const netAmountAfterFee = amount - fee;

    // Create withdrawal request
    const withdrawalRequests = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
    const newRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      amount: netAmountAfterFee, // Store net amount after fee
      originalAmount: amount,
      fee: fee,
      walletAddress,
      status: "pending",
      requestDate: new Date().toISOString()
    };
    withdrawalRequests.push(newRequest);
    localStorage.setItem("withdrawalRequests", JSON.stringify(withdrawalRequests));

    // Update user's available balance
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          availableBalance: user.availableBalance - amount
        };
      }
      return user;
    });
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify({
      ...currentUser,
      availableBalance: currentUser.availableBalance - amount
    }));

    // Update local state
    setPendingWithdrawals([...pendingWithdrawals, newRequest]);

    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud de retiro ha sido enviada correctamente",
    });

    setWithdrawalAmount("");
    setWalletAddress("");
    setNetAmount(0);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    adaptiveHeight: true,
    arrows: true,
    prevArrow: <Button variant="ghost" size="icon"><ArrowUp className="h-4 w-4" /></Button>,
    nextArrow: <Button variant="ghost" size="icon"><ArrowDown className="h-4 w-4" /></Button>,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Wallet</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletIcon className="h-6 w-6" />
                Saldo Disponible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${currentUser.availableBalance?.toFixed(2)} USDT</div>
              <p className="text-sm text-gray-400 mt-2">
                Retiro mínimo: ${minimumWithdrawal} USDT
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-900 to-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Información
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">
                Los retiros son procesados en un plazo máximo de 24 horas hábiles.
                Se aplica una comisión del {feePercentage}% por retiro.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Withdrawal Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Retiro</CardTitle>
            <CardDescription>
              Ingresa los detalles para tu retiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdrawal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Monto a retirar</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min={minimumWithdrawal}
                  max={currentUser.availableBalance}
                  step="0.01"
                  required
                />
                {withdrawalAmount && (
                  <div className="text-sm space-y-1">
                    <p className="text-gray-400">Fee ({feePercentage}%): ${((parseFloat(withdrawalAmount) || 0) * feePercentage / 100).toFixed(2)} USDT</p>
                    <p className="text-green-400">Recibirás: ${netAmount.toFixed(2)} USDT</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección USDT (TRC20)</label>
                <Input
                  placeholder="TRC20 Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!currentUser.availableBalance || currentUser.availableBalance < minimumWithdrawal}
              >
                Solicitar Retiro
              </Button>

              {(!currentUser.availableBalance || currentUser.availableBalance < minimumWithdrawal) && (
                <p className="text-sm text-red-400 text-center">
                  Fondos insuficientes para realizar un retiro
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdrawal History Carousel */}
      <div className="space-y-4">
        {pendingWithdrawals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Retiros Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-hidden">
                <Slider {...sliderSettings}>
                  {pendingWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-2">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">${withdrawal.amount} USDT</p>
                            <p className="text-sm text-gray-400">
                              Solicitado: {new Date(withdrawal.requestDate).toLocaleString()}
                            </p>
                          </div>
                          <span className="flex items-center gap-2 text-yellow-500">
                            <Clock className="h-4 w-4" />
                            Pendiente
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </CardContent>
          </Card>
        )}

        {completedWithdrawals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Retiros Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-hidden">
                <Slider {...sliderSettings}>
                  {completedWithdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-2">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">${withdrawal.amount} USDT</p>
                            <p className="text-sm text-gray-400">
                              Completado: {new Date(withdrawal.completedDate).toLocaleString()}
                            </p>
                          </div>
                          <span className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            Completado
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Wallet;
