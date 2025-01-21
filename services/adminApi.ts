import { AxiosInstance } from "axios";

const createAdminApi = (axiosInstance: AxiosInstance) => ({

  fetchUsersApi: async (role: string, page: number ) => {
    const response = await axiosInstance.get("/api/admin/get-users", {
        params: {
          role,
          page,
        },
      });
    return response.data;
  },

  blockUserApi: async (userId:string) => {
    const response =await axiosInstance.put(`/api/admin/block-user/${userId}`);
    return response.data;
  },
  fetchInstructorRequestsApi: async (page:number) => {
    const response =await axiosInstance.get(`/api/admin/instructor-requests`,{
      params:{
        page
      }
    });
    return response.data;
  },
  
});

export default createAdminApi;