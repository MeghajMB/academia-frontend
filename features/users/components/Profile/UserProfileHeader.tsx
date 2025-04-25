"use client";
import { Camera, Edit } from "lucide-react";
import Image from "next/image";
import React from "react";
import ProfileImage from "@/public/images/blankUserProfile.jpeg";
import { CldUploadWidget } from "next-cloudinary";

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
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          onSuccess={(result, { widget }) => {
            if (
              result.info &&
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              console.log(result.info.secure_url);
              //sent a request to the backend to upload it to the database
              widget.close();
            }
          }}
        >
          {({ open }) => {
            return (
              <div
                className="relative w-32 h-32 rounded-full border-4 border-black bg-neutral-900 overflow-hidden group cursor-pointer"
                onClick={() => open()}
              >
                <Image
                  src={profilePicture ? profilePicture : ProfileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={200}
                  height={200}
                />

                {/* Camera icon overlay */}
                <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full transition-colors">
                  <Camera />
                </div>
              </div>
            );
          }}
        </CldUploadWidget>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-neutral-400">{headline}</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}

export default UserProfileHeader;
