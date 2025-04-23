import { Card, CardBody } from "@heroui/react";
import {
  TrendingUpIcon,
  UsersIcon,
  BookOpenIcon,
  StarIcon,
  MessageSquareIcon,
  BriefcaseIcon,
} from "lucide-react";
import { motion } from "framer-motion";

type MetricCardsProps = {
  courseMetrics: {
    totalCourses: number;
    totalStudents: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
  };
  gigMetrics: {
    totalGigs: number;
    totalGigEarnings: number;
  };
};

export const MetricCards = ({
  courseMetrics,
  gigMetrics,
}: MetricCardsProps) => {
  const metrics = [
    {
      title: "Total Earnings",
      value: `$${courseMetrics.totalEarnings.toLocaleString()}`,
      icon: <TrendingUpIcon className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Students",
      value: courseMetrics.totalStudents.toLocaleString(),
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Courses",
      value: courseMetrics.totalCourses.toString(),
      icon: <BookOpenIcon className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Average Rating",
      value: courseMetrics.averageRating.toFixed(1),
      icon: <StarIcon className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Reviews",
      value: courseMetrics.totalReviews.toLocaleString(),
      icon: <MessageSquareIcon className="h-5 w-5 text-rose-500" />,
      color: "bg-rose-50 dark:bg-rose-900/20",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Total Gigs",
      value: gigMetrics.totalGigs.toString(),
      icon: <BriefcaseIcon className="h-5 w-5 text-violet-500" />,
      color: "bg-violet-50 dark:bg-violet-900/20",
      textColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="border-none shadow-sm">
            <CardBody className="gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className={`text-2xl font-bold ${metric.textColor}`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
