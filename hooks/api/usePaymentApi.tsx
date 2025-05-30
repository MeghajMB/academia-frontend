import createPaymentApi from "@/services/queries/implementations/paymentApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function usePaymentApi() {
  const axiosPrivate = useAxiosPrivate();
  const paymentApi = createPaymentApi(axiosPrivate);

  return paymentApi;
}
