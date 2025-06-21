"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole } from "../utils/types/user";
import {
  getToken,
  getStoredUser,
  removeToken,
  getRoleDashboardRoute,
  setToken,
  setStoredUser,
} from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useTokenRefresh } from "@/hooks/use-token-refresh";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize token refresh hook
  useTokenRefresh({
    enabled: isAuthenticated,
    refreshInterval: 45, // Refresh every 45 minutes
  });

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = getToken();

      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Try to get user from localStorage first (faster)
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsLoading(false);

        // Verify token with backend in the background
        try {
          const response = await api.get("/auth/me");
          if (response.data && response.data.user) {
            const userData = response.data.user;
            // Update user data if it changed
            if (JSON.stringify(userData) !== JSON.stringify(storedUser)) {
              setUser(userData);
              setStoredUser(userData);
            }
          }
        } catch (error) {
          console.warn("Background auth verification failed:", error);
          // Don't logout immediately, let user continue with cached data
        }

        return true;
      }

      // If no stored user, verify token with backend
      const response = await api.get("/auth/me");

      if (response.data && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setStoredUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }

      // Invalid token
      removeToken();
      setIsLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid token
      removeToken();
      delete api.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      // Store tokens and user data using utility functions
      setToken(access_token, true); // Remember me = true
      if (refresh_token) {
        localStorage.setItem("careerBridgeAIRefreshToken", refresh_token);
      }
      setStoredUser(userData);

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Call logout API endpoint (optional)
      api.post("/auth/logout").catch(console.warn);
    } catch (error) {
      console.warn("Logout API call failed:", error);
    }

    // Clear all auth data
    removeToken();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login page
    router.push("/login");

    // Optional: Show logout success message
    if (typeof window !== "undefined") {
      // You can add a toast notification here if you have one
      console.log("Successfully logged out");
    }
  };

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for storage changes (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "careerBridgeAIToken" && e.newValue === null) {
        // Token was removed in another tab, logout here too
        setUser(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common["Authorization"];
        router.push("/login");
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
