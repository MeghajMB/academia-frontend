import { Dispatch, SetStateAction, useEffect } from "react";
import * as mediasoupClient from "mediasoup-client";
import { Socket } from "socket.io-client";
import { IConsumerInfo, Producer, RemoteStreams } from "./useMediaSoup";

export default function useConsumeMedia({
  socket,
  sessionId,
  device,
  consumerTransport,
  producerIds,
  setRemoteStreams,
  setProducerIds
}: {
  socket: Socket;
  sessionId: string | null;
  device: mediasoupClient.types.Device | null;
  consumerTransport: mediasoupClient.types.Transport<mediasoupClient.types.AppData> | null;
  producerIds: {
    producerId: string;
    status: "consumed" | "pending";
  }[];
  setRemoteStreams: Dispatch<SetStateAction<RemoteStreams>>;
  setProducerIds:Dispatch<SetStateAction<Producer[]>>
}) {
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
          sessionId,
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
            profilePicture: string;
            type: "camera" | "screen" | "mic";
            pause: boolean;
          };
        }) => {
          if (status === "error") {
            console.error("Consume error:");
            return;
          }
          console.log("This is the consumer data");
          console.log(consumerData);
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
                  profilePicture: consumerData.profilePicture,
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
                  profilePicture: consumerData.profilePicture,
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
            sessionId,
            consumerId: consumer.id,
          });
        }
      );
    };

    Promise.all(pendingProducers.map(consumeProducer)).catch((err) =>
      console.error("Batch consume error:", err)
    );
  }, [producerIds, consumerTransport, device, socket, sessionId]);
}
