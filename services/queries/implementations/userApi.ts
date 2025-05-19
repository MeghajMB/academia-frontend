import { handleApiError } from "@/util/handle-api-error";
import {
  ErrorResponseDTO,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/user";

const createUserApi = (axiosInstance: AxiosInstance) => ({
  blockUserApi: async (
    userId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/block/${userId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchUserProfileApi: async (userId: string) => {
    const response = await axiosInstance.get(`${BASE_PATH}/profile/${userId}`);
    return response.data;
  },
  fetchInstructorProfileApi: async (instructorId: string) => {
    const response = await axiosInstance.get(
      `${BASE_PATH}/instructor-profile/${instructorId}`
    );
    return response.data;
  },
});

export default createUserApi;
