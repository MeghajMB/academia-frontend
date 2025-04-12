"use client";
import useCourseApi from "@/hooks/api/useCourseApi";
import useFilesApi from "@/hooks/api/useFilesApi";
import { ILecture } from "@/types/course";
import { useSortable } from "@dnd-kit/sortable";
import { Form, Input, Button, Chip, Tooltip } from "@heroui/react";
import axios from "axios";
import {
  Grip,
  Edit2,
  X,
  Save,
  Upload,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/common/modals/DeleteconfirmationModal";

function CourseLectureCard({
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
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: `lecture-${lecture.id}`,
      data: { order: lecture.order, sectionIndex, sectionId },
    });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { editlecture, deleteLecture } = useCourseApi();
  const { generatePutSignedUrlApi } = useFilesApi();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeLecture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    if (!title) {
      setErrorMessage("Title is required");
      setIsLoading(false);
      return;
    }

    try {
      let videoKey = lecture.videoUrl,
        duration = lecture.duration;

      // Generate the signed URL if new video is uploaded
      if (videoFile) {
        videoKey = `${userId}-${courseId}-${sectionId}-${Date.now()}`;
        duration = videoDuration!;
        const videoContentType = videoFile.type;

        const videoSignedUrlResponse = await generatePutSignedUrlApi({
          contentType: videoContentType,
          isPublic: false,
          isTemp: true,
          key: videoKey,
        });
        if (videoSignedUrlResponse.status == "error") {
          setErrorMessage(videoSignedUrlResponse.message);
          return;
        }
        // Store the video into S3
        await axios.put(videoSignedUrlResponse.data.url, videoFile, {
          headers: { "Content-Type": videoContentType },
        });
      }

      const lectureData = {
        title,
        videoUrl: videoKey,
        duration,
      };

      const response = await editlecture(lecture.id, lectureData);
      if (response.status == "error") {
        setErrorMessage(response.message);
        return;
      }
      // Update successful
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating lecture:", error);
      setErrorMessage("Failed to update lecture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLecture = async () => {
    setIsLoading(true);
    try {
      await deleteLecture(lecture.id);
      setIsDeleteModalOpen(false);
      toast.success("Successfully deleted Lecture!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Call parent component's onDelete callback if provided
    } catch (error) {
      console.error("Error deleting lecture:", error);

      toast.error("Error deleting lecture:!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
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
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-xl bg-[#0f0f0f] transition-all ${
          isOverlay ? "opacity-80" : "shadow-md hover:shadow-lg"
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Drag to reorder"
            >
              <Grip size={18} />
            </button>

            {!isEditing && (
              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                {lecture.duration && (
                  <p className="text-xs text-gray-400">
                    {lecture.duration} min
                  </p>
                )}
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1">
              <Tooltip content="Edit lecture">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:bg-blue-900/30"
                >
                  <Edit2 size={16} />
                </Button>
              </Tooltip>
              <Tooltip content="Delete lecture" color="danger">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-red-400 hover:bg-red-900/30"
                >
                  <Trash2 size={16} />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Lecture Content */}
        <div className={`${isOverlay && "opacity-70"}`}>
          {/* Editing Form */}
          {isEditing && (
            <Form
              validationBehavior="native"
              onSubmit={handleChangeLecture}
              className="p-3 space-y-4"
            >
              {/* Title Input */}
              <Input
                id="title"
                label="Lecture Title"
                name="title"
                labelPlacement="outside"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title"
                variant="bordered"
                color="primary"
                isRequired
                classNames={{
                  input: "text-white",
                  label: "text-gray-300",
                }}
              />

              {/* Current Video Status */}
              <div className="p-3 rounded-lg flex gap-3">
                <div className="flex flex-col mb-2 space-y-2">
                  <span className="text-sm text-gray-300">
                    Current Video Status
                  </span>
                  <Chip
                    size="sm"
                    color={
                      lecture.status === "processing"
                        ? "warning"
                        : lecture.status === "processed"
                        ? "success"
                        : "danger"
                    }
                    startContent={
                      lecture.status === "processing" ? (
                        <Clock size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )
                    }
                  >
                    {lecture.status === "processing"
                      ? "Processing"
                      : lecture.status === "processed"
                      ? "Ready"
                      : "Archived"}
                  </Chip>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="videoUpload"
                    className="block text-sm text-gray-300"
                  >
                    Replace Video (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="videoUpload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-2 p-3 border border-dashed border-gray-600 rounded-lg bg-gray-900/50 text-gray-300 hover:bg-gray-900 transition-colors">
                      <Upload size={18} />
                      <span className="text-sm">
                        {videoFile ? videoFile.name : "Click to upload video"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Upload */}

              {/* Error message */}
              {errorMessage && (
                <p className="text-red-400 text-sm">{errorMessage}</p>
              )}

              {/* Form Actions */}
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="flat"
                    color="default"
                    startContent={<X size={16} />}
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(lecture.title);
                      setVideoFile(null);
                      setVideoDuration(null);
                      setErrorMessage("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    startContent={<Save size={16} />}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={handleDeleteLecture}
        isLoading={isLoading}
        title="Delete Lecture"
        itemName={lecture.title}
        itemType="lecture"
        customMessage="This action cannot be undone. The video will be permanently deleted."
      />
    </>
  );
}

export default CourseLectureCard;
