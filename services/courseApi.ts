import { AxiosInstance } from "axios";

const createCourseApi = (axiosInstance: AxiosInstance) => ({

  fetchCurriculum: async (courseId: string) => {
    const response = await axiosInstance.get(
      `/api/course/curriculum/${courseId}`
    );
    return response.data;
  }
});

export default createCourseApi;
