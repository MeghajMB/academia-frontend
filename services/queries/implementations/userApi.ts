import { handleApiError } from "@/util/handle-api-error";
import {
  ErrorResponseDTO,
  GetInstructorProfileResponseDTO,
  GetInstructorProfileResponseSchema,
  GetProfileResponseDTO,
  GetProfileResponseSchema,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/user";

const createUserApi = (axiosInstance: AxiosInstance) => ({
  updateUserProfile: async (payload: {
    imageurl: string | null;
    headLine: string;
    name: string;
  }) => {
    try {
      const response = await axiosInstance.put(`${BASE_PATH}/profile`, payload);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  blockUserApi: async (
    userId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(`${BASE_PATH}/block/${userId}`);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchUserProfileApi: async (
    userId: string
  ): Promise<GetProfileResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/profile/${userId}`
      );
      const result = GetProfileResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  fetchInstructorProfileApi: async (
    instructorId: string
  ): Promise<GetInstructorProfileResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/instructor-profile/${instructorId}`
      );
      const result = GetInstructorProfileResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createUserApi;
