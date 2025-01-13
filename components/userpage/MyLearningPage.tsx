"use client";

import React from 'react';
import { 
  PlayCircle, 
  Clock, 
  Award,
  ChevronRight,
  BookOpen,
  BarChart2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const courses = [
  {
    id: 1,
    title: "Machine Learning A-Z",
    progress: 75,
    timeLeft: "4 hours",
    lastAccessed: "2 days ago",
    thumbnail: "/api/placeholder/400/220"
  },
  {
    id: 2,
    title: "Advanced Python Programming",
    progress: 45,
    timeLeft: "8 hours",
    lastAccessed: "1 week ago",
    thumbnail: "/api/placeholder/400/220"
  }
  // Add more courses as needed
];

const completedCourses = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    completedDate: "Jan 15, 2024",
    score: 95,
    certificate: true,
    thumbnail: "/api/placeholder/400/220"
  }
  // Add more completed courses
];

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-neutral-400">Active Courses</div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">48</div>
              <div className="text-neutral-400">Hours Learned</div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-neutral-400">Certificates</div>
            </div>
          </div>
        </motion.div>

        {/* In Progress Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">In Progress</h2>
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-neutral-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-600 transition-all cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  
                  <div className="flex justify-between text-sm text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{course.timeLeft} left</span>
                    </div>
                    <div>Last accessed {course.lastAccessed}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.progress}% complete</span>
                      <span>{course.progress}/100</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full">
                      <div 
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors">
                    <PlayCircle className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completed Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Completed</h2>
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-neutral-900 rounded-xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover opacity-75" />
                  <div className="absolute top-4 right-4 bg-green-600/20 text-green-400 px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  
                  <div className="flex justify-between text-sm text-neutral-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Completed on {course.completedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Score:</span>
                      <span className="text-green-400">{course.score}%</span>
                    </div>
                  </div>

                  {course.certificate && (
                    <button className="w-full flex items-center justify-center space-x-2 border border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white py-2 rounded-lg transition-colors">
                      <Award className="w-5 h-5" />
                      <span>View Certificate</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}