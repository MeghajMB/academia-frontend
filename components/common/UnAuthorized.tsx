"use client";

import { Button } from "@heroui/react";
import { ShieldAlert, Lock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className=" bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Animated Shield Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
              <ShieldAlert size={48} className="text-red-500" />
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              className="absolute -bottom-2 -right-2 bg-gray-800 text-white p-2 rounded-full"
            >
              <Lock size={20} className="text-purple-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            You don&apos;t have permission to access this page. This area is
            restricted to authorized users only.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            as="button"
            onClick={() => window.history.back()}
            color="secondary"
            variant="shadow"
            size="lg"
            startContent={<ArrowLeft size={18} />}
            className="font-medium"
          >
            Go Back
          </Button>
          <Button
            as={Link}
            href="/"
            color="secondary"
            variant="bordered"
            size="lg"
      
            className="font-medium"
          >
            Go Home
          </Button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
    </div>
  );
}
