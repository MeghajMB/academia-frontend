import { z } from "zod";
import { SuccessResponseSchema } from "../api";

export const GetAllCategoriesSchema = SuccessResponseSchema.extend({
    data: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        isBlocked: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    ),
  });
  export type GetAllCategoriesDTO = z.infer<typeof GetAllCategoriesSchema>;
