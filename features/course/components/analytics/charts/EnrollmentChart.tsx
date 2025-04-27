"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EnrollmentChartProps {
  data: { date: string; averageProgress: number; count: number }[];
}

export const EnrollmentChart = ({ data }: EnrollmentChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="border-none shadow-md">
          <CardBody className="py-2 px-3">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-lg font-semibold text-primary">
              {payload[0].value} students
            </p>
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
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
            tickMargin={10}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 112, 243, 0.1)" }}
          />
          <Bar
            dataKey="count"
            fill="#0070F3"
            radius={[4, 4, 0, 0]}
            onMouseEnter={(data, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry, index) => (
              <motion.g
                key={`cell-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: hoveredIndex === index ? 1.05 : 1,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                }}
              >
                <motion.rect
                  fill={
                    hoveredIndex === index ? "#0080FF" : "#0070F3"
                  }
                />
              </motion.g>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
