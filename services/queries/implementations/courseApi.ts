import { handleApiError } from "@/util/handle-api-error";
import {
  AddLectureResponseDTO,
  AddLectureResponseSchema,
  AddSectionResponseDTO,
  AddSectionResponseSchema,
  ChangeOrderOfLectureResponseDTO,
  ChangeOrderOfLectureResponseSchema,
  CreateCourseResponseDTO,
  CreateCourseResponseSchema,
  DeleteLectureResponseDTO,
  DeleteLectureResponseSchema,
  DeleteSectionResponseDTO,
  DeleteSectionResponseSchema,
  EditCourseCreationDetailsResponseDTO,
  EditCourseCreationDetailsResponseSchema,
  EditLectureResponseDTO,
  EditLectureResponseSchema,
  EditSectionResponseDTO,
  EditSectionResponseSchema,
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
  ListCourseResponseDTO,
  ListCourseResponseSchema,
  MarkLectureAsCompletedResponseDTO,
  MarkLectureAsCompletedResponseSchema,
  SubmitCourseForReviewResponseDTO,
  SubmitCourseForReviewResponseSchema,
} from "@/shared/index";
import { AxiosInstance } from "axios";

const BASE_COURSE_PATH = "/api/courses";

const createCourseApi = (axiosInstance: AxiosInstance) => ({
  fetchEnrolledCoursesApi: async (): Promise<
    GetEnrolledCoursesOfUserResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(
        `${BASE_COURSE_PATH}/enrolled-courses`
      );
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
        `${BASE_COURSE_PATH}/analytics/${courseId}`,
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
        `${BASE_COURSE_PATH}/create-course/${courseId}`
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
  ): Promise<EditCourseCreationDetailsResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_COURSE_PATH}/edit-course/${courseId}`,
        courseDetails
      );
      const result = EditCourseCreationDetailsResponseSchema.parse(
        response.data
      );
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
        `${BASE_COURSE_PATH}/${courseId}/curriculum?status=${status}`
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
  ): Promise<MarkLectureAsCompletedResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_COURSE_PATH}/lectures/${lectureId}/complete`,
        {
          courseId,
        }
      );
      const result = MarkLectureAsCompletedResponseSchema.parse(response.data);
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
        `${BASE_COURSE_PATH}/course-details/${courseId}`
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
      const response = await axiosInstance.get(`${BASE_COURSE_PATH}/new`);
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
      const response = await axiosInstance.get(`${BASE_COURSE_PATH}`, {
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
      const response = await axiosInstance.post(
        `${BASE_COURSE_PATH}/lectures`,
        {
          courseId,
          sectionId,
          lectureData,
        }
      );
      const result = AddLectureResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  editlecture: async (
    lectureId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ): Promise<EditLectureResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_COURSE_PATH}/lectures/${lectureId}`,
        { lectureData }
      );
      const result = EditLectureResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteLecture: async (
    lectureId: string
  ): Promise<DeleteLectureResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_COURSE_PATH}/lectures/${lectureId}`
      );
      const result = DeleteLectureResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  editSectionApi: async (
    sectionId: string,
    sectionData: { title: string; description: string }
  ): Promise<EditSectionResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_COURSE_PATH}/sections/${sectionId}`,
        sectionData
      );
      const result = EditSectionResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteSectionApi: async (
    sectionId: string
  ): Promise<DeleteSectionResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_COURSE_PATH}/sections/${sectionId}`
      );
      const result = DeleteSectionResponseSchema.parse(response.data);
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
      const response = await axiosInstance.post(
        `${BASE_COURSE_PATH}/sections`,
        {
          section,
          courseId,
        }
      );
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
        `${BASE_COURSE_PATH}/lectures/url/${courseId}/${lectureId}`
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
  ): Promise<ChangeOrderOfLectureResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_COURSE_PATH}/lectures/order`,
        {
          draggedLectureId,
          targetLectureId,
        }
      );
      const result = ChangeOrderOfLectureResponseSchema.parse(response.data);
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
      const response = await axiosInstance.post(
        `${BASE_COURSE_PATH}`,
        courseDetails
      );
      const result = CreateCourseResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  submitCourseForReview: async (
    courseId: string
  ): Promise<SubmitCourseForReviewResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_COURSE_PATH}/${courseId}/submit-review`
      );
      const result = SubmitCourseForReviewResponseSchema.parse(response.data);
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
        `${BASE_COURSE_PATH}/instructor/${instructorId}?status=${status}`
      );
      const result = GetCoursesOfInstructorResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  listCourseApi: async (
    courseId: string
  ): Promise<ListCourseResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.patch(
        `${BASE_COURSE_PATH}/${courseId}/publish`
      );
      const result = ListCourseResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createCourseApi;
