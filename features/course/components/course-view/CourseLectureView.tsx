import { ErrorState } from "@/components/common/ErrorState";
import VideoPlayer from "@/components/common/VideoPlayer";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ILecture } from "@/types/course";
import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";

function CourseLectureView({
  activeLecture,
  courseId,
  onEnded,
}: {
  activeLecture: ILecture;
  courseId: string;
  onEnded?: () => void;
}) {
  const { getLectureUrlApi } = useCourseApi();
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchUrl() {
      try {
        const response = await getLectureUrlApi(courseId, activeLecture.id);
        if (response.status == "error") {
          setError(true);
          return;
        }

        setVideoUrl(response.data.url);

      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUrl();
  }, [activeLecture.id, courseId]);
  if (isLoading) {
    return <Spinner />;
  }
  if(error){
    return <ErrorState />
  }
  return (
    <div>
      {/* Video Player */}
      <div className="w-full rounded-lg overflow-hidden mb-4">
        <VideoPlayer videoLink={videoUrl} onEnded={onEnded} />
      </div>

      <h1 className="text-3xl font-bold">{activeLecture.title}</h1>
    </div>
  );
}

export default CourseLectureView;
