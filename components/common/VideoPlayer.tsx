import React from "react";
import VideoJS from "@/components/common/VideoJS";
import videojs from "video.js";

export default function VideoPlayer({ videoLink,onEnded }: { videoLink: string,onEnded?:()=>void }) {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    preload:'auto',
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL", // HLS format
        withCredentials: true
      },
    ],
    html5: {
      nativeAudioTracks: true,
      nativeVideoTracks: true,
      nativeTextTracks: true
    }
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });

    player.on("ended", () => {
      if(onEnded){
        onEnded()
      }
    });

  };

  return <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />;
}
