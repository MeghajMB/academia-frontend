import createReviewApi from "@/services/reviewApi"; 
import useAxiosPrivate from "../useAxiosPrivate";

export default function useReviewApi() {
  const axiosPrivate = useAxiosPrivate();
  const reviewApi = createReviewApi(axiosPrivate);

  return reviewApi;
}
