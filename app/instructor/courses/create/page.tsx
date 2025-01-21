import CourseCreation from "@/components/instructor/courses/CourseCreation";
import React from "react";

export default function page() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white text-center">
        Enter Course Details
      </h2>
      <CourseCreation />
    </>
  );
}
