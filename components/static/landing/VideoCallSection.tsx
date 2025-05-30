"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export const ConnectSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[450px] bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700/50 overflow-hidden"
      variants={item}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

      {/* Main video call interface */}
      <VideoCallAnimation />
      {/* Connection particles */}
      <ConnectionParticles />
    </motion.div>
  );
};

// Video call interface animation component
const VideoCallAnimation = () => {
  const [activePerson, setActivePerson] = useState(0);

  // Cycle through active speakers
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePerson((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // People in the video call
  const people = [
    { name: "Alex", role: "Instructor", color: "from-blue-500 to-cyan-500" },
    { name: "Taylor", role: "Student", color: "from-purple-500 to-pink-500" },
    { name: "Jordan", role: "Student", color: "from-amber-500 to-orange-500" },
    { name: "Morgan", role: "Student", color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col p-6">
      {/* Video call header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white font-medium">Live Session</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>32:15</span>
        </div>
      </motion.div>

      {/* Main video grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {people.map((person, index) => (
          <motion.div
            key={person.name}
            className={`relative rounded-lg overflow-hidden ${
              index === activePerson
                ? "border-2 border-white"
                : "border border-zinc-700"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {/* Gradient background representing the person */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${person.color} opacity-70`}
            />

            {/* Person silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            {/* Person info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{person.name}</span>
                <div className="flex gap-1">
                  {index === activePerson && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </motion.div>
                  )}
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 7l-7 5 7 5V7z"></path>
                      <rect
                        x="1"
                        y="5"
                        width="15"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-xs text-zinc-300">{person.role}</span>
            </div>

            {/* Audio waveform for active speaker */}
            {index === activePerson && (
              <motion.div
                className="absolute bottom-10 left-0 right-0 flex justify-center items-end h-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 mx-0.5 bg-white/70 rounded-full"
                    animate={{
                      height: [4, 12, 8, 16, 4][i % 5],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      duration: 0.8,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Video call controls */}
      <motion.div
        className="flex justify-center mt-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {[
          { icon: "mic", color: "bg-emerald-500" },
          { icon: "video", color: "bg-emerald-500" },
          { icon: "message-square", color: "bg-zinc-600" },
          { icon: "users", color: "bg-zinc-600" },
          { icon: "phone-off", color: "bg-red-500" },
        ].map((control) => (
          <motion.button
            key={control.icon}
            className={`w-10 h-10 rounded-full ${control.color} flex items-center justify-center text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {control.icon === "mic" && (
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              )}
              {control.icon === "mic" && (
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              )}
              {control.icon === "mic" && (
                <line x1="12" y1="19" x2="12" y2="23"></line>
              )}
              {control.icon === "mic" && (
                <line x1="8" y1="23" x2="16" y2="23"></line>
              )}

              {control.icon === "video" && (
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
              )}
              {control.icon === "video" && (
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              )}

              {control.icon === "message-square" && (
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              )}

              {control.icon === "users" && (
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              )}
              {control.icon === "users" && (
                <circle cx="9" cy="7" r="4"></circle>
              )}
              {control.icon === "users" && (
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              )}
              {control.icon === "users" && (
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              )}

              {control.icon === "phone-off" && (
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
              )}
              {control.icon === "phone-off" && (
                <line x1="1" y1="1" x2="23" y2="23"></line>
              )}
            </svg>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

// Connection particles animation
const ConnectionParticles = () => {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400"
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 400,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x: Math.random() * 400,
            y: Math.random() * 400,
            opacity: 0.4,
            scale: 1,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </>
  );
};
