import { AxiosInstance } from "axios";

const createInstructorApi = (axiosInstance: AxiosInstance) => ({

  fetchInstructorProfileApi: async () => {
    const response = await axiosInstance.get("/api/instructor/profile")
    return response.data;
  },
  createCourseLandingPage:async(courseDetails:{category:string,image:string,description:string,price:number,subtitle:string,title:string,video:string})=>{
    const response = await axiosInstance.post("/api/instructor/create-course",courseDetails)
    return response.data;
  },
  createCourseSection:async (courseId:string,section:{title:string,description:string})=>{
    const response = await axiosInstance.post(
      `/api/instructor/create-section`,{section,courseId});
    return response.data;   
  },
  createCourseLecture:async (courseId:string,lecture:{title:string,content:string})=>{
    const response = await axiosInstance.post(
      `/api/instructor/create-lecture/${courseId}`,lecture);
    return response.data;   
  },
  reorderCurriculum:async (courseId:string,lecture:{title:string,content:string})=>{
    const response = await axiosInstance.post(
      `/api/instructor/create-lecture/${courseId}`,lecture);
    return response.data;   
  }
  
});

export default createInstructorApi;