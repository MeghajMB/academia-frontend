"use client";
import React, { useEffect, useState } from "react";
import useMediaSoup from "@/hooks/useMediaSoup";
import JoinRoom from "@/features/video-call/components/JoinRoom";
import ConferenceRoom from "@/features/video-call/components/ConferenceRoom";
import { useParams } from "next/navigation";
import DisconnectRoom from "@/features/video-call/components/DisconnectRoom";
import { useAppSelector } from "@/lib/hooks";
import LoadingPage from "@/components/common/LoadingPage";

export default function MediasoupPage() {
  const [hasjoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
  const [hasDisconnected, sethasDisconnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { gigSlug } = useParams();
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
        if (!accessToken) return;
        const response = await handleJoinRoom({
          gigId:gigSlug as string,
          accessToken: accessToken,
        });
      } catch (error) {
        console.log("cant join room");
      } finally {
        setIsLoading(false);
      }
    }
    joinTheSession();
  }, [gigSlug]);
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
