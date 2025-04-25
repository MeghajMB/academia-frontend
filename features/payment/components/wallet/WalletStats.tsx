"use client";

import { motion } from "framer-motion";

interface WalletStatsProps {
  className?: string;
}

export const WalletStats = ({ className }: WalletStatsProps) => {
  const stats = [
    {
      title: "Total Earnings",
      value: "$24,568",
      change: "+18%",
      changeType: "positive",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
    },
    {
      title: "Gold Coin Conversion Rate",
      value: "1.25:1",
      change: "Standard",
      changeType: "neutral",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-yellow-500"
        >
          <path d="M12 2v20"></path>
          <path d="m17 5-5-3-5 3"></path>
          <path d="m17 19-5 3-5-3"></path>
        </svg>
      ),
    },
    {
      title: "Redeem Coin Conversion Rate",
      value: "5:1",
      change: "Standard",
      changeType: "neutral",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500"
        >
          <path d="M12 2v20"></path>
          <path d="m17 5-5-3-5 3"></path>
          <path d="m17 19-5 3-5-3"></path>
        </svg>
      ),
    },
  ];

  return (
    <div
      className={
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 " + className
      }
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-xs font-medium ${
                stat.changeType === "positive"
                  ? "text-emerald-600 dark:text-emerald-500"
                  : stat.changeType === "negative"
                  ? "text-red-600 dark:text-red-500"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
