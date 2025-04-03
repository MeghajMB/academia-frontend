"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingPage from "@/app/loading";
import useCourseApi from "@/hooks/api/useCourseApi";
import { toast } from "react-toastify";
import { ICourseDetails } from "@/types/course";
import { Tab, Tabs } from "@heroui/react";
import RazorpayCourse from "@/features/payment/RazorPayCourse";
import CourseTabs from "@/features/course/courseDetail/CourseTabs";

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
    hasReviewed: false,
  });

  const [isClient, setIsClient] = useState(false);
  const { courseSlug } = useParams();
  const { fetchDetailsOfListedCourseApi } = useCourseApi();
  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        if (courseSlug && typeof courseSlug == "string") {
          const courseDetails = await fetchDetailsOfListedCourseApi(courseSlug);
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
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <CourseCard course={courseDetails!} />
          </div>
          <div className="mx-auto mt-14 max-w-[50rem] sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <CourseDetails course={courseDetails!} />
          </div>
          <div className="mx-auto mt-16 w-full max-w-[50rem] lg:col-span-4 lg:mt-0 lg:max-w-none">
            <CourseTabs
              courseId={courseSlug! as string}
              canReview={courseDetails.canReview}
              hasReviewed={courseDetails.hasReviewed}
            />
          </div>
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
          <div>
            <span className="text-gray-50">
              Created By:
            </span>
            <Link
              href={`/home/instructor/${course.instructorId}`}
              className="font-semibold text-muted-foreground underline underline-offset-2 text-purple-500"
            >
              {course.instructorName}
            </Link>
          </div>

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
