"use client";
import { setNotifications } from "@/store/features/notification/notificationSlice";
import { useAppDispatch } from "@/store/hooks";
import { getSocket } from "@/store/socket";
import { INotification } from "@/types/notification";
import { useEffect } from "react";

function useNotification(userId: string | null) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    socket.emit("registerUser", userId);
    socket.on(
      "notifications",
      (data: { notifications: INotification[]; count: number }) => {
        console.log(data);
        dispatch(setNotifications(data));
      }
    );
    return () => {
      socket.emit("unRegisterUser", userId);
      socket.off("notifications");
    };
  }, [userId]);
}

export default useNotification;
