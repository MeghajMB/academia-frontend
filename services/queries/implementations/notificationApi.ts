import { AxiosInstance } from "axios";

const createNotificationApi = (axiosInstance: AxiosInstance) => ({
  fetchUnreadNotificationApi: async (userId: string) => {
    const response = await axiosInstance.get(
      `/api/notification/unread/${userId}`
    );
    return response.data;
  },
  markNotificationAsReadApi: async (notificationId: string) => {
    const response = await axiosInstance.patch(
      `/api/notification/mark-read/${notificationId}`
    );
    return response.data;
  },
  markAllNotificationAsReadApi: async () => {
    const response = await axiosInstance.patch(
      `/api/notification/mark-read`
    );
    return response.data;
  },
});

export default createNotificationApi;
