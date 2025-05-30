import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  userId: string;
  type: "course" | "payment" | "message" | "system";
  title: string;
  message: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationState {
  notificationCount: number;
  notifications: Notification[];
}

const initialState: NotificationState = {
  notificationCount: 0,
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
      if (!action.payload.isRead) {
        state.notificationCount += 1;
      }
    },

    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.notificationCount -= 1;
      }
    },

    markAllNotificationsAsRead(state) {
      const unreadCount = state.notifications.filter((n) => !n.isRead).length;
      state.notifications.forEach((n) => (n.isRead = true));
      state.notificationCount -= unreadCount;
    },

    removeNotification(state, action: PayloadAction<string>) {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload
      );
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        state.notifications.splice(index, 1);
        if (wasUnread) {
          state.notificationCount -= 1;
        }
      }
    },

    clearNotifications(state) {
      state.notifications = [];
      state.notificationCount = 0;
    },

    setNotifications(
      state,
      action: PayloadAction<{ count: number; notifications: Notification[] }>
    ) {
      state.notifications = action.payload.notifications;
      state.notificationCount = action.payload.count;
    },

    setNotificationCount(state, action: PayloadAction<number>) {
      state.notificationCount = action.payload < 0 ? 0 : action.payload;
    },
  },
});

export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setNotifications,
  setNotificationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
