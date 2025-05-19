"use client";
import {
  addNotification,
  setNotifications,
} from "@/store/features/notification/notificationSlice";
import { useAppDispatch } from "@/store/hooks";
import { getSocket } from "@/lib/socket";
import { INotification } from "@/types/notification";
import { useEffect } from "react";

function useNotification(userId: string | null) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    socket.emit(
      "registerUser",
      userId,
      (data: { notifications: INotification[]; count: number }) => {
        console.log(data);
        dispatch(setNotifications(data));
      }
    );
    socket.on(
      "notifications",
      (data: { notification: INotification;}) => {
        console.log(data);
        dispatch(addNotification(data.notification));
      }
    );
    return () => {
      socket.emit("unRegisterUser", userId);
      socket.off("notifications");
    };
  }, [userId]);
}

export default useNotification;
