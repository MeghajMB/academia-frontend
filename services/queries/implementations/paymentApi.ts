import { AxiosInstance } from "axios";

const createPaymetApi = (axiosInstance: AxiosInstance) => ({
  createOrderApi: async (itemId: string, type: string) => {
    const response = await axiosInstance.post("/api/payment/order", {
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
    const response = await axiosInstance.post("/api/payment/success", {
      razorpayDetails,
      paymentDetails,
    });
    return response.data;
  },
});

export default createPaymetApi;
