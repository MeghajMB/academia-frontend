"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import useCourseApi from "@/hooks/api/useCourseApi";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";
import type { ICourse } from "@/types/course";
import { Button, Spinner } from "@heroui/react";
import NoContentAvailable from "@/components/common/NoContentAvailable";
import CourseCategory from "@/features/course/components/instructor/CourseCategory";

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

  const handleListCourse = async (courseId: string, date: string) => {
    try {
      const response = await listCourseApi(courseId, date);
      if (response.status == "error") {
        throw new Error(response.message);
      }
      // Update the course status in the state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, status: "scheduled" } : course
        )
      );

      toast.success("Course scheduled successfully!");
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
      id: "scheduled",
      title: "Scheduled Courses",
      description: "Courses that are scheduled.",
      courses: courses.filter((course) => course.status === "scheduled"),
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
