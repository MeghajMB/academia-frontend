import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type ReviewDistributionProps = {
  data: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

export const ReviewDistributionChart = ({ data }: ReviewDistributionProps) => {
  const chartData = [
    { name: "1 Star", value: data[1], color: "#0088FE" },
    { name: "2 Stars", value: data[2], color: "#00C49F" },
    { name: "3 Stars", value: data[3], color: "#FFBB28" },
    { name: "4 Stars", value: data[4], color: "#FF8042" },
    { name: "5 Stars", value: data[5], color: "red" },
  ];
  //const colors = ['#', '#', '#', '#', '', 'pink'];
  const barRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    barRefs.current = barRefs.current.slice(0, chartData.length);
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">
            <span className="font-semibold">{payload[0].value}</span> reviews
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {(
              (payload[0].value /
                Object.values(data).reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1)}
            % of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barGap={8}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
