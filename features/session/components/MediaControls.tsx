import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorX,
  PhoneOff,
} from "lucide-react";
import { Button } from "@heroui/react";

interface MediaControlsProps {
  isAudioMuted: boolean;
  isVideoPaused: boolean;
  isScreenSharing: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  handleDisconnectUser: () => void;
}

export default function MediaControls({
  isAudioMuted,
  isVideoPaused,
  isScreenSharing,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  handleDisconnectUser,
}: MediaControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {/* 🎤 Audio Toggle */}
      <Button
        onClick={toggleAudio}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all 
          ${
            isAudioMuted
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
      >
        {isAudioMuted ? <MicOff size={18} /> : <Mic size={18} />}
        {isAudioMuted ? "Unmute" : "Mute"}
      </Button>

      {/* 🎥 Video Toggle */}
      <Button
        onClick={toggleVideo}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all 
          ${
            isVideoPaused
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
      >
        {isVideoPaused ? <VideoOff size={18} /> : <Video size={18} />}
        {isVideoPaused ? "Start Video" : "Stop Video"}
      </Button>

      {/* 🖥️ Screen Share */}
      <Button
        onClick={toggleScreenShare}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all 
          ${
            isScreenSharing
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
      >
        {isScreenSharing ? <MonitorX size={18} /> : <MonitorUp size={18} />}
        {isScreenSharing ? "Stop Share" : "Share Screen"}
      </Button>

      {/* 📞 Disconnect */}
      <Button
        onClick={handleDisconnectUser}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-800 text-white transition-all"
      >
        <PhoneOff size={18} />
        Disconnect
      </Button>
    </div>
  );
}
