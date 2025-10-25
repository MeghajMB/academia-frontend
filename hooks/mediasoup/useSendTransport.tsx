import { SetStateAction, useEffect } from "react";
import * as mediasoupClient from "mediasoup-client";
import { Socket } from "socket.io-client";
import { ITransportParams } from "./useMediaSoup";

export default function useSendTransport({
  socket,
  sessionId,
  device,
  setProducerTransport,
}: {
  socket: Socket;
  sessionId: string | null;
  device: mediasoupClient.types.Device | null;
  setProducerTransport: (
    value: SetStateAction<mediasoupClient.types.Transport<mediasoupClient.types.AppData> | null>
  ) => void;
}) {
  useEffect(() => {
    socket.on("sendTransportCreated", async (data: ITransportParams) => {
      {
        /* Creaete the producer transport in the client side */
        if (!device) {
          console.error("no device in sendTransport");
          return;
        }
        const transport = device.createSendTransport({
          ...data,
          /*           iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
            {
              credential: "ViUCb0/rDO2hn0ybSI+650OZ74bMCoIg5A0CD9rNfxQ=",
              urls: "turn:global.turn.twilio.com:3478?transport=udp",
              username:
                "aff41892bcedc66a6542964a178b50a0186edf7f46ecbece22d6e58ec08707fd",
            },
            {
              credential: "ViUCb0/rDO2hn0ybSI+650OZ74bMCoIg5A0CD9rNfxQ=",
              urls: "turn:global.turn.twilio.com:3478?transport=tcp",
              username:
                "aff41892bcedc66a6542964a178b50a0186edf7f46ecbece22d6e58ec08707fd",
            },
            {
              credential: "ViUCb0/rDO2hn0ybSI+650OZ74bMCoIg5A0CD9rNfxQ=",
              urls: "turn:global.turn.twilio.com:443?transport=tcp",
              username:
                "aff41892bcedc66a6542964a178b50a0186edf7f46ecbece22d6e58ec08707fd",
            },
          ], */
        });
        setProducerTransport(transport);
        console.log("Successfully Created send transport");
        console.log("Ice candidates and ice parameters");
        console.log("----------------------------------------------------");
        console.log(data);

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
              console.log("----------> producer transport has connected(send transport)");
              // Notify the server that the transport is ready to connect with the provided DTLS parameters
              await new Promise((resolve, reject) => {
                socket.emit(
                  "connectProducerTransport",
                  { dtlsParameters, sessionId, transportId: transport.id },
                  (data: { status: "ok" | "error"; message?: string }) => {
                    if (data.status === "error") {
                      reject(new Error(data.message));
                    } else {
                      resolve("Success");
                    }
                  }
                );
              });
              console.log("success in send transoport connect")
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
                  sessionId,
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
              console.log("Error in send transport produce");
              // Errback to indicate failure
              errback(error);
            }
          }
        );
        socket.emit("createTransport", {
          sessionId: sessionId,
          transportType: "consumer",
        });
      }
    });
    return () => {
      socket.off("sendTransportCreated");
    };
  }, [device, sessionId, socket]);
}
