"use client";

import React, { useEffect, useState } from "react";
import ProfileImage from "@/public/images/blankUserProfile.jpeg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingPage from "@/app/loading";
import useCourseApi from "@/hooks/api/useCourseApi";
import { toast } from "react-toastify";
import { ICourseDetails } from "@/types/course";
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
import RazorpayCourse from "@/components/Payment/RazorPayCourse";
import useReviewApi from "@/hooks/api/useReviewApi";

export default function Page() {
  const [courseDetails, setCourseDetails] = useState<ICourseDetails>({
    courseId: "",
    instructorId: "",
    instructorName: "",
    totalDuration: 0,
    totalLectures: 0,
    imageThumbnail: "",
    promotionalVideo: "",
    category: "",
    title: "",
    price: 0,
    subtitle: "",
    description: "",
    enrollmentStatus: "not enrolled",
    canReview: false,
    hasReviewed:false,
  });

  const [isClient, setIsClient] = useState(false);
  const { courseSlug } = useParams();
  const { fetchDetailsOfListedCourseApi } = useCourseApi();
  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        if (courseSlug && typeof courseSlug == "string") {
          const courseDetails = await fetchDetailsOfListedCourseApi(courseSlug);
          console.log(courseDetails);
          setCourseDetails(courseDetails);
          setIsClient(true);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something happened", {
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
    fetchCourseDetails();
  }, [courseSlug]);
  if (!isClient) {
    return <LoadingPage />;
  }
  return (
    <>
      <main className="pt-24 px-7">
        <div className="grid md:grid-cols-2 gap-x-5 gap-y-10 md:gap-y-3">
          <CourseCard course={courseDetails!} />
          <CourseDetails course={courseDetails!} />
          <CourseTabs
            courseId={courseSlug! as string}
            canReview={courseDetails.canReview}
            hasReviewed={courseDetails.hasReviewed}
          />
        </div>
      </main>
    </>
  );
}

const CourseCard = ({ course }: { course: ICourseDetails }) => {
  return (
    <div>
      <Tabs aria-label="Options" color="secondary">
        <Tab key="Image" title="Image">
          <div className="w-full max-w-lg mx-auto relative h-64">
            {" "}
            {/* Ensure relative & height */}
            <Image
              src={course.imageThumbnail || "/fallback-image.jpg"} // Fallback image
              alt="Course banner"
              className="rounded-lg"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw" // Optimize image loading
            />
          </div>
        </Tab>
        <Tab key="Video" title="Video">
          <div className="">
            <video controls className="w-full rounded-lg">
              <source src={course.promotionalVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const CourseDetails = ({ course }: { course: ICourseDetails }) => {
  return (
    <>
      <div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">{course.title}</h2>
          <p className="mt-4 text-gray-300">{course.subtitle}</p>
          <Link
            href={`/home/instructor/${course.instructorId}`}
            className="text-gray-400"
          >
            Created By:{" "}
            <span className="text-blue-500">{course.instructorName}</span>
          </Link>
          <p>Last updated :19/10/2024</p>
          <p className="mt-4 text-3xl font-bold">₹{course.price}</p>
          <div className="mt-4 flex gap-4">
            {course.enrollmentStatus == "not enrolled" && (
              <RazorpayCourse courseId={course.courseId} type="course" />
            )}
            {course.enrollmentStatus == "enrolled" && (
              <Link
                href={`/course/${course.courseId}/learn`}
                className="w-full text-center flex items-center justify-center bg-purple-500 h-10 rounded-md"
              >
                Go to course
              </Link>
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <h2 className="text-2xl font-bold">What You&apos;ll Learn</h2>
          <p>{course.description}</p>
        </div>
      </div>
    </>
  );
};

const CourseTabs = ({
  canReview,
  courseId,
  hasReviewed
}: {
  canReview: boolean;
  courseId: string;
  hasReviewed:string;
}) => {
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
      const data = Object.fromEntries(new FormData(e.currentTarget)) as {rating:string,comment:string};
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
                      <p className="text-yellow-500">⭐ {review.rating}/5</p>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardBody>
                </Card>
              ))
            )}

            {(canReview && !hasReviewed) && (
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
                      <SelectItem key={num} textValue={`${num}`}> {num} stars</SelectItem>
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
};
