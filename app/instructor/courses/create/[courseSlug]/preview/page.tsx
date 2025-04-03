"use client";
import LoadingPage from "@/app/loading";
import CourseContent from "@/features/course/courseView/CourseContent";
import CourseLectureView from "@/features/course/courseView/CourseLectureView";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ILecture, ISection } from "@/types/course";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PreviewCoursePage() {
  const { courseSlug } = useParams();
  const { fetchCurriculum } = useCourseApi();
  const [sections, setSections] = useState<ISection[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeLecture, setActiveLecture] = useState<ILecture>();

  useEffect(() => {
    async function getCurriculum() {
      try {
        if (courseSlug && typeof courseSlug == "string") {
          const response = await fetchCurriculum(courseSlug,'instructor');
          setSections(response);
          setActiveLecture( response[0].lectures[0]);
          setIsClient(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCurriculum();
  }, []);

  if (!isClient) {
    return (
      <div className="-mt-24 -ml-20"><LoadingPage /></div>
      
    );
  }
  return (
    <>
      {" "}
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-neutral-900 text-white">
        {/* Left Section */}
        <div
          className={`w-full ${
            showContent ? "hidden lg:block" : ""
          } lg:w-2/3 p-4`}
        >
          <CourseLectureView
            activeLecture={activeLecture!}
            courseId={courseSlug as string}
          />
        </div>

        {/* Right Section */}
        <div
          className={`w-full ${
            showContent ? "block" : "hidden lg:block"
          } lg:w-1/3 p-4`}
        >
          <CourseContent
            sections={sections}
            setActiveLecture={setActiveLecture}
            activeLecture={activeLecture!}
          />
        </div>

        {/* Mobile Toggle Button */}
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-2 flex lg:hidden">
          <button
            onClick={() => setShowContent(!showContent)}
            className="w-full text-center py-2 bg-blue-600 rounded-lg"
          >
            {showContent ? "Back to Overview" : "View Course Content"}
          </button>
        </div>
      </div>
    </>
  );
}

