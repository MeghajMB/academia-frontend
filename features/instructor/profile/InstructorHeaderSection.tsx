"use client";
import { Globe, Medal, Star, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

interface IHeaderProps{
  profilePicture:string;
  name:string;
  headline:string;
  biography:string;
  students:number;
  reviewRating:number;
  coins:number;
}

export default function InstructorHeaderSection({
  profilePicture,
  name,
  headline,
  biography,
  students,
  reviewRating,
  coins,
}:IHeaderProps) {
  return (
    <>
      {/* Profile Image */}
      <div className="w-48 h-48 relative">
        <div className="w-full h-full rounded-2xl overflow-hidden ring-2 ring-purple-500/20">
          <Image
            src={profilePicture}
            alt="Instructor"
            className="w-full h-full object-cover"
            fill
          />
        </div>
        {coins > 100 && (
          <div className="absolute -bottom-3 -right-3 bg-purple-600 text-white p-2 rounded-lg shadow-lg shadow-purple-500/20">
            <Medal size={24} />
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white">{name}</h1>
        <p className="mt-2 text-xl text-purple-400">{headline}</p>
        <p className="mt-4 text-gray-200 max-w-2xl">{biography}</p>
        <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
            <Users size={20} className="text-purple-400" />
            <span className="text-gray-300">{students} Students</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
            <Star size={20} className="text-purple-400" />
            <span className="text-gray-300">{reviewRating} Average Rating</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
            <Globe size={20} className="text-purple-400" />
            <span className="text-gray-300">{coins} Coins</span>
          </div>
        </div>
      </div>
    </>
  );
}
