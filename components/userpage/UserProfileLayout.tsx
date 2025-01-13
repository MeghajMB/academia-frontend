"use client";

import React from 'react';
import Link from 'next/link';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Settings, 
  MessageCircle,
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SideNavProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: BookOpen, label: 'My Courses', href: '/profile/courses' },
  { icon: Calendar, label: 'Schedule', href: '/profile/schedule' },
  { icon: MessageCircle, label: 'Messages', href: '/profile/messages' },
  { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
  { icon: Settings, label: 'Settings', href: '/profile/settings' },
];

const ProfileLayout = ({ children }: SideNavProps) => {
  const [activeItem, setActiveItem] = React.useState('Profile');

  return (
    <div className="flex min-h-screen bg-black">
      {/* Side Navigation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed w-64 h-screen bg-neutral-900 border-r border-neutral-800"
      >
        {/* Logo Area */}
        <div className="h-24 px-6 flex items-center border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded"></div>
            <span className="text-xl font-bold text-white">Academia</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <motion.div
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors ${
                  activeItem === item.label
                    ? 'bg-indigo-600 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
                onClick={() => setActiveItem(item.label)}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  activeItem === item.label ? 'opacity-100' : ''
                }`} />
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 w-full px-4">
          <button 
            className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;