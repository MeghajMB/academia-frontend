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
} from "@academia-dev/common";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/coin";

const coinApi = (axiosInstance: AxiosInstance) => ({
  fetchCoinConfigApi: async (): Promise<
    GetCoinConfigResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/config`);
      const result = GetCoinConfigResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  fetchCoinPackagesApi: async (): Promise<
    GetPackagesResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/packages`);
      const result = GetPackagesResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  updateCoinRatioApi: async (payload: {
    goldToINRRatio: number;
    redeemPointsToGoldRatio: number;
  }): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.put(
        `${BASE_PATH}/config/ratios`,
        payload
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createCoinPackageApi: async (payload: {
    coinAmount: number;
    priceInINR: number;
  }): Promise<CreateCoinPackageResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/package`, payload);
      const result = CreateCoinPackageResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateCoinPackageApi: async (payload: {
    id:string,
    coinAmount: number;
    priceInINR: number;
  }): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const {id,...data}=payload
      const response = await axiosInstance.put(`${BASE_PATH}/package/${id}`, data);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteCoinPackageApi: async (
    packageId: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_PATH}/package/${packageId}`
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default coinApi;
