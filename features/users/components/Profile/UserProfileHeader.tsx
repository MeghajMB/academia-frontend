"use client";
import Image from "next/image";
import React from "react";
import ProfileImage from "@/public/images/blankUserProfile.jpeg";
import EditProfile from "./EditProfile";

interface UserProfileHeaderProps {
  profilePicture: string | null;
  name: string;
  headline: string;
}
function UserProfileHeader({
  profilePicture,
  name,
  headline,
}: UserProfileHeaderProps) {
  return (
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
        <div className=" w-32 h-32 rounded-full border-4 border-black bg-neutral-900 overflow-hidden group">
          <Image
            src={profilePicture ? profilePicture : ProfileImage}
            alt="Profile"
            className="w-full h-full object-cover"
            width={200}
            height={200}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-neutral-400">{headline}</p>
        </div>
        <EditProfile
          profilePicture={profilePicture}
          name={name}
          headline={headline}
        />
      </div>
    </div>
  );
}

export default UserProfileHeader;
