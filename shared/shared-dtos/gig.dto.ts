import { z } from "zod";
import { SuccessResponseSchema } from "../api";

// Create Gig Response
export const CreateGigResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    id: z.string(),
    sessionDate: z.string(),
    description: z.string(),
    biddingAllowed: z.boolean(),
    sessionDuration: z.number(),
    maxParticipants: z.number(),
    minBid: z.number(),
    status:z.enum(["active", "expired", "completed", "no-bids", "missed"]),
    currentBid:z.number(),
    currentBidder:z.string(),
    title: z.string(),
    instructorId: z.string(),
    biddingExpiresAt:z.string(),
    createdAt: z.string(),
  }),
});
export type CreateGigResponseDTO = z.infer<typeof CreateGigResponseSchema>;

// Get Gig By ID Response
export const GetGigByIdResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    id: z.string(),
    sessionDate: z.string(),
    description: z.string(),
    biddingAllowed: z.boolean(),
    sessionDuration: z.number(),
    maxParticipants: z.number(),
    minBid: z.number(),
    title: z.string(),
    instructorId: z.string(),
    createdAt: z.string().optional(),
  }),
});
export type GetGigByIdResponseDTO = z.infer<typeof GetGigByIdResponseSchema>;

// Get Active Gigs Response
export const GetActiveGigsResponseSchema = SuccessResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      sessionDate: z.string(),
      description: z.string(),
      biddingAllowed: z.boolean(),
      sessionDuration: z.number(),
      maxParticipants: z.number(),
      minBid: z.number(),
      title: z.string(),
      instructorId: z.string(),
      createdAt: z.string().optional(),
    })
  ),
});
export type GetActiveGigsResponseDTO = z.infer<
  typeof GetActiveGigsResponseSchema
>;

// Get Active Gigs Of Instructor Response
export const GetActiveGigsOfInstructorResponseSchema =
  SuccessResponseSchema.extend({
    data: z.array(
      z.object({
        id: z.string(),
        sessionDate: z.string(),
        description: z.string(),
        biddingAllowed: z.boolean(),
        sessionDuration: z.number(),
        maxParticipants: z.number(),
        minBid: z.number(),
        status:z.enum(["active" , "expired"]),
        currentBid:z.number(),
        currentBidder:z.string(),
        title: z.string(),
        instructorId: z.string(),
        biddingExpiresAt:z.string(),
        createdAt: z.string(),
      })
    ),
  });
export type GetActiveGigsOfInstructorResponseDTO = z.infer<
  typeof GetActiveGigsOfInstructorResponseSchema
>;

// Update Gig Response
export const UpdateGigResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    id: z.string(),
    sessionDate: z.string(),
    description: z.string(),
    biddingAllowed: z.boolean(),
    sessionDuration: z.number(),
    maxParticipants: z.number(),
    minBid: z.number(),
    title: z.string(),
    instructorId: z.string(),
    createdAt: z.string().optional(),
  }),
});
export type UpdateGigResponseDTO = z.infer<typeof UpdateGigResponseSchema>;

// Delete Gig Response
export const DeleteGigResponseSchema = SuccessResponseSchema.extend({
  data: z.null(), // No content returned
});
export type DeleteGigResponseDTO = z.infer<typeof DeleteGigResponseSchema>;

// Get all gigs
export const GetGigsOfInstructorResponseSchema = SuccessResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      sessionDate: z.string(),
      description: z.string(),
      biddingAllowed: z.boolean(),
      sessionDuration: z.number(),
      maxParticipants: z.number(),
      minBid: z.number(),
      status: z.enum(["active", "expired", "completed", "no-bids", "missed"]),
      currentBid: z.number(),
      currentBidder: z.string().nullable(),
      title: z.string(),
      instructorId: z.string(),
      biddingExpiresAt: z.string(),
      createdAt: z.string(),
    })
  ),
});
export type GetGigsOfInstructorResponseDTO = z.infer<
  typeof GetGigsOfInstructorResponseSchema
>;