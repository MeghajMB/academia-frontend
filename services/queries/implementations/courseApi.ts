import { handleApiError } from "@/util/handle-api-error";
import {
  AddLectureResponseDTO,
  AddLectureResponseSchema,
  AddSectionResponseDTO,
  AddSectionResponseSchema,
  CreateCourseResponseDTO,
  CreateCourseResponseSchema,
  ErrorResponseDTO,
  GenerateLectureUrlResponseDTO,
  GenerateLectureUrlResponseSchema,
  GetCourseAnalyticsResponseDTO,
  GetCourseAnalyticsResponseSchema,
  GetCourseCreationDetailsResponseDTO,
  GetCourseCreationDetailsResponseSchema,
  GetCourseDetailsResponseDTO,
  GetCourseDetailsResponseSchema,
  GetCoursesOfInstructorResponseDTO,
  GetCoursesOfInstructorResponseSchema,
  GetCoursesResponseDTO,
  GetCoursesResponseSchema,
  GetCurriculumResponseDTO,
  GetCurriculumResponseSchema,
  GetEnrolledCoursesOfUserResponseDTO,
  GetEnrolledCoursesOfUserResponseSchema,
  GetNewCoursesResponseDTO,
  GetNewCoursesResponseSchema,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/courses";

const createCourseApi = (axiosInstance: AxiosInstance) => ({
  blockCourseApi: async (
    courseId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/block/${courseId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchEnrolledCoursesApi: async (): Promise<
    GetEnrolledCoursesOfUserResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/enrolled-courses`);
      const result = GetEnrolledCoursesOfUserResponseSchema.parse(
        response.data
      );
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCourseAnalyticsApi: async (
    filter: "quarter" | "month" | "year",
    courseId: string
  ): Promise<GetCourseAnalyticsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/analytics/${courseId}`,
        { params: { filter } }
      );
      const result = GetCourseAnalyticsResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      console.log(error);
      return handleApiError(error);
    }
  },

  fetchCourseCreationDetailsApi: async (
    courseId: string
  ): Promise<GetCourseCreationDetailsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/create-course/${courseId}`
      );
      const result = GetCourseCreationDetailsResponseSchema.parse(
        response.data
      );
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  editCourseCreationDetailsApi: async (
    courseId: string,
    courseDetails: {
      category: string;
      imageThumbnail: string | null;
      description: string;
      price: number;
      subtitle: string;
      title: string;
      promotionalVideo: string | null;
    }
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/edit-course/${courseId}`,
        courseDetails
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCurriculum: async (
    courseId: string,
    status: "instructor" | "student" | "admin"
  ): Promise<GetCurriculumResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/${courseId}/curriculum?status=${status}`
      );
      const result = GetCurriculumResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  markLectureCompleted: async (
    courseId: string,
    lectureId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_PATH}/lectures/${lectureId}/complete`,
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

  fetchDetailsOfListedCourseApi: async (
    courseId: string
  ): Promise<GetCourseDetailsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/course-details/${courseId}`
      );
      const result = GetCourseDetailsResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchNewCoursesApi: async (): Promise<
    GetNewCoursesResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/new`);
      const result = GetNewCoursesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  fetchCoursesApi: async ({
    sort,
    category,
    page,
    search,
  }: {
    sort?: string;
    category?: string;
    page: number;
    search?: string;
  }): Promise<GetCoursesResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}`, {
        params: { sort, category, page, search },
      });
      const result = GetCoursesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  addLecture: async (
    courseId: string,
    sectionId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ): Promise<AddLectureResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/lectures`, {
        courseId,
        sectionId,
        lectureData,
      });
      const result = AddLectureResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  editlecture: async (
    lectureId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/lectures/${lectureId}`,
        { lectureData }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteLecture: async (
    lectureId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_PATH}/lectures/${lectureId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  editSectionApi: async (
    sectionId: string,
    sectionData: { title: string; description: string }
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/sections/${sectionId}`,
        sectionData
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteSectionApi: async (
    sectionId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_PATH}/sections/${sectionId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createCourseSection: async (
    courseId: string,
    section: { title: string; description: string }
  ): Promise<AddSectionResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/sections`, {
        section,
        courseId,
      });
      const result = AddSectionResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getLectureUrlApi: async (
    courseId: string,
    lectureId: string
  ): Promise<GenerateLectureUrlResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/lectures/url/${courseId}/${lectureId}`
      );
      const result = GenerateLectureUrlResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  changeOrderOfLectureApi: async (
    draggedLectureId: string,
    targetLectureId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(`${BASE_PATH}/lectures/order`, {
        draggedLectureId,
        targetLectureId,
      });
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createCourse: async (courseDetails: {
    category: string;
    imageThumbnail: string;
    description: string;
    price: number;
    subtitle: string;
    title: string;
    promotionalVideo: string;
  }): Promise<CreateCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}`, courseDetails);
      const result = CreateCourseResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  submitCourseForReview: async (
    courseId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_PATH}/${courseId}/submit-review`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCoursesOfInstructorWithStatus: async (
    instructorId: string,
    status: string
  ): Promise<GetCoursesOfInstructorResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/instructor/${instructorId}?status=${status}`
      );
      const result = GetCoursesOfInstructorResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  listCourseApi: async (
    courseId: string,
    scheduleDate: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_PATH}/${courseId}/publish`,
        { scheduleDate }
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createCourseApi;
