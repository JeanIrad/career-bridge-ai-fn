"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Bug,
  Wifi,
  Server,
  Shield,
  Clock,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

type ErrorType =
  | "network"
  | "authentication"
  | "authorization"
  | "server"
  | "timeout"
  | "validation"
  | "not_found"
  | "rate_limit"
  | "maintenance"
  | "unknown";

interface ErrorInfo {
  type: ErrorType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "secondary" | "destructive" | "outline";
  actions: {
    primary?: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
  showSupport?: boolean;
  showTechnicalDetails?: boolean;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const [errorType, setErrorType] = useState<ErrorType>("unknown");
  const [showDetails, setShowDetails] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Log error for monitoring
    console.error("Application error:", error);

    // Determine error type based on error message and properties
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      setErrorType("network");
    } else if (
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("401")
    ) {
      setErrorType("authentication");
    } else if (
      errorMessage.includes("forbidden") ||
      errorMessage.includes("403")
    ) {
      setErrorType("authorization");
    } else if (
      errorMessage.includes("server") ||
      errorMessage.includes("500") ||
      errorMessage.includes("502") ||
      errorMessage.includes("503")
    ) {
      setErrorType("server");
    } else if (
      errorMessage.includes("timeout") ||
      errorMessage.includes("408")
    ) {
      setErrorType("timeout");
    } else if (
      errorMessage.includes("validation") ||
      errorMessage.includes("400")
    ) {
      setErrorType("validation");
    } else if (
      errorMessage.includes("not found") ||
      errorMessage.includes("404")
    ) {
      setErrorType("not_found");
    } else if (
      errorMessage.includes("rate limit") ||
      errorMessage.includes("429")
    ) {
      setErrorType("rate_limit");
    } else if (
      errorMessage.includes("maintenance") ||
      errorMessage.includes("503")
    ) {
      setErrorType("maintenance");
    }
  }, [error]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    reset();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const subject = `Error Report: ${error.name}`;
    const body = `Error Details:\n\n${JSON.stringify(errorReport, null, 2)}`;
    const mailtoLink = `mailto:support@careerbridge.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
  };

  const errorConfig: Record<ErrorType, ErrorInfo> = {
    network: {
      type: "network",
      title: "Connection Problem",
      description:
        "Unable to connect to our servers. Please check your internet connection and try again.",
      icon: Wifi,
      variant: "secondary",
      actions: {
        primary: {
          label: "Try Again",
          action: handleRetry,
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    authentication: {
      type: "authentication",
      title: "Authentication Required",
      description:
        "Your session has expired or you need to log in to access this resource.",
      icon: Shield,
      variant: "secondary",
      actions: {
        primary: {
          label: "Go to Login",
          action: () => router.push("/login"),
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    authorization: {
      type: "authorization",
      title: "Access Denied",
      description:
        "You don't have permission to access this resource. Please contact support if you believe this is an error.",
      icon: Shield,
      variant: "destructive",
      actions: {
        primary: {
          label: "Go Back",
          action: handleGoBack,
        },
        secondary: {
          label: "Contact Support",
          action: () => window.open("mailto:support@careerbridge.ai", "_blank"),
        },
      },
      showSupport: true,
      showTechnicalDetails: false,
    },
    server: {
      type: "server",
      title: "Server Error",
      description:
        "Something went wrong on our end. Our team has been notified and is working to fix the issue.",
      icon: Server,
      variant: "destructive",
      actions: {
        primary: {
          label: "Try Again",
          action: handleRetry,
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: true,
      showTechnicalDetails: true,
    },
    timeout: {
      type: "timeout",
      title: "Request Timeout",
      description:
        "The request took too long to complete. This might be due to high server load or network issues.",
      icon: Clock,
      variant: "secondary",
      actions: {
        primary: {
          label: "Try Again",
          action: handleRetry,
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    validation: {
      type: "validation",
      title: "Invalid Request",
      description:
        "The request contains invalid data. Please check your input and try again.",
      icon: AlertTriangle,
      variant: "secondary",
      actions: {
        primary: {
          label: "Go Back",
          action: handleGoBack,
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    not_found: {
      type: "not_found",
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      icon: HelpCircle,
      variant: "secondary",
      actions: {
        primary: {
          label: "Go Home",
          action: handleGoHome,
        },
        secondary: {
          label: "Go Back",
          action: handleGoBack,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    rate_limit: {
      type: "rate_limit",
      title: "Too Many Requests",
      description:
        "You've made too many requests in a short time. Please wait a moment and try again.",
      icon: Clock,
      variant: "secondary",
      actions: {
        primary: {
          label: "Try Again Later",
          action: () => setTimeout(handleRetry, 5000),
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: false,
      showTechnicalDetails: false,
    },
    maintenance: {
      type: "maintenance",
      title: "Maintenance Mode",
      description:
        "The system is currently under maintenance. Please try again later.",
      icon: RefreshCw,
      variant: "secondary",
      actions: {
        primary: {
          label: "Check Status",
          action: () => window.open("https://status.careerbridge.ai", "_blank"),
        },
        secondary: {
          label: "Go Home",
          action: handleGoHome,
        },
      },
      showSupport: true,
      showTechnicalDetails: false,
    },
    unknown: {
      type: "unknown",
      title: "Something Went Wrong",
      description:
        "An unexpected error occurred. Please try again or contact support if the problem persists.",
      icon: Bug,
      variant: "destructive",
      actions: {
        primary: {
          label: "Try Again",
          action: handleRetry,
        },
        secondary: {
          label: "Report Error",
          action: handleReportError,
        },
      },
      showSupport: true,
      showTechnicalDetails: true,
    },
  };

  const currentError = errorConfig[errorType];
  const IconComponent = currentError.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <Badge variant={currentError.variant} className="mx-auto">
              {currentError.type.replace("_", " ").toUpperCase()}
            </Badge>
            <CardTitle className="text-2xl">{currentError.title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {currentError.description}
          </p>

          {retryCount > 0 && (
            <Alert>
              <RefreshCw className="h-4 w-4" />
              <AlertDescription>
                Retry attempt: {retryCount}
                {retryCount >= 3 &&
                  " - If the problem persists, please contact support."}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {currentError.actions.primary && (
              <Button
                onClick={currentError.actions.primary.action}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {currentError.actions.primary.label}
              </Button>
            )}

            {currentError.actions.secondary && (
              <Button
                variant="outline"
                onClick={currentError.actions.secondary.action}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentError.actions.secondary.label}
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Server className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Support Section */}
          {currentError.showSupport && (
            <div className="text-center space-y-3 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Need help?</p>
              <div className="flex justify-center space-x-4">
                <Button variant="link" size="sm" asChild>
                  <a
                    href="mailto:support@careerbridge.ai"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Support
                  </a>
                </Button>
                <Button variant="link" size="sm" asChild>
                  <a
                    href="tel:+1-800-CAREER"
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Support
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Technical Details */}
          {currentError.showTechnicalDetails && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                {showDetails ? "Hide" : "Show"} Technical Details
              </Button>

              {showDetails && (
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <strong>Error:</strong> {error.name}
                  </div>
                  <div>
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div>
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                  <div>
                    <strong>Timestamp:</strong> {new Date().toISOString()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReportError}
                    className="mt-2"
                  >
                    Report This Error
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
