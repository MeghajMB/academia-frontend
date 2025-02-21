"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import useCourseApi from "@/hooks/api/useCourseApi";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import { ICourse } from "@/types/course";

const CoursesPage = () => {
  const { fetchCoursesOfInstructorWithStatus, listCourseApi } = useCourseApi();
  const { id } = useAppSelector((state) => state.auth.user);
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    async function fetchAllCourses() {
      try {
        const response = await fetchCoursesOfInstructorWithStatus(id!, "all"); // Fetch all courses
        setCourses(response);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch courses. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
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

      toast.success("Course listed successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something happened. Try again later!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">My Courses</h1>
          <p className="mt-2 text-gray-400 text-lg">
            Manage your courses and track their performance
          </p>
        </div>
        <Link
          href="/instructor/courses/create"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition-colors font-medium shadow-md"
        >
          <Plus size={22} />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Course Categories */}
      <div className="space-y-10">
        <CourseSection
          title="Listed Courses"
          description="Courses that have been listed."
          courses={courses.filter((course) => course.status === "listed")}
          handleListCourse={handleListCourse}
        />
        <CourseSection
          title="Active Courses"
          description="Courses that have been approved."
          courses={courses.filter((course) => course.status === "accepted")}
          handleListCourse={handleListCourse}
        />

        <CourseSection
          title="Pending Courses"
          description="Courses waiting for admin approval."
          courses={courses.filter((course) => course.status === "pending")}
          handleListCourse={handleListCourse}
        />

        <CourseSection
          title="Incomplete Courses"
          description="Courses that are drafted."
          courses={courses.filter((course) => course.status === "draft")}
          handleListCourse={handleListCourse}
        />

        <CourseSection
          title="Rejected Courses"
          description="Courses that have been rejected."
          courses={courses.filter((course) => course.status === "rejected")}
          handleListCourse={handleListCourse}
        />
      </div>
    </div>
  );
};

export default CoursesPage;

const CourseSection = ({
  title,
  description,
  courses,
  handleListCourse,
}: {
  title: string;
  description: string;
  courses: ICourse[];
  handleListCourse: (courseId: string) => void;
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-gray-400">{description}</p>
      <PendingCourseList
        courses={courses}
        handleListCourse={handleListCourse}
      />
    </div>
  );
};

const PendingCourseList = ({
  courses,
  handleListCourse,
}: {
  courses: ICourse[];
  handleListCourse: (courseId: string) => void;
}) => {
  if (!courses || courses.length === 0) {
    return (
      <p className="mt-4 text-gray-400 italic">
        No courses found in this category.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800 hover:border-purple-500 transition-all"
        >
          <h3 className="text-xl font-semibold text-white">{course.title}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {course.description?.slice(0, 100)}...
          </p>
          <div className="mt-4 flex justify-between items-center">
            {course.status === "accepted" ? (
              <Button
                color="success"
                className="h-7"
                onPress={() => handleListCourse(course.id)}
                aria-label="List the course"
              >
                List the Course
              </Button>
            ) : (
              <span className="text-sm px-3 py-1 rounded-full text-white bg-purple-600">
                {course.status}
              </span>
            )}
            <Link
              href={`courses/create/${course.id}`}
              className="text-purple-400 hover:underline text-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
