"use client";
import useReviewApi from "@/hooks/api/useReviewApi";
import { Accordion, AccordionItem, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import CourseReviews from "./CourseReviews";
import { Review } from "@/types/review";

function CourseTabs({
  canReview,
  courseId,
  hasReviewed,
}: {
  canReview: boolean;
  courseId: string;
  hasReviewed: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { fetchCourseReviewsApi, addReviewApi } = useReviewApi();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetchCourseReviewsApi(courseId);
      setReviews(res);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async (review: Partial<Review>) => {
    try {
      console.log(review);

      await addReviewApi(courseId, Number(review.rating), review.comment);
      //fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  function handleEditReview(review: Partial<Review>) {
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
            <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
              course-content
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
              course-content
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
              course-content
            </AccordionItem>
          </Accordion>
        </Tab>
        <Tab key="reviews" title="Reviews">
          <div className="space-y-6 p-4">
            <CourseReviews
              reviews={reviews}
              currentUserId="Current User" // In real app, get from auth
              onAddReview={handleAddReview}
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
