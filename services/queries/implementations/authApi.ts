import {
  ErrorResponseDTO,
  NullResponseDTO,
  NullResponseSchema,
  SignInResponseDTO,
  SignInResponseSchema,
  VerifyResetOtpResponseDTO,
  VerifyResetOtpResponseSchema,
} from "@academia-dev/common";
import axios, { AxiosInstance } from "axios";
import {
  InstructorPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";
import { handleApiError } from "@/util/handle-api-error";

const BASE_PATH = "/api/auth";

const createAuthApi = (axiosInstance: AxiosInstance) => ({

  signUpApi: async (
    payload: {name:string,email:string,password:string}
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/signup`, payload);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  signInApi: async (
    payload: {email:string,password:string}
  ): Promise<SignInResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/signin`, payload);
      const result = SignInResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  verifyOtpApi: async (
    data: VerifyOtpPayload
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/verify-otp`, data);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  registerInstructorApi: async (
    instructorData: InstructorPayload
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_PATH}/register-instructor`,
        instructorData
      );
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  resendOtpApi: async (
    email: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/resend-otp`, {
        email,
      });
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  forgotPasswordApi: async (
    email: string
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/forgot-password`, {
        email,
      });
      const result = NullResponseSchema.parse(response.data);
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
        `${BASE_PATH}/verify-reset-password`,
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
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axios.post(`${BASE_PATH}/reset-password`, data);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },

  logoutApi: async (): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/signout`);
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createAuthApi;
