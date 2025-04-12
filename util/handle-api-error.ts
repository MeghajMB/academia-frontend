import { ErrorResponseDTO, ErrorResponseSchema } from "@/shared/index";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown): ErrorResponseDTO => {
  if (error instanceof AxiosError && error.response) {
    const errData = ErrorResponseSchema.safeParse(error.response.data);
    if (errData.success) {
      return errData.data;
    }
  }
  return {
    status: "error",
    code: 0,
    message: "Unknown error occurred",
  };
};
