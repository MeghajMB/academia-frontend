"use client";
import { getSocket } from "@/store/socket";
import { useEffect, useCallback, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";

interface ITransportParams {
  id: string;
  iceParameters: mediasoupClient.types.IceParameters;
  iceCandidates: mediasoupClient.types.IceCandidate[];
  dtlsParameters: mediasoupClient.types.DtlsParameters;
}
interface IConsumerInfo {
  id: string;
  producerId: string;
  kind: mediasoupClient.types.MediaKind;
  rtpParameters: mediasoupClient.types.RtpParameters;
}

function useMediaSoup() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLVideoElement | null>(null);
  const [gigId, setGigId] = useState<string | null>(null);

  /* State to store the details of the remote streams */
  const [remoteStreams, setRemoteStreams] = useState<{
    [userId: string]: {
      producerId: string;
      stream: MediaStream;
      kind: "audio" | "video";
      type: "camera" | "screen" | "mic";
      profilePicture:string;
      userName: string;
      paused: boolean;
    }[];
  }>({});

  /* State for storing mediasoup device */
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null);

  /* State for storing producer and consumer transport */
  const [producerTransport, setProducerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for sending media
  const [consumerTransport, setConsumerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for receiving media

  /* State to store all the productIds for consuming */
  const [producerIds, setProducerIds] = useState<
    { producerId: string; status: "consumed" | "pending" }[]
  >([]);

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
      gigId,
      accessToken,
    }: {
      gigId: string;
      accessToken: string;
    }): Promise<string> {
      setGigId(gigId);
      return new Promise((resolve, reject) => {
        socket.emit(
          "joinGig",
          { gigId, accessToken },
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
  useEffect(() => {
    socket.on(
      "routerCapabilities",
      async (data: {
        routerRtpCapabilities: mediasoupClient.types.RtpCapabilities;
      }) => {
        try {
          if (!gigId || device) return;
          const newDevice = new mediasoupClient.Device();
          await newDevice.load({
            routerRtpCapabilities: data.routerRtpCapabilities,
          });
          //emits an event to create transport
          //sets the new device and rtpcapabilities
          setDevice(newDevice);
          console.log("Successfully set the new device");
          socket.emit("createTransport", {
            gigId: gigId,
            transportType: "sender",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error);
          if (error.name === "UnsupportedError") {
            console.error("Browser not supported");
          }
        }
      }
    );
    return () => {
      socket.off("routerCapabilities");
    };
  }, [device, gigId, socket]);
  /**
   * step:3
   * After creating a web transport in the backend it sends an event 'sendTransportCreated'
   * create a send transport and store it in producer transport.This is used to send media to the backend
   * After creating the sendTransport emit an event to produce another transport for recievetransport
   */
  useEffect(() => {
    socket.on("sendTransportCreated", async (data: ITransportParams) => {
      {
        /* Creaete the producer transport in the client side */
        if (!device) {
          console.error("no device in sendTransport");
          return;
        }
        const transport = device.createSendTransport(data);
        setProducerTransport(transport);
        console.log("Successfully Created send transport");
        /**
         * Set up the initial connection using conect event
         */
        transport?.on(
          "connect",
          async (
            {
              dtlsParameters,
            }: { dtlsParameters: ITransportParams["dtlsParameters"] },
            callback: () => void,
            errback: (err: Error) => void
          ) => {
            try {
              console.log("----------> producer transport has connected");
              // Notify the server that the transport is ready to connect with the provided DTLS parameters
              await new Promise((resolve, reject) => {
                socket.emit(
                  "connectProducerTransport",
                  { dtlsParameters, gigId, transportId: transport.id },
                  (data: { status: "ok" | "error"; message?: string }) => {
                    if (data.status === "error") {
                      reject(new Error(data.message));
                    } else {
                      resolve("Success");
                    }
                  }
                );
              });
              callback();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              // Errback to indicate failure
              console.error("Connect consumer transport error:", error);
              errback(error);
            }
          }
        );
        /**
         * transport.on produce event is triggered when we call producerTransport.produce({ track });
         * This event norifies the server that a new media is available
         */
        transport?.on(
          "produce",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async (parameters: any, callback: any, errback: any) => {
            const { kind, rtpParameters, appData } = parameters;

            try {
              // Notify the server to start producing media with the provided parameters
              socket.emit(
                "transport-produce",
                {
                  kind,
                  rtpParameters,
                  gigId,
                  transportId: transport.id,
                  appData,
                },
                (data: {
                  id: string;
                  status: "ok" | "error";
                  message?: string;
                }) => {
                  if (data.status == "error") {
                    throw new Error(data.message);
                  }
                  callback({ id: data.id });
                }
              );
            } catch (error) {
              // Errback to indicate failure
              errback(error);
            }
          }
        );
        socket.emit("createTransport", {
          gigId: gigId,
          transportType: "consumer",
        });
      }
    });
    return () => {
      socket.off("sendTransportCreated");
    };
  }, [device, gigId, socket]);
  /**
   * Step:4
   * setup recieve transport
   * The backend will emit an event 'recvTransportCreated' with the webtransport
   * create a receive transport for recieving media
   * Fetch all the active producers once recieve transport is created
   */
  useEffect(() => {
    socket.on("recvTransportCreated", async (data: ITransportParams) => {
      if (!device) {
        console.error("no device in recieveTransport");
        return;
      }
      const transport = device.createRecvTransport(data);
      setConsumerTransport(transport);
      console.log("Successfully Created recieve transport");
      /**
       * This event is triggered when "consumerTransport.consume" is called
       * for the first time on the client-side.
       * */
      transport?.on(
        "connect",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async ({ dtlsParameters }: any, callback: any, errback: any) => {
          try {
            // Notifying the server to connect the receive transport with the provided DTLS parameters
            socket.emit(
              "connectConsumerTransport",
              {
                dtlsParameters,
                gigId,
                transportId: transport.id,
              },
              (data: { status: "ok" | "error"; message?: string }) => {
                if (data.status == "error") {
                  throw new Error(data.message);
                }
              }
            );
            callback();
          } catch (error) {
            errback(error);
          }
        }
      );
      /* emit an event to fetch all active producers(producerId) and store it in the state */
      socket.emit(
        "getProducers",
        { gigId },
        ({
          producerIds,
        }: {
          producerIds: {
            kind: "video" | "audio";
            producerId: string;
            userId: string;
            userName: string;
          }[];
        }) => {
          setProducerIds(
            producerIds.map((producerData) => ({
              producerId: producerData.producerId,
              status: "pending",
            }))
          );
        }
      );
    });
    return () => {
      socket.off("recvTransportCreated");
    };
  }, [device, gigId, socket]);

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
  useEffect(() => {
    if (!consumerTransport || !device || !producerIds.length) return;
    const pendingProducers = producerIds.filter((p) => p.status === "pending");

    if (!pendingProducers.length) return;
    const consumeProducer = async (producerDetails: {
      producerId: string;
      status: "consumed" | "pending";
    }) => {
      socket.emit(
        "consumeMedia",
        {
          gigId,
          consumerTransportId: consumerTransport.id,
          producerId: producerDetails.producerId,
          rtpCapabilities: device.rtpCapabilities,
        },
        async ({
          status,
          consumerData,
        }: {
          status: "ok" | "error";
          consumerData: IConsumerInfo & {
            userId: string;
            userName: string;
            profilePicture:string;
            type: "camera" | "screen" | "mic";
            pause:boolean
          };
        }) => {
          if (status === "error") {
            console.error("Consume error:");
            return;
          }
          const consumer = await consumerTransport.consume({
            id: consumerData.id,
            producerId: consumerData.producerId,
            kind: consumerData.kind,
            rtpParameters: consumerData.rtpParameters,
          });

          setRemoteStreams((prev) => {
            const newData = { ...prev };
            if (newData[consumerData.userId]) {
              // Check if producerId already exists
              const exists = newData[consumerData.userId].some(
                (stream) => stream.producerId === consumerData.producerId
              );
              if (!exists) {
                newData[consumerData.userId].push({
                  stream: new MediaStream([consumer.track]),
                  kind: consumerData.kind,
                  producerId: consumerData.producerId,
                  type: consumerData.type,
                  userName: consumerData.userName,
                  profilePicture:consumerData.profilePicture,
                  paused: consumerData.pause,
                });
              }
            } else {
              newData[consumerData.userId] = [
                {
                  stream: new MediaStream([consumer.track]),
                  kind: consumerData.kind,
                  producerId: consumerData.producerId,
                  type: consumerData.type,
                  userName: consumerData.userName,
                  paused: consumerData.pause,
                  profilePicture:consumerData.profilePicture
                },
              ];
            }
            return newData;
          });

          setProducerIds((prev) =>
            prev.map((p) =>
              p.producerId === producerDetails.producerId
                ? { ...p, status: "consumed" }
                : p
            )
          );
          socket.emit("resumePausedConsumer", {
            gigId,
            consumerId: consumer.id,
          });
        }
      );
    };

    Promise.all(pendingProducers.map(consumeProducer)).catch((err) =>
      console.error("Batch consume error:", err)
    );
  }, [producerIds, consumerTransport, device, socket, gigId]);

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
          audioProd.pause()
        }
        setIsVideoPaused(initialVideoPaused)
        setIsAudioMuted(initialMicPaused)
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
      gigId,
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
      gigId,
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
        gigId,
      });
    } catch (err) {
      console.error("Error starting screen share:", err);
      setIsScreenSharing(false);
    }
  };
  /* Function to disconnect call */
  const handleDisconnect = useCallback(() => {
    // Stop local media tracks
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
    socket.emit("leaveGig", { gigId });

    // Reset state
    setGigId(null);
    setProducerIds([]);
    setRemoteStreams({});
    setIsAudioMuted(false);
    setIsVideoPaused(false);
  }, [
    gigId,
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
