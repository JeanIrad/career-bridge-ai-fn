"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useValidateEmail, useForgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [emailValidationMessage, setEmailValidationMessage] = useState("");

  const router = useRouter();
  const { mutate: validateEmail, isPending: isValidating } = useValidateEmail();
  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword();

  const handleEmailBlur = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validateEmail(email, {
        onSuccess: (data) => {
          setIsEmailValid(data.exists);
          setEmailValidationMessage(data.message);
          if (!data.exists) {
            setError(data.message);
          } else {
            setError("");
          }
        },
        onError: () => {
          setIsEmailValid(false);
          setEmailValidationMessage(
            "Failed to validate email. Please try again."
          );
          setError("Failed to validate email. Please try again.");
        },
      });
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
    setIsEmailValid(null);
    setEmailValidationMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // If email hasn't been validated or is invalid, validate first
    if (isEmailValid === null || isEmailValid === false) {
      validateEmail(email, {
        onSuccess: (data) => {
          setIsEmailValid(data.exists);
          setEmailValidationMessage(data.message);
          if (data.exists) {
            // Proceed with forgot password if email is valid
            proceedWithForgotPassword();
          } else {
            setError(data.message);
          }
        },
        onError: () => {
          setError("Failed to validate email. Please try again.");
        },
      });
      return;
    }

    // If email is valid, proceed directly
    if (isEmailValid) {
      proceedWithForgotPassword();
    }
  };

  const proceedWithForgotPassword = () => {
    forgotPassword(email, {
      onSuccess: () => {
        setEmailSent(true);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again later.";
        setError(errorMessage);
      },
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent password reset instructions to <br />
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                If you don't see the email in your inbox, check your spam or
                junk folder. The reset code will expire in 15 minutes.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() =>
                  router.push(
                    `/reset-password?email=${encodeURIComponent(email)}`
                  )
                }
                className="w-full"
              >
                I Have My Reset Code
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                  setIsEmailValid(null);
                  setEmailValidationMessage("");
                }}
                className="w-full"
              >
                Try Different Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
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
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email address and we'll send you a reset code
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
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
                  className={`pl-10 border-gray-300 focus:ring-blue-500 transition-all duration-200 ${
                    isEmailValid === false
                      ? "border-red-500 focus:ring-red-500"
                      : isEmailValid === true
                        ? "border-green-500 focus:ring-green-500"
                        : ""
                  }`}
                  disabled={isSending || isValidating}
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
            </div>
          </CardContent>

          <CardContent className="pt-0 space-y-4">
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
              disabled={isSending || isValidating || isEmailValid === false}
            >
              {isSending
                ? "Sending Reset Code..."
                : isValidating
                  ? "Validating Email..."
                  : "Send Reset Code"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/login")}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
              disabled={isSending || isValidating}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
