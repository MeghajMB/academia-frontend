"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesCombined, Plus } from "lucide-react";
import Link from "next/link";
import useCourseApi from "@/hooks/api/useCourseApi";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import type { ICourse } from "@/types/course";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Spinner,
} from "@heroui/react";
import NoContentAvailable from "@/components/common/NoContentAvailable";
import { CourseAnalyticsDrawer } from "@/features/course/components/analytics/CourseAnalyticsDrawer";
import ScheduleCourseListModal from "@/features/course/components/SheduleCourseListModal";

const CoursesPage = () => {
  const { fetchCoursesOfInstructorWithStatus, listCourseApi } = useCourseApi();
  const { id } = useAppSelector((state) => state.auth.user);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        setIsLoading(true);
        const response = await fetchCoursesOfInstructorWithStatus(id!, "all");
        if (response.status == "error") {
          return;
        }
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllCourses();
  }, [id]);

  const handleListCourse = async (courseId: string) => {
    try {
      await listCourseApi(courseId);

      // Update the course status in the state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, status: "listed" } : course
        )
      );

      toast.success("Course listed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something happened. Try again later!");
    }
  };

  // Define course categories
  const courseCategories = [
    {
      id: "listed",
      title: "Listed Courses",
      description:
        "Courses that have been listed and are available to students.",
      courses: courses.filter((course) => course.status === "listed"),
    },
    {
      id: "accepted",
      title: "Active Courses",
      description:
        "Courses that have been approved and are ready to be listed.",
      courses: courses.filter((course) => course.status === "accepted"),
    },
    {
      id: "pending",
      title: "Pending Courses",
      description: "Courses waiting for admin approval.",
      courses: courses.filter((course) => course.status === "pending"),
    },
    {
      id: "draft",
      title: "Incomplete Courses",
      description: "Courses that are still in draft mode.",
      courses: courses.filter((course) => course.status === "draft"),
    },
    {
      id: "rejected",
      title: "Rejected Courses",
      description: "Courses that have been rejected by admins.",
      courses: courses.filter((course) => course.status === "rejected"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            My Courses
          </h1>
          <p className="mt-2 text-muted-foreground text-base md:text-lg">
            Manage your courses and track their performance
          </p>
        </div>
        <Button
          as={Link}
          href="/instructor/courses/create"
          color="primary"
          startContent={<Plus size={20} />}
          className="font-medium"
          size="lg"
        >
          Create New Course
        </Button>
      </div>
      {courses.length == 0 && (
        <NoContentAvailable
          title="Create Courses"
          content="Add courses to view them"
        />
      )}
      {/* Course Categories */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="secondary" />
        </div>
      ) : (
        <div className="space-y-12">
          {courseCategories.map((category) => (
            <CourseCategory
              key={category.id}
              title={category.title}
              description={category.description}
              courses={category.courses}
              handleListCourse={handleListCourse}
              showListButton={category.id === "accepted"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

const CourseCategory = ({
  title,
  description,
  courses,
  handleListCourse,
  showListButton = false,
}: {
  title: string;
  description: string;
  courses: ICourse[];
  handleListCourse: (courseId: string) => void;
  showListButton?: boolean;
}) => {
  if (!courses || courses.length === 0) {
    return null; // Don't show empty categories
  }

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            handleListCourse={handleListCourse}
            showListButton={showListButton}
          />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({
  course,
  handleListCourse,
  showListButton,
}: {
  course: ICourse;
  handleListCourse: (courseId: string) => void;
  showListButton: boolean;
}) => {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusColorMap: Record<
    string,
    {
      color:
        | "success"
        | "primary"
        | "warning"
        | "default"
        | "danger"
        | "secondary";
      label: string;
    }
  > = {
    listed: { color: "success", label: "Listed" },
    accepted: { color: "primary", label: "Approved" },
    pending: { color: "warning", label: "Pending" },
    draft: { color: "default", label: "Draft" },
    rejected: { color: "danger", label: "Rejected" },
  };

  const statusInfo = statusColorMap[course.status] || {
    color: "default",
    label: course.status,
  };

  return (
    <>
      <Card className="bg-content1 border-none shadow-md hover:shadow-lg transition-shadow">
        <CardBody className="p-5">
          <h3 className="text-xl font-semibold text-foreground line-clamp-1">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {course.description || "No description available"}
          </p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between items-center p-5">
          <Chip
            color={statusInfo.color}
            variant="flat"
            size="sm"
            className={`${course.status === "rejected" && "font-semibold"}`}
          >
            {statusInfo.label}
          </Chip>
          <div className="flex gap-2">
            {showListButton && (
              <Button
                color="success"
                size="sm"
                variant="flat"
                onPress={() => handleListCourse(course.id)}
                className="font-medium"
              >
                List Course
              </Button>
            )}
            <Button
              color="success"
              size="sm"
              variant="flat"
              onPress={() => setIsModalOpen(true)}
              className="font-medium"
            >
              List Course
            </Button>
            {course.status == "listed" && (
              <Button
                color="warning"
                size="sm"
                variant="flat"
                className="font-medium"
                onPress={() => setIsAnalyticsOpen(true)}
              >
                <ChartNoAxesCombined />
              </Button>
            )}
            <Button
              as={Link}
              href={`/instructor/courses/${course.id}`}
              color="secondary"
              variant="light"
              size="sm"
              className="font-medium"
            >
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* Schedule List Modal */}
      <ScheduleCourseListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onListCourse={(data) => {
          console.log(data);
          return new Promise((resolve) => resolve("something"));
        }}
      />
      {/* Analytics Drawer */}
      {isAnalyticsOpen && (
        <CourseAnalyticsDrawer
          isOpen={isAnalyticsOpen}
          onClose={() => setIsAnalyticsOpen(false)}
          courseId={course.id}
          courseTitle={course.title}
        />
      )}
    </>
  );
};
