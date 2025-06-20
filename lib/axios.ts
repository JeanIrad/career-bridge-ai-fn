import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Configure array parameter serialization
  paramsSerializer: {
    indexes: null, // Use roles=value1&roles=value2 format instead of roles[0]=value1&roles[1]=value2
  },
});

// Optional: Add a request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("careerBridgeAIToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    const token = process.env.AUTH_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
