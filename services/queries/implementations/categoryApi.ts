import { ErrorResponseDTO, GetAllCategoriesDTO, GetAllCategoriesSchema } from "@/shared";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createCategoryApi = (axiosInstance: AxiosInstance) => ({
  fetchCategoriesApi: async (): Promise<
    GetAllCategoriesDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get("/api/category/all");
      const result = GetAllCategoriesSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createCategoryApi;
