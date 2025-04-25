"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the chart
const weekData = [
  { date: "Mon", redeemable: 120, gold: 50 },
  { date: "Tue", redeemable: 180, gold: 75 },
  { date: "Wed", redeemable: 150, gold: 60 },
  { date: "Thu", redeemable: 250, gold: 100 },
  { date: "Fri", redeemable: 300, gold: 120 },
  { date: "Sat", redeemable: 280, gold: 110 },
  { date: "Sun", redeemable: 220, gold: 90 },
];

const monthData = [
  { date: "Week 1", redeemable: 1200, gold: 480 },
  { date: "Week 2", redeemable: 1500, gold: 600 },
  { date: "Week 3", redeemable: 1800, gold: 720 },
  { date: "Week 4", redeemable: 2200, gold: 880 },
];

const yearData = [
  { date: "Jan", redeemable: 4500, gold: 1800 },
  { date: "Feb", redeemable: 5200, gold: 2080 },
  { date: "Mar", redeemable: 4800, gold: 1920 },
  { date: "Apr", redeemable: 6000, gold: 2400 },
  { date: "May", redeemable: 7200, gold: 2880 },
  { date: "Jun", redeemable: 6800, gold: 2720 },
  { date: "Jul", redeemable: 7500, gold: 3000 },
  { date: "Aug", redeemable: 8200, gold: 3280 },
  { date: "Sep", redeemable: 7800, gold: 3120 },
  { date: "Oct", redeemable: 8500, gold: 3400 },
  { date: "Nov", redeemable: 9200, gold: 3680 },
  { date: "Dec", redeemable: 10000, gold: 4000 },
];

export const EarningsChart = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const chartData =
    timeRange === "week"
      ? weekData
      : timeRange === "month"
      ? monthData
      : yearData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            {payload[0].value} Redeemable Coins
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            {payload[1].value} Gold Coins
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <h4 className="text-lg font-medium">Earnings Overview</h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your coin earnings over time
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={timeRange === "week" ? "flat" : "light"}
            color={timeRange === "week" ? "secondary" : "default"}
            onPress={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={timeRange === "month" ? "flat" : "light"}
            color={timeRange === "month" ? "secondary" : "default"}
            onPress={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={timeRange === "year" ? "flat" : "light"}
            color={timeRange === "year" ? "secondary" : "default"}
            onPress={() => setTimeRange("year")}
          >
            Year
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <motion.div
          key={timeRange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorRedeemable"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="redeemable"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRedeemable)"
                name="Redeemable Coins"
              />
              <Area
                type="monotone"
                dataKey="gold"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGold)"
                name="Gold Coins"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <div>
              <p className="text-xs text-purple-700 dark:text-purple-400">
                Total Redeemable
              </p>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-300">
                {timeRange === "week"
                  ? "1,500"
                  : timeRange === "month"
                  ? "6,700"
                  : "75,700"}
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <div>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Total Gold
              </p>
              <p className="text-lg font-bold text-amber-900 dark:text-amber-300">
                {timeRange === "week"
                  ? "605"
                  : timeRange === "month"
                  ? "2,680"
                  : "30,280"}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
