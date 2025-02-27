import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { IEnrolledCourses } from "@/components/userpage/MyLearningPage";
import Image from "next/image";
import Link from "next/link";

function MyLearningCard({ course }: { course: IEnrolledCourses }) {
  return (
    <motion.div
      key={course.id}
      className="bg-neutral-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-600 transition-all"
      whileHover={{ y: -5 }}
    >
      <div className="w-full h-48 relative">
        <Image
          src={course.imageThumbnail}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="w-full h-48 object-contain"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">{course.title}</h3>

        {/*       <div className="flex justify-between text-sm text-neutral-400">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{course.timeLeft} left</span>
        </div>
        <div>Last accessed {course.lastAccessed}</div>
      </div> */}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{course.progressPercentage}% complete</span>
            <span>{course.progressPercentage}/100</span>
          </div>
          <div className="w-full h-2 bg-neutral-800 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${course.progressPercentage}%` }}
            />
          </div>
        </div>

        <Link
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
          href={`/course/${course.id}/learn`}
        >
          <PlayCircle className="w-5 h-5" />
          <span>Continue Learning</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default MyLearningCard;
