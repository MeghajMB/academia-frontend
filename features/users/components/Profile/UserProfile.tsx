"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Calendar } from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import useUserApi from "@/hooks/api/useUserApi";
import { useAppSelector } from "@/store/hooks";
import UserProfileHeader from "./UserProfileHeader";

interface IUser {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  isBlocked: boolean;
  verified: "pending" | "rejected" | "verified" | "notRequested";
  role: "instructor" | "student";
  createdAt: string;
  purpleCoin: number;
  headline?: string | undefined;
  biography?: string | undefined;
  links?:
    | {
        facebook?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
        website?: string | undefined;
      }
    | undefined;
  phoneNo?: number | undefined;
}

export default function ProfilePage() {
  const [user, setUser] = useState<IUser>();
  const { fetchUserProfileApi } = useUserApi();
  const { id } = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetchUserProfileApi(id!);
        if (response.status == "error") {
          throw new Error(response.message);
        }
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile();
  }, [id]);
  if (!user) return null;
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <UserProfileHeader
          profilePicture={user.profilePicture}
          headline={user.headline || ""}
          name={user.name}
        />

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
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6"></div>
        </div>
      </div>
    </main>
  );
}
