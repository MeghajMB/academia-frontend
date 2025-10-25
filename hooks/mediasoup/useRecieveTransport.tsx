import { SetStateAction, useEffect } from "react";
import * as mediasoupClient from "mediasoup-client";
import { Socket } from "socket.io-client";
import { ITransportParams } from "./useMediaSoup";

export default function useRecieveTransport({
  socket,
  sessionId,
  device,
  setConsumerTransport,
  setProducerIds,
}: {
  socket: Socket;
  sessionId: string | null;
  device: mediasoupClient.types.Device | null;
  setConsumerTransport: (
    value: SetStateAction<mediasoupClient.types.Transport<mediasoupClient.types.AppData> | null>
  ) => void;
  setProducerIds: (
    value: SetStateAction<
      {
        producerId: string;
        status: "consumed" | "pending";
      }[]
    >
  ) => void;
}) {
  useEffect(() => {
    socket.on("recvTransportCreated", async (data: ITransportParams) => {
      if (!device) {
        console.error("no device in recieveTransport");
        return;
      }
      const transport = device.createRecvTransport({
        ...data,
        /*         iceServers: [
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
                sessionId,
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
            console.log("Error in connectConsumerTransport");
            errback(error);
          }
        }
      );
      /* emit an event to fetch all active producers(producerId) and store it in the state */
      socket.emit(
        "getProducers",
        { sessionId },
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
          console.log("These are the producer Ids");
          console.log(producerIds);
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
  }, [device, sessionId, socket]);
}
