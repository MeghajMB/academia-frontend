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
import { AdminAnalyticsSummary } from "../../types/admin-analytics.types";

export const AdminSummary = ({
  summary,isLoading
}: {
  summary: AdminAnalyticsSummary | null;
  isLoading:boolean
}) => {
  const metrics = [
    //transaction
    {
      title: "Total Revenue",
      value: `$${summary?.transactionSummary?.totalRevenue||0}`,
      icon: <TrendingUpIcon className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Platform Share",
      value: summary?.transactionSummary?.platformShare||0,
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Instructor Share",
      value: summary?.transactionSummary?.instructorShare||0,
      icon: <BookOpenIcon className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Transaction Count",
      value: summary?.transactionSummary?.count||0,
      icon: <BookOpenIcon className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    //enrollment
    {
      title: "Enrollment Count",
      value: summary?.enrollmentSummary?.enrollmentCount||0,
      icon: <StarIcon className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    //session
    {
      title: "Session Count",
      value: summary?.sessionSummary?.sessionCount||0,
      icon: <MessageSquareIcon className="h-5 w-5 text-rose-500" />,
      color: "bg-rose-50 dark:bg-rose-900/20",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    //review
    {
      title: "Average Review Rating",
      value: summary?.reviewSummary?.averageRating||0,
      icon: <BriefcaseIcon className="h-5 w-5 text-violet-500" />,
      color: "bg-violet-50 dark:bg-violet-900/20",
      textColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Reviews",
      value: summary?.reviewSummary?.totalReviews||0,
      icon: <BriefcaseIcon className="h-5 w-5 text-violet-500" />,
      color: "bg-violet-50 dark:bg-violet-900/20",
      textColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
