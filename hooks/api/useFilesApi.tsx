import createFileApi from "@/services/queries/implementations/fileApi";
import useAxiosPrivate from "../useAxiosPrivate";

export default function useFilesApi() {
  const axiosPrivate = useAxiosPrivate();
  const fileApi = createFileApi(axiosPrivate);

  return fileApi;
}
