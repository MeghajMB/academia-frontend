"use client";

import Image from "next/image";
import Link from "next/link";
import UserProfilePicture from '@/public/images/blankUserProfile.jpeg'
import { Edit } from "lucide-react";

interface IInstructorDetail {
  name: string;
  headline: string;
  totalStudents: number;
  reviews: number;
  purpleCoins: number;
  biography: string;
  website?:string;
  twitter:string;
  linkedin:string;
  facebook:string;
  profilePicture:string
}

export default function InstructorDetail({
  name,
  headline,
  totalStudents,
  reviews,
  purpleCoins,
  biography,
  profilePicture,
  website,
  twitter,
  linkedin,
  facebook
}: IInstructorDetail) {
  return (
    <>
          <div className="max-w-4xl mx-auto p-8 bg-neutral-900 rounded-lg text-white shadow-lg">
      {/* Top Section */}
      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* Left Section */}
        <section className="flex-1">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Instructor</h2>
          <h1 className="text-3xl font-bold mt-2">{name}</h1>
          <h2 className="text-xl text-indigo-400 mt-2">{headline}</h2>
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-sm text-gray-400">Total Students</p>
              <p className="text-lg font-semibold">{totalStudents}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Reviews</p>
              <p className="text-lg font-semibold">{reviews}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Coins</p>
              <p className="text-lg font-semibold">{purpleCoins}</p>
            </div>
          </div>
          <h2 className="text-lg font-medium mt-6">About Me</h2>
          <p className="mt-2 text-gray-300 leading-relaxed">{biography}</p>
        </section>

        {/* Right Section */}
        <section className="flex flex-col items-center space-y-4">
          <Image
            width={120}
            height={120}
            className="rounded-full border-4 border-indigo-500"
            src={profilePicture ? profilePicture : UserProfilePicture}
            alt="Profile Picture"
          />
          <div className="flex flex-col items-center gap-2">
            {website && (
              <Link
                href={website}
                className="text-indigo-400 hover:text-indigo-300 transition text-sm"
              >
                Visit My Website
              </Link>
            )}
            <Link
              href={twitter}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Twitter
            </Link>
            <Link
              href={linkedin}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              LinkedIn
            </Link>
            <Link
              href={facebook}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Facebook
            </Link>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
