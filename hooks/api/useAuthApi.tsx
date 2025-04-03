import createAuthApi from "@/services/queries/implementations/authApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useAuthApi() {
  const axiosPrivate = useAxiosPrivate();
  const authApi = createAuthApi(axiosPrivate);

  return authApi;
}
