import { IReviewRequests } from "@/app/admin/review-courses/page";
import { AxiosInstance } from "axios";

const createAdminApi = (axiosInstance: AxiosInstance) => ({

  fetchUsersApi: async (role: string, page: number,search?:string) => {
    const response = await axiosInstance.get("/api/admin/get-users", {
      params: {
        role,
        page,
        search
      },
    });
    return response.data;
  },

  blockUserApi: async (userId: string) => {
    const response = await axiosInstance.put(`/api/admin/block-user/${userId}`);
    return response.data;
  },

  rejectInstructorRequestApi: async (rejectReason: string, userId: string) => {
    const response = await axiosInstance.post(
      `/api/admin/instructor-request/reject`,
      {
        rejectReason,
        userId,
      }
    );
    return response.data;
  },

  approveInstructorRequestApi: async (userId: string) => {
    const response = await axiosInstance.put(
      `/api/admin/instructor-request/approve`,
      { userId }
    );
    return response.data;
  },

  fetchInstructorRequestsApi: async (page: number) => {
    const response = await axiosInstance.get(`/api/admin/instructor-requests`, {
      params: {
        page,
      },
    });
    return response.data;
  },

  createCategoryApi: async (category: {
    name: string;
    description: string;
  }) => {
    const response = await axiosInstance.post("/api/admin/create-category", {
      category,
    });
    return response.data;
  },

  editCategoryApi: async (
    category: { name: string; description: string },
    categoryId: string
  ) => {
    const response = await axiosInstance.post("/api/admin/edit-category", {
      category,
      categoryId,
    });
    return response.data;
  },

  fetchCoursesForReview: async (
    page: number
  ): Promise<{
    reviewRequests: IReviewRequests[];
    pagination: {
      currentPage: number;
      limit: number;
      totalDocuments: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get(
      `/api/admin/course-review-requests`,
      {
        params: {
          page,
        },
      }
    );
    return response.data;
  },

  rejectCourseRequestApi: async (rejectReason: string, courseId: string) => {
    const response = await axiosInstance.put(
      `/api/admin/course-review-requests/reject`,
      {
        rejectReason,
        courseId,
      }
    );
    return response.data;
  },
  approveCourseRequestApi: async (courseId: string) => {
    const response = await axiosInstance.put(
      `/api/admin/course-review-requests/approve`,
      {
        courseId,
      }
    );
    return response.data;
  },

});

export default createAdminApi;
