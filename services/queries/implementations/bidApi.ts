import {
  ErrorResponseDTO,
  PlaceBidResponseDTO,
  PlaceBidResponseSchema,
} from "@/shared";
import { handleApiError } from "@/util/handle-api-error";
import { AxiosInstance } from "axios";

const createBidApi = (axiosInstance: AxiosInstance) => ({
  CreateBidApi: async (
    gigId: string,
    bidAmt: number
  ): Promise<PlaceBidResponseDTO | ErrorResponseDTO> => {
    try {
      const response = await axiosInstance.post(`/api/bid/create`, {
        gigId,
        bidAmt,
      });
      const result = PlaceBidResponseSchema.parse(response.data);
      return result;
    } catch (error) {
      return handleApiError(error);
    }
  },
});
export default createBidApi;
