"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type TimeSeriesChartProps = {
  data: { date: string; [key: string]: any }[];
  dataKey: string;
  xAxisKey: string;
  color: string;
  prefix?: string;
};

export const TimeSeriesChart = ({
  data,
  dataKey,
  xAxisKey,
  color,
  prefix = "",
}: TimeSeriesChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm">
            <span className="font-semibold">
              {prefix}
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
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
        fill={color}
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
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-white ">
        No data available to display.
      </div>
    );
  }
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatDate}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${prefix}${value}`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${dataKey})`}
            dot={<CustomDot />}
            activeDot={{ r: 8, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
