"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import RoleBadge from "@/components/static/RoleBadge";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiltChartCard } from "@/components/static/landing/TiltCard";
import { LandingSection } from "@/components/static/LandingSection";
import Cube from "@/components/static/landing/Cube";
import { ConnectSection } from "@/components/static/landing/VideoCallSection";

export default function Page() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (user.role) {
      if (user.role == "admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    }
  }, [router, user.role]);
  return (
    <>
      <main className="pt-10 pb-16 px-4">
        {/* Announcement banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-md py-1 px-5 cursor-default">
            <p className="text-sm md:text-base">
              Learn at Your Own Pace, Anytime, Anywhere
            </p>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8"
          >
            Learn at Your Own Pace, Anytime, Anywhere
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 mb-12"
          >
            Empower your learning journey with curated courses and live events
          </motion.p>

          {/* Email signup section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex justify-center  sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-6 py-3 bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Get started
              </Link>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-400"
          >
            Top companies choose Academia to build in-demand career skills.
          </motion.p>

          {/* Floating role badges */}
          <RoleBadge
            role="Designer"
            same={false}
            className="top-0 left-0 md:-left-20 bg-fuchsia-600"
          />
          <RoleBadge
            role="Developer"
            same
            className="top-20 right-0 md:-right-20 bg-rose-500"
          />
          <RoleBadge
            role="Software Testing"
            same
            className="bottom-0 left-10 md:-left-30 bg-orange-500"
          />
          <RoleBadge
            role="Trading"
            same={false}
            className="bottom-20 right-10 md:-right-30 bg-teal-600"
          />
        </div>

        {/* Analytics section */}
        <LandingSection
          chip="Analytics Dashboard"
          title="Know Your Impact"
          description="Dive into comprehensive analytics to understand your performance,
              track earnings, and measure engagement metrics in real-time."
          order="left"
          AnimatedContent={TiltChartCard}
        />
        {/* Coin System */}
        <LandingSection
          chip="Coins & Rewards"
          title="A Learning Economy Like No Other"
          description="Use Virtual coins to engage in a gamified educational experience. 
          Use them to unlock exclusive instructor services through competitive bidding."
          order="right"
          AnimatedContent={Cube}
        />
        {/* Videocall */}
        <LandingSection
          chip="Connect"
          title="Connect Live with Experts"
          description="Join real-time video calls with instructors through built-in WebRTC integration.
           Get personalized guidance and immediate feedback on your progress."
          order="left"
          AnimatedContent={ConnectSection}
        />
      </main>
    </>
  );
}
