"use client";

import FacebookSvg from "@/components/svg/FacebookSvg";
import LinkedinSvg from "@/components/svg/LinkedinSvg";
import TwitterSvg from "@/components/svg/TwitterSvg";
import InstructorHeaderSection from "@/features/users/components/instructor/InstructorHeaderSection";
import useUserApi from "@/hooks/api/useUserApi";
import { Calendar, Globe, GraduationCap } from "lucide-react";
import moment from "moment";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { instructorSlug } = useParams();
  const { fetchUserProfileApi } = useUserApi();
  const [profile, setProfile] = useState();
  useEffect(() => {
    async function getProfile() {
      try {
        if (!instructorSlug || typeof instructorSlug !== "string") {
          return;
        }
        const profile = await fetchUserProfileApi(instructorSlug);
        setProfile(profile);
      } catch (error) {
        console.log(error);
      }
    }

    getProfile();
  }, []);

  if (!profile) {
    return null;
  }
  return (
    <>
      <div className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <InstructorHeaderSection
              profilePicture={profile!.profilePicture}
              name={profile!.name}
              headline={profile!.headline}
              biography={profile!.biography}
              students={0}
              reviewRating={0}
              coins={0}
            />
          </div>
        </div>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="">
            {/* Education */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-400" />
                    <span className="font-medium text-gray-200">
                      Ph.D. in Computer Science
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">
                    Stanford University, 2015
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-400" />
                    <span className="font-medium text-gray-200">
                      M.S. in AI
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">MIT, 2012</p>
                </div>
                <div className="flex items-center space-x-3 text-neutral-400">
                  <Calendar size={20} className="text-purple-400" />
                  <span>
                    {moment(profile?.createdAt).format("MMM DD, YYYY HH:mm:ss")}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Connect</h2>

              <div className="space-y-4">
                <a
                  href={profile?.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
                    <FacebookSvg />
                  </div>
                  <span className="font-medium">Facebook</span>
                </a>

                <a
                  href={profile?.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
                    <TwitterSvg />
                  </div>
                  <span className="font-medium">Twitter</span>
                </a>

                <a
                  href={profile?.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
                    <LinkedinSvg />
                  </div>
                  <span className="font-medium">LinkedIn</span>
                </a>

                <a
                  href={profile?.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20">
                    <Globe />
                  </div>
                  <span className="font-medium">Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
