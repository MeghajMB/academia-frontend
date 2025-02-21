import { AxiosInstance } from "axios";

const createReviewApi = (axiosInstance: AxiosInstance) => ({
  // Fetch all reviews for a specific course
  fetchCourseReviewsApi: async (courseId: string) => {
    const response = await axiosInstance.get(`/api/review/get/${courseId}`);
    return response.data;
  },

  // Submit a new review
  submitReviewApi: async (courseId: string, rating: number, comment: string) => {
    const response = await axiosInstance.post("/api/review/add-review", {
      courseId,
      rating,
      comment,
    });
    return response.data;
  },
});

export default createReviewApi;
