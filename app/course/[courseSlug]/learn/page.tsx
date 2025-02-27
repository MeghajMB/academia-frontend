"use client";
import CourseContent from "@/components/course/courseView/CourseContent";
import CourseLectureView from "@/components/course/courseView/CourseLectureView";
import LoadingPage from "@/components/LoadingPage";
import PageNotFound from "@/components/PageNotFound";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ILecture, ISection } from "@/types/course";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function LearnPage() {
  const { courseSlug } = useParams();
  const { fetchCurriculum, markLectureCompleted } = useCourseApi();
  const [sections, setSections] = useState<ISection[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeLecture, setActiveLecture] = useState<ILecture>();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getCurriculum() {
      try {
        if (courseSlug && typeof courseSlug == "string") {
          const response = await fetchCurriculum(courseSlug, "student");
          setSections(response);
          // ✅ Find the first incomplete lecture
          const firstIncompleteLecture = response
            .flatMap((section:ISection) => section.lectures)
            .find((lecture:ILecture) => lecture.progress !== "completed");

          setActiveLecture(
            firstIncompleteLecture || response[0]?.lectures[0] 
          );
          //
          setIsClient(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      }
    }
    getCurriculum();
  }, [courseSlug]);

  const handleLectureComplete = useCallback(async () => {
    try {
      if (!activeLecture) return;
      await markLectureCompleted(courseSlug as string, activeLecture.id);
    } catch (error) {
      console.log(error);
    }
  }, [activeLecture, courseSlug]);

  if (error) {
    return <PageNotFound />;
  }

  if (!isClient) {
    return <LoadingPage />;
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full min-h-screen text-white pt-24 px-7">
        {/* Left Section */}
        <div
          className={`w-full ${
            showContent ? "hidden lg:block" : ""
          } lg:w-2/3 p-4`}
        >
          {activeLecture ? (
            <CourseLectureView
              activeLecture={activeLecture}
              courseId={courseSlug as string}
              onEnded={handleLectureComplete}
            />
          ) : (
            <p>No lectures available</p>
          )}
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
