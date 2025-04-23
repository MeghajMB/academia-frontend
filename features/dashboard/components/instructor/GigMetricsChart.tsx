import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

type GigMetricsProps = {
  data: {
    activeGigs: number;
    expiredGigs: number;
    completedGigs: number;
    missedGigs: number;
    noBidGigs: number;
  };
};

export const GigMetricsChart = ({ data }: GigMetricsProps) => {
  const chartData = [
    { name: "Active", value: data.activeGigs, color: "#10B981" },
    { name: "Completed", value: data.completedGigs, color: "#3B82F6" },
    { name: "Expired", value: data.expiredGigs, color: "#F59E0B" },
    { name: "Missed", value: data.missedGigs, color: "#EF4444" },
    { name: "No Bid", value: data.noBidGigs, color: "#6B7280" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p
            className="font-medium"
            style={{ color: payload[0].payload.color }}
          >
            {payload[0].payload.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">{payload[0].value}</span> gigs
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

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <motion.li
            key={`legend-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </motion.li>
        ))}
      </ul>
    );
  };
console.log(data)
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
