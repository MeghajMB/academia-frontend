import VideoPlayer from "@/components/VideoPlayer";
import useCourseApi from "@/hooks/api/useCourseApi";
import { ILecture } from "@/types/course";
import React, { useEffect, useState } from "react";

function CourseLectureView({
  activeLecture,
  courseId,
  onEnded,
}: {
  activeLecture: ILecture;
  courseId: string;
  onEnded?:()=>void,
}) {
  const { getLectureUrlApi } = useCourseApi();
  const [videoUrl, setVideoUrl] = useState("");
  useEffect(() => {
    async function fetchUrl() {
      try {
        const { url } = await getLectureUrlApi(courseId, activeLecture.id);
        setVideoUrl(url);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUrl();
  }, [activeLecture.id,courseId]);
  if(!videoUrl){
    return null
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
