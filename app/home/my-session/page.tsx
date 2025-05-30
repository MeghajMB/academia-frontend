"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown, Filter, Search } from "lucide-react";
import SessionCard from "@/features/session/components/session/SessionCard";
import useGigApi from "@/hooks/api/useGigApi";
import { debounce } from "lodash";

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "scheduled" | "in-progress" | "completed" | "missed" | "all"
  >("all");
  const [page, setPage] = useState(1);
  const [sessions, setSessions] = useState<
    {
      status: "completed" | "missed" | "scheduled" | "in-progress";
      id: string;
      sessionDate: string;
      sessionDuration: number;
      title: string;
      description: string;
      instructor: {
        id: string;
        name: string;
      };
      gigId: string;
      sessionId: string;
    }[]
  >([]);
  const { getSessionsOfUserApi } = useGigApi();

  const fetchUsersSessions = debounce(async () => {
    const response = await getSessionsOfUserApi({
      page: page,
      status: statusFilter,
      search: searchQuery,
    });
    if (response.status == "error") {
      return;
    }
    setSessions(response.data.sessionDetails);
  }, 500);
  useEffect(() => {
    fetchUsersSessions();
    return () => fetchUsersSessions.cancel();
  }, [searchQuery, statusFilter, page]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Sessions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage and track all your learning sessions
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search sessions or instructors..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              endContent={<ChevronDown size={16} />}
              startContent={<Filter size={16} />}
            >
              {statusFilter === "all"
                ? "All Statuses"
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Status filter options"
            onAction={(key) =>
              setStatusFilter(
                key as
                  | "scheduled"
                  | "in-progress"
                  | "completed"
                  | "missed"
                  | "all"
              )
            }
            selectedKeys={[statusFilter]}
            selectionMode="single"
          >
            <DropdownItem key="all">All Statuses</DropdownItem>
            <DropdownItem key="scheduled">Scheduled</DropdownItem>
            <DropdownItem key="in-progress">In Progress</DropdownItem>
            <DropdownItem key="completed">Completed</DropdownItem>
            <DropdownItem key="missed">Missed</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </motion.div>

      {/* Sessions List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <motion.div key={session.sessionId} variants={itemVariants}>
              <SessionCard session={session} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="mx-auto h-24 w-24 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Search size={48} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No sessions found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
