"use client";

import Image from "next/image";
import Link from "next/link";
import UserProfilePicture from "@/public/images/blankUserProfile.jpeg";
import { Edit } from "lucide-react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

interface IInstructorDetail {
  name: string;
  headline: string;
  totalStudents: number;
  reviews: number;
  links: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  purpleCoin: number;
  biography: string;
  profilePicture: string;
}

export default function InstructorDetail({
  totalStudents,
  reviews,
}:{totalStudents:number,reviews:number}) {
  const [user, setUser] = useState<IInstructorDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    async function getProfile() {
      try {
        const response = await axiosPrivate.get("/api/instructor/profile");
        setUser(response.data);
        console.log(response.data);
        setIsClient(true);
      } catch (error) {
        console.log(error);
      }
    }
    getProfile();
  }, []);
  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-neutral-900 rounded-lg text-white shadow-lg">
        {/* Top Section */}
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Left Section */}
          <section className="flex-1">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Instructor
            </h2>
            <h1 className="text-3xl font-bold mt-2">{user?.name}</h1>
            <h2 className="text-xl text-indigo-400 mt-2">{user?.headline}</h2>
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
                <p className="text-lg font-semibold">{user?.purpleCoin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Courses</p>
                <p className="text-lg font-semibold">{user?.purpleCoin}</p>
              </div>
            </div>
            <h2 className="text-lg font-medium mt-6">About Me</h2>
            <p className="mt-2 text-gray-300 leading-relaxed">
              {user?.biography}
            </p>
          </section>

          {/* Right Section */}
          <section className="flex flex-col items-center space-y-4">
            <Image
              width={120}
              height={120}
              className="rounded-full border-4 border-indigo-500"
              src={
                user?.profilePicture ? user?.profilePicture : UserProfilePicture
              }
              alt="Profile Picture"
            />
            <div className="flex flex-col items-center gap-2">
              {user?.links.website && (
                <Link
                  href={user.links?.website}
                  className="text-indigo-400 hover:text-indigo-300 transition text-sm"
                >
                  Visit My Website
                </Link>
              )}
              {user?.links.twitter && (
                <Link
                  href={user?.links.twitter}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Twitter
                </Link>
              )}
              {user?.links.twitter && (
                <Link
                  href={user?.links.twitter}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  LinkedIn
                </Link>
              )}
              {user?.links.facebook && (
                <Link
                  href={user?.links.facebook}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Facebook
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
