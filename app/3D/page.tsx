"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollLineAnimation() {
  const targetRef = useRef(null);

  // Scroll progress on the entire container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Animates the stroke drawing
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={targetRef} className="min-h-[200vh] bg-black text-white">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.svg
          width="100vw" // Make width responsive
          height="100vh" // Make height responsive
          viewBox="0 0 600 600" // Fixed viewBox for consistent scaling
          className="overflow-visible z-0"
        >
          {/* Example custom path - can be any shape */}
          <motion.path
            d="M15.5 1C15.5 1 15.5 -6 15.5 26.5C15.5 59 15.5 69.5 15.5 69.5M15.5 69.5C15.5 69.5 32 71 31 81.5C30 92 15.5 92 15.5 92C15.5 92 3 92 2.5 81.5C2 71 15.5 69.5 15.5 69.5ZM15.5 69.5V126V150.5L15.5 172.5"
            stroke="#C448F9"
            strokeWidth="4"
            fill="transparent"
            style={{ pathLength }}
          />

          {/* Ripple or marker at the end */}
          <motion.circle
            cx="280"
            cy="280"
            r="10"
            fill="white"
            style={{
              scale: pathLength,
              opacity: pathLength,
              transformOrigin: "center",
            }}
          />
        </motion.svg>
      </div>
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Hello Academia 🚀</h1>
          <p className="mt-4 text-gray-300">This is your animated intro!</p>
        </div>
      </div>
    </div>
  );
}
