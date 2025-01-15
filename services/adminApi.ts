import { AxiosInstance } from "axios";

const createAdminApi = (axiosInstance: AxiosInstance) => ({

  fetchUsers: async (role: string, page: number ) => {
    const response = await axiosInstance.get("/api/admin/get-users", {
        params: {
          role,
          page,
        },
      });
    return response.data;
  },

  blockUser: async (userId:string) => {
    const response =await axiosInstance.put(`/api/admin/block-user/${userId}`);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
  },
  
});

export default createAdminApi;