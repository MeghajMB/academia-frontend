import createNotificationApi from "@/services/notificationApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useNotificationApi() {
  const axiosPrivate = useAxiosPrivate();
  const notificationApi = createNotificationApi(axiosPrivate);

  return notificationApi;
}