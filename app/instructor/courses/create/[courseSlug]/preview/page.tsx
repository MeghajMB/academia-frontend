"use client";
import VideoPlayer from "@/components/VideoPlayer";
import useCourseApi from "@/hooks/useCourseApi";
import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { courseSlug } = useParams();
  const { fetchCurriculum } = useCourseApi();
  const [sections, setSections] = useState();
  const [isClient, setIsClient] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [activeLecture, setActiveLecture] = useState<{
    content: string;
    sectionId: string;
    courseId: string;
    lectureId: string;
  }>();

  useEffect(() => {
    async function getCurriculum() {
      try {
        if (courseSlug && typeof courseSlug == "string") {
          const response = await fetchCurriculum(courseSlug);
          setSections(response.sections);
          setActiveLecture({
            content: response.sections[0].lectures[0].content,
            sectionId: response.sections[0].id,
            courseId: response.courseId,
            lectureId: response.sections[0].lectures[0].id,
          });
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
      <div className="h-full w-full flex justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      {" "}
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-900 text-white">
        {/* Left Section */}
        <div
          className={`w-full ${
            showContent ? "hidden lg:block" : ""
          } lg:w-2/3 p-4`}
        >
          <CourseDetails activeLecture={activeLecture} />
        </div>

        {/* Right Section */}
        <div
          className={`w-full ${
            showContent ? "block" : "hidden lg:block"
          } lg:w-1/3 p-4`}
        >
          <CourseContent sections={sections} />
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

const CourseDetails = ({
  activeLecture,
}: {
  activeLecture: {
    content: string;
    sectionId: string;
    courseId: string;
    lectureId: string;
  };
}) => {
  const { previewLecture } = useCourseApi();
  return (
    <div>
      {/* Video Player */}
      <div className="w-full rounded-lg overflow-hidden mb-4">
        <VideoPlayer lecture={activeLecture} fetchFn={previewLecture} />
      </div>

      <h1 className="text-3xl font-bold">Course Title</h1>
      <p className="text-gray-300">Published: January 1970</p>
      <p className="text-gray-400">Language: English</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-400">Lorem ipsum dolor sit amet...</p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <p className="text-gray-400">Your personal notes...</p>
      </div>
    </div>
  );
};

const CourseContent = ({ sections }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Course Content</h2>

      <Accordion variant="shadow" selectionMode="multiple">
        {sections.map((section, index) => (
          <AccordionItem key={index} title={section.title}>
            <ul className="list-disc pl-5 text-gray-400">
              {section.lectures.map((lecture, i) => (
                <li key={i} className="py-1">
                  {lecture.title}
                </li>
              ))}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
