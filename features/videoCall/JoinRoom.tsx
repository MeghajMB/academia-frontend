import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function JoinRoom({
  startMedia,
  setHasJoinedRoom,
  userDetails,
}: {
  startMedia: (
    initialVideoPaused?: boolean,
    initialMicPaused?: boolean
  ) => Promise<void>;
  setHasJoinedRoom: React.Dispatch<React.SetStateAction<boolean>>;
  userDetails: { name: string };
}) {
  const streamRef = useRef<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function accessMedia() {
      try {
        if (streamRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to access media:", error);
      }
    }
    accessMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);
  if (isLoading) return null;
  async function handleVideoChange() {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (isVideoEnabled) {
        videoTrack.stop(); // Stop the track to turn off camera
        setIsVideoEnabled(false);
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = newStream;
        setIsVideoEnabled(true);
      }
    } catch (error) {
      console.error("Failed to toggle video:", error);
    }
  }

  async function handleAudioChange() {
    if (!streamRef.current) return;

    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !isAudioEnabled;
      setIsAudioEnabled((prev) => !prev);
    }
  }

  function handleStartSession() {
    startMedia(!isVideoEnabled, !isAudioEnabled);
    setHasJoinedRoom(true);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border border-gray-800 shadow-xl">
        <CardHeader className="flex flex-col gap-2 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-center text-white">
            Join Video Call
          </h1>
          <p className="text-center text-gray-400">
            Preview your audio and video before joining
          </p>
          {/* <Button onClick={accessMedia}>ankd</Button> */}
        </CardHeader>
        <CardBody className="flex flex-col gap-6 py-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-950 aspect-video w-full border border-gray-800">
            <video
              ref={(el) => {
                if (el) {
                  el.srcObject = streamRef.current;
                }
              }}
              autoPlay
              muted // Muted since this is a preview
              playsInline
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl text-white">
                    {userDetails.name
                      ? userDetails.name.charAt(0).toUpperCase()
                      : "You"}
                  </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                isIconOnly
                className={`rounded-full ${
                  isAudioEnabled
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onPress={handleAudioChange}
                aria-label={
                  isAudioEnabled ? "Mute microphone" : "Unmute microphone"
                }
              >
                {isAudioEnabled ? (
                  <Mic className="h-5 w-5 text-white" />
                ) : (
                  <MicOff className="h-5 w-5 text-white" />
                )}
              </Button>
              <Button
                isIconOnly
                className={`rounded-full ${
                  isVideoEnabled
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onPress={handleVideoChange}
                aria-label={
                  isVideoEnabled ? "Turn off camera" : "Turn on camera"
                }
              >
                {isVideoEnabled ? (
                  <Video className="h-5 w-5 text-white" />
                ) : (
                  <VideoOff className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0 pb-6">
          <Button
            color="primary"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
            onClick={handleStartSession}
          >
            Join Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default JoinRoom;
