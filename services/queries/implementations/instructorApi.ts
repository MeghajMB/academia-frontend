import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/instructor";

const createInstructorApi = (axiosInstance: AxiosInstance) => ({
  fetchInstructorProfileApi: async () => {
    const response = await axiosInstance.get(`${BASE_PATH}/profile`);
    return response.data;
  },
  getInstructorAnalyticsSummary: async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/analytics/summary`
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
      const response = await axiosInstance.get(`${BASE_PATH}/analytics`, {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createInstructorApi;
