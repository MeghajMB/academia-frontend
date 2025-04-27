import createCategoryApi from "@/services/queries/implementations/categoryApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useCategoryApi() {
  const axiosPrivate = useAxiosPrivate();
  const categoryApi = createCategoryApi(axiosPrivate);

  return categoryApi;
}
