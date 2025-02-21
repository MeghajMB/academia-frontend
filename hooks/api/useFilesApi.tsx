import createFileApi from "@/services/fileApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useFilesApi() {
  const axiosPrivate = useAxiosPrivate();
  const fileApi = createFileApi(axiosPrivate);

  return fileApi;
}
