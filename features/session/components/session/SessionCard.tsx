"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";

type Session = {
  gigId: string;
  sessionId: string;
  instructor: { id: string; name: string };
  title: string;
  description: string;
  sessionDate: string;
  sessionDuration: number;
  status: "scheduled" | "in-progress" | "completed" | "missed";
};

export default function SessionCard({ session }: { session: Session }) {
  const router = useRouter();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="shadow-md">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <StatusBadge status={session.status} />
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {session.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>{formatDate(session.sessionDate)}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock size={16} />
                  <span>{session.sessionDuration} min</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              {session.status === "in-progress" && (
                <Button
                  color="success"
                  className="font-medium"
                  onPress={() => router.push(`/call/${session.sessionId}`)}
                >
                  Join Now
                </Button>
              )}

              {/*               <Button
                variant="flat"
                color="secondary"
                endContent={<ExternalLink size={16} />}
                onPress={() => router.push(`/sessions/${session.sessionId}`)}
              >
                View Details
              </Button> */}
            </div>
          </div>
        </CardBody>

        <CardFooter className="pt-0 px-4 pb-4 flex">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Instructor:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {session.instructor.name}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
