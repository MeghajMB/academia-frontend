import { AxiosInstance } from "axios";
import { GeneratePutSignedUrlPayload } from "../types/file.types";
import {
  ErrorResponseDTO,
  GenerateGetSignedUrlResponseDTO,
  GenerateGetSignedUrlResponseSchema,
  GeneratePutSignedUrlResponseDTO,
  GeneratePutSignedUrlResponseSchema,
} from "@academia-dev/common";
import { handleApiError } from "@/util/handle-api-error";

const BASE_PATH = "/api/files";

const createfileApi = (axiosInstance: AxiosInstance) => ({
  generatePutSignedUrlApi: async (
    payload: GeneratePutSignedUrlPayload
  ): Promise<GeneratePutSignedUrlResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_PATH}/generate-put-signed-url`,
        payload
      );
      const result = GeneratePutSignedUrlResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
  generateGetSignedUrlApi: async (
    key: string
  ): Promise<GenerateGetSignedUrlResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(
        `${BASE_PATH}/generate-get-signed-url`,
        { key }
      );
      const result = GenerateGetSignedUrlResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});

export default createfileApi;
