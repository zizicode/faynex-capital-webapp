import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet as WalletIcon, AlertCircle, Clock, CheckCircle, ArrowDown, ArrowUp } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCommissionsByUserId } from '@/services/api/commissions/getCommissionsByUserId';
import { getPaymentsByUserId } from '@/services/api/payments/getAllPaymentsByUserId';
import { createPayments } from '@/services/api/payments/createPayments';

const Wallet = () => {
  const [commissions, setCommissions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [netAmount, setNetAmount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const minimumWithdrawal = 50;
  const feePercentage = 6;

  const pendingWithdrawals = payments.filter(p => p.status === "pending");
  const completedWithdrawals = payments.filter(p => p.status === "completed");
  const totalCommissions = commissions.reduce((sum, item) => sum + (item?.amount || 0), 0);
  const totalPaymentsAmount = payments.reduce((sum, item) => sum + (item?.original_amount || 0), 0);
  const currencyBalance = (totalCommissions - totalPaymentsAmount) || 0;

  useEffect(() => {
    if (!currentUser.id) return;

    getPaymentsByUserId(currentUser.id).then(res => {
      if (res.success) setPayments(res.data);
    });

    getCommissionsByUserId(currentUser.id).then(res => {
      if (res.success) setCommissions(res.data);
    });
  }, [currentUser.id]);

  useEffect(() => {
    const amount = parseFloat(withdrawalAmount);
    const fee = (amount * feePercentage) / 100;
    setNetAmount(amount ? amount - fee : 0);
  }, [withdrawalAmount]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    // 
    if (parseFloat(withdrawalAmount) > currencyBalance) {
      console.log("No cuenta con saldo suficiente para esta transaccion")
      return
    }

    const payload = {
      user_id: currentUser?.id,
      wallet_address: walletAddress,
      original_amount: await parseFloat(withdrawalAmount),
      fee: feePercentage,
      amount: netAmount,
    }

    try {
      const result = await createPayments(payload)

      if (result.success) {
        getPaymentsByUserId(currentUser.id).then(res => {
          if (res.success) setPayments(res.data);
        });
        setWithdrawalAmount("");
        setWalletAddress("");
        setNetAmount(0);
        return
      }

      console.log(result.message);
    } catch (error) {
      console.error(error.message)
    }
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
        {[{
          icon: <WalletIcon className="h-6 w-6" />, title: "Saldo Disponible",
          content: <>
            <div className="text-4xl font-bold">${currencyBalance} USDT</div>
            <p className="text-sm text-gray-400 mt-2">Retiro mínimo: ${minimumWithdrawal} USDT</p>
          </>
        }, {
          icon: <AlertCircle className="h-6 w-6" />, title: "Información",
          content: <p className="text-sm text-gray-300">Los retiros se procesan en 24h. Comisión del {feePercentage}%.</p>
        }].map(({ icon, title, content }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className={`bg-gradient-to-br from-${i ? 'purple' : 'blue'}-900 to-${i ? 'purple' : 'blue'}-800`}>
              <CardHeader><CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle></CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Retiro</CardTitle>
            <CardDescription>Ingresa los detalles para tu retiro</CardDescription>
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
                    <p className="text-gray-400">Fee ({feePercentage}%): ${(parseFloat(withdrawalAmount) * feePercentage / 100).toFixed(2)} USDT</p>
                    <p className={
                      netAmount > 0 && (netAmount < 50 || parseFloat(withdrawalAmount) > currencyBalance)
                        ? "text-red-500"
                        : "text-green-400"
                    }>
                      {netAmount > 0 && parseFloat(withdrawalAmount) > currencyBalance
                        ? "No cuentas con saldo suficiente"
                        : netAmount > 0 && netAmount < 50
                          ? `Retiro mínimo: $${minimumWithdrawal}`
                          : `Recibirás: ${netAmount.toFixed(2)} USDT`}
                    </p>
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
                disabled={currencyBalance < minimumWithdrawal}
              >
                Solicitar Retiro
              </Button>

              {currencyBalance < minimumWithdrawal && (
                <p className="text-sm text-red-400 text-center">
                  Fondos insuficientes para realizar un retiro
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        {[{ label: "Retiros Pendientes", icon: <Clock className="h-6 w-6" />, data: pendingWithdrawals, status: "Pendiente", color: "yellow", dateKey: "created_at" },
        { label: "Retiros Completados", icon: <CheckCircle className="h-6 w-6" />, data: completedWithdrawals, status: "Completado", color: "green", dateKey: "completedDate" }
        ].map(({ label, icon, data, status, color, dateKey }) => (
          data.length > 0 && (
            <Card key={status}>
              <CardHeader><CardTitle className="flex items-center gap-2">{icon}{label}</CardTitle></CardHeader>
              <CardContent>
                <div className="max-h-[300px] overflow-hidden">
                  <Slider {...sliderSettings}>
                    {data.map((withdrawal) => (
                      <div key={withdrawal.id} className="p-2">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">${withdrawal.amount} USDT</p>
                              <p className="text-sm text-gray-400">
                                {status}: {new Date((withdrawal[dateKey] || '').split('.')[0]).toLocaleString()}
                              </p>
                            </div>
                            <span className={`flex items-center gap-2 text-${color}-500`}>
                              {icon}<span>{status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default Wallet;
