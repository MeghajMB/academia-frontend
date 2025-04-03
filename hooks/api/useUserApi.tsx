import createUserApi from "@/services/queries/implementations/userApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useUserApi() {
  const axiosPrivate = useAxiosPrivate();
  const userApi = createUserApi(axiosPrivate);

  return userApi;
}