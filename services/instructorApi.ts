import { AxiosInstance } from "axios";

const createInstructorApi = (axiosInstance: AxiosInstance) => ({

  fetchUInstructorProfileApi: async () => {
    const response = await axiosInstance.get("/api/instructor/profile")
    return response.data;
  },
  createCourseLandingPage:async(courseDetails:{category:string,image:string,description:string,price:number,subtitle:string,title:string,video:string})=>{
    const response = await axiosInstance.post("/api/instructor/create-course",courseDetails)
    return response.data;
  }
  
});

export default createInstructorApi;