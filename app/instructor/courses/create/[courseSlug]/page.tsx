"use client";
import LoadingPage from "@/app/loading";
import AddSection from "@/components/instructor/courses/AddSection";
import CourseLectureCard from "@/components/instructor/courses/CourseLectureCard";
import CourseSection from "@/components/instructor/courses/CourseSection";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ILecture, ISection } from "@/types/course";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [curriculum, setCurriculum] = useState<ISection[]>([]);
  const [activeLecture, setActiveLecture] = useState<ILecture | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { courseSlug } = useParams();
  //function api calls
  const { fetchCurriculum, changeOrderOfLectureApi } = useCourseApi();

  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof courseSlug === "string") {
          const data = await fetchCurriculum(courseSlug, "instructor");

          setCurriculum(data);
          setIsClient(true);
        } else {
          router.push("/instructor/courses");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [courseSlug]);

  if (!isClient) {
    return <LoadingPage />;
  }

  const handleDragStart = (event: any) => {
    const [type, id] = event.active.id.split("-");
    if (type === "lecture") {
      const lecture = curriculum
        .flatMap((section) => section.lectures)
        .find((lecture) => lecture.id === id);
      setActiveLecture(lecture || null);
    }
  };

  const handleDragEnd = async (event: any) => {
    try {
      const { active, over } = event;

      if (!over) {
        setActiveLecture(null);
        return;
      }

      // take the id of the dragged item
      const [activeType, activeId] = active.id.split("-");
      // take the id of the area of dropped item
      const [overType, overId] = over.id.split("-");

      //section indexes of dopped and dragged
      const activeSectionIndex = active.data.current.sectionIndex;
      const overSectionIndex = over.data.current.sectionIndex;

      if (activeType === "lecture" && overType === "lecture") {
        if (
          activeSectionIndex !== undefined &&
          overSectionIndex !== undefined
        ) {
          const updatedSections = [...curriculum];

          const activeLectureIndex = updatedSections[
            activeSectionIndex
          ].lectures.findIndex((lecture) => lecture.id === activeId);

          const overLectureIndex = updatedSections[
            overSectionIndex
          ].lectures.findIndex((lecture) => lecture.id === overId);

          // Move the lecture
          const [movedLecture] = updatedSections[
            activeSectionIndex
          ].lectures.splice(activeLectureIndex, 1);

          updatedSections[overSectionIndex].lectures.splice(
            overLectureIndex,
            0,
            movedLecture
          );

          setCurriculum(updatedSections);

          await changeOrderOfLectureApi(activeId, overId);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setActiveLecture(null);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4">
          <Link
            href={`/instructor/courses/${courseSlug}`}
            className="bg-neutral-700 p-2 rounded-lg text-sm sm:text-base"
          >
            Go to Course Creation Page
          </Link>
          {curriculum.length > 0 && (
            <Link
              href={`${courseSlug}/preview`}
              className="bg-primary-400 rounded-lg p-2 text-sm sm:text-base"
            >
              Preview Course
            </Link>
          )}
        </div>

        <div className="sm:p-20 max-h-screen">
          <SortableContext
            items={curriculum.map((section) => `section-${section.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {curriculum.map((section, index) => {
              return (
                <CourseSection
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                  setSections={setCurriculum}
                  courseId={courseSlug as string}
                  sectionId={section.id}
                />
              );
            })}
          </SortableContext>
          <AddSection setSections={setCurriculum} courseId={courseSlug} />
        </div>

        <DragOverlay>
          {activeLecture ? (
            <CourseLectureCard
              lecture={activeLecture}
              isOverlay={true} // Special styling for the overlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}