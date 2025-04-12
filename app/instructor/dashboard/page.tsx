"use client";
import useInstructorApi from "@/hooks/api/useInstructorApi";
import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
type Props = {
  metrics: {
    totalEarnings: number;
    totalStudents: number;
    totalCourses: number;
    avgRating: number;
  };
};
const DUMMY_DATA = {
  // 1. Top Summary
  topMetrics: {
    totalEarnings: 45200,
    totalStudents: 1380,
    totalCourses: 14,
    avgRating: 4.6,
  },

  // 2. Earnings Line Chart
  earningsByDate: [
    { date: "2025-03-01", earnings: 1200 },
    { date: "2025-03-05", earnings: 3000 },
    { date: "2025-03-10", earnings: 2500 },
    { date: "2025-03-15", earnings: 4000 },
    { date: "2025-03-20", earnings: 1800 },
    { date: "2025-03-25", earnings: 2200 },
  ],

  // 3. Course Stats Table
  courseStats: [
    {
      title: "Next.js for Beginners",
      enrollments: 380,
      completionRate: 40,
      rating: 4.5,
      earnings: 12800,
    },
    {
      title: "Mastering TypeScript",
      enrollments: 240,
      earnings: 9800,
      rating: 4.7,
      completionRate: 40,
    },
    {
      title: "Docker & Kubernetes Bootcamp",
      enrollments: 560,
      earnings: 19200,
      rating: 4.8,
      completionRate: 40,
    },
  ],

  // 4. Student Growth Chart
  studentsByDate: [
    { date: "2025-03-01", students: 30 },
    { date: "2025-03-05", students: 60 },
    { date: "2025-03-10", students: 90 },
    { date: "2025-03-15", students: 120 },
    { date: "2025-03-20", students: 160 },
    { date: "2025-03-25", students: 180 },
  ],

  // 5. Top Gigs
  topGigs: [
    {
      title: "1-on-1 Code Review Session",
      bids: 12,
      highestBid: 250,
      status: "Completed",
    },
    {
      title: "Live Debugging Session",
      bids: 8,
      highestBid: 180,
      status: "Ongoing",
    },
  ],

  // 6. Reviews Snapshot
  reviews: {
    total: 235,
    positive: 190,
    negative: 45,
    avgRating: 4.6,
  },

  // 7. Coin Balance
  coins: {
    gold: 320,
    purple: 1420,
  },
};
export default function InstructorDashboardPage() {
  const [data, setData] = useState(DUMMY_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState("");
  const { getInstructorDashboard } = useInstructorApi();
  useEffect(() => {
    async function fetchDashBoard() {
      try {
        const response = await getInstructorDashboard();
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDashBoard();
  }, []);
  if (isLoading) return <div className="p-4">Loading dashboard...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error loading dashboard</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
      <TopCards metrics={data.topMetrics} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EarningsChart data={data.earningsByDate} />
        <StudentGrowthChart data={data.studentsByDate} />
      </div>

      <CourseStatsTable courses={data.courseStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopGigs gigs={data.topGigs} />
        <ReviewsSnapshot reviews={data.reviews} />
      </div>

      <CoinBalance coins={data.coins} />
    </div>
  );
}

export const TopCards = ({ metrics }: Props) => {
  const cards = [
    { title: "Total Earnings", value: `${metrics.totalEarnings} GC` },
    { title: "Total Students", value: metrics.totalStudents },
    { title: "Total Courses", value: metrics.totalCourses },
    { title: "Average Rating", value: metrics.avgRating.toFixed(2) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} shadow="sm" className="p-2 rounded-2xl">
          <CardBody>
            <h2 className="text-sm text-gray-500">{card.title}</h2>
            <p className="text-xl font-semibold">{card.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

type EarningsChartProps = {
  data: { date: string; earnings: number }[];
};

export const EarningsChart = ({ data }: EarningsChartProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Earnings (Last 30 days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4ade80"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

type CourseStatsTableProps = {
  courses: {
    title: string;
    enrollments: number;
    completionRate: number;
    rating: number;
    earnings: number;
  }[];
};

export const CourseStatsTable = ({ courses }: CourseStatsTableProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Course Performance</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th>Course</th>
                <th>Enrollments</th>
                <th>Completion</th>
                <th>Rating</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td>{course.title}</td>
                  <td>{course.enrollments}</td>
                  <td>{course.completionRate}%</td>
                  <td>⭐ {course.rating.toFixed(1)}</td>
                  <td>{course.earnings} GC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

type StudentGrowthChartProps = {
  data: { date: string; students: number }[];
};

export const StudentGrowthChart = ({ data }: StudentGrowthChartProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Student Growth</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#60a5fa"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

type Gig = {
  title: string;
  bids: number;
  highestBid: number;
  status: string;
};

type TopGigsProps = {
  gigs: Gig[];
};

export const TopGigs = ({ gigs }: TopGigsProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Top Gigs</h2>
        <ul className="space-y-2">
          {gigs.map((gig, i) => (
            <li key={i} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{gig.title}</p>
                <span className="text-xs text-gray-400">
                  {gig.bids} bids · {gig.status}
                </span>
              </div>
              <span className="text-green-400 font-semibold">
                {gig.highestBid} GC
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

type ReviewsSnapshotProps = {
  reviews: {
    total: number;
    positive: number;
    negative: number;
    avgRating: number;
  };
};

export const ReviewsSnapshot = ({ reviews }: ReviewsSnapshotProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Reviews Snapshot</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            Total Reviews: <strong>{reviews.total}</strong>
          </p>
          <p>
            Avg Rating: <strong>⭐ {reviews.avgRating.toFixed(1)}</strong>
          </p>
          <p>
            👍 Positive: <strong>{reviews.positive}</strong>
          </p>
          <p>
            👎 Negative: <strong>{reviews.negative}</strong>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

type CoinBalanceProps = {
  coins: {
    gold: number;
    purple: number;
  };
};

export const CoinBalance = ({ coins }: CoinBalanceProps) => {
  return (
    <Card shadow="sm" className="rounded-2xl">
      <CardBody>
        <h2 className="text-md font-semibold mb-2">Coin Balance</h2>
        <div className="flex space-x-6 text-sm">
          <p>
            🥇 Gold Coins: <strong>{coins.gold}</strong>
          </p>
          <p>
            🟣 Purple Coins: <strong>{coins.purple}</strong>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
