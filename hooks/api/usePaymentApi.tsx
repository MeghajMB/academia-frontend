import createPaymentApi from "@/services/paymentApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function usePaymentApi() {
  const axiosPrivate = useAxiosPrivate();
  const paymentApi = createPaymentApi(axiosPrivate);

  return paymentApi;
}
