"use client";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function InstructorIntroductionPage() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>

      <main className="pt-24">
        <section className="hero bg-[#0f0f0f] text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold">
              Become an Instructor at Academia
            </h1>
            <p className="mt-4 text-xl">
              Share your knowledge and make a global impact while earning
              rewards!
            </p>
            {user.verified == "pending" ? (
              <p className=" p-10 text-purple-700">Request Has Been Send.<br/>Will Notify when accepted.</p>
            ) : (
              <Link
                href="/home/teaching/register"
                className="mt-8 inline-block bg-blue-700 text-white py-3 px-6 rounded-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>

        <section className="benefits py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold">Why Become an Instructor?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <div className="benefit">
                <h3 className="text-xl font-semibold">Flexible Schedule</h3>
                <p className="text-gray-500">
                  Teach on your own terms, anytime, anywhere.
                </p>
              </div>
              <div className="benefit">
                <h3 className="text-xl font-semibold">Earn Coins</h3>
                <p className="text-gray-500">
                  Unlock exciting rewards and new opportunities for earning.
                </p>
              </div>
              <div className="benefit">
                <h3 className="text-xl font-semibold">
                  Reach a Global Audience
                </h3>
                <p className="text-gray-500">
                  Your courses will be available to students worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="how-it-works py-16 bg-gradient-to-r from-black to-[#3d2890]">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <ol className="mt-8 space-y-4 text-left">
              <li>1. Sign Up and Create Your Profile</li>
              <li>2. Upload Your Courses and Set Pricing</li>
              <li>3. Teach and Engage with Your Students</li>
              <li>4. Earn Rewards and Get Paid</li>
            </ol>
          </div>
        </section>

        <section className="cta py-16 text-center">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold">
              Ready to Share Your Knowledge?
            </h2>
            <p className="mt-4 text-xl">
              Join Academia and start teaching today!
            </p>
            <Link
              href="/home/teaching/register"
              className="mt-8 inline-block bg-blue-600 text-white py-3 px-6 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

    </>
  );
}
