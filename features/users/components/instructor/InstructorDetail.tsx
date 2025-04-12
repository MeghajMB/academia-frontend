"use client";

import React from "react";
import { Globe, GraduationCap, Calendar } from "lucide-react";

import TwitterSvg from "../../../../components/icons/TwitterSvg";
import FacebookSvg from "../../../../components/icons/FacebookSvg";
import LinkedinSvg from "../../../../components/icons/LinkedinSvg";
import moment from "moment";
import InstructorHeaderSection from "./InstructorHeaderSection";

interface IInstructorDetail {
  name: string;
  headline: string;
  totalStudents: number;
  reviews: number;
  links: {
    website: string;
    twitter: string;
    linkedin: string;
    facebook: string;
  };
  purpleCoin: number;
  biography: string;
  profilePicture: string;
  createdAt: string;
}

export default function InstructorDetail({
  totalStudents,
  reviews,
  user,
}: {
  totalStudents: number;
  reviews: number;
  user: IInstructorDetail;
}) {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <InstructorHeaderSection
              profilePicture={user!.profilePicture}
              name={user!.name}
              headline={user!.headline}
              biography={user!.biography}
              students={totalStudents}
              reviewRating={reviews}
              coins={reviews}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
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
                <p className="text-gray-400 mt-1">Stanford University, 2015</p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-purple-400" />
                  <span className="font-medium text-gray-200">M.S. in AI</span>
                </div>
                <p className="text-gray-400 mt-1">MIT, 2012</p>
              </div>
              <div className="flex items-center space-x-3 text-neutral-400">
                <Calendar size={20} className="text-purple-400" />
                <span>
                  {moment(user?.createdAt).format("MMM DD, YYYY HH:mm:ss")}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-semibold text-white mb-4">Connect</h2>

            <div className="space-y-4">
              <a
                href={user?.links.facebook}
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
                href={user?.links.twitter}
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
                href={user?.links.linkedin}
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
                href={user?.links.website}
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
    </>
  );
}
