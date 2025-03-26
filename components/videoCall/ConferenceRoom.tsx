import { Button } from "@heroui/react";
import React from "react";

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
  remoteStreams: {
    [userId: string]: {
      producerId: string;
      stream: MediaStream;
      kind: "audio" | "video";
      type: "camera" | "screen" | "mic";
      userName: string;
      paused: boolean;
    }[];
  };
}) {
  return (
    <>
      <Button onClick={toggleAudio}>
        {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
      </Button>
      <Button onClick={toggleVideo}>
        {isVideoPaused ? "Unpause Video" : "Pause Video"}
      </Button>
      <Button onClick={toggleScreenShare}>
        {isScreenSharing ? "Stop screen share" : "Start screen share"}
      </Button>
      <Button onClick={handleDisconnect}>Disconnect</Button>
      <div className="flex gap-8 flex-col">
        <video
          ref={videoRef}
          id="localvideo"
          autoPlay
          playsInline
          className="border-y-fuchsia-900"
        />
        <video
          ref={screenRef}
          id="localscreen"
          autoPlay
          playsInline
          className="border-y-fuchsia-900"
        />
        <div className="grid grid-cols-5">
          {Object.entries(remoteStreams).map(([userId, streamData]) => {
            return (
              <div key={userId}>
                {streamData.map((stream) => {
                  console.log("The stram is currently:")
                  return (
                    <div key={stream.producerId}>
                      {stream.type == "camera" || stream.type == "screen" ? (
                        <>
                          <label className="text-white text-lg">
                            {stream.type}
                            {stream.paused ? "Paused" : "Not Paused"}
                          </label>

                          {!stream.paused && (
                            <video
                              ref={(el) => {
                                if (el) {
                                  el.srcObject = stream.stream;
                                  el.play().catch((e) =>
                                    console.error("Play error:", e)
                                  );
                                }
                              }}
                              autoPlay
                              playsInline
                              className="border-y-amber-400"
                            />
                          )}
                          {stream.paused && (
                            <div className="bg-yellow-500 w-16 h-16">
                              Stream paused
                            </div>
                          )}
                        </>
                      ) : (
                        <audio
                          ref={(el) => {
                            if (el) {
                              el.srcObject = stream.stream;
                              el.play().catch((e) =>
                                console.error("Play error:", e)
                              );
                            }
                          }}
                          autoPlay
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ConferenceRoom;
