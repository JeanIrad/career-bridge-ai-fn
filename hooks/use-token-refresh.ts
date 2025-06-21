import { useEffect, useRef } from "react";
import { getToken, getRefreshToken } from "@/lib/auth-utils";
import api from "@/lib/axios";

interface UseTokenRefreshOptions {
  enabled?: boolean;
  refreshInterval?: number; // in minutes
}

export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const { enabled = true, refreshInterval = 45 } = options; // Default: refresh every 45 minutes
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;

      // Check if token expires in the next 5 minutes
      return expirationTime - currentTime < 300; // 5 minutes
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // If we can't parse it, assume it's expiring
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = getToken();
      const refreshTokenValue = getRefreshToken();

      if (!token || !refreshTokenValue) {
        return false;
      }

      // Check if token is expiring soon
      if (!isTokenExpiringSoon(token)) {
        return true; // Token is still valid, no need to refresh
      }

      console.log("Token is expiring soon, attempting refresh...");

      const response = await api.post("/auth/refresh", {
        refreshToken: refreshTokenValue,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Update tokens
      if (typeof window !== "undefined") {
        localStorage.setItem("careerBridgeAIToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("careerBridgeAIRefreshToken", newRefreshToken);
        }

        // Update axios headers
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      }

      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const startTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(
      async () => {
        const success = await refreshToken();
        if (!success) {
          console.warn("Token refresh failed, stopping interval");
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
          }
        }
      },
      refreshInterval * 60 * 1000
    ); // Convert minutes to milliseconds
  };

  const stopTokenRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const token = getToken();
    const refreshTokenValue = getRefreshToken();

    if (token && refreshTokenValue) {
      // Start the refresh interval
      startTokenRefreshInterval();

      // Also check immediately if token needs refresh
      refreshToken();
    }

    return () => {
      stopTokenRefreshInterval();
    };
  }, [enabled, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTokenRefreshInterval();
    };
  }, []);

  return {
    refreshToken,
    startTokenRefreshInterval,
    stopTokenRefreshInterval,
  };
};
