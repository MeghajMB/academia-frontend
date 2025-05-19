// src/services/queries/adminApi.ts
import { AxiosInstance } from "axios";
import {
  ErrorResponseDTO,
  GetAdminCoursesResponseDTO,
  GetAdminCoursesResponseSchema,
  GetCategoriesResponseDTO,
  GetCategoriesResponseSchema,
  GetCourseReviewRequestsResponseDTO,
  GetCourseReviewRequestsResponseSchema,
  GetInstructorVerificationRequestsResponseDTO,
  GetInstructorVerificationRequestsResponseSchema,
  GetUsersResponseDTO,
  GetUsersResponseSchema,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { handleApiError } from "@/util/handle-api-error";

const BASE_PATH = "/api/admin";

const createAdminApi = (axiosInstance: AxiosInstance) => ({

  fetchUsersApi: async ({
    role,
    page,
    search,
  }: {
    role: string;
    page: number;
    search?: string;
  }): Promise<GetUsersResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/get-users`, {
        params: { role, page, search },
      });
      const result = GetUsersResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCoursesApi: async ({
    page,
    search,
  }: {
    page: number;
    search?: string;
  }): Promise<GetAdminCoursesResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/get-courses`, {
        params: { page, search },
      });
      const result = GetAdminCoursesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  rejectInstructorRequestApi: async (
    rejectReason: string,
    userId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_PATH}/instructor-request/reject`,
        {
          rejectReason,
          userId,
        }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  approveInstructorRequestApi: async (
    userId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/instructor-request/approve`,
        {
          userId,
        }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchInstructorRequestsApi: async (
    page: number
  ): Promise<GetInstructorVerificationRequestsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/instructor-requests`,
        {
          params: { page },
        }
      );
      const result = GetInstructorVerificationRequestsResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCategoriesApi: async (
    page: number
  ): Promise<GetCategoriesResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/get-categories`, {
        params: { page },
      });
      const result = GetCategoriesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCoursesForReviewApi: async (
    page: number
  ): Promise<GetCourseReviewRequestsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/course-review-requests`,
        {
          params: { page },
        }
      );
      const result = GetCourseReviewRequestsResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  rejectCourseRequestApi: async (
    rejectReason: string,
    courseId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/course-review-requests/reject`,
        {
          rejectReason,
          courseId,
        }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  approveCourseRequestApi: async (
    courseId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/course-review-requests/approve`,
        {
          courseId,
        }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createAdminApi;
