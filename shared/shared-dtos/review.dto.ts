import { z } from "zod";
import { SuccessResponseSchema } from "../api";

// Add Review Response
export const AddReviewResponseSchema = SuccessResponseSchema.extend({
  message: z.literal("Review added"),
  data: z.object({
    id: z.string(),
    courseId: z.string(),
    studentId: z.string(),
    rating: z.number(),
    comment: z.string(),
    createdAt: z.string().optional(), // Assuming ISO date string or similar
  }),
});
export type AddReviewResponseDTO = z.infer<typeof AddReviewResponseSchema>;

// Get Reviews Of Course Response
export const GetReviewsOfCourseResponseSchema = SuccessResponseSchema.extend({
  data: z.object({
    reviews: z.array(
      z.object({
        id: z.string(),
        studentId: z.object({
          id:z.string(),
          name: z.string(),
          avatar: z.string(),
        }),
        rating: z.number(),
        comment: z.string(),
        createdAt: z.string(),
      })
    ),
    reviewStats: z.object({
      averageRating: z.number(),
      totalReviews: z.number(),
      ratingBreakdown: z.object({
        "1star": z.number().optional(),
        "2star": z.number().optional(),
        "3star": z.number().optional(),
        "4star": z.number().optional(),
        "5star": z.number().optional(),
      }),
    }),
  }),
});
export type GetReviewsOfCourseResponseDTO = z.infer<
  typeof GetReviewsOfCourseResponseSchema
>;

// Get Reviews By Student Response
export const GetReviewsByStudentResponseSchema = SuccessResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      courseId: z.string(),
      studentId: z.string(),
      rating: z.number(),
      comment: z.string(),
      createdAt: z.string().optional(),
    })
  ),
});
export type GetReviewsByStudentResponseDTO = z.infer<
  typeof GetReviewsByStudentResponseSchema
>;

// Delete Review Response
export const DeleteReviewResponseSchema = SuccessResponseSchema.extend({
  message: z.literal("Review deleted successfully"),
  data: z.null(),
});
export type DeleteReviewResponseDTO = z.infer<
  typeof DeleteReviewResponseSchema
>;