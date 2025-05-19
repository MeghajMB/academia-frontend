import {
  ErrorResponseDTO,
  NullResponseDTO,
  NullResponseSchema,
} from "@academia-dev/common";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/bid";

const createBidApi = (axiosInstance: AxiosInstance) => ({
  CreateBidApi: async (
    gigId: string,
    bidAmt: number
  ): Promise<NullResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`${BASE_PATH}/create`, {
        gigId,
        bidAmt,
      });
      const result = NullResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});
export default createBidApi;
