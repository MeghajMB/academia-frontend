"use client";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "./cards/CourseCard";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ICourse } from "@/types/course";


export default function Section({label,status}:{label:string;status:string}) {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const {fetchNewCoursesApi}=useCourseApi()
  useEffect(() => {
    async function fetchCourses(){
      if(status=='new'){
        const response=await fetchNewCoursesApi();
        setCourses(response)
      }
    }
    fetchCourses()
    //Fetch the courses here
  }, []);

  return (
    <>
      <section className="pt-10 pb-5">
        <div className="flex gap-20 items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white cursor-auto">
            {label}
          </h2>
          <button className="flex items-center text-indigo-400 hover:text-indigo-300">
            <span>View all</span>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4 gap-5 ">
          {courses.map((course: ICourse) => {
            return <CourseCard key={course.id} course={course} />;
          })}
        </div>
      </section>
    </>
  );
}
