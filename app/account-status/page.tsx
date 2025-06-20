"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { resendVerificationEmail } from "@/lib/actions/auth";
import { toast } from "sonner";

type AccountStatus =
  | "not_verified"
  | "inactive"
  | "suspended"
  | "locked"
  | "active";

interface AccountStatusInfo {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "secondary" | "destructive" | "outline";
  actions?: {
    primary?: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
}

export default function AccountStatusPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AccountStatus>("not_verified");

  useEffect(() => {
    const statusParam = searchParams.get("status") as AccountStatus;
    const emailParam = searchParams.get("email");

    if (statusParam) {
      setStatus(statusParam);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await resendVerificationEmail(email);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig: Record<AccountStatus, AccountStatusInfo> = {
    not_verified: {
      title: "Email Verification Required",
      description:
        "Your account is not verified. Please check your email for the verification link or request a new one.",
      icon: Mail,
      variant: "secondary",
      actions: {
        primary: {
          label: "Resend Verification Email",
          action: handleResendVerification,
        },
      },
    },
    inactive: {
      title: "Account Deactivated",
      description:
        "Your account has been deactivated. Please contact support to reactivate your account.",
      icon: XCircle,
      variant: "destructive",
      actions: {
        primary: {
          label: "Contact Support",
          action: () => window.open("mailto:support@careerbridge.ai", "_blank"),
        },
      },
    },
    suspended: {
      title: "Account Suspended",
      description:
        "Your account has been suspended due to policy violations. Please contact support for assistance.",
      icon: AlertTriangle,
      variant: "destructive",
      actions: {
        primary: {
          label: "Contact Support",
          action: () => window.open("mailto:support@careerbridge.ai", "_blank"),
        },
        secondary: {
          label: "Call Support",
          action: () => window.open("tel:+1-800-CAREER", "_self"),
        },
      },
    },
    locked: {
      title: "Account Temporarily Locked",
      description:
        "Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.",
      icon: RefreshCw,
      variant: "outline",
      actions: {
        primary: {
          label: "Reset Password",
          action: () => window.open("/forgot-password", "_self"),
        },
      },
    },
    active: {
      title: "Account Active",
      description: "Your account is active and ready to use.",
      icon: CheckCircle,
      variant: "default",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <currentStatus.icon className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{currentStatus.title}</CardTitle>
          <Badge variant={currentStatus.variant} className="mx-auto">
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {currentStatus.description}
          </p>

          {status === "not_verified" && (
            <div className="space-y-3">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {currentStatus.actions && (
            <div className="space-y-3">
              {currentStatus.actions.primary && (
                <Button
                  onClick={currentStatus.actions.primary.action}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    currentStatus.actions.primary.label
                  )}
                </Button>
              )}

              {currentStatus.actions.secondary && (
                <Button
                  variant="outline"
                  onClick={currentStatus.actions.secondary.action}
                  className="w-full"
                >
                  {currentStatus.actions.secondary.label}
                </Button>
              )}
            </div>
          )}

          <div className="pt-4 border-t">
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          {status === "suspended" || status === "inactive" ? (
            <div className="text-center text-sm text-muted-foreground">
              <p>Need immediate assistance?</p>
              <div className="flex justify-center space-x-4 mt-2">
                <Button variant="link" size="sm" asChild>
                  <a href="mailto:support@careerbridge.ai">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </a>
                </Button>
                <Button variant="link" size="sm" asChild>
                  <a href="tel:+1-800-CAREER">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
