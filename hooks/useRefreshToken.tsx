"use client";
import { axiosPrivate } from "@/api/axios";
import { login, logout } from "@/lib/features/auth/authSlice";
import { AxiosError } from "axios";

import { useDispatch } from "react-redux";

export default function useRefreshToken() {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axiosPrivate.post("/api/auth/refresh");
      dispatch(login(response.data)); // add the access token to the redux store
      return response.data.accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Refresh Token" + error.message);
        dispatch(logout());
      }
    }
  };
  return refresh;
}
