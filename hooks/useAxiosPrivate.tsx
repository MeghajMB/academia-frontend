"use client";
import { axiosPrivate } from "@/api/axios";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { InternalAxiosRequestConfig } from "axios";

export default function useAxiosPrivate() {
  const refresh = useRefreshToken();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent &&error.response.data.message=='TOKEN_EXPIRED') {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, accessToken]);
  return axiosPrivate;
}
