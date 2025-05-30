"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; totalAmount: number }[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-In", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="border-none shadow-md">
          <CardBody className="py-2 px-3">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-lg font-semibold text-secondary">
              {formatCurrency(payload[0].value)}
            </p>
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  const CustomDot = ({ cx, cy, index }: any) => {
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={hoveredIndex === index ? 6 : 4}
        fill="#7828C8"
        stroke="white"
        strokeWidth={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    );
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7828C8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7828C8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="totalAmount"
            stroke="#7828C8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={<CustomDot />}
            activeDot={{ r: 8, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
