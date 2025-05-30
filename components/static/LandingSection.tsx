"use client";

import { motion } from "framer-motion";
import { JSX } from "react";
interface SectionProps {
  chip: string;
  title: string;
  description: string;
  order: "left" | "right";
  AnimatedContent:() => JSX.Element;
}
export const LandingSection = ({
  chip,
  title,
  description,
  order,
  AnimatedContent
}: SectionProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-20 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
          <motion.div
            variants={item}
            className={`${
              order == "left" ? "md:order-1" : "md:order-2"
            } order-1 h-[450px] p-4`}
          >
            <AnimatedContent />
          </motion.div>

          <motion.div
            variants={container}
            className={`${
              order == "left" ? " md:order-2" : "md:order-1"
            } order-2 flex flex-col items-start text-left md:pl-8`}
          >
            <motion.div variants={item} className="inline-block mb-3">
              <span className="bg-purple-900/30 text-purple-400 text-xs font-medium px-3 py-1 rounded-full border border-purple-700/30">
                {chip}
              </span>
            </motion.div>

            <motion.h2
              variants={item}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={item}
              className="text-lg text-zinc-400 mb-8 max-w-xl"
            >
              {description}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
