import {
  CreateCoinPackageResponseDTO,
  CreateCoinPackageResponseSchema,
  ErrorResponseDTO,
  GetCoinConfigResponseDTO,
  GetCoinConfigResponseSchema,
  GetPackagesResponseDTO,
  GetPackagesResponseSchema,
  NullResponseDTO,
  NullResponseSchema,
} from "@/shared";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const coinApi = (axiosInstance: AxiosInstance) => ({
  fetchCoinConfig: async (): Promise<
    GetCoinConfigResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get("/api/coin/config");
      const result = GetCoinConfigResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCoinPackages: async (): Promise<
    GetPackagesResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get("/api/coin/packages");
      const result = GetPackagesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  updateCoinRatio: async (payload: {
    goldToINRRatio: number;
    redeemCoinToGoldRatio: number;
  }): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        "/api/coin/config/ratios",
        payload
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createCoinPackage: async (payload: {
    coinAmount: number;
    priceInINR: number;
  }): Promise<CreateCoinPackageResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/coin/package", payload);
      const result = CreateCoinPackageResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateCoinPackage: async (payload: {
    id:string,
    coinAmount: number;
    priceInINR: number;
  }): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const {id,...data}=payload
      const response = await axiosInstance.put(`/api/coin/package/${id}`, data);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteCoinPackage: async (
    packageId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `/api/coin/package/${packageId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default coinApi;
