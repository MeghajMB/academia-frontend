import { ICreateGigDTO } from "@/types/gig";
import axios, { AxiosInstance } from "axios";

const createGigApi = (axiosInstance: AxiosInstance) => ({
  createGigApi: async (data: ICreateGigDTO) => {
    try {
      const response = await axiosInstance.post("/api/gig/create", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw (
          error.response?.data?.errors || "An unexpected API error occurred"
        );
      } else {
        throw "An unexpected error occurred";
      }
    }
  },

  getAllActiveGigApi: async () => {
    const response = await axiosInstance.get("/api/gig/active");
    return response.data;
  },
  getGigByIdApi: async (gigId: string) => {
    const response = await axiosInstance.get(`/api/gig/id/${gigId}`);
    return response.data;
  },
  getActiveGigOfInstructorApi: async (instructorId: string) => {
    const response = await axiosInstance.get(`/api/gig/active/${instructorId}`);
    return response.data;
  },
  CreateBidApi: async (gigId: string, bidAmt: number) => {
    const response = await axiosInstance.post(`/api/bid/create`, {
      gigId,
      bidAmt,
    });
    return response.data;
  },
});

export default createGigApi;
