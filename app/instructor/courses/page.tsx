"use client";
import React from "react";
import {
  Plus,
} from "lucide-react";

import Link from "next/link";

const CoursesPage = () => {

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Courses</h1>
            <p className="mt-2 text-gray-400">
              Manage your courses and track their performance
            </p>
          </div>
          <Link
          href='/instructor/courses/create'
           className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
           >
            <Plus size={20} />
            <span>Create New Course</span>
          </Link>
        </div>



        {/* Course Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white">Active Courses</h2>
          <p className="mt-2 text-gray-400">
            Courses which have been approved.
          </p>
        </div>
    {/* Active Courses go here */}
        <div>
          <h2 className="text-3xl font-bold text-white">Pending Courses</h2>
          <p className="mt-2 text-gray-400">Coures which are pending</p>
        </div>
    {/* Pending Courses go here */}
        <div>
          <h2 className="text-3xl font-bold text-white">Rejected Courses</h2>
          <p className="mt-2 text-gray-400">Coures which are Rejected</p>
        </div>
            {/* Rejected Courses go here */}
      </div>
    </>
  );
};

export default CoursesPage;
