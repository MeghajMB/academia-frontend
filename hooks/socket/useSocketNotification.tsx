import { getSocket } from "@/lib/socket";
import { INotification } from "@/types/notification";
import { useEffect, useState } from "react";

function useNotification(userId: string | null) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    socket.emit("registerUser", userId);
    socket.on("notifications", (data) => {
      console.log(data)
      setNotifications(data.notifications);
      setNotificationCount(data.count);
    });
    return () => {
      socket.emit("unRegisterUser", userId);
    };
  }, [userId]);
  return { notifications, notificationCount };
}

export default useNotification;
