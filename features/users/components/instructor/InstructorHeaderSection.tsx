"use client";
import { Avatar, Chip } from "@heroui/react";
import { Globe, Medal, Star, Users } from "lucide-react";
import React from "react";

interface IHeaderProps {
  profilePicture: string;
  name: string;
  headline: string;
  biography: string;
  students: number;
  reviewRating: number;
  coins: number;
}

export default function InstructorHeaderSection({
  profilePicture,
  name,
  headline,
  biography,
  students,
  reviewRating,
  coins,
}: IHeaderProps) {
  return (
    <>
      {/* Profile Image */}
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full">
      {/* Profile Image */}
      <div className="relative">
        <Avatar
          src={profilePicture}
          alt="Instructor"
          className="w-48 h-48 text-large"
          radius="lg"
          isBordered
          color="secondary"
          showFallback
          size="lg"
        />
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
          <Chip
            startContent={<Users size={18} />}
            variant="bordered"
            color="secondary"
            className="bg-gray-900/50 border-purple-500/20"
          >
            {students} Students
          </Chip>
          <Chip
            startContent={<Star size={18} />}
            variant="bordered"
            color="secondary"
            className="bg-gray-900/50 border-purple-500/20"
          >
            {reviewRating} Average Rating
          </Chip>
          <Chip
            startContent={<Globe size={18} />}
            variant="bordered"
            color="secondary"
            className="bg-gray-900/50 border-purple-500/20"
          >
            {coins} Coins
          </Chip>
        </div>
      </div>
    </div>
    </>
  );
}
