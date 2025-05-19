import { AxiosInstance } from "axios";
import { GetTransactionHistoryApiParams } from "../types/payment.types";
import { handleApiError } from "@/util/handle-api-error";
import {
  ErrorResponseDTO,
  GetTransactionHistoryResponseSchema,
  GetUserWalletResponseDTO,
  GetUserWalletResponseSchema,
} from "@academia-dev/common";

const BASE_PATH = "/api/payments";

const createPaymetApi = (axiosInstance: AxiosInstance) => ({
  getWalletApi: async (): Promise<
    GetUserWalletResponseDTO | ErrorResponseDTO
  > => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/wallet`);
      const result = GetUserWalletResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getTransactionHistoryApi: async (payload: GetTransactionHistoryApiParams) => {
    try {
      const response = await axiosInstance.get(`${BASE_PATH}/transaction`, {
        params: payload,
      });
      const result = GetTransactionHistoryResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  createOrderApi: async (itemId: string, type: string) => {
    const response = await axiosInstance.post(`${BASE_PATH}/order`, {
      itemId,
      type,
    });
    return response.data;
  },

  paymentSuccessApi: async (
    razorpayDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    paymentDetails: {
      itemId: string;
      paymentType: string;
      amount: number;
    }
  ) => {
    const response = await axiosInstance.post(`${BASE_PATH}/success`, {
      razorpayDetails,
      paymentDetails,
    });
    return response.data;
  },
});

export default createPaymetApi;
