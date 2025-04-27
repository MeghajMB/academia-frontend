"use client";
import React, { useEffect, useState } from "react";
import useMediaSoup from "@/hooks/useMediaSoup";
import JoinRoom from "@/features/session/components/JoinRoom";
import ConferenceRoom from "@/features/session/components/ConferenceRoom";
import { useParams } from "next/navigation";
import DisconnectRoom from "@/features/session/components/DisconnectRoom";
import { useAppSelector } from "@/store/hooks";
import LoadingPage from "@/components/common/LoadingPage";
import { ErrorState } from "@/components/common/ErrorState";

export default function MediasoupPage() {
  const [hasjoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
  const [hasDisconnected, sethasDisconnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { sessionSlug } = useParams();
  const [error, setError] = useState(false);
  const {
    handleJoinRoom,
    remoteStreams,
    startMedia,
    videoRef,
    screenRef,
    isAudioMuted,
    isVideoPaused,
    toggleAudio,
    toggleVideo,
    handleDisconnect,
    toggleScreenShare,
    isScreenSharing,
  } = useMediaSoup();
  const { accessToken } = useAppSelector((state) => state.auth);
  useEffect(() => {
    async function joinTheSession() {
      try {
        setIsLoading(true);
        if (!accessToken) return;
        const response = await handleJoinRoom({
          sessionId: sessionSlug as string,
          accessToken: accessToken,
        });
        console.log(response);
      } catch (error) {
        setError(true);
        console.log("cant join room");
      } finally {
        setIsLoading(false);
      }
    }
    joinTheSession();
  }, [accessToken, sessionSlug]);
  if (error) {
    return (
      <ErrorState
        fullPage
        message="You Dont have access to this Session"
        details="Try again after few minutes!"
      />
    );
  }
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <>
      {!hasjoinedRoom && (
        <JoinRoom
          startMedia={startMedia}
          setHasJoinedRoom={setHasJoinedRoom}
          userDetails={{ name: "your name" }}
        />
      )}

      {hasjoinedRoom && !hasDisconnected && (
        <ConferenceRoom
          isAudioMuted={isAudioMuted}
          isVideoPaused={isVideoPaused}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          handleDisconnect={handleDisconnect}
          toggleScreenShare={toggleScreenShare}
          isScreenSharing={isScreenSharing}
          videoRef={videoRef}
          screenRef={screenRef}
          remoteStreams={remoteStreams}
          setHasDisconnected={sethasDisconnected}
        />
      )}
      {hasDisconnected && <DisconnectRoom />}
    </>
  );
}
