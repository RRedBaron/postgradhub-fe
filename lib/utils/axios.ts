import axios, { CreateAxiosDefaults } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response.data?.message === "jwt expired"
    ) {
      originalRequest._retry = true;
      await api.post("/auth/refresh");
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const axiosDefaults: CreateAxiosDefaults = {
  baseURL: "http://localhost:3000/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export default api;
