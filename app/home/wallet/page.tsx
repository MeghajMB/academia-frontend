"use client";

import { motion } from "framer-motion";
import { GoldCoinsCard } from "@/features/payment/components/wallet/GoldCoinsCard";
import RedeemablePointsCard from "@/features/payment/components/wallet/RedeemableCoinsCard";
import { TransactionHistory } from "@/features/payment/components/wallet/TransactionHistory";
import WalletStats from "@/features/payment/components/wallet/WalletStats";
import { useEffect, useState } from "react";
import usePaymentApi from "@/hooks/api/usePaymentApi";
import { WalletData } from "./type";

export default function WalletPage() {
  const { getWalletApi } = usePaymentApi();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        setIsLoading(true);
        const response = await getWalletApi();
        if (response.status == "error") {
          throw new Error(response.message);
        }
        setWalletData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWallet();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl mt-7 font-bold text-zinc-900 dark:text-zinc-50">
          Wallet
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your earnings, redeem coins, and track your financial
          performance
        </p>
      </motion.div>

      {/* Coins Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GoldCoinsCard
          goldCoins={walletData?.goldCoins}
          goldConversion={walletData?.goldConversion}
          setWalletData={setWalletData}
        />
        <RedeemablePointsCard
          setWalletData={setWalletData}
          redeemablePoints={walletData?.redeemPoints}
          redeemConversion={walletData?.redeemConversion}
        />
      </div>

      {/* Wallet Stats */}

      <WalletStats
        goldConversion={walletData?.goldConversion}
        redeemConversion={walletData?.redeemConversion}
        totalEarnings={walletData?.totalEarnings}
        isLoading={isLoading}
        className="mb-8"
      />

      {/* Bottom Section */}
      <div className="grid grid-cols-1">
        <TransactionHistory />
      </div>
    </main>
  );
}
