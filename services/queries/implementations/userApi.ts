import { ErrorResponseDTO } from "@/shared";
import {
  GetInstructorProfileResponseDTO,
  GetInstructorProfileResponseSchema,
} from "@/shared/shared-dtos/user.dto";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createUserApi = (axiosInstance: AxiosInstance) => ({
  fetchUserProfileApi: async (userId: string) => {
    const response = await axiosInstance.get(`/api/user/profile/${userId}`);
    return response.data;
  },
  fetchInstructorProfileApi: async (
    instructorId: string
  ): Promise<GetInstructorProfileResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `/api/user/instructor-profile/${instructorId}`
      );
      const result = GetInstructorProfileResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createUserApi;
