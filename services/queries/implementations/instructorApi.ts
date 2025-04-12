import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createInstructorApi = (axiosInstance: AxiosInstance) => ({
  fetchInstructorProfileApi: async () => {
    const response = await axiosInstance.get("/api/instructor/profile");
    return response.data;
  },
  getInstructorDashboard: async () => {
    try {
      const response = await axiosInstance.get("/api/instructor/analytics");
      return response.data;
    } catch (error) {
      return handleApiError(error)
    }
  },
});

export default createInstructorApi;
