import { AxiosInstance } from "axios";

const createCourseApi = (axiosInstance: AxiosInstance) => ({

  fetchCurriculum: async (courseId: string) => {
    const response = await axiosInstance.get(
      `/api/course/curriculum/${courseId}`
    );
    return response.data;
  },

  addLecture: async (
    courseId: string,
    sectionId: string,
    lectureData: { title: string; content: string }
  ) => {
    const response = await axiosInstance.post(`/api/course/add-lecture`, {
      courseId,
      sectionId,
      lectureData,
    });
    return response.data;
  },
  
  previewLecture: async (
    courseId: string,
    sectionId: string,
    lectureId: string
  ): Promise<{ url: string }> => {
    const response = await axiosInstance.get(
      `/api/course/preview/get-lecture-url/${courseId}/${sectionId}/${lectureId}`
    );
    return response.data;
  },
  submitCourseForReview: async (
    courseId: string
  ): Promise<{ url: string }> => {
    const response = await axiosInstance.patch(
      `/api/course/${courseId}/submit-review`
    );
    return response.data;
  },

  fetchCourseOfInstructor: async (
    instructorId: string,
    status: string
  ): Promise<unknown> => {
    const response = await axiosInstance.get(
      `/api/course/${instructorId}?status=${status}`
    );
    return response.data;
  },

});

export default createCourseApi;
