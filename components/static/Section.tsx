"use client";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "../../features/course/components/CourseCard";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ListCourses } from "@/features/course/types/course";
import Link from "next/link";

export default function Section({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  const [courses, setCourses] = useState<ListCourses[]>([]);
  const { fetchCoursesApi } = useCourseApi();
  useEffect(() => {
    async function fetchCourses() {
      if (status == "new") {
        const response = await fetchCoursesApi({
          page: 1,
        });
        if (response.status == "error") return;

        setCourses(response.data.courses);
      }
    }
    fetchCourses();
    //Fetch the courses here
  }, [status]);

  return (
    <>
      <section className="pt-10 pb-5">
        <div className="flex gap-20 items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white cursor-auto">{label}</h2>
          <Link href={'/home/courses'} className="flex items-center text-indigo-400 hover:text-indigo-300">
            <span>View all</span>
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center ">
          {courses.map((course) => {
            return <CourseCard key={course.id} course={course} />;
          })}
        </div>
      </section>
    </>
  );
}
