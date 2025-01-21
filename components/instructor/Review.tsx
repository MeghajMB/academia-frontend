'use client'
import { Star } from 'lucide-react'
import React from 'react'

export default function Review() {
  return (
    <>                  <div className="border-b border-gray-800 last:border-0 pb-6 last:pb-0">
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
  </div></>
  )
}
