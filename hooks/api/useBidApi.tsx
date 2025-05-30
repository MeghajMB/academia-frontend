
import createBidApi from "@/services/queries/implementations/bidApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useBidApi() {
  const axiosPrivate = useAxiosPrivate();
  const bidApi = createBidApi(axiosPrivate);

  return bidApi;
}
