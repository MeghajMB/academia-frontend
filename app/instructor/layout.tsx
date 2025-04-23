"use client";
import {
  Menu,
  X,
  BookOpen,
  ChevronRight,
  Wallet,
  ChartNoAxesCombined,
  Briefcase,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProtectedRoute from "@/hoc/ProtectedRoute";

const menuItems = [
  { title: "Profile", icon: UserIcon, path: "/instructor" },
  { title: "Dashboard", icon: ChartNoAxesCombined, path: "/instructor/dashboard" },
  { title: "Courses", icon: BookOpen, path: "/instructor/courses" },
  { title: "Gigs", icon: Briefcase, path: "/instructor/gigs" },
  { title: "Wallet", icon: Wallet, path: "/instructor/wallet" },
];

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ProtectedRoute role={["instructor"]}>
        <main className="pt-10">
          <button
            className="fixed top-24 left-4 z-50 p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setOpen((prevState) => !prevState)}
          >
            {open ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>

          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-gradient-to-r from-[#190f43] to-black shadow-xl z-40 rounded-r-xl z-48"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <div className="flex flex-col h-full pt-24 px-6">
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <Link href={item.path} key={item.title}>
                        <motion.div
                          className="flex items-center justify-between p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer group transition-colors"
                          whileHover={{ x: 10 }}
                          transition={{
                            type: "spring",
                            stiffness: 800,
                            damping: 20,
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <item.icon className="w-5 h-5" />
                            <span className="text-lg">{item.title}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </Link>
                    ))}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pl-5 sm:pl-20">{children}</div>
        </main>
      </ProtectedRoute>
    </>
  );
}
