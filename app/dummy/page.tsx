'use client'
import { useRef, useState } from "react";

const MeetStyleCameraFix = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
  
      if (isVideoEnabled) {
        videoTrack.stop(); // Turns OFF the camera (light should turn off)
        videoTrack.enabled = false;
      } else {
        navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
          const newTrack = newStream.getVideoTracks()[0];
          const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(newTrack); // Replaces track, avoiding camera permission popup
          }
          setStream(newStream);
        });
      }
  
      setIsVideoEnabled(!isVideoEnabled);
    }
  };


  return (
    <div>
      <video ref={videoRef} autoPlay width="500"></video>
      <button onClick={startCamera}>Start Camera</button>
      {stream && (
        <button onClick={toggleVideo}>
          {isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      )}
    </div>
  );
};

export default MeetStyleCameraFix;
