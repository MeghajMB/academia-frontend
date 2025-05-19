import { ErrorResponseDTO, NullResponseDTO } from "@academia-dev/common";
import { AxiosInstance } from "axios";

const BASE_PATH = "/api/notification";

const createNotificationApi = (axiosInstance: AxiosInstance) => ({
  fetchUnreadNotificationApi: async (userId: string) => {
    const response = await axiosInstance.get(`${BASE_PATH}/unread/${userId}`);
    return response.data;
  },
  markNotificationAsReadApi: async (notificationId: string) => {
    const response = await axiosInstance.patch(
      `${BASE_PATH}/mark-read/${notificationId}`
    );
    return response.data;
  },
  markAllNotificationAsReadApi: async (): Promise<
    NullResponseDTO | ErrorResponseDTO
  > => {
    const response = await axiosInstance.patch(`${BASE_PATH}/mark-read`);
    return response.data;
  },
});

export default createNotificationApi;
