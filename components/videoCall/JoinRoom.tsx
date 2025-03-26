import { Button } from "@heroui/react";
import React from "react";
function JoinRoom({
  startMedia,
  setHasJoinedRoom,
}: {
  startMedia: (
    initialVideoPaused?: boolean,
    initialMicPaused?: boolean
  ) => Promise<void>;
  setHasJoinedRoom: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleStartSession() {
    //set the initial video and audio state here
    startMedia(true, true);
    setHasJoinedRoom(true);
  }
  return (
    <>
      <h1>You are inside the room</h1>
      <div className="flex gap-4">
        <Button onClick={handleStartSession}>Start the session</Button>
      </div>
    </>
  );
}

export default JoinRoom;
