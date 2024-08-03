// apiService.js
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
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

const handleRequest = async (url, method, data = null) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error("Request canceled");
    } else if (!error.response) {
      throw new Error("Unable to connect to the server");
    } else {
      const message = error.response.data || "An error occurred on the server.";
      throw new Error(message);
    }
  }
};

const apiService = {
  listProducts: () => handleRequest("/products", "get"),
  deleteProduct: (itemId) => handleRequest(`/products/${itemId}`, "delete"),
  updateProduct: (itemId, data) =>
    handleRequest(`/products/${itemId}`, "put", data),
  createProduct: (data) => handleRequest("/products", "post", data),
  login: async (data) => {
    const response = await handleRequest("/auth/login", "post", data);
    return response;
  },
  register: (data) => handleRequest("/auth/register", "post", data),
};

export default apiService;
