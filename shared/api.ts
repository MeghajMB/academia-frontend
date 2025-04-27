import { z } from "zod";

export const SuccessResponseSchema = z.object({
  status: z.literal("success"),
  code: z.number(),
  message: z.string(),
  data: z.any(),
});

export const ErrorResponseSchema = z.object({
  status: z.literal("error"),
  code: z.number(),
  message: z.string(),
  errors: z
    .array(z.object({ field: z.string().optional(), message: z.string() }))
    .optional(),
});

export type SuccessResponseDTO<T> = z.infer<typeof SuccessResponseSchema> & {
  data: T;
};
export type ErrorResponseDTO = z.infer<typeof ErrorResponseSchema>;
