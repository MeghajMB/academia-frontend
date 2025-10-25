import { Button } from "@heroui/react";
import React from "react";

function SessionControls({
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  handleDisconnect,
  isAudioMuted,
  isVideoPaused,
  isScreenSharing,
  setHasDisconnected,
}: {
  isAudioMuted: boolean;
  isVideoPaused: boolean;
  isScreenSharing: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  handleDisconnect: () => void;
  toggleScreenShare: () => Promise<void>;
  setHasDisconnected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleDisconnectUser() {
    handleDisconnect();
    setHasDisconnected(true);
  }
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
      <Button onClick={handleDisconnectUser}>Disconnect</Button>
    </>
  );
}

export default SessionControls;
