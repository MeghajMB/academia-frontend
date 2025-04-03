import createNotificationApi from "@/services/queries/implementations/notificationApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useNotificationApi() {
  const axiosPrivate = useAxiosPrivate();
  const notificationApi = createNotificationApi(axiosPrivate);

  return notificationApi;
}