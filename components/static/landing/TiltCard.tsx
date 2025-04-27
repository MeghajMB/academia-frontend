'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const sampleData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 200 },
  { name: 'Wed', value: 150 },
  { name: 'Thu', value: 250 },
  { name: 'Fri', value: 300 },
  { name: 'Sat', value: 180 },
  { name: 'Sun', value: 220 },
];

export const TiltChartCard = () => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);
  const shine = useTransform(y, [0, 1], [0.5, 0.8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const normalizedX = offsetX / rect.width;
    const normalizedY = offsetY / rect.height;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 shadow-lg">
          <p className="text-zinc-300 text-sm">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-zinc-700/50 shadow-xl relative overflow-hidden"
    >
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-purple-500/20 pointer-events-none"
        style={{ opacity: shine }}
      />
      
      <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl text-white font-semibold">Weekly Views</h3>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 text-sm font-medium">+12.5%</span>
            <span className="text-zinc-400 text-xs">vs last week</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#888" axisLine={false} tickLine={false} />
            <YAxis stroke="#888" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#a855f7" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Daily', 'Weekly', 'Monthly'].map((period, index) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-2 rounded-lg text-sm font-medium ${
                index === 1 
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
