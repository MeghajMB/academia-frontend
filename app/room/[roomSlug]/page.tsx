"use client";
import { Button } from "@heroui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import peer from "@/services/peer/perrService";

function WebRtcPage() {
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = getSocket();

  useEffect(() => {
    if (videoRef.current && myStream) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);
  
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  }, [socket]);

  const handleUserJoined = useCallback(
    ({ email, id }: { email: string; id: string }) => {
      console.log(`${email} joined room ${id}`);
      setRemoteSocketId(id);
    },
    []
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        if (peer.peer) {
          console.log("Adding track to peer:", track.kind);
          peer.peer.addTrack(track, myStream);
        }
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if (peer.peer) {
      peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
      return () => {
        if (peer.peer) {
          peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        }
      };
    }
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );
  
  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  // This is the key fix - properly set up the track event handler
  useEffect(() => {
    // Define the track handler function
    const handleTrack = (ev: RTCTrackEvent) => {
      console.log("GOT TRACKS!!", ev.streams);
      if (ev.streams && ev.streams[0]) {
        console.log("Setting remote stream");
        setRemoteStream(ev.streams[0]);
      }
    };

    // Add the event listener if peer exists
    if (peer.peer) {
      peer.peer.addEventListener("track", handleTrack);
      
      // Clean up function
      return () => {
        if (peer.peer) {
          peer.peer.removeEventListener("track", handleTrack);
        }
      };
    }
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    handleCallAccepted,
    handleIncomingCall,
    handleNegoNeedFinal,
    handleNegoNeedIncomming,
    handleUserJoined,
    socket,
  ]);
  
  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [remoteSocketId, socket]);

  return (
    <main className="p-4">
      <div className="text-xl font-bold mb-4">WebRTC Video Call</div>
      <div className="flex flex-col gap-3 mb-4">
        {remoteSocketId && !myStream && (
          <Button onPress={handleCallUser}>CALL</Button>
        )}
        {myStream && (
          <Button onPress={sendStreams}>Send Stream</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myStream && (
          <div className="border p-2 rounded">
            <h2 className="text-lg font-medium mb-2">Your Video</h2>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-auto bg-black"
            />
          </div>
        )}
        
        {remoteStream && (
          <div className="border p-2 rounded">
            <h2 className="text-lg font-medium mb-2">Remote Stream</h2>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto bg-black"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default WebRtcPage;