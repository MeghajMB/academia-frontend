import createAuthApi from "@/services/authApi";
//import { customAxios } from "@/api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useAuthApi() {
  const axiosPrivate = useAxiosPrivate();
  const authApi = createAuthApi(axiosPrivate);

  return authApi;
}
