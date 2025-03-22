"use client";
import { getSocket } from "@/lib/socket";
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
  const [gigId, setGigId] = useState<string | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [producerId: string]: MediaStream;
  }>({});
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null); // mediasoup Device
  const [producerTransport, setProducerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for sending media
  const [consumerTransport, setConsumerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for receiving media
  const [producerIds, setProducerIds] = useState<
    { producerId: string; status: "consumed" | "pending" }[]
  >([]);
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
    }) {
      setGigId(gigId);
      socket.emit("joinGig", { gigId, accessToken });
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
          if (!gigId) return;
          console.log(
            `getRouterRtpCapabilities: ${data.routerRtpCapabilities}`
          );
          const newDevice = new mediasoupClient.Device();
          await newDevice.load({
            routerRtpCapabilities: data.routerRtpCapabilities,
          });
          //emits an event to create transport
          //sets the new device and rtpcapabilities
          setDevice(newDevice);
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
  }, [gigId, socket]);
  /**
   * step:3
   * After creating a web transport in the backend it sends an event 'sendTransportCreated'
   * create a send transport and store it in producer transport.This is used to send media to the backend
   * After creating the sendTransport emit an event to produce another transport for recievetransport
   */
  useEffect(() => {
    socket.on("sendTransportCreated", async (data: ITransportParams) => {
      {
        console.log("Inside send transport created");
        /* Creaete the producer transport in the client side */
        if (!device) {
          console.error("no device in sendTransport");
          return;
        }
        const transport = device.createSendTransport(data);
        setProducerTransport(transport);

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
              socket.emit(
                "connectProducerTransport",
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
              // Callback to indicate success
              callback();
            } catch (error) {
              // Errback to indicate failure
              if (error instanceof Error) {
                errback(error);
              }
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
            const { kind, rtpParameters } = parameters;

            console.log("----------> transport-produce");

            try {
              // Notify the server to start producing media with the provided parameters
              socket.emit(
                "transport-produce",
                { kind, rtpParameters, gigId, transportId: transport.id },
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
  }, [device, gigId, socket]);
  //set up the recieve transport(consumer)
  /**
   * Step:4
   * The backend will emit an event 'recvTransportCreated' with the webtransport
   * create a receive transport for recieving media
   */
  useEffect(() => {
    socket.on("recvTransportCreated", async (data: ITransportParams) => {
      if (!device) {
        console.error("no device in recieveTransport");
        return;
      }
      const transport = device.createRecvTransport(data);
      setConsumerTransport(transport);
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
            console.log("----------> consumer transport has connected");
            callback();
            //**NEW: Request to consume media after transport is connected**
            if (!producerTransport) {
              console.error("Producer transport is not initialized yet!");
              return;
            }
          } catch (error) {
            errback(error);
          }
        }
      );
    });
  }, [consumerTransport, device, gigId, producerTransport, socket]);
  /**
   * "newProducer" event is triggered when ever their is a new media
   * emits an event 'consumeMedia' to start consuming this new producer
   */
  useEffect(() => {
    socket.on("newProducer", async (data: { producerId: string }) => {
      if (!gigId || !consumerTransport || !device) {
        return;
      }
      socket.emit(
        "consumeMedia",
        {
          gigId,
          consumerTransportId: consumerTransport.id,
          producerId: data.producerId,
          rtpCapabilities: device.rtpCapabilities,
        },
        async ({
          status,
          consumerData,
        }: {
          status: "ok" | "error";
          consumerData: IConsumerInfo;
        }) => {
          try {
            if (!consumerTransport || status == "error") {
              console.error("No consumer transport available!");
              return;
            }
            const consumer = await consumerTransport.consume({
              id: consumerData.id,
              producerId: consumerData.producerId,
              kind: consumerData.kind,
              rtpParameters: consumerData.rtpParameters,
            });

            // Accessing the media track from the consumer
            const { track } = consumer;
            console.log("************** track", track);

            // Attaching the media track to the remote video element for playback
            setRemoteStreams((prev) => ({
              ...prev,
              [data.producerId]: new MediaStream([track]),
            }));
            // Add as pending if not already in producerIds
            setProducerIds((prevIds) => {
              if (prevIds.some((p) => p.producerId === data.producerId))
                return prevIds;
              return [
                ...prevIds,
                { producerId: data.producerId, status: "pending" },
              ];
            });
            // Notifying the server to resume media consumption
            socket.emit("resumePausedConsumer", {
              gigId,
              consumerId: consumer.id,
            });
            console.log("----------> consumer transport has resumed");
          } catch (error) {
            console.log(error);
          }
        }
      );
    });
  }, [consumerTransport, device, gigId, socket]);
  /**
   * Function to start the camera and obtain a media stream.
   * This stream is then attached to the local video element for preview.
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        const track = stream.getVideoTracks()[0];
        videoRef.current.srcObject = stream;
        if (producerTransport) {
          const producer = await producerTransport.produce({ track });
          console.log("Video producer created:", producer.id);
          // Event handlers for track ending and transport closing events
          producer?.on("trackended", () => {
            console.log("trackended");
          });
          producer?.on("transportclose", () => {
            console.log("transportclose");
          });
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  /* Cleanup useeffect */
  useEffect(() => {
    return () => {
      socket.off("routerCapabilities");
      socket.off("sendTransportCreated");
      socket.off("recvTransportCreated");
      socket.off("newProducer");
      producerTransport?.close();
      consumerTransport?.close();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (remoteStreams) {
        Object.entries(remoteStreams).forEach(([, stream]) => {
          stream.getTracks().forEach((track) => track.stop());
        });
      }
    };
  }, []);
  return {
    handleJoinRoom,
    videoRef,
    remoteStreams,
    startCamera,
  };
}

export default useMediaSoup;
