import { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getStoredUser } from "@/lib/auth-utils";

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  company?: string;
  bio?: string;
  headline?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token using the auth utility
      const token = getToken();
      if (!token) {
        // Check if we have stored user data (for when app loads before token check)
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log("Using stored user data:", storedUser);
          setUser(storedUser);
        } else {
          console.warn("No authentication token found, user not logged in");
        }
        setLoading(false);
        return;
      }

      console.log(
        "Fetching user data with token:",
        token.substring(0, 20) + "..."
      );

      // Try to fetch fresh user data from API using /auth/me endpoint
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      if (response.data) {
        // Handle response structure from /auth/me which returns { user: userWithoutPassword }
        const userData = response.data.user || response.data;
        console.log("Setting user data:", userData);
        setUser(userData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching current user:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      // If API call fails, try to use stored user data as fallback
      const storedUser = getStoredUser();
      if (storedUser) {
        console.log("Using stored user data as fallback:", storedUser);
        setUser(storedUser);
      } else {
        setError(`Failed to load user data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<CurrentUser>) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.patch(`${API_BASE_URL}/users/me`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const userData = response.data.user || response.data;
        setUser(userData);
        return userData;
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError("Failed to update user data");
      throw err;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
  };
}
