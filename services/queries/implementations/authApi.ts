// src/services/queries/authApi.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import {
  VerifyOtpData,
  RegisterInstructorData,
  ResendOtpData,
  ForgotPasswordData,
  VerifyResetPasswordData,
  ResetPasswordData,
  LogoutData,
  InstructorData,
  ResetPasswordPayload,
  VerifyOtpParams,
} from "../types/auth.types"; // Adjust path as needed
import { ApiSuccessResponse, ApiErrorResponse, ApiResponse } from "@/types/api";

const createAuthApi = (axiosInstance: AxiosInstance) => ({
  verifyOtpApi: async ({
    email,
    otp,
  }: VerifyOtpParams): Promise<ApiResponse<VerifyOtpData>> => {
    try {
      const response = await axiosInstance.post("/api/auth/verify-otp", {
        email,
        otp,
      });
      return response.data as ApiSuccessResponse<VerifyOtpData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  registerInstructorApi: async (
    instructorData: InstructorData
  ): Promise<ApiResponse<RegisterInstructorData>> => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/register-instructor",
        instructorData
      );
      return response.data as ApiSuccessResponse<RegisterInstructorData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  resendOtpApi: async (email: string): Promise<ApiResponse<ResendOtpData>> => {
    try {
      const response = await axiosInstance.post("/api/auth/resend-otp", {
        email,
      });
      return response.data as ApiSuccessResponse<ResendOtpData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  forgotPasswordApi: async (
    email: string
  ): Promise<ApiResponse<ForgotPasswordData>> => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });
      return response.data as ApiSuccessResponse<ForgotPasswordData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  verifyResetPasswordApi: async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<ApiResponse<VerifyResetPasswordData>> => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/verify-reset-password",
        {
          email,
          otp,
        }
      );
      return response.data as ApiSuccessResponse<VerifyResetPasswordData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  resetPasswordApi: async ({
    email,
    password,
    token,
  }: ResetPasswordPayload): Promise<ApiResponse<ResetPasswordData>> => {
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        password,
        token,
      });
      return response.data as ApiSuccessResponse<ResetPasswordData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },

  logoutApi: async (): Promise<ApiResponse<LogoutData>> => {
    try {
      const response = await axiosInstance.post("/api/auth/signout");
      return response.data as ApiSuccessResponse<LogoutData>;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        status: "error",
        code: 0,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

export default createAuthApi;
