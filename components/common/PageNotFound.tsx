"use client";

import { Button } from "@heroui/react";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PageNotFound() {
  return (
    <div className="h-full bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-purple-500/10 rounded-full flex items-center justify-center">
              <FileQuestion size={64} className="text-purple-400" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-2 -right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              404
            </motion.div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved to another location.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            as={Link}
            href="/"
            color="secondary"
            variant="shadow"
            size="lg"
            startContent={<Home size={18} />}
            className="font-medium"
          >
            Back to Home
          </Button>
          <Button
            as="button"
            onClick={() => window.history.back()}
            color="secondary"
            variant="bordered"
            size="lg"
            startContent={<ArrowLeft size={18} />}
            className="font-medium"
          >
            Go Back
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 p-4 bg-gray-900/50 border border-purple-500/20 rounded-xl"
        >
          <p className="text-gray-300 text-sm">
            If you believe this is an error, please contact our support team or
            try searching for what you&apos;re looking for.
          </p>

        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
    </div>
  );
}
