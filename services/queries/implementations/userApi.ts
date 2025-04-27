import { AxiosInstance } from "axios";

const createUserApi = (axiosInstance: AxiosInstance) => ({
  fetchUserProfileApi: async (userId: string) => {
    const response = await axiosInstance.get(`/api/user/profile/${userId}`);
    return response.data;
  },
  fetchInstructorProfileApi: async (instructorId: string) => {
    const response = await axiosInstance.get(
      `/api/user/instructor-profile/${instructorId}`
    );
    return response.data;
  },
});

export default createUserApi;
