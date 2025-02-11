"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import useCourseApi from "@/hooks/useCourseApi";
import { useAppSelector } from "@/lib/hooks";
import PersistLogin from "@/hoc/PersistLogin";

const CoursesPage = () => {
  const { fetchCourseOfInstructor } = useCourseApi();
  const { id } = useAppSelector((state) => state.auth.user);

  return (
    <PersistLogin>
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
            title="Active Courses"
            description="Courses that have been approved."
            fetchFn={fetchCourseOfInstructor}
            instructorId={id!}
            status="accepted"
          />

          <CourseSection
            title="Pending Courses"
            description="Courses waiting for admin approval."
            fetchFn={fetchCourseOfInstructor}
            instructorId={id!}
            status="pending"
          />

          <CourseSection
            title="Incomplete Courses"
            description="Courses that are drafted."
            fetchFn={fetchCourseOfInstructor}
            instructorId={id!}
            status="notRequested"
          />

          <CourseSection
            title="Rejected Courses"
            description="Courses that have been rejected."
            fetchFn={fetchCourseOfInstructor}
            instructorId={id!}
            status="rejected"
          />
        </div>
      </div>
    </PersistLogin>
  );
};

export default CoursesPage;

const CourseSection = ({
  title,
  description,
  fetchFn,
  instructorId,
  status,
}: {
  title: string;
  description: string;
  fetchFn: (instructorId: string, status: string) => Promise<unknown>;
  instructorId: string;
  status: string;
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-gray-400">{description}</p>
      <PendingCourseList
        fetchFn={fetchFn}
        instructorId={instructorId}
        status={status}
      />
    </div>
  );
};

const PendingCourseList = ({
  fetchFn,
  instructorId,
  status,
}: {
  fetchFn: (instructorId: string, status: string) => Promise<unknown>;
  instructorId: string;
  status: string;
}) => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchFn(instructorId, status);
        setCourses(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [fetchFn, instructorId, status]);

  if (!courses || courses.length === 0) {
    return (
      <p className="mt-4 text-gray-400 italic">No courses found in this category.</p>
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
            <span className="text-sm px-3 py-1 rounded-full text-white bg-purple-600">
              {course.status}
            </span>
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
