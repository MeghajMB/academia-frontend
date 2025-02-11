"use client";

import React, { useEffect, useState } from "react";
import ProfileImage from "@/public/images/blankUserProfile.jpeg";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Clock,
  Award,
  Edit,
} from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import Image from "next/image";
import useUserApi from "@/hooks/useUserApi";
import { useAppSelector } from "@/lib/hooks";

interface IUser {
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
  email: string;
  createdAt: string;
  purpleCoin: number;
  biography: string;
  profilePicture: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<IUser>();
  const { fetchUserProfileApi } = useUserApi();
  const {id} =useAppSelector(state=>state.auth.user)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchUserProfileApi(id!);
        console.log(response)
        setUser(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile();
  }, []);
  
  return (
    <main className=" pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-48 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">
            {/*             <Image
              src={ProfileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            /> */}
          </div>

          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 -mt-16 px-4">
            <div className="w-32 h-32 rounded-full border-4 border-black bg-neutral-900 overflow-hidden">
              <Image
                src={user?.profilePicture ? user.profilePicture : ProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                width={200}
                height={200}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-neutral-400">{user?.headline}</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-neutral-400">
                  <User size={20} />
                  <span>@{user?.name.toLowerCase()}</span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-400">
                  <Mail size={20} />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-neutral-400">
                  <Calendar size={20} />
                  <span>
                    {moment(user?.createdAt).format("MMM DD, YYYY HH:mm:ss")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-neutral-400">
                    Courses Completed
                  </div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">48</div>
                  <div className="text-sm text-neutral-400">Hours Learned</div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-neutral-400">Certificates</div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-neutral-400">Avg. Score</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 bg-neutral-800 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        Machine Learning Fundamentals
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-neutral-400">
                        <Clock size={16} />
                        <span>4 hours remaining</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">75%</div>
                      <div className="w-20 h-2 bg-neutral-700 rounded-full">
                        <div className="w-3/4 h-full bg-indigo-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 bg-neutral-800 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Python Programming</h3>
                      <p className="text-sm text-neutral-400">
                        Completed Jan 2024
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
