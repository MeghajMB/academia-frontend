import { z } from "zod";
import { SuccessResponseSchema } from "../api";


// Send Notification Response
export const SendNotificationResponseSchema = SuccessResponseSchema.extend({
  data: z
    .object({
      id: z.string(),
      userId: z.string(),
      type: z.string(),
      title: z.string(),
      message: z.string(),
      entityId: z.string(),
      isRead: z.boolean(),
      createdAt: z.string().optional(), // Assuming ISO date string or similar
    })
});
export type SendNotificationResponseDTO = z.infer<
  typeof SendNotificationResponseSchema
>;

// Get User Notifications Response
export const GetUserNotificationsResponseSchema = SuccessResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      type: z.string(),
      title: z.string(),
      message: z.string(),
      entityId: z.string(),
      isRead: z.boolean(),
      createdAt: z.string().optional(),
    })
  ),
});
export type GetUserNotificationsResponseDTO = z.infer<
  typeof GetUserNotificationsResponseSchema
>;

// Mark Notification As Read Response
export const MarkNotificationAsReadResponseSchema =
  SuccessResponseSchema.extend({
    data: z.object({
      id: z.string(),
      userId: z.string(),
      type: z.string(),
      title: z.string(),
      message: z.string(),
      entityId: z.string(),
      isRead: z.literal(true), // After marking as read, it should be true
      createdAt: z.string().optional(),
    }),
  });
export type MarkNotificationAsReadResponseDTO = z.infer<
  typeof MarkNotificationAsReadResponseSchema
>;
