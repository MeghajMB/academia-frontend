export interface INotification {
  id: string;
  userId: string;
  type: "course" | "payment" | "message" | "system";
  title: string;
  message: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
}
