import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReferralStats from "@/components/ReferralStats";
import CountdownTimer from "@/components/CountdownTimer";
import RecentActivity from "@/components/RecentActivity";
import { Copy, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useUserDataStore from "../zustand/isAuthenticate";
import {getCommissionsByUserId} from '@/services/api/commissions/getCommissionsByUserId';
import { getPaymentsByUserId } from '@/services/api/payments/getAllPaymentsByUserId';

const Dashboard = () => {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState([]);
  const [payments, setPayments] = useState([]);

  const { currentUser, syncUserDataFromServer } = useUserDataStore();
  const dataUser = currentUser || "{}";
  const countActiveUsers = Object.values(currentUser?.referrals || {})
  const activeReferrals = countActiveUsers.filter(user => user.account_status === 'active').length;
  const totalAmount = commissions.reduce((acc, item) => acc + item.amount, 0);
  const totalPaymentsAmount = payments.reduce((sum, item) => sum + (item?.original_amount || 0), 0);
  const currencyBalance = (totalAmount - totalPaymentsAmount) || 0;

  // Calculate real statistics based on referrals and active plans
  const stats = {
    activeReferrals: activeReferrals,
    newReferrals: 0, // This would need to be calculated based on recent signups
    totalEarnings: totalAmount?.toFixed(2) || "0.00",
    monthlyEarnings: totalAmount?.toFixed(2) || "0.00",
    level: dataUser.level || "Bronce",
    nextLevelProgress: dataUser.nextLevelProgress || 0,
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}?ref=${dataUser.referral_code}`
    );
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de referido ha sido copiado al portapapeles",
    });
  };


  useEffect(() => {
    syncUserDataFromServer();

    currentUser?.id ? getPaymentsByUserId(currentUser.id).then(res => {
      if (res.success) setPayments(res.data);
    }) : null;

    const getPlansByUser = async () => {
      if(currentUser.id_plan){
        const res = await getCommissionsByUserId(currentUser.id);
        if(res.success && res.data){
          setCommissions(res.data)
        }
      }
    }

    getPlansByUser();
  },[currentUser])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={dataUser.avatar} />
            <AvatarFallback>
              {dataUser.full_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Bienvenido, {dataUser.full_name}
            </h1>
            <p className="text-gray-400">
              Miembro desde{" "}
              {new Date(dataUser.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Available Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Saldo Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${currencyBalance.toFixed(2)} USDT</div>
            <p className="text-sm text-gray-400 mt-2">
              Retiro mínimo: $50 USDT
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Referral Stats */}
      <ReferralStats stats={stats} />

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900">
          <CardHeader>
            <CardTitle>Tu Enlace de Referido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <code className="rounded bg-gray-800 px-4 py-2 flex-1">
                {`${window.location.origin}?ref=${dataUser.referral_code}`}
              </code>
              <button
                onClick={handleCopyReferralLink}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentActivity currentUser={dataUser} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
