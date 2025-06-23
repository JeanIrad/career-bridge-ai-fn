"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useValidateEmail, useResetPassword } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [emailValidationMessage, setEmailValidationMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: validateEmail, isPending: isValidating } = useValidateEmail();
  const { mutate: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");

    if (emailParam) {
      setEmail(emailParam);
      // Auto-validate email if it comes from URL params
      validateEmailIfValid(emailParam);
    }
    if (codeParam) {
      setResetCode(codeParam);
    }
  }, [searchParams]);

  const validateEmailIfValid = (emailToValidate: string) => {
    if (emailToValidate && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)) {
      validateEmail(emailToValidate, {
        onSuccess: (data) => {
          setIsEmailValid(data.exists);
          setEmailValidationMessage(data.message);
          if (!data.exists) {
            setError(data.message);
          }
        },
        onError: () => {
          setIsEmailValid(false);
          setEmailValidationMessage(
            "Failed to validate email. Please try again."
          );
        },
      });
    }
  };

  const handleEmailBlur = () => {
    validateEmailIfValid(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
    setIsEmailValid(null);
    setEmailValidationMessage("");
  };

  // Password validation
  const passwordValidation = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Validate email if not already validated
    if (isEmailValid === null) {
      validateEmailIfValid(email);
      return;
    }

    if (isEmailValid === false) {
      setError("Please enter a valid email address that exists in our system");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must meet all security requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    resetPassword(
      {
        email,
        resetCode,
        newPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to reset password. Please try again.";
          setError(errorMessage);
        },
      }
    );
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your password has been successfully reset. You can now log in with
              your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter the verification code sent to your email and create a new
            password
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleEmailBlur}
                  className={`pl-10 border-gray-300 focus:ring-blue-500 ${
                    isEmailValid === false
                      ? "border-red-500 focus:ring-red-500"
                      : isEmailValid === true
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                  }`}
                  disabled={isPending || isValidating}
                  required
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {isEmailValid === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                )}
                {isEmailValid === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-4 w-4" />
                )}
              </div>
              {emailValidationMessage && isEmailValid === true && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ {emailValidationMessage}
                </p>
              )}
              {emailValidationMessage && isEmailValid === false && (
                <p className="text-red-500 text-xs mt-1">
                  ✗ {emailValidationMessage}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="resetCode"
                className="text-sm font-medium text-gray-700"
              >
                Reset Code
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="resetCode"
                  type="text"
                  placeholder="Enter 6-digit reset code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-blue-500"
                  disabled={isPending}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:ring-blue-500"
                  disabled={isPending}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {newPassword && (
                <div className="text-xs space-y-1">
                  <div
                    className={`flex items-center ${passwordValidation.minLength ? "text-green-600" : "text-red-500"}`}
                  >
                    <span className="mr-2">
                      {passwordValidation.minLength ? "✓" : "✗"}
                    </span>
                    At least 8 characters
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}`}
                  >
                    <span className="mr-2">
                      {passwordValidation.hasUpperCase ? "✓" : "✗"}
                    </span>
                    One uppercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasLowerCase ? "text-green-600" : "text-red-500"}`}
                  >
                    <span className="mr-2">
                      {passwordValidation.hasLowerCase ? "✓" : "✗"}
                    </span>
                    One lowercase letter
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}`}
                  >
                    <span className="mr-2">
                      {passwordValidation.hasNumber ? "✓" : "✗"}
                    </span>
                    One number
                  </div>
                  <div
                    className={`flex items-center ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-500"}`}
                  >
                    <span className="mr-2">
                      {passwordValidation.hasSpecialChar ? "✓" : "✗"}
                    </span>
                    One special character
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:ring-blue-500"
                  disabled={isPending}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div
                  className={`text-xs ${passwordsMatch ? "text-green-600" : "text-red-500"}`}
                >
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </div>
              )}
            </div>
          </CardContent>

          <CardContent className="pt-0 space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
              disabled={
                isPending ||
                isValidating ||
                isEmailValid === false ||
                !isPasswordValid ||
                !passwordsMatch
              }
            >
              {isPending
                ? "Resetting Password..."
                : isValidating
                  ? "Validating Email..."
                  : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/login")}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
              disabled={isPending}
            >
              Back to Login
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
