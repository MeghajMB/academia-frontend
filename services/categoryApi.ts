
import { AxiosInstance } from "axios";

const createCategoryApi = (axiosInstance: AxiosInstance) => ({
  
  fetchCategoriesApi: async () => {
    const response = await axiosInstance.get("/api/category/all");
    return response.data;
  }

});

export default createCategoryApi;
