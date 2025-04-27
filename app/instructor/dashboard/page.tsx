"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

import useInstructorApi from "@/hooks/api/useInstructorApi";
import { MetricCards } from "@/features/dashboard/components/instructor/MetricsCard";
import { ReviewDistributionChart } from "@/features/dashboard/components/instructor/ReviewDistributionchart";
import { GigMetricsChart } from "@/features/dashboard/components/instructor/GigMetricsChart";
import { TimeSeriesChart } from "@/features/dashboard/components/instructor/TimeSeriesChart";

// Types for our data
type CourseMetrics = {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  reviewDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
};

type GigMetrics = {
  totalGigs: number;
  activeGigs: number;
  expiredGigs: number;
  completedGigs: number;
  missedGigs: number;
  noBidGigs: number;
  totalGigEarnings: number;
};

type TimeSeriesData = {
  courseEarnings: { date: string; earnings: number }[];
  studentGrowth: { date: string; count: number }[];
  gigEarnings: { date: string; earnings: number }[];
};

type TimeFilter = "month" | "quarter" | "year";

export default function InstructorDashboard() {
  const [summaryData, setSummaryData] = useState<{
    courseMetrics: CourseMetrics;
    gigMetrics: GigMetrics;
  } | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(
    null
  );
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [loading, setLoading] = useState(true);
  const { getInstructorAnalyticsSummary, getInstructorAnalytics } =
    useInstructorApi();

  useEffect(() => {
    // Fetch summary data
    const fetchSummaryData = async () => {
      try {
        const response = await getInstructorAnalyticsSummary();
        setSummaryData(response);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummaryData();
  }, []);

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      try {
        const response = await getInstructorAnalytics(timeFilter);
        setTimeSeriesData(response);
      } catch (error) {
        console.error("Error fetching time series data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSeriesData();
  }, [timeFilter]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Metrics Summary Cards */}
        <motion.div variants={itemVariants}>
          {summaryData && (
            <MetricCards
              courseMetrics={summaryData.courseMetrics}
              gigMetrics={summaryData.gigMetrics}
            />
          )}
        </motion.div>

        {/* Charts Row 1 - Review Distribution and Gig Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md">
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-semibold">Review Distribution</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                {summaryData ? (
                  <ReviewDistributionChart
                    data={summaryData.courseMetrics.reviewDistribution}
                  />
                ) : (
                  <Spinner />
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md">
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-semibold">
                  Gig Status Distribution
                </h3>
              </CardHeader>
              <Divider />
              <CardBody>
                {summaryData ? (
                  <GigMetricsChart data={summaryData.gigMetrics} />
                ) : (
                  <Spinner />
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Time Filter */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                endContent={<ChevronDownIcon className="h-4 w-4" />}
                className="capitalize"
              >
                {timeFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Time filter options"
              onAction={(key) => setTimeFilter(key as TimeFilter)}
              selectedKeys={[timeFilter]}
              selectionMode="single"
            >
              <DropdownItem key="month">Month</DropdownItem>
              <DropdownItem key="quarter">Quarter</DropdownItem>
              <DropdownItem key="year">Year</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </motion.div>

        {/* Charts Row 2 - Time Series Charts */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md">
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-semibold">Course Earnings</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                {timeSeriesData ? (
                  <TimeSeriesChart
                    data={timeSeriesData.courseEarnings}
                    dataKey="earnings"
                    xAxisKey="date"
                    color="#0070F3"
                    prefix="$"
                    filter={timeFilter}
                  />
                ) : (
                  <Spinner />
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md">
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-semibold">Student Growth</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                {timeSeriesData && (
                  <TimeSeriesChart
                    data={timeSeriesData.studentGrowth}
                    dataKey="count"
                    xAxisKey="date"
                    color="#10B981"
                    filter={timeFilter}
                  />
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-md">
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-semibold">Gig Earnings</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                {timeSeriesData ? (
                  <TimeSeriesChart
                    data={timeSeriesData.gigEarnings}
                    dataKey="earnings"
                    xAxisKey="date"
                    color="#8B5CF6"
                    prefix="$"
                    filter={timeFilter}
                  />
                ) : (
                  <Spinner />
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}