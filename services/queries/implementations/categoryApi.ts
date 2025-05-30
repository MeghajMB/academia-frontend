import {
  CategoryResponseDTO,
  CategoryResponseSchema,
  ErrorResponseDTO,
  GetAllCategoriesDTO,
  GetAllCategoriesSchema,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/category";

const createCategoryApi = (axiosInstance: AxiosInstance) => ({
  fetchCategoriesApi: async (): Promise<
    GetAllCategoriesDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/all`);
      const result = GetAllCategoriesSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  createCategoryApi: async (category: {
    name: string;
    description: string;
  }): Promise<CategoryResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}`, category);
      const result = CategoryResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  blockCategoryApi: async (
    id: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(`${BASE_PATH}/block/${id}`);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  editCategoryApi: async (
    category: { name: string; description: string },
    categoryId: string
  ): Promise<CategoryResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(`${BASE_PATH}/${categoryId}`, {
        category,
      });
      const result = CategoryResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createCategoryApi;
