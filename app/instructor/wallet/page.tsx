"use client";

import { motion } from "framer-motion";
import { GoldCoinsCard } from "@/features/payment/components/wallet/GoldCoinsCard";
import { RedeemableCoinsCard } from "@/features/payment/components/wallet/RedeemableCoinsCard";
import { EarningsChart } from "@/features/payment/components/wallet/EarningsChart";
import { TransactionHistory } from "@/features/payment/components/wallet/TransactionHistory";
import { WalletStats } from "@/features/payment/components/wallet/WalletStats";

export default function InstructorWallet() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Instructor Wallet
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your earnings, redeem coins, and track your financial
          performance
        </p>
      </motion.div>

      {/* Coins Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GoldCoinsCard />
        <RedeemableCoinsCard />
      </div>

      {/* Wallet Stats */}
      <WalletStats className="mb-8" />

      {/* Earnings Chart */}
      <div className="mb-8">
        <EarningsChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1">
        <TransactionHistory />
      </div>
    </main>
  );
}
