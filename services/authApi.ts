import { AxiosInstance } from "axios";

const createAuthApi = (axiosInstance: AxiosInstance) => ({
  verifyOtp: async (otp: string, email: string) => {
    const response = await axiosInstance.post("/api/auth/verify-otp", {
      otp,
      email,
    });
    return response.data;
  },
  resendOtp: async (email: string) => {
    const response = await axiosInstance.post("/api/auth/resend-otp", {
      email,
    });
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
  },
});

export default createAuthApi;
