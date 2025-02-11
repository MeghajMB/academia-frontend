"use client";
import useCourseApi from "@/hooks/useCourseApi";
import useInstructorApi from "@/hooks/useInstructorApi";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Form, Input, Spinner, Textarea } from "@nextui-org/react";
import { useParams } from "next/navigation";
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

  const { courseSlug } = useParams();
  //function api calls
  const { fetchCurriculum } = useCourseApi();
  const { createCourseLecture, reorderCurriculum } =
    useInstructorApi();

  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof courseSlug === "string") {
          const data = await fetchCurriculum(courseSlug);
          setSections(data.sections);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

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
        <Button color="success">Submit for review</Button>
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
}: {
  section: ISection;
  sectionIndex: number;
}) => {
  return (
    <div className="p-4 bg-neutral-900 text-white rounded-md">
      <h3 className="font-bold mb-3">
        Section {sectionIndex+1}: {section.title}
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#2d2d2d",
    padding: "12px",
    borderRadius: "4px",
    cursor: "grab",
  };
  const overlayStyle = isOverlay
    ? {
        backgroundColor: "rgba(50, 50, 50, 0.8)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      }
    : {};
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={`p-3 bg-gray-800 text-white rounded-md ${
          isOverlay && "opacity-90"
        }`}
        style={overlayStyle}
      >
        Lecture {lecture.id}: {lecture.title}
      </div>
    </div>
  );
};

const AddSection = ({setSections,courseId}) => {

  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState("");
  const [isLoading,setIsLoading]=useState(false)
  const { createCourseSection } =
  useInstructorApi();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true)
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as {id:string,title:string,description:string};
    try {
      const response=await createCourseSection(courseId,formData);
      console.log(response)
      setIsActive(false);
      setSections((prevSections)=> [...prevSections,response]);
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
    
  }

  return (
    <>
      <div className="p-4">
        <Button
          color="secondary"
          onPress={() => setIsActive((prevState) => !prevState)}
          className="mb-4"
        >
          {isActive ? "Close" : "+ Section"}
        </Button>

        {isActive && (
          <Form
            validationBehavior="native"
            onSubmit={handleSubmit}
            className="p-4 rounded-lg shadow-md bg-neutral-900 border border-gray-700"
          >
            <Input
              isRequired
              errorMessage={errors || ""}
              label="Section Title"
              labelPlacement="outside"
              name="title"
              placeholder="Enter the Title"
              type="text"
              variant="bordered"
              className="mb-4"
              validate={(value) => {
                if (value.trim().length <= 0) {
                  return "Enter Title";
                }
                return null;
              }}
            />

            <h2 className="font-semibold mb-2 text-lg text-gray-200">
              What will the students be able to do at the end of the section?
            </h2>
            <Textarea
              name="description"
              placeholder="Enter the learning outcome for this section"
              className="mb-4"
              isRequired
              validate={(value) => {
                if (value.trim().length <= 0) {
                  return "Please fill out this field.";
                }
                if(value.length <=10){
                  return 'Must be greater than 10 characters'
                }
                return null;
              }}
              classNames={{
                input: "bg-gray-700 text-gray-200 placeholder-gray-400",
              }}
            />

            <div className="flex justify-between gap-3">
              <Button
                onPress={() => setIsActive(false)}
                variant="ghost"
                className="mr-2 text-gray-200"
              >
                Cancel
              </Button>
              <Button type="submit" color="secondary" disabled={isLoading}>
                {isLoading ? <Spinner /> :"Add Section"}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </>
  );
};
