"use client";
import { motion, useScroll, useTransform } from "framer-motion";
export default function MotionPath() {
  // Scroll progress on the entire container
  const { scrollYProgress } = useScroll();

  // Animates the stroke drawing
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.svg
      width="100%" // Make width responsive
      height="100%" // Make height responsive
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
  );
}
