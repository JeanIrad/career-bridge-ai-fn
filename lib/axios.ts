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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Helper function to get refresh token
const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("careerBridgeAIRefreshToken");
};

// Helper function to set tokens
const setTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerBridgeAIToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("careerBridgeAIRefreshToken", refreshToken);
  }
};

// Helper function to clear tokens and redirect to login
const handleLogout = () => {
  if (typeof window === "undefined") return;

  // Clear tokens
  localStorage.removeItem("careerBridgeAIToken");
  localStorage.removeItem("careerBridgeAIRefreshToken");
  localStorage.removeItem("user");

  // Clear cookies
  document.cookie =
    "careerBridgeAIToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "careerBridgeAIRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear axios headers
  delete api.defaults.headers.common["Authorization"];

  // Show a notification that session expired
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("sessionExpired", "true");
  }

  // Redirect to login with current path as redirect parameter
  const currentPath = window.location.pathname;
  const redirectUrl =
    currentPath !== "/login"
      ? `?redirect=${encodeURIComponent(currentPath)}`
      : "";
  window.location.href = `/login${redirectUrl}`;
};

// Request interceptor
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

// Response interceptor with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, logout
        processQueue(error, null);
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens
        setTokens(accessToken, newRefreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Process the queued requests
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other 401 errors or if retry failed
    if (error.response?.status === 401 && originalRequest._retry) {
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default api;
