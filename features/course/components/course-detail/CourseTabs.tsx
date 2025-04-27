"use client";
import { Accordion, AccordionItem, Tab, Tabs } from "@heroui/react";
import React from "react";
import CourseReviews from "./CourseReviews";
import { useAppSelector } from "@/store/hooks";
import useReviewApi from "@/hooks/api/useReviewApi";
import { toast } from "react-toastify";

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
  const { id } = useAppSelector((state) => state.auth.user);
  const { editReviewApi, deleteReviewApi } = useReviewApi();
  async function handleEditReview(review: {
    comment: string;
    id: string;
    rating: number;
  }) {
    try {
      const { id: reviewId, ...rest } = review;
      const updatedDetails = { ...rest, reviewId, courseId };
      const response=await editReviewApi(updatedDetails);
      if(response.status=="error"){
        return
      }
      toast("Successfully Edited Your Review!", {
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
    }
  }
  async function handleDeleteReview(reviewId: string) {
    try {
      await deleteReviewApi(reviewId);
      toast("Successfully deleted Your Review!", {
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
    }
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
              currentUserId={id!} // In real app, get from auth
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
