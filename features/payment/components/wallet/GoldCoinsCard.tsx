"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";

export const GoldCoinsCard = () => {
  return (
    <Card
      className="h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800/30"
      shadow="sm"
    >
      <CardHeader className="flex gap-3 pb-0">
        <div className="flex items-center text-amber-900 dark:text-amber-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v12"></path>
            <path d="M8 12h8"></path>
          </svg>
          <div>
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
              24,680
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              ≈ $2,468.00 USD
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
          startContent={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
          }
        >
          Withdraw
        </Button>
      </CardBody>
    </Card>
  );
};
