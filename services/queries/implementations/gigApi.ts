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
} from "@/shared";
import { ICreateGigDTO } from "@/types/gig";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createGigApi = (axiosInstance: AxiosInstance) => ({
  createGigApi: async (
    data: ICreateGigDTO
  ): Promise<CreateGigResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/gig/create", data);
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
      const response = await axiosInstance.get("/api/gig/active");
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
      const response = await axiosInstance.get(`/api/gig/id/${gigId}`);
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
        `/api/gig/active/${instructorId}`
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
      const response = await axiosInstance.get(`/api/gig/all`, {
        params: { sort, status, page, search },
      });
      const result = GetGigsOfInstructorResponseSchema.parse(
        response.data
      );
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createGigApi;
