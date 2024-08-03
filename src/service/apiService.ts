import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { ApiResponse, Product } from "./types";

interface LoginData {
  username: string;
  password: string;
}

interface ApiProductData {
  name: string;
  detail: string;
  price: number;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This allows the server to set cookies
});

const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore.getState();
        authStore.logout();
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors();

const handleRequest = async <T>(
  url: string,
  method: string,
  data: any = null
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("Request canceled");
    } else if (!axios.isAxiosError(error)) {
      throw new Error("Unable to connect to the server");
    } else {
      const message =
        error.response?.data?.message || "An error occurred on the server.";
      throw new Error(message);
    }
  }
};

const apiService = {
  listProducts: () => handleRequest<Product[]>("/products", "get"),
  deleteProduct: (itemId: number) =>
    handleRequest<void>(`/products/${itemId}`, "delete"),
  updateProduct: (itemId: number, data: ApiProductData) =>
    handleRequest<Product>(`/products/${itemId}`, "put", data),
  createProduct: (data: ApiProductData) =>
    handleRequest<Product>("/products", "post", data),
  login: async (data: LoginData) => {
    const response = await handleRequest<{ success: boolean }>(
      "/auth/login",
      "post",
      data
    );
    if (response.success) {
      useAuthStore.getState().login();
    }
    return response;
  },
  logout: () => handleRequest<void>("/auth/logout", "post"),
  register: (data: LoginData) =>
    handleRequest<{ success: boolean }>("/auth/register", "post", data),
} as const;

export default apiService;
