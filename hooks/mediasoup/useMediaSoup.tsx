"use client";
import { getSocket } from "@/lib/socket";
import { useEffect, useCallback, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import useRouterCapabilities from "./useRouterCapabilities";
import useSendTransport from "./useSendTransport";
import useRecieveTransport from "./useRecieveTransport";
import useConsumeMedia from "./useConsumeMedia";

export interface ITransportParams {
  id: string;
  iceParameters: mediasoupClient.types.IceParameters;
  iceCandidates: mediasoupClient.types.IceCandidate[];
  dtlsParameters: mediasoupClient.types.DtlsParameters;
}
export interface IConsumerInfo {
  id: string;
  producerId: string;
  kind: mediasoupClient.types.MediaKind;
  rtpParameters: mediasoupClient.types.RtpParameters;
}
export interface RemoteStreams {
  [userId: string]: {
    producerId: string;
    stream: MediaStream;
    kind: "audio" | "video";
    type: "camera" | "screen" | "mic";
    profilePicture: string;
    userName: string;
    paused: boolean;
  }[];
}
export interface Producer {
  producerId: string;
  status: "consumed" | "pending";
}

function useMediaSoup() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLVideoElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  /* State to store the details of the remote streams */
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreams>({});

  /* State for storing mediasoup device */
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null);

  /* State for storing producer and consumer transport */
  const [producerTransport, setProducerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for sending media
  const [consumerTransport, setConsumerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for receiving media

  /* State to store all the productIds for consuming */
  const [producerIds, setProducerIds] = useState<Producer[]>([]);

  /* State to store auido, video and screen producers */
  const [videoProducer, setVideoProducer] =
    useState<mediasoupClient.types.Producer | null>(null);
  const [audioProducer, setAudioProducer] =
    useState<mediasoupClient.types.Producer | null>(null);
  const [screenProducer, setScreenProducer] =
    useState<mediasoupClient.types.Producer | null>(null);

  /* Stat to store the status of video, audio and screenshare (pause/mute/close) */
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const socket = getSocket();

  /**
   * step:1
   * This is the starting point of the workflow.emits an event to join the room
   */
  const handleJoinRoom = useCallback(
    function handleJoinRoom({
      sessionId,
      accessToken,
    }: {
      sessionId: string;
      accessToken: string;
    }): Promise<string> {
      setSessionId(sessionId);
      return new Promise((resolve, reject) => {
        socket.emit(
          "joinSession",
          { sessionId, accessToken },
          (response: { status: "ok" | "error"; message: string }) => {
            if (response.status == "ok") {
              resolve(response.message);
            } else {
              reject(new Error(response.message || "You dont have access"));
            }
          }
        );
      });
    },
    [socket]
  );
  /**
   * step:2
   * after successfully joiinig the room,routercapabilities are sent from the backend through this event
   * get the rtpCapabilities and set the device
   * after setting the device,emits a event 'createtransport' to create a sender transport
   */
  useRouterCapabilities({ socket, sessionId, device, setDevice });
  /**
   * step:3
   * After creating a web transport in the backend it sends an event 'sendTransportCreated'
   * create a send transport and store it in producer transport.This is used to send media to the backend
   * After creating the sendTransport emit an event to produce another transport for recievetransport
   */
  useSendTransport({ socket, device, sessionId, setProducerTransport });
  /**
   * Step:4
   * setup recieve transport
   * The backend will emit an event 'recvTransportCreated' with the webtransport
   * create a receive transport for recieving media
   * Fetch all the active producers once recieve transport is created
   */
  useRecieveTransport({
    device,
    sessionId,
    setConsumerTransport,
    setProducerIds,
    socket,
  });

  /**
   * In this use effect,we are checking for new producers and update the producerId state
   * "newProducer" event is triggered when ever their is a new media
   */
  useEffect(() => {
    socket.on("newProducer", async (data: { producerId: string }) => {
      console.log("Got new producers");
      setProducerIds((prevIds) => {
        if (prevIds.some((p) => p.producerId === data.producerId))
          return prevIds;
        return [...prevIds, { producerId: data.producerId, status: "pending" }];
      });
    });
    return () => {
      socket.off("newProducer");
    };
  }, [socket]);
  /**
   * In this useEffect,we are consuming the producers.
   * emits an event 'consumeMedia' to start consuming this new producer
   */
  useConsumeMedia({
    consumerTransport,
    device,
    producerIds,
    sessionId,
    setProducerIds,
    setRemoteStreams,
    socket,
  });
  /**
   * this useeffect is triggered when a producer state has changed(mute/unmute/pause/unpause)
   */
  useEffect(() => {
    socket.on(
      "producerStateChanged",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ producerId, paused, userId, userName, kind }) => {
        setRemoteStreams((prev) => {
          const newStreams = { ...prev };
          if (newStreams[userId]) {
            const index = newStreams[userId].findIndex(
              (stream) => stream.producerId == producerId
            );
            if (index !== -1) {
              newStreams[userId][index].paused = paused;
            }
          }
          return newStreams;
        });
      }
    );
    return () => {
      socket.off("producerStateChanged");
    };
  }, [socket]);
  /* use effect to handle closing of other producers */
  useEffect(() => {
    socket.on("producerClosed", ({ producerId }) => {
      console.log(
        "This is the producer id which is to be deleted" + producerId
      );
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        // Iterate over each userId
        Object.keys(newStreams).forEach((userId) => {
          // Filter out the stream with matching producerId
          newStreams[userId] = newStreams[userId].filter(
            (stream) => stream.producerId !== producerId
          );
          // Remove userId entry if no streams remain
          if (newStreams[userId].length === 0) {
            delete newStreams[userId];
          }
        });
        return newStreams;
      });
      // Update producerIds if still needed
      setProducerIds((prev) => prev.filter((p) => p.producerId !== producerId));
    });
    return () => {
      socket.off("producerClosed");
    };
  }, [socket]);
  /* Cleanup useEffect */
  useEffect(() => {
    console.log("cleanup triggered");
    return () => {
      videoProducer?.close();
      audioProducer?.close();
      producerTransport?.close();
      consumerTransport?.close();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setRemoteStreams({});
      setProducerIds([]);
    };
  }, []);

  /**
   * Function to start the camera and obtain a media stream.
   * This stream is then attached to the local video element for preview.
   */
  const startMedia = async (
    initialVideoPaused = true,
    initialMicPaused = true
  ) => {
    try {
      if (!producerTransport) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        videoRef.current.srcObject = stream;
        console.log("Going to create video producer");                                              /* --------- */
        const videoProd = await producerTransport.produce({
          track: videoTrack,
          appData: { type: "camera", paused: initialVideoPaused },
        });
        setVideoProducer(videoProd);
        console.log("Video producer created:", videoProd.id);
        // Event handlers for track ending and transport closing events
        const audioProd = await producerTransport.produce({
          track: audioTrack,
          appData: { type: "mic", paused: initialMicPaused },
        });
        setAudioProducer(audioProd);
        console.log("Audio producer created:", audioProd.id);
        //pause the video and audio if demanded
        if (initialVideoPaused) {
          videoProd.pause();
        }
        if (initialMicPaused) {
          audioProd.pause();
        }
        setIsVideoPaused(initialVideoPaused);
        setIsAudioMuted(initialMicPaused);
        videoProd.on("trackended", () => console.log("Video track ended"));
        videoProd.on("transportclose", () =>
          console.log("Video transport closed")
        );
        audioProd.on("trackended", () => console.log("Audio track ended"));
        audioProd.on("transportclose", () =>
          console.log("Audio transport closed")
        );
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  /* Function To Mute or Unmute Audio */
  const toggleAudio = async () => {
    if (!audioProducer) return;
    if (isAudioMuted) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const newAudioTrack = stream.getAudioTracks()[0];
      await audioProducer.replaceTrack({ track: newAudioTrack });
      audioProducer.resume();
      setIsAudioMuted(false);
      console.log("Audio unmuted");
    } else {
      audioProducer.pause();
      setIsAudioMuted(true);
      console.log("Audio muted");
    }
    socket.emit("producerStateChanged", {
      producerId: audioProducer.id,
      paused: isAudioMuted,
      sessionId,
    });
  };

  /* Function to pause or unpause video */
  const toggleVideo = async () => {
    if (!videoProducer || !videoRef.current?.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const videoTrack = stream.getVideoTracks()[0];

    if (isVideoPaused) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const newVideoTrack = stream.getVideoTracks()[0];
      await videoProducer.replaceTrack({ track: newVideoTrack });
      //
      videoRef.current.srcObject = stream;
      videoProducer.resume();
      setIsVideoPaused(false);
      console.log("Video unpaused");
    } else {
      videoTrack.stop();
      videoProducer.pause();
      setIsVideoPaused(true);
      console.log("Video paused");
    }
    socket.emit("producerStateChanged", {
      producerId: videoProducer.id,
      paused: !isVideoPaused,
      sessionId,
    });
  };

  const toggleScreenShare = async () => {
    try {
      if (!producerTransport || !screenRef.current) return;
      if (!screenProducer) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "browser" },
        });
        const screenTrack = stream.getVideoTracks()[0];
        const screenProd = await producerTransport.produce({
          track: screenTrack,
          appData: { type: "screen" },
        });
        screenRef.current.srcObject = stream;
        screenProd.on("trackended", () => console.log("Video track ended"));
        screenProd.on("transportclose", () =>
          console.log("Video transport closed")
        );
        setScreenProducer(screenProd);
        setIsScreenSharing(true);
        return;
      }
      if (isScreenSharing) {
        // Stop screen sharing
        const stream = screenRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        screenProducer.pause();
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "browser" },
        });
        const tracks = stream.getVideoTracks()[0];
        await screenProducer.replaceTrack({ track: tracks });
        screenRef.current.srcObject = stream;
        screenProducer.resume();
        setIsScreenSharing(true);
      }
      socket.emit("producerStateChanged", {
        producerId: screenProducer.id,
        paused: isScreenSharing,
        sessionId,
      });
    } catch (err) {
      console.error("Error starting screen share:", err);
      setIsScreenSharing(false);
    }
  };
  /* Function to disconnect call */
  const handleDisconnect = useCallback(() => {
    // Stop local media tracks
    console.log("Disconnect triggered");
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop(); // Stops camera/mic and turns off LED
      });
      videoRef.current.srcObject = null;
    }

    // Close producers
    if (videoProducer) {
      videoProducer.close();
      setVideoProducer(null);
    }
    if (audioProducer) {
      audioProducer.close();
      setAudioProducer(null);
    }

    // Close transports
    if (producerTransport) {
      producerTransport.close();
      setProducerTransport(null);
    }
    if (consumerTransport) {
      consumerTransport.close();
      setConsumerTransport(null);
    }

    // Notify server and others
    socket.emit("leaveGig", { sessionId });

    // Reset state
    setSessionId(null);
    setProducerIds([]);
    setRemoteStreams({});
    setIsAudioMuted(false);
    setIsVideoPaused(false);
  }, [
    sessionId,
    socket,
    videoProducer,
    audioProducer,
    producerTransport,
    consumerTransport,
  ]);

  return {
    handleJoinRoom,
    videoRef,
    screenRef,
    remoteStreams,
    startMedia,
    toggleAudio,
    toggleVideo,
    isAudioMuted,
    isVideoPaused,
    handleDisconnect,
    toggleScreenShare,
    isScreenSharing,
  };
}

export default useMediaSoup;
