import createUserApi from "@/services/userApi";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useUserApi() {
  const axiosPrivate = useAxiosPrivate();
  const userApi = createUserApi(axiosPrivate);

  return userApi;
}