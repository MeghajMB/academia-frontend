export interface INotification {
  id: string;
  userId: string;
  type: "course" | "payment" | "message" | "system";
  title: string; // Short title for the notification
  message: string; // Detailed message
  entityId?: string;
  isRead: boolean; // Whether the user has seen it
  createdAt: Date;
}
