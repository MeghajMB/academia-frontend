"use client";
import { getSocket } from "@/lib/socket";
import { Button } from "@heroui/react";
import React, { useEffect, useCallback, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { useAppSelector } from "@/lib/hooks";

interface ITransportParams {
  id: string;
  iceParameters: mediasoupClient.types.IceParameters;
  iceCandidates: mediasoupClient.types.IceCandidate[];
  dtlsParameters: mediasoupClient.types.DtlsParameters;
}
const gigId = "123";
export default function MediasoupPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [device, setDevice] = useState<mediasoupClient.Device | null>(null); // mediasoup Device
  const [rtpCapabilities, setRtpCapabilities] =
    useState<mediasoupClient.types.RtpCapabilities | null>(null); // RTP Capabilities for the device
  const [producerTransport, setProducerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for sending media
  const [consumerTransport, setConsumerTransport] =
    useState<mediasoupClient.types.Transport | null>(null); // Transport for receiving media
  const [producerIds, setProducerIds] = useState<string[]>([]);
  const { accessToken } = useAppSelector((state) => state.auth);

  /**
   * This use effect is for the intializaion of mediasoup
   */
  const socket = getSocket();
  //join the room
  function handleJoinRoom(){
    socket.emit("joinGig", { gigId, accessToken });
  }
  useEffect(() => {
    
    return () => {
      socket.off("routerCapabilities");
      socket.off("sendTransportCreated");
      socket.off("recvTransportCreated");
      producerTransport?.close();
      consumerTransport?.close();
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [gigId]);
  /* get the rtpCapabilities and set the device */
  useEffect(() => {
    socket.on(
      "routerCapabilities",
      async (data: {
        routerRtpCapabilities: mediasoupClient.types.RtpCapabilities;
      }) => {
        try {
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
          setRtpCapabilities(data.routerRtpCapabilities);
          socket.emit("createTransport", {
            gigId: gigId,
            transportType: "sender",
          });
        } catch (error: any) {
          console.log(error);
          if (error.name === "UnsupportedError") {
            console.error("Browser not supported");
          }
        }
      }
    );
  }, []);
  //get the send transport details(producer)
  useEffect(() => {
    socket.on("sendTransportCreated", async (data: ITransportParams) => {
      {
        console.log("Inside send transport created");
        console.log(device);
        /* Creaete the producer transport in the client side */
        if (!device) return;
        const transport = device?.createSendTransport(data);
        setProducerTransport(transport);

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
                (data) => {
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

        transport?.on(
          "produce",
          async (parameters: any, callback: any, errback: any) => {
            const { kind, rtpParameters } = parameters;

            console.log("----------> transport-produce");

            try {
              // Notify the server to start producing media with the provided parameters
              socket.emit(
                "transport-produce",
                { kind, rtpParameters, gigId, transportId: transport.id },
                ({ id, status }: { id: string; status: string }) => {
                  callback({ id });
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
  }, [device]);
  //set up the recieve transport(consumer)
  useEffect(() => {
    socket.on("recvTransportCreated", async (data: ITransportParams) => {
      if (!device) return;
      const transport = device?.createRecvTransport(data);
      setConsumerTransport(transport);
      /**
       * This event is triggered when "consumerTransport.consume" is called
       * for the first time on the client-side.
       * */
      transport?.on(
        "connect",
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
              (data) => console.log(data)
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
  }, [consumerTransport, device, producerTransport]);

  useEffect(() => {
    socket.on("newProducer", async (data: { producerId: string }) => {
      socket.emit(
        "consumeMedia",
        {
          gigId,
          consumerTransportId: consumerTransport?.id,
          producerId: data.producerId,
          rtpCapabilities: device?.rtpCapabilities,
        },
        async ({ status, consumerData }) => {
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
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = new MediaStream([track]);
          }

          // Notifying the server to resume media consumption
          socket.emit("resumePausedConsumer", {
            gigId,
            consumerId: consumer.id,
          });
          console.log("----------> consumer transport has resumed");
        }
      );
      setProducerIds((prevIds) => [...prevIds, data.producerId]);
    });
  }, [consumerTransport, device]);

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
  return (
    <>
      <h1>You are inside the room</h1>
      <Button onClick={startCamera}>Start Camera</Button>
      <Button onClick={handleJoinRoom}>Join Room</Button>

      <div className="flex gap-8">
        <video
          ref={videoRef}
          id="localvideo"
          autoPlay
          playsInline
          className="border-y-fuchsia-900"
        />
        <video
          ref={remoteVideoRef}
          id="remotevideo"
          autoPlay
          playsInline
          className="border-y-amber-400"
        />
      </div>
    </>
  );
}
