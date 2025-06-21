import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { LoginFormData, SignupFormData } from "@/utils/schemas/auth";
import { useRouter } from "next/navigation";
import { toastErrorStyles, toastSuccessStyles } from "../utils";

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === "https:"}`;
};

// Define role-based dashboard routes
const getRoleDashboardRoute = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    STUDENT: "/dashboard/student",
    ALUMNI: "/dashboard/student",
    EMPLOYER: "/dashboard/employer",
    ADMIN: "/dashboard/admin",
    SUPER_ADMIN: "/dashboard/admin",
    PROFESSOR: "/dashboard/university",
    UNIVERSITY_STAFF: "/dashboard/university",
    MENTOR: "/dashboard/mentor",
  };

  return roleRoutes[role] || "/dashboard";
};

// Account status error messages
const getAccountStatusMessage = (error: any): string => {
  const errorCode = error.response?.data?.code;
  const errorMessage = error.response?.data?.message;

  switch (errorCode) {
    case "ACCOUNT_NOT_VERIFIED":
      return "Your account is not verified. Please check your email for the verification link.";
    case "ACCOUNT_INACTIVE":
      return "Your account has been deactivated. Please contact support to reactivate it.";
    case "ACCOUNT_SUSPENDED":
      return "Your account has been suspended. Please contact support for assistance.";
    case "ACCOUNT_LOCKED":
      return "Your account has been temporarily locked due to multiple failed login attempts.";
    case "INVALID_CREDENTIALS":
      return "Invalid email or password. Please try again.";
    default:
      return errorMessage || "Login failed. Please try again.";
  }
};

export const useLoginUser = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (body: Omit<LoginFormData, "rememberMe">) => {
      try {
        const response = await api.post("/auth/login", body);
        return response.data;
      } catch (error: any) {
        // Log the full error for debugging
        console.error("Login error:", error);
        console.error("Error response:", error.response);
        console.error("Error data:", error.response?.data);

        // Handle network errors first
        if (!error.response) {
          // Network error - no response received
          if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
            throw new Error("NETWORK_ERROR");
          } else if (
            error.code === "ETIMEDOUT" ||
            error.message?.includes("timeout")
          ) {
            throw new Error("NETWORK_TIMEOUT");
          } else if (
            error.message?.includes("Network Error") ||
            error.name === "NetworkError"
          ) {
            throw new Error("NETWORK_UNAVAILABLE");
          } else {
            throw new Error("CONNECTION_ERROR");
          }
        }

        // Handle specific account status errors
        if (error.response?.status === 403) {
          const errorData = error.response.data;

          // Check for specific account status issues
          if (errorData.code === "ACCOUNT_NOT_VERIFIED") {
            throw new Error("ACCOUNT_NOT_VERIFIED");
          }
          if (errorData.code === "ACCOUNT_INACTIVE") {
            throw new Error("ACCOUNT_INACTIVE");
          }
          if (errorData.code === "ACCOUNT_SUSPENDED") {
            throw new Error("ACCOUNT_SUSPENDED");
          }
          if (errorData.code === "ACCOUNT_LOCKED") {
            throw new Error("ACCOUNT_LOCKED");
          }
        }

        throw error;
      }
    },
    onError: (error: any) => {
      console.log("Error in onError:", error);

      let errorMessage = "";
      let showResendVerification = false;
      let showContactSupport = false;

      // Handle network-specific errors first
      if (
        error.message === "NETWORK_ERROR" ||
        error.message === "CONNECTION_ERROR"
      ) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.message === "NETWORK_TIMEOUT") {
        errorMessage =
          "The request timed out. Please check your connection and try again.";
      } else if (error.message === "NETWORK_UNAVAILABLE") {
        errorMessage =
          "Network is unavailable. Please check your internet connection.";
      } else if (error.message === "ACCOUNT_NOT_VERIFIED") {
        errorMessage =
          "Your account is not verified. Please check your email for the verification link.";
        showResendVerification = true;
      } else if (error.message === "ACCOUNT_INACTIVE") {
        errorMessage =
          "Your account has been deactivated. Please contact support to reactivate it.";
        showContactSupport = true;
      } else if (error.message === "ACCOUNT_SUSPENDED") {
        errorMessage =
          "Your account has been suspended. Please contact support for assistance.";
        showContactSupport = true;
      } else if (error.message === "ACCOUNT_LOCKED") {
        errorMessage =
          "Your account has been temporarily locked due to multiple failed login attempts. Please try again later.";
      } else {
        // Handle general errors
        errorMessage = getAccountStatusMessage(error);
      }

      // Show toast with appropriate action
      toast.error(errorMessage, {
        ...toastErrorStyles,
        duration: 6000,
        action: showResendVerification
          ? {
              label: "Resend Verification",
              onClick: () => {
                // Handle resend verification logic
                console.log("Resend verification clicked");
                router.push("/resend-verification");
              },
            }
          : showContactSupport
            ? {
                label: "Contact Support",
                onClick: () => {
                  window.open("mailto:support@careerbridge.ai", "_blank");
                },
              }
            : undefined,
      });
    },
    onSuccess: (data) => {
      console.log("User logged in successfully:", data);
      const { access_token, refresh_token, user } = data;

      if (!user || !user.role) {
        toast.error("Invalid user data received", toastErrorStyles);
        return;
      }

      // Store the tokens in localStorage AND cookies for better security
      localStorage.setItem("careerBridgeAIToken", access_token);
      if (refresh_token) {
        localStorage.setItem("careerBridgeAIRefreshToken", refresh_token);
      }
      localStorage.setItem("user", JSON.stringify(user));

      // Set secure cookies
      setCookie("careerBridgeAIToken", access_token, 7);
      if (refresh_token) {
        setCookie("careerBridgeAIRefreshToken", refresh_token, 30); // Refresh tokens last longer
      }

      // Set authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      toast.success(
        data.message || `Welcome back, ${user.firstName || user.name}!`,
        toastSuccessStyles
      );

      // Check for redirect parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect");

      setTimeout(() => {
        if (redirectTo && redirectTo.startsWith("/dashboard")) {
          // Validate that user has access to the redirect route
          const userRole = user.role;
          const roleBasedRoutes: Record<string, string[]> = {
            "/dashboard/student": ["STUDENT", "ALUMNI"],
            "/dashboard/employer": ["EMPLOYER"],
            "/dashboard/admin": ["ADMIN", "SUPER_ADMIN"],
            "/dashboard/university": ["PROFESSOR", "UNIVERSITY_STAFF"],
          };

          let hasAccess = false;
          for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
            if (redirectTo.startsWith(route)) {
              hasAccess = allowedRoles.includes(userRole);
              break;
            }
          }

          if (hasAccess) {
            router.push(redirectTo);
          } else {
            // User doesn't have access to requested route, redirect to their default dashboard
            const defaultRoute = getRoleDashboardRoute(userRole);
            router.push(defaultRoute);
          }
        } else {
          // No redirect or invalid redirect, go to role-based dashboard
          const defaultRoute = getRoleDashboardRoute(user.role);
          router.push(defaultRoute);
        }
      }, 1500);
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (
      body: Omit<SignupFormData, "agreeToTerms" | "confirmPassword">
    ) => {
      try {
        const response = await api.post("/auth/register", body);
        return response.data;
      } catch (error: any) {
        // Log the full error for debugging
        console.error("Full error object:", error);
        console.error("Error response:", error.response);
        console.error("Error data:", error.response?.data);

        // Handle network errors first
        if (!error.response) {
          // Network error - no response received
          if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
            throw new Error("NETWORK_ERROR");
          } else if (
            error.code === "ETIMEDOUT" ||
            error.message?.includes("timeout")
          ) {
            throw new Error("NETWORK_TIMEOUT");
          } else if (
            error.message?.includes("Network Error") ||
            error.name === "NetworkError"
          ) {
            throw new Error("NETWORK_UNAVAILABLE");
          } else {
            throw new Error("CONNECTION_ERROR");
          }
        }

        // Re-throw to let React Query handle it
        throw error;
      }
    },
    onError: (error: any) => {
      console.log("Error in onError:", error);
      console.log("Error response:", error.response);
      console.log("Error data:", error.response?.data);

      const getErrorMessage = (error: any): string => {
        // Handle network-specific errors first
        if (
          error.message === "NETWORK_ERROR" ||
          error.message === "CONNECTION_ERROR"
        ) {
          return "Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.message === "NETWORK_TIMEOUT") {
          return "The request timed out. Please check your connection and try again.";
        } else if (error.message === "NETWORK_UNAVAILABLE") {
          return "Network is unavailable. Please check your internet connection.";
        }

        // Handle server response errors
        if (error.response?.data?.message) return error.response.data.message;
        if (error.response?.data?.error) return error.response.data.error;
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          if (Array.isArray(errors) && errors.length > 0) {
            return errors[0].message || errors[0];
          }
        }
        if (error.message) return error.message;
        return "An unexpected error occurred";
      };

      toast.error(getErrorMessage(error), toastErrorStyles);
    },
    onSuccess: (data) => {
      console.log("User registered successfully:", data);
      toast.success(
        data.message || "Account created successfully!",
        toastSuccessStyles
      );
    },
  });
};

// Enhanced logout function
export const logout = async () => {
  try {
    // Call logout API endpoint
    await api.post("/auth/logout");
  } catch (error) {
    console.warn("Logout API call failed:", error);
  }

  // Clear localStorage
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

  // Show logout message
  toast.success("You have been logged out successfully", toastSuccessStyles);

  // Redirect to login
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};

// Function to check account status
export const checkAccountStatus = async (email: string) => {
  try {
    const response = await api.get(`/auth/account-status?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to check account status:", error);
    throw error;
  }
};

// Function to resend verification link
export const resendVerificationLink = async (email: string) => {
  try {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  } catch (error) {
    console.error("Failed to resend verification link:", error);
    throw error;
  }
};

// Legacy alias for backward compatibility
export const resendVerificationEmail = resendVerificationLink;
