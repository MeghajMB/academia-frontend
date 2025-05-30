import {
  CreateGigResponseDTO,
  CreateGigResponseSchema,
  ErrorResponseDTO,
  GetActiveGigsOfInstructorResponseDTO,
  GetActiveGigsOfInstructorResponseSchema,
  GetActiveGigsResponseDTO,
  GetActiveGigsResponseSchema,
  GetGigByIdResponseDTO,
  GetGigByIdResponseSchema,
  GetGigsOfInstructorResponseDTO,
  GetGigsOfInstructorResponseSchema,
  GetSessionsOfUserResponseDTO,
  GetSessionsOfUserResponseSchema,
} from "@academia-dev/common";
import { ICreateGigDTO } from "@/types/gig";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/gig";

const createGigApi = (axiosInstance: AxiosInstance) => ({
  createGigApi: async (
    data: ICreateGigDTO
  ): Promise<CreateGigResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/create`, data);
      const result = CreateGigResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllActiveGigApi: async (): Promise<
    GetActiveGigsResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/active`);
      const result = GetActiveGigsResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getGigByIdApi: async (
    gigId: string
  ): Promise<GetGigByIdResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/id/${gigId}`);
      const result = GetGigByIdResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getActiveGigOfInstructorApi: async (
    instructorId: string
  ): Promise<GetActiveGigsOfInstructorResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(
        `${BASE_PATH}/active/${instructorId}`
      );
      const result = GetActiveGigsOfInstructorResponseSchema.parse(
        response.data
      );
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getGigsOfInstructorApi: async ({
    sort,
    status,
    page,
    search,
  }: {
    sort?: string;
    status: "active" | "expired" | "completed" | "no-bids" | "missed";
    page: number;
    search?: string;
  }): Promise<GetGigsOfInstructorResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/all`, {
        params: { sort, status, page, search },
      });
      const result = GetGigsOfInstructorResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getSessionsOfUserApi: async ({
    status,
    page,
    search,
  }: {
    status: "scheduled" | "in-progress" | "completed" | "missed" | "all";
    page: number;
    search?: string;
  }): Promise<GetSessionsOfUserResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/session/all`, {
        params: { status, page, search },
      });
      const result = GetSessionsOfUserResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createGigApi;
