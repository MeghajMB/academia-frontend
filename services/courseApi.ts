import { ICourse, ICourseDetails } from "@/types/course";
import { AxiosInstance } from "axios";

const createCourseApi = (axiosInstance: AxiosInstance) => ({
  fetchEnrolledCoursesApi: async () => {
    const response = await axiosInstance.get(`/api/course/enrolled-courses`);
    return response.data;
  },

  fetchCourseCreationDetailsApi: async (courseId: string) => {
    const response = await axiosInstance.get(
      `/api/course/create-course/${courseId}`
    );
    return response.data;
  },
  
  editCourseCreationDetailsApi: async (courseId:string,courseDetails: {
    category: string;
    imageThumbnail: string | null;
    description: string;
    price: number;
    subtitle: string;
    title: string;
    promotionalVideo: string | null;
  }) => {
    const response = await axiosInstance.put(
      `/api/course/edit-course/${courseId}`,
      courseDetails
    );
    return response.data;
  },

  fetchCurriculum: async (
    courseId: string,
    status: "instructor" | "student" | "admin"
  ) => {
    const response = await axiosInstance.get(
      `/api/course/curriculum/${courseId}?status=${status}`
    );
    return response.data;
  },

  markLectureCompleted: async (courseId: string, lectureId: string) => {
    const response = await axiosInstance.post("/api/course/progress", {
      courseId,
      lectureId,
    });
    return response.data;
  },

  fetchDetailsOfListedCourseApi: async (
    courseId: string
  ): Promise<ICourseDetails> => {
    const response = await axiosInstance.get(
      `/api/course/course-details/${courseId}`
    );
    return response.data;
  },
  //
  fetchTopRatedCoursesApi: async () => {
    const response = await axiosInstance.get(`/api/course/top-rated`);
    return response.data;
  },
  //
  fetchNewCoursesApi: async () => {
    const response = await axiosInstance.get(`/api/course/new`);
    return response.data;
  },

  addLecture: async (
    courseId: string,
    sectionId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ) => {
    const response = await axiosInstance.post(`/api/course/add-lecture`, {
      courseId,
      sectionId,
      lectureData,
    });
    return response.data;
  },

  editlecture: async (
    lectureId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ) => {
    const response = await axiosInstance.put(`/api/course/edit-lecture`, {
      lectureId,
      lectureData,
    });
    return response.data;
  },

  deleteLecture: async (lectureId: string) => {
    const response = await axiosInstance.delete(
      `/api/course/delete-lecture/${lectureId}`
    );
    return response.data;
  },
  editSectionApi: async (
    sectionId: string,
    sectionData: { title: string; description:string }
  ) => {
    const response = await axiosInstance.put(`/api/course/edit-section`, {
      sectionId,
      sectionData,
    });
    return response.data;
  },

  deleteSectionApi: async (sectionId: string) => {
    const response = await axiosInstance.delete(
      `/api/course/delete-section/${sectionId}`
    );
    return response.data;
  },

  createCourseSection: async (
    courseId: string,
    section: { title: string; description: string }
  ) => {
    const response = await axiosInstance.post(`/api/course/create-section`, {
      section,
      courseId,
    });
    return response.data;
  },

  getLectureUrlApi: async (
    courseId: string,
    lectureId: string
  ): Promise<{ url: string }> => {
    const response = await axiosInstance.get(
      `/api/course/get-lecture-url/${courseId}/${lectureId}`
    );
    return response.data;
  },

  changeOrderOfLectureApi: async (
    draggedLectureId: string,
    targetLectureId: string
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.put(
      `/api/course/lectures/update-order`,
      {
        draggedLectureId,
        targetLectureId,
      }
    );
    return response.data;
  },

  createCourse: async (courseDetails: {
    category: string;
    imageThumbnail: string;
    description: string;
    price: number;
    subtitle: string;
    title: string;
    promotionalVideo: string;
  }) => {
    const response = await axiosInstance.post(
      "/api/course/create-course",
      courseDetails
    );
    return response.data;
  },

  submitCourseForReview: async (courseId: string): Promise<{ url: string }> => {
    const response = await axiosInstance.patch(
      `/api/course/${courseId}/submit-review`
    );
    return response.data;
  },

  fetchCoursesOfInstructorWithStatus: async (
    instructorId: string,
    status: string
  ): Promise<ICourse[]> => {
    const response = await axiosInstance.get(
      `/api/course/get/${instructorId}?status=${status}`
    );
    return response.data;
  },

  listCourseApi: async (courseId: string): Promise<unknown> => {
    const response = await axiosInstance.patch(`/api/course/${courseId}/list`);
    return response.data;
  },
});

export default createCourseApi;
