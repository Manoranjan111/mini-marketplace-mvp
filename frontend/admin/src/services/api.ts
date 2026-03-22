import axios from "axios";
import { decryptPayload } from "@/lib/utils";

const BASE_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem("access_token") || "";
    const refresh_token = localStorage.getItem("refresh_token") || "";
    config.headers["Authorization"] = `Bearer ${access_token}`;
    config.headers["x-refresh-token"] = `${refresh_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if the error status is 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 👇 Queue the request while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest._retry = true;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        console.log("Interceptor called");
        const response = await refreshToken();
        console.log("Refresh token response:", response.data);
        const payload = decryptPayload(response.data);
        const newAccessToken = payload.access_token;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        localStorage.setItem("access_token", payload?.access_token || "");
        localStorage.setItem("refresh_token", payload?.refresh_token || "");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

const refreshToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/refresh-token`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while refreshing token", errorMessage);
    return error.response?.data || error.message;
  }
};
