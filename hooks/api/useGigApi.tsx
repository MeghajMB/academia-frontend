import createGigApi from "@/services/gigApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useGigApi() {
  const axiosPrivate = useAxiosPrivate();
  const gigApi = createGigApi(axiosPrivate);

  return gigApi;
}
