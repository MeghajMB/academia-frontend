import React, { useEffect, useState } from "react";
import VideoJS from "@/components/VideoJS";
import { Spinner } from "@nextui-org/react";

export default function VideoPlayer({
  lecture,
  fetchFn,
}: {
  lecture: {
    content: string;
    sectionId: string;
    courseId: string;
    lectureId: string;
  };
  fetchFn: (
    courseId: string,
    sectionId: string,
    lectureId: string
  ) => Promise<{url:string}>;
}) {
  const playerRef = React.useRef(null);
  const [videoLink, setVideoLink] = useState<null | string>(null);
  const [isLoading,setIsLoading]=useState(true)

  useEffect(() => {
    async function fetchLectureUrl(){

      const {url} =await fetchFn(lecture.courseId,lecture.sectionId,lecture.lectureId);
      setVideoLink(url);
      setIsLoading(false)
    }
    fetchLectureUrl()
  }, []);
  if(isLoading){
    return null
  }

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL", // HLS format
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />;
}
