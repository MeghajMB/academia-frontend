// src/services/queries/authApi.ts
import {
  ErrorResponseDTO,
  ForgotPasswordResponseDTO,
  ForgotPasswordResponseSchema,
  RegisterInstructorResponseDTO,
  RegisterInstructorResponseSchema,
  ResendOtpResponseDTO,
  ResendOtpResponseSchema,
  ResetPasswordResponseDTO,
  ResetPasswordResponseSchema,
  SignInResponseDTO,
  SignInResponseSchema,
  SignOutResponseDTO,
  SignOutResponseSchema,
  VerifyOtpResponseDTO,
  VerifyOtpResponseSchema,
  VerifyResetOtpResponseDTO,
  VerifyResetOtpResponseSchema,
} from "@/shared/index";
import axios, { AxiosInstance } from "axios";
import {
  InstructorPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";
import { handleApiError } from "@/util/handle-api-error";

const createAuthApi = (axiosInstance: AxiosInstance) => ({

  signInApi: async (
    payload: {email:string,password:string}
  ): Promise<SignInResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/auth/signin", payload);
      const result = SignInResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  verifyOtpApi: async (
    data: VerifyOtpPayload
  ): Promise<VerifyOtpResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/auth/verify-otp", data);
      const result = VerifyOtpResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  registerInstructorApi: async (
    instructorData: InstructorPayload
  ): Promise<RegisterInstructorResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/register-instructor",
        instructorData
      );
      const result = RegisterInstructorResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  resendOtpApi: async (
    email: string
  ): Promise<ResendOtpResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/auth/resend-otp", {
        email,
      });
      const result = ResendOtpResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  forgotPasswordApi: async (
    email: string
  ): Promise<ForgotPasswordResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });
      const result = ForgotPasswordResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  verifyResetPasswordApi: async (data: {
    email: string;
    otp: string;
  }): Promise<VerifyResetOtpResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/verify-reset-password",
        data
      );
      const result = VerifyResetOtpResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  resetPasswordApi: async (
    data: ResetPasswordPayload
  ): Promise<ResetPasswordResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axios.post("/api/auth/reset-password", data);
      const result = ResetPasswordResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  logoutApi: async (): Promise<SignOutResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post("/api/auth/signout");
      const result = SignOutResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createAuthApi;
