"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { Coins, Wallet } from "lucide-react";

export const GoldCoinsCard = ({ goldCoins, goldConversion,setWalletData }) => {
  return (
    <Card
      className="h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800/30"
      shadow="sm"
    >
      <CardHeader className="flex gap-3 pb-0">
        <div className="flex items-center text-amber-900 dark:text-amber-300">
          <Coins />
          <div className="px-1">
            <h4 className="text-lg font-medium">Gold Coins</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your primary currency for withdrawals
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div className="flex items-center justify-between mb-6 relative">
          <div>
            <div className="text-4xl font-bold text-amber-900 dark:text-amber-300">
              {goldCoins}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              ≈ ${goldCoins * goldConversion} INR
            </div>
          </div>

          {/* Coin */}
          <div className="relative h-10 w-12">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-amber-300 flex items-center justify-center shadow-lg"
                style={{
                  top: i * -4,
                  zIndex: 5 - i,
                  filter: `brightness(${100 - i * 5}%)`,
                }}
                animate={{ y: i * -2 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: i * 0.05,
                }}
              >
                <span className="text-amber-100 font-bold text-xs">GOLD</span>
              </motion.div>
            ))}
          </div>
        </div>

        <Button
          color="warning"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          startContent={<Wallet />}
        >
          Withdraw
        </Button>
      </CardBody>
    </Card>
  );
};
