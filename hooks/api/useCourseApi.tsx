import createCourseApi from "@/services/queries/implementations/courseApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useCourseApi() {
  const axiosPrivate = useAxiosPrivate();
  const courseApi = createCourseApi(axiosPrivate);

  return courseApi;
}
