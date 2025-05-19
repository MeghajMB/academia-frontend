"use client";

import type { ICourse } from "@/types/course";
import InstructorCourseCard from "./InstructorCourseCard";

export default function CourseCategory({
  title,
  description,
  courses,
  handleListCourse,
}: {
  title: string;
  description: string;
  courses: ICourse[];
  handleListCourse: (courseId: string, date: string) => void;
}) {
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
          <InstructorCourseCard
            key={course.id}
            course={course}
            handleListCourse={handleListCourse}
          />
        ))}
      </div>
    </div>
  );
}
