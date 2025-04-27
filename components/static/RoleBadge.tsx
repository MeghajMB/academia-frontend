// components/RoleBadge.tsx
import React from "react";
import { motion } from "framer-motion";
import { RoleBadgeProps } from "../../types/roleBadge";

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className, same }) => {
  let x, y;
  if (same) {
    x = [0, 20, 0, 20, 0];
    y = [0, 0, 20, -20, 0];
  } else {
    x = [0, 0, 20, -20, 0];
    y = [0, 20, 0, 20, 0];
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        x: x,
        y: y,
        opacity: 1,
      }}
      transition={{
        duration: 14,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        opacity: { duration: 1 },
      }}
      className={`absolute hidden ${className} cursor-default backdrop-blur-sm border border-gray-700 rounded-lg py-2 px-4 lg:flex items-center gap-2`}
    >
      <span className="text-white">{role}</span>
    </motion.div>
  );
};

export default RoleBadge;
