import createInstructorApi from "@/services/queries/implementations/instructorApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useInstructorApi() {
  const axiosPrivate = useAxiosPrivate();
  const instructorApi = createInstructorApi(axiosPrivate);

  return instructorApi;
}