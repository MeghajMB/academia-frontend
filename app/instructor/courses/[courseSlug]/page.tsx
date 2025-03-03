"use client";
import LoadingPage from "@/app/loading";
import CourseCreation from "@/components/instructor/courses/CourseCreation";
import PageNotFound from "@/components/PageNotFound";
import useCourseApi from "@/hooks/api/useCourseApi";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ICourseDetails {
  courseId: string;
  imageThumbnail: string;
  promotionalVideo: string;
  category: string;
  title: string;
  price: number;
  subtitle: string;
  description: string;
  rejectedReason: string;
  canSubmitReview: boolean;
}

export default function Page() {
  const { courseSlug } = useParams();
  const [courseDetails, setCourseDetails] = useState<ICourseDetails>();
  const [error, setError] = useState("");
  const router=useRouter()
  const { fetchCourseCreationDetailsApi, submitCourseForReview } =
    useCourseApi();
  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof courseSlug == "string") {
          const course = (await fetchCourseCreationDetailsApi(
            courseSlug
          )) as ICourseDetails;
          setCourseDetails(course);
        }
      } catch (error) {
        console.log(error)
        setError("something Happened");
      }
    }
    fetchData();
  }, []);
  if (!courseDetails) {
    return <LoadingPage />;
  }
  if (error) {
    return <PageNotFound />;
  }

  async function handleSubmitReview() {
    try {
      await submitCourseForReview(courseSlug as string);
      toast.success("Submitted Request", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      router.push('/instructor/courses')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex gap-4">
        <Link
          href={`/instructor/courses/create/${courseSlug}`}
          className="bg-neutral-700 p-2 rounded-xl hover:opacity-80"
        >
          Go to curriculum
        </Link>
        {courseDetails.canSubmitReview && (
          <button
            className="p-2 bg-green-600 rounded-xl hover:opacity-80"
            onClick={handleSubmitReview}
          >
            Submit For Review
          </button>
        )}
        {courseDetails.rejectedReason && (
          <Button className="bg-red-500">Rejected Reason</Button>
        )}
      </div>
      <h2 className="text-3xl font-bold text-white text-center">
        Edit Course Details
      </h2>
      <div className="w-full max-w-3xl mx-auto p-4">
        <CourseCreation isEditMode={true} courseDetails={courseDetails} />
      </div>
    </>
  );
}
