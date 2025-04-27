"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Tabs,
  Tab,
  Spinner,
  Card,
  CardBody,
} from "@heroui/react";
import {
  XIcon,
  TrendingUpIcon,
  UsersIcon,
  StarIcon,
  ClockIcon,
} from "lucide-react";
import { RevenueChart } from "./charts/RevenueChart";
import { EnrollmentChart } from "./charts/EnrollmentChart";
import { RatingDistribution } from "./charts/RatinDistribution";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ErrorState } from "@/components/common/ErrorState";

interface CourseAnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}
interface AnalyticsData {
  courseMetrics: {
    enrollments: {
      date: string;
      averageProgress: number;
      count: number;
    }[];
    transactions: {
      date: string;
      totalAmount: number;
    }[];
  };
  courseMetricsSummary: {
    averageProgress: number;
    totalRevenue: number;
    totalStudents: number;
    averageRating: number;
    reviewCount: number;
    reviewDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

export const CourseAnalyticsDrawer = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: CourseAnalyticsDrawerProps) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [timeRange, setTimeRange] = useState<"quarter" | "month" | "year">(
    "month"
  );
  const [error, setError] = useState(false);
  const { fetchCourseAnalyticsApi } = useCourseApi();
  // Fetch analytics data when drawer opens
  useEffect(() => {
    if (isOpen) {
      console.log("open");
      fetchAnalyticsData();
    }
  }, [isOpen, courseId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetchCourseAnalyticsApi(timeRange, courseId);
      if (response.status == "error") {
        console.error("Error fetching analytics data:", response.message);
        setError(true);
        return;
      }
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      backdrop="blur"
      placement="right"
      size="lg"
      classNames={{
        base: "bg-black",
        header: "border-b border-divider",
        footer: "border-t border-divider",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Course Analytics</h3>
            <p className="text-sm text-default-500 mt-1">{courseTitle}</p>
          </div>
          <Button isIconOnly variant="light" onPress={onClose}>
            <XIcon size={20} />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-0">
          {error ? (
            <ErrorState />
          ) : loading || !analyticsData ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spinner size="lg" color="secondary" />
              <p className="text-default-500 mt-4">Loading analytics data...</p>
            </div>
          ) : (
            <div className="px-4">
              {/* Summary Cards */}
              <AnimatePresence>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      title: "Total Revenue",
                      value: formatCurrency(
                        analyticsData.courseMetricsSummary.totalRevenue
                      ),
                      icon: (
                        <TrendingUpIcon
                          className="text-emerald-500"
                          size={18}
                        />
                      ),
                      color: "bg-emerald-50 dark:bg-emerald-900/20",
                    },
                    {
                      title: "Total Students",
                      value: analyticsData.courseMetricsSummary.totalStudents,
                      icon: <UsersIcon className="text-blue-500" size={18} />,
                      color: "bg-blue-50 dark:bg-blue-900/20",
                    },
                    {
                      title: "Average Rating",
                      value: analyticsData.courseMetricsSummary.averageRating,
                      icon: <StarIcon className="text-amber-500" size={18} />,
                      color: "bg-amber-50 dark:bg-amber-900/20",
                    },
                    {
                      title: "Completion Rate",
                      value: `${analyticsData.courseMetricsSummary.averageProgress}%`,
                      icon: <ClockIcon className="text-violet-500" size={18} />,
                      color: "bg-violet-50 dark:bg-violet-900/20",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card shadow="sm" className="border border-divider">
                        <CardBody className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-default-500">
                                {item.title}
                              </p>
                              <p className="text-lg font-semibold">
                                {item.value}
                              </p>
                            </div>
                            <div className={`p-2 rounded-lg ${item.color}`}>
                              {item.icon}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Time Range Selector */}
              <div className="flex justify-end mb-4">
                <div className="flex gap-1 bg-default-100 rounded-lg p-1">
                  {["quarter", "month", "year"].map((range) => (
                    <Button
                      key={range}
                      size="sm"
                      variant={timeRange === range ? "flat" : "light"}
                      color={timeRange === range ? "secondary" : "default"}
                      onPress={() =>
                        setTimeRange(range as "quarter" | "month" | "year")
                      }
                      className="capitalize"
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                color="secondary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-secondary",
                  tab: "max-w-fit px-0 h-12",
                }}
              >
                <Tab key="revenue" title="Revenue">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <RevenueChart
                      data={analyticsData.courseMetrics.transactions}
                    />
                  </motion.div>
                </Tab>
                <Tab key="students" title="Enrollments">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <EnrollmentChart
                      data={analyticsData.courseMetrics.enrollments}
                    />
                  </motion.div>
                </Tab>
                <Tab key="ratings" title="Ratings">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4"
                  >
                    <RatingDistribution
                      data={{
                        average:
                          analyticsData.courseMetricsSummary.averageRating,
                        total: analyticsData.courseMetricsSummary.reviewCount,
                        distribution:
                          analyticsData.courseMetricsSummary.reviewDistribution,
                      }}
                    />
                  </motion.div>
                </Tab>
              </Tabs>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button color="secondary" variant="light" onPress={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
