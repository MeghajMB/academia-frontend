"use client";
import LoadingPage from "@/app/loading";
import AddLecture from "@/components/instructor/courses/AddLecture";
import AddSection from "@/components/instructor/courses/AddSection";
import useCourseApi from "@/hooks/api/useCourseApi";
import useFilesApi from "@/hooks/api/useFilesApi";
import { useAppSelector } from "@/lib/hooks";
import { ILecture, ISection } from "@/types/course";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Form, Input } from "@nextui-org/react";
import axios from "axios";
import { Grip } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ICourseDetails {
  status: string;
}

export default function Page() {
  const [curriculum, setCurriculum] = useState<ISection[]>([]);
  const [activeLecture, setActiveLecture] = useState<ILecture | null>(null);
  const [courseDetails, setCourseDetails] = useState<ICourseDetails>({
    status: "draft",
  });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { courseSlug } = useParams();
  //function api calls
  const { fetchCurriculum, submitCourseForReview, changeOrderOfLectureApi } =
    useCourseApi();

  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof courseSlug === "string") {
          const data = await fetchCurriculum(courseSlug, "instructor");

          setCurriculum(data);
          //setCourseDetails({ status: data.courseDetails.status });
          setIsClient(true);
        } else {
          router.push("/instructor/courses");
        }
      } catch (error) {
        //router.push("/instructor/courses");
        console.log(error);
      }
    }
    fetchData();
  }, [courseSlug]);

  if (!isClient) {
    return <LoadingPage />;
  }

  async function handleSendSubmitReviewRequest() {
    try {
      if (typeof courseSlug == "string") {
        const response = await submitCourseForReview(courseSlug);
        console.log(response);
        toast.success("Request send successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/instructor/courses");
      }
    } catch (error) {
      console.log(error);
    }
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
          console.log(over);

          setCurriculum(updatedSections);

          await changeOrderOfLectureApi(activeId,overId);
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
        {(courseDetails!.status == "draft" ||
          courseDetails!.status == "rejected") &&
          curriculum.length > 0 && (
            <Button color="success" onPress={handleSendSubmitReviewRequest}>
              Submit for review
            </Button>
          )}
        {courseDetails!.status == "rejected" && (
          <Button color="danger">Rejected Reason</Button>
        )}

        {curriculum.length > 0 && (
          <Link
            href={`${courseSlug}/preview`}
            className="bg-primary-400 rounded-lg p-2"
          >
            Preview Course
          </Link>
        )}

        <div className="p-20 max-h-screen">
          <SortableContext
            items={curriculum.map((section) => `section-${section.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {curriculum.map((section, index) => {
              return (
                <Section
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
  const { id } = useAppSelector((state) => state.auth.user);
  return (
    <div className="p-4 bg-[#1c1f26] text-white rounded-lg mt-5">
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
              courseId={courseId}
              sectionId={sectionId}
              userId={id!}
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
  userId,
  courseId,
  sectionId,
}: {
  courseId?: string;
  sectionId?: string;
  userId?: string;
  lecture: ILecture;
  isOverlay?: boolean;
  sectionIndex?: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `lecture-${lecture.id}`,
      data: { order: lecture.order, sectionIndex, sectionId },
    });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const { editlecture } = useCourseApi();
  const { generatePutSignedUrlApi } = useFilesApi();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity, 1))",
    padding: "12px",
    borderRadius: "4px",
  };

  const handleChangeLecture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    if (!title) {
      return;
    }

    try {
      let videoKey = lecture.videoUrl,
        duration = lecture.duration;
      //generate the signed url
      if (videoFile) {
        videoKey = `${userId}-${courseId}-${sectionId}-${Date.now()}`;
        duration = videoDuration!;
        const videoContentType = videoFile.type;

        const videoSignedUrl = await generatePutSignedUrlApi(
          videoKey,
          videoContentType,
          false,
          true
        );

        //store the video into s3
        await axios.put(videoSignedUrl, videoFile, {
          headers: { "Content-Type": videoContentType },
        });
      }

      const lectureData = {
        title,
        videoUrl: videoKey,
        duration,
      };

      const response = await editlecture(lecture.id, lectureData);
      console.log(response);
      // setSections((prevSections) =>
      //   prevSections.map((section) =>
      //     section.id === sectionId
      //       ? { ...section, lectures: [...section.lectures, response] }
      //       : section
      //   )
      // );

      // setIsActive(false);
    } catch (error) {
      console.error("Error adding lecture:", error);
      //setErrors("Failed to add lecture. Please try again.");
    } finally {
      //setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);

      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setVideoDuration(video.duration);
      };

      video.src = URL.createObjectURL(file);
    }
  };

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
          <Form validationBehavior="native" onSubmit={handleChangeLecture}>
            <div className="mt-4 space-y-4">
              {/* Title Input */}

              <Input
                id="title"
                label="Title"
                name="title"
                labelPlacement="outside"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter new title"
              />

              {/* Video Upload */}
              <div>
                <label
                  htmlFor="videoKey"
                  className="block text-sm text-gray-400"
                >
                  Upload New Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                />
                {lecture.status === "processing" ? (
                  <p className="text-yellow-400">Processing...</p>
                ) : (
                  <p className="text-green-400">processing complete</p>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-red-400 hover:text-red-600 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-green-400 hover:text-green-600 px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};
