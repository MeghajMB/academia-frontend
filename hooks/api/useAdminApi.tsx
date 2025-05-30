import createAdminApi from "@/services/queries/implementations/adminApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useAdminApi() {
  const axiosPrivate = useAxiosPrivate();
  const adminApi = createAdminApi(axiosPrivate);

  return adminApi;
}
