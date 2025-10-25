import React from "react";
import DummyProfilePicture from "@/public/images/blankUserProfile.jpeg";
import Image from "next/image";
import MediaControls from "./MediaControls";

function ConferenceRoom({
  isAudioMuted,
  isVideoPaused,
  toggleAudio,
  toggleVideo,
  handleDisconnect,
  toggleScreenShare,
  isScreenSharing,
  screenRef,
  videoRef,
  remoteStreams,
  setHasDisconnected,
}: {
  isAudioMuted: boolean;
  isVideoPaused: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  handleDisconnect: () => void;
  toggleScreenShare: () => Promise<void>;
  isScreenSharing: boolean;
  screenRef: React.RefObject<HTMLVideoElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  setHasDisconnected: React.Dispatch<React.SetStateAction<boolean>>;
  remoteStreams: {
    [userId: string]: {
      producerId: string;
      stream: MediaStream;
      kind: "audio" | "video";
      type: "camera" | "screen" | "mic";
      userName: string;
      paused: boolean;
      profilePicture: string;
    }[];
  };
}) {
  function handleDisconnectUser() {
    handleDisconnect();
    setHasDisconnected(true);
  }
  console.log("this is the remote streams");
  console.log(remoteStreams);
  return (
    <>
      <div className="flex gap-8 flex-col relative">
        <div className="relative">
          <video
            ref={videoRef}
            id="localvideo"
            autoPlay
            playsInline
            className={`border-y-fuchsia-900 ${
              isVideoPaused ? "opacity-50 grayscale" : ""
            }`}
            muted
          />
          {isVideoPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
              Video Paused
            </div>
          )}
        </div>

        <video
          ref={screenRef}
          id="localscreen"
          autoPlay
          playsInline
          className="border-y-fuchsia-900"
          muted
        />

        <div className="grid grid-cols-5">
          {Object.entries(remoteStreams).map(([userId, streamData]) => (
            <div key={userId}>
              {streamData.map((stream) => (
                <div key={stream.producerId} className="relative">
                  <label className="text-white text-lg">
                    {stream.type} {stream.paused ? "Paused" : "Not Paused"}
                  </label>

                  {stream.type === "camera" && (
                    <>
                      <video
                        ref={(el) => {
                          if (el) el.srcObject = stream.stream;
                        }}
                        autoPlay
                        playsInline
                        className={`border-y-amber-400 ${
                          stream.paused ? "opacity-50 grayscale" : ""
                        }`}
                      />
                      {stream.paused && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
                          <Image
                            src={
                              stream.profilePicture || DummyProfilePicture.src
                            }
                            alt="Profile Picture"
                            fill
                          />
                        </div>
                      )}
                    </>
                  )}

                  {stream.type === "screen" && !stream.paused && (
                    <video
                      ref={(el) => {
                        if (el) {
                          el.srcObject = stream.stream;
                        }
                      }}
                      autoPlay
                      playsInline
                      className="border-y-amber-400"
                    />
                  )}

                  {stream.type === "mic" && (
                    <audio
                      ref={(el) => {
                        if (el) {
                          el.srcObject = stream.stream;
                        }
                      }}
                      autoPlay
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MediaControls
        isAudioMuted={isAudioMuted}
        handleDisconnectUser={handleDisconnectUser}
        isScreenSharing={isScreenSharing}
        isVideoPaused={isVideoPaused}
        toggleAudio={toggleAudio}
        toggleScreenShare={toggleScreenShare}
        toggleVideo={toggleVideo}
      />
    </>
  );
}
export default ConferenceRoom;
