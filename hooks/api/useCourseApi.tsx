import createCourseApi from "@/services/courseApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useCourseApi() {
  const axiosPrivate = useAxiosPrivate();
  const courseApi = createCourseApi(axiosPrivate);

  return courseApi;
}
