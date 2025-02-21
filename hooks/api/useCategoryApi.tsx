import createCategoryApi from "@/services/categoryApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useCategoryApi() {
  const axiosPrivate = useAxiosPrivate();
  const categoryApi = createCategoryApi(axiosPrivate);

  return categoryApi;
}
