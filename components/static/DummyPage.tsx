"use client";
import React from "react";

function DummyPage() {
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-semibold mb-4">Why Academia?</h2>
        <p className="max-w-xl mb-8">
          Discover how Academia is revolutionizing the way people learn and
          teach online.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <FeatureCard
            title="Comprehensive Courses"
            desc="Structured, instructor-led learning paths."
          />
          <FeatureCard
            title="Instructor Ecosystem"
            desc="Create, manage, and monetize your knowledge."
          />
          <FeatureCard
            title="Real-Time Messaging"
            desc="Built-in chat and communication tools."
          />
          <FeatureCard
            title="Gamified Learning"
            desc="Earn and spend coins for engaging experiences."
          />
        </div>
      </section>

      {/* Learn Anytime */}
      <Section
        title="Learning that Fits Your Life"
        desc="Access high-quality content, track your progress, and complete learning paths anytime, anywhere."
      />

      {/* Instructor Ecosystem */}
      <Section
        title="Empower Your Teaching Journey"
        desc="From uploading lectures to offering services, Academia gives you all the tools to grow."
      />

      {/* Coin System */}
      <Section
        title="A Learning Economy Like No Other"
        desc="Use Virtual coins to engage in a gamified educational experience."
      />

      {/* Live Services */}
      <Section
        title="Connect Live with Experts"
        desc="Join real-time video calls with instructors through built-in WebRTC integration."
      />

      {/* Analytics */}
      <Section
        title="Know Your Impact"
        desc="Dive into analytics to understand performance, earnings, and engagement."
      />

      {/* Tech & Scale */}
      <Section
        title="Powered by Modern Tech"
        desc="Microservices. Kafka. Kubernetes. Academia is built for scale and security."
      />

      {/* CTA */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-semibold mb-4">Ready to Level Up?</h2>
        <p className="max-w-xl mb-6">
          Whether you&apos;re here to learn or teach, Academia is the place for
          you.
        </p>
        <div className="flex gap-4">
          <button className="bg-purple-600 px-6 py-2 rounded-xl">
            Start Learning
          </button>
          <button className="border border-purple-600 px-6 py-2 rounded-xl">
            Start Teaching
          </button>
        </div>
      </section>
    </>
  );
}
export default DummyPage;

const Section = ({ title, desc }: { title: string; desc: string }) => (
  <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
    <p className="max-w-xl">{desc}</p>
  </section>
);

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm">{desc}</p>
  </div>
);
