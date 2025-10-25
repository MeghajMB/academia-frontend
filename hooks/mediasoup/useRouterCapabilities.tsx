import { Dispatch, SetStateAction, useEffect } from "react";
import * as mediasoupClient from "mediasoup-client";
import { Socket } from "socket.io-client";

export default function useRouterCapabilities({
  socket,
  sessionId,
  device,
  setDevice,
}: {
  socket: Socket;
  sessionId: string | null;
  device: mediasoupClient.types.Device | null;
  setDevice: Dispatch<SetStateAction<mediasoupClient.types.Device | null>>;
}) {
  useEffect(() => {
    socket.on(
      "routerCapabilities",
      async (data: {
        routerRtpCapabilities: mediasoupClient.types.RtpCapabilities;
      }) => {
        try {
          if (!sessionId || device) return;
          const newDevice = new mediasoupClient.Device();
          await newDevice.load({
            routerRtpCapabilities: data.routerRtpCapabilities,
          });
          //emits an event to create transport
          //sets the new device and rtpcapabilities
          setDevice(newDevice);
          console.log("Successfully set the new device");
          const sctpCapabilities = newDevice.sctpCapabilities;
          socket.emit("createTransport", {
            sessionId: sessionId,
            transportType: "sender",
            sctpCapabilities,
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
  }, [device, sessionId, socket]);
}
