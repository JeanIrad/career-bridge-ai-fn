"use client";

/**
 * Enhanced Login Form with Network Error Handling
 *
 * Features:
 * - Comprehensive network error detection (connection refused, timeouts, network unavailable)
 * - User-friendly error messages for different network scenarios
 * - Retry functionality with visual retry button for network errors
 * - Server error handling (500, 503 status codes)
 * - Account status error routing (verification, inactive, suspended, locked)
 * - Loading states and form validation
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, AlertCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/utils/schemas/auth";
import { useLoginUser } from "@/lib/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate: loginUser, isPending } = useLoginUser();

  const onSubmit = async (data: LoginFormData) => {
    // Clear any previous auth errors
    setAuthError(null);
    setShowRetry(false);

    console.log("Login data:", data);

    // Extract rememberMe from data and pass the rest to login
    const { rememberMe, ...loginData } = data;

    try {
      loginUser(loginData, {
        onError: (error: any) => {
          console.error("Login form error:", error);

          // Handle network errors first
          if (
            error.message?.includes("NETWORK_ERROR") ||
            error.message?.includes("CONNECTION_ERROR") ||
            error.message?.includes("NETWORK_TIMEOUT") ||
            error.message?.includes("NETWORK_UNAVAILABLE")
          ) {
            setAuthError(
              "Connection failed. Please check your internet connection and try again."
            );
            setShowRetry(true);
          } else if (
            !error.response &&
            (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK")
          ) {
            setAuthError(
              "Unable to reach the server. Please check your connection and try again."
            );
            setShowRetry(true);
          } else if (
            !error.response &&
            (error.code === "ETIMEDOUT" || error.message?.includes("timeout"))
          ) {
            setAuthError("Request timed out. Please try again.");
            setShowRetry(true);
          } else if (
            !error.response &&
            (error.message?.includes("Network Error") ||
              error.name === "NetworkError")
          ) {
            setAuthError(
              "Network error occurred. Please check your internet connection."
            );
            setShowRetry(true);
          } else if (!error.response) {
            setAuthError(
              "Connection failed. Please check your internet connection and try again."
            );
            setShowRetry(true);
          } else if (error.message?.includes("ACCOUNT_NOT_VERIFIED")) {
            const email = encodeURIComponent(data.email);
            router.push(`/account-status?status=not_verified&email=${email}`);
          } else if (error.message?.includes("ACCOUNT_INACTIVE")) {
            router.push(`/account-status?status=inactive`);
          } else if (error.message?.includes("ACCOUNT_SUSPENDED")) {
            router.push(`/account-status?status=suspended`);
          } else if (error.message?.includes("ACCOUNT_LOCKED")) {
            router.push(`/account-status?status=locked`);
          } else if (error.response?.status === 500) {
            setAuthError("Server error occurred. Please try again later.");
            setShowRetry(true);
          } else if (error.response?.status === 503) {
            setAuthError(
              "Service temporarily unavailable. Please try again later."
            );
            setShowRetry(true);
          } else {
            // Show general error in the form
            setAuthError("Invalid email or password. Please try again.");
          }
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      // Handle any synchronous errors or network issues
      if (error instanceof Error) {
        if (
          error.message?.includes("Network") ||
          error.name === "NetworkError"
        ) {
          setAuthError(
            "Network error occurred. Please check your internet connection."
          );
          setShowRetry(true);
        } else {
          setAuthError("An unexpected error occurred. Please try again.");
        }
      } else {
        setAuthError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => {
    if (errors[field]) {
      clearErrors(field);
    }
    // Clear auth error when user starts typing
    if (authError) {
      setAuthError(null);
      setShowRetry(false);
    }
  };

  const handleRetry = () => {
    const formData = watch();
    onSubmit(formData);
  };

  // Check for redirect or error parameters
  const redirectPath = searchParams.get("redirect");
  const errorParam = searchParams.get("error");

  const rememberMe = watch("rememberMe");

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to your account to continue
          {redirectPath && (
            <span className="block text-xs mt-2 text-blue-600">
              You'll be redirected to {redirectPath.replace("/dashboard/", "")}{" "}
              dashboard
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Show error messages */}
          {(authError || errorParam) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {authError ||
                    (errorParam === "invalid_token"
                      ? "Your session has expired. Please log in again."
                      : "An error occurred. Please try again.")}
                </span>
                {showRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={isPending}
                    className="ml-2 h-8 px-3 bg-white hover:bg-gray-50 border-red-300 text-red-700 hover:text-red-800"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                onChange={(e) => {
                  register("email").onChange(e);
                  handleInputChange("email");
                }}
                className={`pl-10 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } transition-all duration-200`}
                disabled={isPending}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                onChange={(e) => {
                  register("password").onChange(e);
                  handleInputChange("password");
                }}
                className={`pl-10 pr-10 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } transition-all duration-200`}
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isPending}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  setValue("rememberMe", checked as boolean);
                  handleInputChange("rememberMe");
                }}
                disabled={isPending}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <Button
              variant="link"
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 p-0"
              onClick={() => router.push("/forgot-password")}
              disabled={isPending}
            >
              Forgot password?
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                disabled={isPending}
              >
                Sign up
              </button>
            </p>

            {/* Role-based login hints */}
            <div className="text-xs text-gray-500">
              <p>Login as:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  Student
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                  Employer
                </span>
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                  Admin
                </span>
                <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded">
                  University
                </span>
              </div>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
