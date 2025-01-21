import createInstructorApi from "@/services/instructorApi";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useInstructorApi() {
  const axiosPrivate = useAxiosPrivate();
  const instructorApi = createInstructorApi(axiosPrivate);

  return instructorApi;
}