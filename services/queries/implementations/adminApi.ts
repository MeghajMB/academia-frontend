// src/services/queries/adminApi.ts
import { AxiosInstance } from "axios";
import {
  BlockResponseDTO,
  BlockResponseSchema,
  CategoryResponseDTO,
  CategoryResponseSchema,
  CourseReviewRequestResponseDTO,
  CourseReviewRequestResponseSchema,
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
  VerificationRequestResponseDTO,
  VerificationRequestResponseSchema,
} from "@/shared/index";
import { handleApiError } from "@/util/handle-api-error";

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
      const response = await axiosInstance.get("/api/admin/get-users", {
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
      const response = await axiosInstance.get("/api/admin/get-courses", {
        params: { page, search },
      });
      const result = GetAdminCoursesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  blockCourseApi: async (
    courseId: string
  ): Promise<BlockResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/block-course/${courseId}`
      );
      const result = BlockResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  blockUserApi: async (
    userId: string
  ): Promise<BlockResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/block-user/${userId}`
      );
      const result = BlockResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  rejectInstructorRequestApi: async (
    rejectReason: string,
    userId: string
  ): Promise<VerificationRequestResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `/api/admin/instructor-request/reject`,
        {
          rejectReason,
          userId,
        }
      );
      const result = VerificationRequestResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  approveInstructorRequestApi: async (
    userId: string
  ): Promise<VerificationRequestResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/instructor-request/approve`,
        {
          userId,
        }
      );
      const result = VerificationRequestResponseSchema.parse(response.data);
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
        `/api/admin/instructor-requests`,
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
      const response = await axiosInstance.get(`/api/admin/get-categories`, {
        params: { page },
      });
      const result = GetCategoriesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createCategoryApi: async (category: {
    name: string;
    description: string;
  }): Promise<CategoryResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        "/api/admin/create-category",
        category
      );
      console.log('inside the response')
      const result = CategoryResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      console.log("inside the error block")
      return handleApiError(error);
    }
  },

  editCategoryApi: async (
    category: { name: string; description: string },
    categoryId: string
  ): Promise<CategoryResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/admin/edit-category", {
        category,
        categoryId,
      });
      const result = CategoryResponseSchema.parse(response.data);
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
        `/api/admin/course-review-requests`,
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
  ): Promise<CourseReviewRequestResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/course-review-requests/reject`,
        {
          rejectReason,
          courseId,
        }
      );
      const result = CourseReviewRequestResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  approveCourseRequestApi: async (
    courseId: string
  ): Promise<CourseReviewRequestResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/course-review-requests/approve`,
        {
          courseId,
        }
      );
      const result = CourseReviewRequestResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createAdminApi;
