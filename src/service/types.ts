export interface Product {
  id: number;
  name: string;
  detail: string;
  price: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiProductData {
  name: string;
  detail: string;
  price: number;
}