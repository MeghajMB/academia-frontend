import { AxiosInstance } from "axios";

const createfileApi = (axiosInstance: AxiosInstance) => ({
  generatePutSignedUrlApi: async (key:string,contentType:string,isPublic:boolean) => {
    const response = await axiosInstance.post("/api/files/generate-put-signed-url",{key,contentType,isPublic});
    return response.data;
  },
  generateGetSignedUrlApi: async (key:string) => {
    const response = await axiosInstance.post("/api/files/generate-get-signed-url",{key});
    return response.data;
  },
});

export default createfileApi;
