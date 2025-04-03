"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

function WebRtc2() {
  const [videoStream, setvideoStream] = useState<MediaStream | undefined>(
    undefined
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  async function startCapture(displayMediaOptions) {
    let captureStream;

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      setvideoStream(captureStream);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);
  const displayMediaOptions = {
    video: {
      displaySurface: "browser",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  };
  return (
    <>
      <div>WebRtc2</div>
      <div className="flex flex-col gap-3">
        <Link href={"/webrtc-1"} className="bg-blue-500 w-48">Go to webrtc-1</Link>
        <Link href={"/call"} className="bg-yellow-500 w-48">Go to Call</Link>
      </div>
      <Button
        color="secondary"
        onPress={() => startCapture(displayMediaOptions)}
      >
        Start screen sharing
      </Button>
      <video ref={videoRef} autoPlay playsInline muted />
    </>
  );
}

export default WebRtc2;
