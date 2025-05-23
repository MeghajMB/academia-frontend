"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FolderTree,
  BookOpen,
  Star,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/features/auth/authSlice";
import useAuthApi from "@/hooks/api/useAuthApi";

export default function AdminNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { logoutApi } = useAuthApi();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const router=useRouter()

  if (user.role !== "admin") {
    return null;
  }

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Students", icon: Users, href: "/admin/students" },
    { name: "Instructors", icon: GraduationCap, href: "/admin/instructors" },
    { name: "Categories", icon: FolderTree, href: "/admin/categories" },
    { name: "Courses", icon: BookOpen, href: "/admin/courses" },
    { name: "Review Courses", icon: Star, href: "/admin/review-courses" },
    { name: "Review Instructor", icon: User, href: "/admin/review-instructor" },
  ];
  async function handleLogout() {
    setLoading(true);
    try {
      const response = await logoutApi();
      if (response.status == "error") return;
      dispatch(logout());
      router.push('/admin-login')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={` h-screen bg-black text-white transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        {!isCollapsed && <span className="text-xl font-bold">Admin Panel</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-gray-800 transition-colors
            ${isCollapsed ? "mx-auto" : "ml-auto"}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
            >
              <item.icon size={20} className="min-w-[20px]" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
              {!isCollapsed && isActive && (
                <div className="w-1.5 h-8 bg-white rounded-full ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4">
        <div className="border-t border-gray-800 pt-4">
          {!isCollapsed && (
            <div className="flex items-center px-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-800" />
              <div className="ml-3">
                <p className="text-sm font-medium">Admin Name</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
              </div>
            </div>
          )}
          <button
            className={`w-full flex items-center px-2 py-3 rounded-lg text-red-400 
              hover:bg-red-500/10 transition-colors`}
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
