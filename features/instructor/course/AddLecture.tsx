import useCourseApi from "@/hooks/api/useCourseApi";
import useFilesApi from "@/hooks/api/useFilesApi";
import { useAppSelector } from "@/lib/hooks";
import { Button, Form, Input, Spinner } from "@heroui/react";
import axios from "axios";
import { useState } from "react";

interface AddLectureProps {
  setSections: React.Dispatch<React.SetStateAction<ISection[]>>;
  courseId: string;
  sectionId: string;
}

export default function AddLecture({
  setSections,
  courseId,
  sectionId,
}: AddLectureProps) {
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const { addLecture } = useCourseApi();
  const { generatePutSignedUrlApi } = useFilesApi();
  const { id } = useAppSelector((state) => state.auth.user);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    if (!title || !videoFile || !videoDuration) {
      setErrors("Title and video file are required.");
      setIsLoading(false);
      return;
    }

    try {
      //generate the signed url
      const videoKey = `${id}-${courseId}-${sectionId}-${Date.now()}`;
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

      const lectureData = {
        title,
        videoUrl: videoKey,
        duration: videoDuration,
      };

      const response = await addLecture(courseId, sectionId, lectureData);

      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? { ...section, lectures: [...section.lectures, response] }
            : section
        )
      );

      setIsActive(false);
    } catch (error) {
      console.error("Error adding lecture:", error);
      setErrors("Failed to add lecture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        color="secondary"
        onPress={() => setIsActive((prevState) => !prevState)}
        className="mb-4"
      >
        {isActive ? "Close" : "+ Lecture"}
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
            label="Lecture Title"
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
            />
          </div>

          <div className="flex justify-between gap-3">
            <Button
              onPress={() => setIsActive(false)}
              variant="ghost"
              className="mr-2 text-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" color="secondary" disabled={isLoading}>
              {isLoading ? <Spinner /> : "Add Lecture"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
