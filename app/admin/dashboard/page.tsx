"use client";

import { AdminAreaChart } from "@/features/dashboard/components/admin/AdminAreaChart";
import { AdminSummary } from "@/features/dashboard/components/admin/AdminSummary";
import { ReviewDistributionChart } from "@/features/dashboard/components/instructor/ReviewDistributionchart";
import { AdminAnalyticsSummary } from "@/features/dashboard/types/admin-analytics.types";
import useAdminApi from "@/hooks/api/useAdminApi";
import { GetAdminAnalyticsResponseDTO } from "@academia-dev/common";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const { getAdminAnalytics } = useAdminApi();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [transactionChart, setTransactionChart] = useState<
    GetAdminAnalyticsResponseDTO["data"]["transaction"]["metrics"] | null
  >(null);
  const [enrollmentChart, setEnrollmentChart] = useState<
    GetAdminAnalyticsResponseDTO["data"]["enrollment"]["metrics"] | null
  >(null);
  const [sessionChart, setSessionChart] = useState<
    GetAdminAnalyticsResponseDTO["data"]["session"]["metrics"] | null
  >(null);
  const [reviewDistribution, setReviewDistribution] = useState<
    GetAdminAnalyticsResponseDTO["data"]["review"]["distribution"] | null
  >(null);
  const [filter, setFilter] = useState<"quarter" | "month" | "year" | "custom">(
    "month"
  );
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchadminAnalytics();
  }, []);

  const fetchadminAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      if (startDate && endDate && filter == "custom") {
        const start = moment(startDate);
        const end = moment(endDate);

        if (start.isAfter(end)) {
          toast.error("Start date cannot be after end date.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        }
      }

      const response = await getAdminAnalytics({
        filter: filter,
        endDate: filter == "custom" ? endDate : undefined,
        startDate: filter == "custom" ? startDate : undefined,
      });
      if (response.status == "error") {
        throw new Error(response.message);
      }
      setSummary({
        transactionSummary: response.data.transaction.summary,
        enrollmentSummary: response.data.enrollment.summary,
        sessionSummary: response.data.session.summary,
        reviewSummary: response.data.review.summary,
      });
      setTransactionChart(response.data.transaction.metrics);
      setEnrollmentChart(response.data.enrollment.metrics);
      setSessionChart(response.data.session.metrics);
      setReviewDistribution(response.data.review.distribution);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [endDate, filter, startDate]);

  return (
    <>
      <div className="h-full w-full">
        {/* Header */}
        <div className="flex flex-col gap-2 py-8 px-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            View the overall analytics of the system
          </p>
        </div>
        {/* Selection */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchadminAnalytics();
          }}
          className="flex gap-3"
        >
          {" "}
          <Select
            className="max-w-48"
            label="Filter"
            placeholder="Select Filter"
            selectedKeys={[filter]}
            variant="bordered"
            onChange={(e) =>
              setFilter(
                e.target.value as unknown as
                  | "quarter"
                  | "month"
                  | "year"
                  | "custom"
              )
            }
          >
            {["quarter", "month", "year", "custom"].map((status) => (
              <SelectItem key={status}>{status}</SelectItem>
            ))}
          </Select>
          {filter == "custom" && (
            <>
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button color="primary">Select Date</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex gap-3">
                    <Calendar
                      showMonthAndYearPickers
                      aria-label="Date (Controlled)"
                      onChange={(value) => {
                        const utcDate = moment(value.toString(), "YYYY-MM-DD")
                          .utc()
                          .toISOString();
                        setStartDate(utcDate);
                      }}
                      topContent={
                        <>
                          <h1 className="text-3xl font-bold">Start Date</h1>
                          <p className="text-gray-500">Select the start Date</p>
                        </>
                      }
                    />
                    <Calendar
                      showMonthAndYearPickers
                      aria-label="Date (Controlled)"
                      onChange={(value) => {
                        const utcDate = moment(value.toString(), "YYYY-MM-DD")
                          .utc()
                          .toISOString();

                        setEndDate(utcDate);
                      }}
                      topContent={
                        <>
                          <h1 className="text-3xl font-bold">End Date</h1>
                          <p className="text-gray-500">Select the end Date</p>
                        </>
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
          <Button type="submit" color="secondary" isLoading={isLoading}>
            Apply
          </Button>
        </form>

        {/* Summary section */}
        <div className="p-10">
          <AdminSummary summary={summary} isLoading={isLoading} />
        </div>

        {/* Chart section */}
        <div className="flex gap-10 flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {reviewDistribution ? (
              <ReviewDistributionChart
                data={reviewDistribution}
                isLoading={isLoading}
              />
            ) : (
              <Spinner />
            )}
            <AdminAreaChart
              data={transactionChart}
              dataKey="totalRevenue"
              xAxisKey="date"
              color="#8B5CF6"
              isLoading={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <AdminAreaChart
              data={enrollmentChart}
              dataKey="enrollmentCount"
              xAxisKey="date"
              color="#10B981"
              isLoading={isLoading}
            />
            <AdminAreaChart
              data={sessionChart}
              dataKey="sessionCount"
              xAxisKey="date"
              color="#0070F3"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
