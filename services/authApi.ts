import { AxiosInstance } from "axios";

const createAuthApi = (axiosInstance: AxiosInstance) => ({
  verifyOtpApi: async (otp: string, email: string) => {
    const response = await axiosInstance.post("/api/auth/verify-otp", {
      otp,
      email,
    });
    return response.data;
  },
  registerInstructor: async (
    instructorData: {
    headline: string;
    biography: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    website: string;
    agreement: boolean;
  }) => {
    const response = await axiosInstance.post("/api/auth/register-instructor", {
      instructorData,
    });
    return response.data;
  },
  resendOtpApi: async (email: string) => {
    const response = await axiosInstance.post("/api/auth/resend-otp", {
      email,
    });
    return response.data;
  },
  logoutApi: async () => {
    const response = await axiosInstance.post("/api/auth/signout");
    return response.data;
  },
});

export default createAuthApi;
