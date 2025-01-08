'use client'
import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  instructors: string[];
  rating: number;
  reviews: number;
  originalPrice: number;
  currentPrice: number;
  isPremium: boolean;
  isBestseller: boolean;
  imageUrl: string;
}

const CourseCard: React.FC<Course> = ({ 
  title, instructors, rating, reviews, 
  originalPrice, currentPrice, isPremium, 
  isBestseller, imageUrl 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg border border-neutral-800"
  >
    <Image fill src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-lg text-white line-clamp-2">{title}</h3>
      <p className="text-sm text-neutral-400">{instructors.join(', ')}</p>
      
      <div className="flex items-center space-x-1">
        <span className="font-bold text-sm text-white">{rating}</span>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill={i < Math.floor(rating) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
        </div>
        <span className="text-sm text-neutral-400">({reviews.toLocaleString()})</span>
      </div>

      <div className="flex items-center space-x-2 text-white">
        <span className="font-bold">₹{currentPrice}</span>
        <span className="text-neutral-400 line-through text-sm">₹{originalPrice}</span>
      </div>

      <div className="flex space-x-2">
        {isPremium && (
          <span className="px-2 py-1 bg-indigo-900/30 text-indigo-400 rounded text-xs font-semibold">
            Premium
          </span>
        )}
        {isBestseller && (
          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs font-semibold">
            Bestseller
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default function CoursesSection(){
  const courses: Course[] = [
    {
      id: '1',
      title: 'Machine Learning A-Z: AI, Python & R + ChatGPT Prize',
      instructors: ['Kirill Eremenko', 'Hadelin de Ponteves'],
      rating: 4.5,
      reviews: 192756,
      originalPrice: 3999,
      currentPrice: 449,
      isPremium: true,
      isBestseller: true,
      imageUrl: '/api/placeholder/400/320'
    },
    // Add more courses here
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-black">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white cursor-auto">What to learn next</h2>
        <button className="flex items-center text-indigo-400 hover:text-indigo-300">
          <span>View all</span>
          <ChevronRight size={20} />
        </button>
      </div>
      
      <h3 className="text-xl font-semibold mb-6 text-white">Recommended for you</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
};