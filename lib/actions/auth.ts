import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { LoginFormData, SignupFormData } from "@/utils/schemas/auth";
import { useRouter } from "next/navigation";
import { toastErrorStyles, toastSuccessStyles } from "../utils";
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
        console.error("Full error object:", error);
        console.error("Error response:", error.response);
        console.error("Error data:", error.response?.data);

        throw error;
      }
    },
    onError: (error: any) => {
      console.log("Error in onError:", error);
      console.log("Error response:", error.response);
      console.log("Error data:", error.response?.data);

      const getErrorMessage = (error: any): string => {
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
      console.log("User logged in successfully:", data);
      const { access_token, user } = data;
      // Store the token in localStorage or cookies
      localStorage.setItem("careerBridgeAIToken", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(
        data.message || "Logged in successfully!",
        toastSuccessStyles
      );
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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

        // Re-throw to let React Query handle it
        throw error;
      }
    },
    onError: (error: any) => {
      console.log("Error in onError:", error);
      console.log("Error response:", error.response);
      console.log("Error data:", error.response?.data);

      const getErrorMessage = (error: any): string => {
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
