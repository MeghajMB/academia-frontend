"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  speaker?: string;
  imageUrl: string;
}

const EventCard: React.FC<Event> = ({ title, description, type, speaker, imageUrl }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-neutral-900 rounded-xl overflow-hidden"
  >
    <div className="relative h-48">
      <Image 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover"
        fill
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      {speaker && (
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm">ft. {speaker}</p>
        </div>
      )}
    </div>
    <div className="p-6 space-y-4">
      <span className="px-3 py-1 bg-indigo-900/30 text-indigo-400 rounded-full text-sm">
        {type}
      </span>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

const EventsSection: React.FC = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Building a flywheel to 10X creative diversity',
      description: 'Learn how to nail down a winning process for ad creation and analysis — while expanding your reach to new customers.',
      type: 'AMA',
      speaker: 'Spencer Toomey',
      imageUrl: '/api/placeholder/400/320'
    },
    {
      id: '2',
      title: 'Applying DTC principles to B2B advertising',
      description: 'Worlds collide as the leading DTC marketer teaches B2B marketers how to capture attention and make winning ads at scale.',
      type: 'AMA',
      speaker: 'Dave Gerhardt & Nick Shackelford',
      imageUrl: '/api/placeholder/400/320'
    },
    {
      id: '3',
      title: 'How to run the perfect creative strategy meeting',
      description: 'Get more value from your weekly creative strategy meetings. Learn the ideal meeting structure, which metrics to review, and how to assign tasks.',
      type: 'AMA',
      imageUrl: '/api/placeholder/400/320'
    }
  ];

  return (
    <section className="bg-black min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-12"
        >
          On-demand events
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <EventCard {...event} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;