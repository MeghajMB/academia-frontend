"use client";
import { Accordion, AccordionItem, Tab, Tabs } from "@heroui/react";
import React from "react";
import CourseReviews from "./CourseReviews";
import { IReview } from "@/types/review";

function CourseTabs({
  canReview,
  courseId,
  hasReviewed,
  curriculum,
}: {
  canReview: boolean;
  courseId: string;
  hasReviewed: boolean;
  curriculum: {
    title: string;
    id: string;
    order: number;
    lectures: {
      title: string;
      id: string;
      order: number;
    }[];
  }[];
}) {
  function handleEditReview(review: Partial<IReview>) {
    console.log(review);
  }
  function handleDeleteReview(reviewId: string) {
    console.log(reviewId);
  }

  return (
    <div className="my-10">
      <Tabs aria-label="Course Tabs" color="primary" variant="underlined">
        <Tab key="course-content" title="Course Content">
          <Accordion variant="splitted">
            {curriculum.map((section) => {
              return (
                <AccordionItem
                  key={section.id}
                  aria-label={section.title}
                  title={section.title}
                >
                  {section.lectures.map((lecture) => {
                    return <div key={lecture.id}>{lecture.title}</div>;
                  })}
                </AccordionItem>
              );
            })}
          </Accordion>
        </Tab>
        <Tab key="reviews" title="Reviews">
          <div className="space-y-6 p-4">
            <CourseReviews
              currentUserId="Current User" // In real app, get from auth
              onEditReview={handleEditReview}
              onDeleteReview={handleDeleteReview}
              canReview={canReview}
              hasReviewed={hasReviewed}
              courseId={courseId}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
export default CourseTabs;
