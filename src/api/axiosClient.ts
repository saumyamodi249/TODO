import axios from "axios";
import type { ApiResponse } from "@/types/task";

export const BASE_API_URL = "https://nestjs-learn-wbkf.onrender.com";

export const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.data) {
      const responseData = error.response.data as ApiResponse<unknown>;
      const errorMessage =
        (responseData.errors && responseData.errors.length > 0)
          ? responseData.errors.join(", ")
          : responseData.message || error.message;

      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(error);
  },
);
