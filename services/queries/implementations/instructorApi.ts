import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createInstructorApi = (axiosInstance: AxiosInstance) => ({
  fetchInstructorProfileApi: async () => {
    const response = await axiosInstance.get("/api/instructor/profile");
    return response.data;
  },
  getInstructorAnalyticsSummary: async () => {
    try {
      const response = await axiosInstance.get(
        "/api/instructor/analytics/summary"
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  getInstructorAnalytics: async (
    filter: "month" | "quarter" | "year"
  ) => {
    try {
      const response = await axiosInstance.get("/api/instructor/analytics", {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createInstructorApi;
