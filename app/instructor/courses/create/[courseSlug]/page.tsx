"use client";
import AddLecture from "@/components/instructor/courses/AddLecture";
import AddSection from "@/components/instructor/courses/AddSection";
import useCourseApi from "@/hooks/useCourseApi";
import useInstructorApi from "@/hooks/useInstructorApi";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "@nextui-org/react";
import { Grip } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ILecture {
  id: string;
  title: string;
  content: string;
}

interface ISection {
  id: string;
  title: string;
  lectures: ILecture[];
}

export default function Page() {
  const [sections, setSections] = useState<ISection[]>([]);
  const [activeLecture, setActiveLecture] = useState<ILecture | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { courseSlug } = useParams();
  //function api calls
  const { fetchCurriculum,submitCourseForReview } = useCourseApi();
  const { createCourseLecture, reorderCurriculum } = useInstructorApi();


  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof courseSlug === "string") {
          const data = await fetchCurriculum(courseSlug);
          setSections(data.sections);
          setIsClient(true);
        }
      } catch (error) {
        router.push("/instructor/courses");
        console.log(error);
      }
    }
    fetchData();
  }, []);
  if (!isClient) {
    return null;
  }
  async function handleSendSubmitReviewREquest(){
    const reponse=await submitCourseForReview()
  }

  const handleDragStart = (event: any) => {
    const [type, id] = event.active.id.split("-");
    if (type === "lecture") {
      const lecture = sections
        .flatMap((section) => section.lectures)
        .find((lecture) => lecture.id === id);
      setActiveLecture(lecture || null);
    }
  };

  const handleDragEnd = (event: any) => {
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
    const activeSectionIndex = active.data.current.sectionIndex - 1;
    const overSectionIndex = over.data.current.sectionIndex - 1;

    if (activeType === "lecture" && overType === "lecture") {
      if (activeSectionIndex !== undefined && overSectionIndex !== undefined) {
        const updatedSections = [...sections];

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

        setSections(updatedSections);
      }
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
        <Button color="success" onPress={handleSendSubmitReviewREquest}>Submit for review</Button>
        <Link href={`${courseSlug}/preview`} className="bg-primary-400 rounded-lg p-2">Preview Course</Link>
        <div className="p-20 max-h-screen">
          <SortableContext
            items={sections.map((section) => `section-${section.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section, index) => {
              return (
                <Section
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                  setSections={setSections}
                  courseId={courseSlug as string}
                  sectionId={section.id}
                />
              );
            })}
          </SortableContext>
          <AddSection setSections={setSections} courseId={courseSlug} />
        </div>
        <DragOverlay>
          {activeLecture ? (
            <LectureCard
              lecture={activeLecture}
              isOverlay={true} // Special styling for the overlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

const Section = ({
  section,
  sectionIndex,
  setSections,
  courseId,
  sectionId,
}: {
  section: ISection;
  sectionIndex: number;
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  courseId: string;
  sectionId: string;
}) => {
  return (
    <div className="p-4 bg-neutral-900 text-white rounded-md">
      <h3 className="font-bold mb-3">
        Section {sectionIndex + 1}: {section.title}
      </h3>
      <SortableContext
        items={section.lectures.map((lecture) => `lecture-${lecture.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {section.lectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              sectionIndex={sectionIndex}
            />
          ))}
        </div>
        <AddLecture
          setSections={setSections}
          courseId={courseId}
          sectionId={sectionId}
        />
      </SortableContext>
    </div>
  );
};

const LectureCard = ({
  lecture,
  isOverlay = false,
  sectionIndex,
}: {
  lecture: ILecture;
  isOverlay?: boolean;
  sectionIndex?: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `lecture-${lecture.id}`, data: { sectionIndex } });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [videoKey, setVideoKey] = useState(lecture.content);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity, 1))",
    padding: "12px",
    borderRadius: "4px",
  };

  function handleChangeLecture(){
   //do the edit function here
   
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col space-y-4 p-4 rounded-md bg-gray-800"
    >
      <div className="flex">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600"
        >
          <Grip />
        </button>
        <p className="text-lg">{title}</p>
        <button
          onClick={() => setIsEditing((prevState) => !prevState)}
          className="text-blue-400 hover:text-blue-600 text-sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      {/* Lecture Content */}
      <div className={`text-white ${isOverlay && "opacity-70"}`}>
        {/* Editing Form */}
        {isEditing && (
          <div className="mt-4 space-y-4">
            {/* Title Input */}

              <Input
                id="title"
                label="Title"
                labelPlacement="outside"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter new title"
              />

            {/* Video Upload */}
            <div>
              <label htmlFor="videoKey" className="block text-sm text-gray-400">
                Upload New Video
              </label>
              <Input
                id="videoKey"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoKey(e.target.files?.[0]?.name || "")}
                className=" text-white p-2 rounded-md w-full"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-red-400 hover:text-red-600 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeLecture}
                className="text-green-400 hover:text-green-600 px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
