import { ErrorResponseDTO, GetReviewsOfCourseResponseDTO, GetReviewsOfCourseResponseSchema } from "@/shared";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createReviewApi = (axiosInstance: AxiosInstance) => ({
  // Fetch all reviews for a specific course
  fetchCourseReviewsApi: async (courseId: string): Promise<GetReviewsOfCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`/api/review/get/${courseId}`);
      const result = GetReviewsOfCourseResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCourseReviewStatiticsApi: async (courseId: string) => {
    const response = await axiosInstance.get(
      `/api/review/course/statitics/${courseId}`
    );
    return response.data;
  },

  // Submit a new review
  addReviewApi: async (courseId: string, rating: number, comment?: string) => {
    const response = await axiosInstance.post("/api/review/add-review", {
      courseId,
      rating,
      comment,
    });
    return response.data;
  },
});

export default createReviewApi;
