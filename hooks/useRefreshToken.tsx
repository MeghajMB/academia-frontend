"use client";
import { axiosPrivate } from "@/api/axios";
import { login, logout } from "@/store/features/auth/authSlice";
import { AxiosError } from "axios";

import { useDispatch } from "react-redux";

export default function useRefreshToken() {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axiosPrivate.post("/api/auth/refresh");
      const resData = response.data.data;
      dispatch(login(resData));
      return resData.accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Refresh Token" + error.message);
        dispatch(logout());
      }
    }
  };
  return refresh;
}
