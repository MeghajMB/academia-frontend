"use client";
import React from "react";
import { motion } from "framer-motion";
import AcademiaLogo from "@/public/images/academia-logo.png";
import Image from "next/image";

const LoadingPage = () => {
  // Dots animation variants
  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariant = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
  };

  return (
    <main className="h-full bg-black text-white flex flex-col items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded animate-pulse relative">
            <Image src={AcademiaLogo.src} alt="logo" fill />
          </div>

          <span className="text-2xl font-bold">Academia</span>
        </div>

        {/* Loading text */}
        <h1 className="text-xl font-medium text-gray-300">
          Loading your experience
        </h1>

        {/* Animated dots */}
        <motion.div
          variants={dotsVariants}
          initial="initial"
          animate="animate"
          className="flex justify-center space-x-2"
        >
          {[1, 2, 3].map((dot) => (
            <motion.span
              key={dot}
              variants={dotVariant}
              className="w-3 h-3 bg-indigo-600 rounded-full"
            />
          ))}
        </motion.div>

        {/* Loading message */}
        <p className="text-sm text-gray-400 mt-4">
          This may take a few moments
        </p>
      </motion.div>
    </main>
  );
};

export default LoadingPage;
