import {
  DeleteReviewResponseDTO,
  DeleteReviewResponseSchema,
  ErrorResponseDTO,
  GetReviewsOfCourseResponseDTO,
  GetReviewsOfCourseResponseSchema,
} from "@/shared";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createReviewApi = (axiosInstance: AxiosInstance) => ({
  // Fetch all reviews for a specific course
  fetchCourseReviewsApi: async (
    courseId: string
  ): Promise<GetReviewsOfCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`/api/review/get/${courseId}`);
      const result = GetReviewsOfCourseResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCourseReviewStatiticsApi: async (
    courseId: string
  ): Promise<GetReviewsOfCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `/api/review/course/statitics/${courseId}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  editReviewApi: async (reviewData: {
    courseId: string;
    comment: string;
    reviewId: string;
    rating: number;
  }): Promise<GetReviewsOfCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/review/edit-review`,
        reviewData
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  deleteReviewApi: async (
    reviewId: string
  ): Promise<DeleteReviewResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `/api/review/delete/${reviewId}`
      );
      const result = DeleteReviewResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Submit a new review
  addReviewApi: async (
    courseId: string,
    rating: number,
    comment?: string
  ): Promise<GetReviewsOfCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/review/add-review", {
        courseId,
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createReviewApi;
