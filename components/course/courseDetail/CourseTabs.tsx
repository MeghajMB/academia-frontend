"use client";
import useReviewApi from "@/hooks/api/useReviewApi";
import {
  Button,
  Card,
  CardBody,
  Form,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";

function CourseTabs({
  canReview,
  courseId,
  hasReviewed,
}: {
  canReview: boolean;
  courseId: string;
  hasReviewed: boolean;
}) {
  const [reviews, setReviews] = useState([]);
  const { fetchCourseReviewsApi, submitReviewApi } = useReviewApi();

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget)) as {
        rating: string;
        comment: string;
      };
      await submitReviewApi(courseId, Number(data.rating), data.comment);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="my-10">
      <Tabs aria-label="Course Tabs" color="primary" variant="underlined">
        <Tab key="course-content" title="Course Content">
          <div className="p-4">Course content goes here.</div>
        </Tab>
        <Tab key="reviews" title="Reviews">
          <div className="space-y-6 p-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              reviews.map((review: any) => (
                <Card key={review.id} shadow="sm">
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{review.studentId.name}</p>
                      <p className="text-yellow-500"><Star /> {review.rating}/5</p>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardBody>
                </Card>
              ))
            )}

            {canReview && !hasReviewed && (
              <Card shadow="sm" className="p-4">
                <h3 className="font-semibold">Leave a Review</h3>
                <Form
                  validationBehavior="native"
                  onSubmit={handleSubmit}
                  className="p-4 rounded-lg shadow-md bg-neutral-900 border border-gray-700"
                >
                  <Select
                    className="max-w-xs"
                    label="Select Review"
                    labelPlacement="outside"
                    isRequired
                    name="rating"
                    variant="bordered"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} textValue={`${num}`}>
                        {" "}
                        {num} stars
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    isRequired
                    label="Review"
                    placeholder="Write your Review..."
                    labelPlacement="outside"
                    name="comment"
                    variant="bordered"
                  />
                  <Button color="primary" className="mt-2 w-full" type="submit">
                    Submit Review
                  </Button>
                </Form>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
export default CourseTabs;
