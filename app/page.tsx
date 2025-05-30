"use client";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { TiltChartCard } from "@/components/static/landing/TiltCard";
import { LandingSection } from "@/components/static/LandingSection";
import Cube from "@/components/static/landing/Cube";
import { ConnectSection } from "@/components/static/landing/VideoCallSection";
import HeroSection from "@/components/static/landing/HeroSection";

export default function Page() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (user.role) {
      if (user.role == "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/home");
      }
    }
  }, []);
  return (
    <>
      <main className="pt-10 pb-16 px-4">
        <HeroSection />
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
