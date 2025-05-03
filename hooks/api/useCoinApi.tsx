
import coinApi from "@/services/queries/implementations/coinApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useCoinApi() {
  const axiosPrivate = useAxiosPrivate();
  const apis = coinApi(axiosPrivate);

  return apis;
}
