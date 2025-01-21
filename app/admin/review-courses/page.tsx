"use client";

import React from 'react';
import { 
  Medal,
  BookOpen, 
  Users,
  Star,
  Clock,
  Globe,
  MessageSquare,
  Languages,
  GraduationCap
} from 'lucide-react';

export default function InstructorDetailPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="w-48 h-48 relative">
              <div className="w-full h-full rounded-2xl overflow-hidden ring-2 ring-purple-500/20">
                <img
                  src="/api/placeholder/400/400"
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
       {/*        <div className="absolute -bottom-3 -right-3 bg-purple-600 text-white p-2 rounded-lg shadow-lg shadow-purple-500/20">
                <Medal size={24} />
              </div> */}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-white">Prof. David Chen</h1>
              <p className="mt-2 text-xl text-purple-400">Computer Science & AI Expert</p>
              <p className="mt-4 text-gray-400 max-w-2xl">
                Former Tech Lead at Google AI, with over 15 years of experience in machine learning 
                and software engineering. Passionate about making complex topics accessible to everyone.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
                  <Users size={20} className="text-purple-400" />
                  <span className="text-gray-300">50K+ Students</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
                  <Star size={20} className="text-purple-400" />
                  <span className="text-gray-300">4.9 Average Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-purple-500/20">
                  <Globe size={20} className="text-purple-400" />
                  <span className="text-gray-300">25+ Countries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expertise & Info */}
          <div className="space-y-8">
            {/* Expertise */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Areas of Expertise</h2>
              <div className="space-y-3">
                {['Machine Learning', 'Deep Learning', 'Computer Vision', 'Python Programming'].map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Languages</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">English</span>
                  <span className="text-sm text-purple-400">Native</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mandarin</span>
                  <span className="text-sm text-purple-400">Fluent</span>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-400" />
                    <span className="font-medium text-gray-200">Ph.D. in Computer Science</span>
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
              </div>
            </div>
          </div>

          {/* Right Column - Courses & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Courses */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-6">Featured Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 ring-1 ring-purple-500/20">
                      <img
                        src="/api/placeholder/400/240"
                        alt="Course thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-200 group-hover:text-purple-400 transition-colors">
                        Advanced Machine Learning: From Theory to Practice
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>20 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>2.5K students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Reviews */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-6">Student Reviews</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="border-b border-gray-800 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden ring-1 ring-purple-500/20">
                        <img
                          src="/api/placeholder/100/100"
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-200">Alex Thompson</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Star size={16} className="text-purple-400" />
                          <span>5.0</span>
                          <span>•</span>
                          <span>2 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Professor Chen has an incredible ability to break down complex concepts into 
                      understandable pieces. His teaching style is engaging and the course materials 
                      are well-structured.
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}