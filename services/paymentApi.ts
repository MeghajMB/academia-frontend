import { AxiosInstance } from "axios";

const createPaymetApi = (axiosInstance: AxiosInstance) => ({

  createOrderApi: async (amount:number,currency:string) => {
    const response = await axiosInstance.post("/api/payment/order",{amount,currency});
    return response.data;
  },

});

export default createPaymetApi;
