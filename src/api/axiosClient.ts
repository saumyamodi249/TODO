import axios from "axios";
import type { ApiResponse } from "@/types/task";

export const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "https://nestjs-learn-wbkf.onrender.com");

export const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        const responseData = error.response.data as ApiResponse<unknown>;
        const errorMessage =
          responseData.errors && responseData.errors.length > 0
            ? responseData.errors.join(", ")
            : responseData.message || error.message;

        return Promise.reject(new Error(errorMessage));
      }

      if (error.message === "Network Error") {
        return Promise.reject(
          new Error("Network Error: Unable to connect to backend server. Please verify your connection."),
        );
      }
    }

    return Promise.reject(error);
  },
);
