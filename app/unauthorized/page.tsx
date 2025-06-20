"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth-context";
import { LogoutButton } from "@/components/auth/logout-button";
import { getRoleDashboardRoute } from "@/lib/auth-utils";
import {
  Shield,
  AlertTriangle,
  Home,
  ArrowLeft,
  Lock,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [attemptedRoute, setAttemptedRoute] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [authorizedRoute, setAuthorizedRoute] = useState<string>("");

  useEffect(() => {
    setAttemptedRoute(searchParams.get("attempted") || "");
    setUserRole(searchParams.get("role") || "");
    setReason(searchParams.get("reason") || "");
    setAuthorizedRoute(searchParams.get("authorized") || "");
  }, [searchParams]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "EMPLOYER":
        return "bg-green-100 text-green-800 border-green-200";
      case "PROFESSOR":
      case "UNIVERSITY_STAFF":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "STUDENT":
      case "ALUMNI":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getRouteDescription = (route: string) => {
    if (route.includes("/dashboard/admin")) {
      return {
        name: "Admin Dashboard",
        requiredRoles: ["Admin", "Super Admin"],
      };
    }
    if (route.includes("/dashboard/employer")) {
      return { name: "Employer Dashboard", requiredRoles: ["Employer"] };
    }
    if (route.includes("/dashboard/student")) {
      return {
        name: "Student Dashboard",
        requiredRoles: ["Student", "Alumni"],
      };
    }
    if (route.includes("/dashboard/university")) {
      return {
        name: "University Dashboard",
        requiredRoles: ["Professor", "University Staff"],
      };
    }
    return { name: "Protected Resource", requiredRoles: ["Authorized Users"] };
  };

  const getErrorMessage = (
    reason: string,
    attemptedRoute: string,
    userRole: string
  ) => {
    switch (reason) {
      case "cross_dashboard_access":
        return {
          title: "Cross-Dashboard Access Denied",
          message:
            "You attempted to access a dashboard that doesn't belong to your role. Users can only access their designated dashboard.",
          icon: <Eye className="w-5 h-5 text-amber-500" />,
          severity: "warning" as const,
        };
      case "insufficient_permissions":
        return {
          title: "Insufficient Permissions",
          message:
            "Your current role does not have the required permissions to access this resource.",
          icon: <Lock className="w-5 h-5 text-red-500" />,
          severity: "error" as const,
        };
      case "unknown_role":
        return {
          title: "Unknown Role",
          message:
            "Your account has an unrecognized role. Please contact support for assistance.",
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          severity: "error" as const,
        };
      default:
        return {
          title: "Access Denied",
          message: "You don't have permission to access this resource.",
          icon: <Shield className="w-5 h-5 text-red-500" />,
          severity: "error" as const,
        };
    }
  };

  const routeInfo = getRouteDescription(attemptedRoute);
  const currentUserRole = user?.role || userRole;
  const userDashboard = currentUserRole
    ? getRoleDashboardRoute(currentUserRole)
    : "/";

  const errorInfo = getErrorMessage(reason, attemptedRoute, currentUserRole);

  const getAuthorizedDashboardName = (route: string) => {
    if (route.includes("/dashboard/admin")) return "Admin Dashboard";
    if (route.includes("/dashboard/employer")) return "Employer Dashboard";
    if (route.includes("/dashboard/student")) return "Student Dashboard";
    if (route.includes("/dashboard/university")) return "University Dashboard";
    return "Your Dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">403</div>
            <CardTitle className="text-3xl">{errorInfo.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Alert
            className={`border-2 ${
              errorInfo.severity === "error"
                ? "border-red-200 bg-red-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {errorInfo.icon}
              <AlertDescription
                className={
                  errorInfo.severity === "error"
                    ? "text-red-700"
                    : "text-amber-700"
                }
              >
                {errorInfo.message}
              </AlertDescription>
            </div>
          </Alert>

          {attemptedRoute && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Access Restriction Details</span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Attempted to access:</span>
                  <div className="mt-1 font-mono bg-white p-2 rounded border text-left">
                    {routeInfo.name}
                  </div>
                </div>

                <div>
                  <span className="font-medium">Required roles:</span>
                  <div className="mt-1 flex flex-wrap gap-1 justify-center">
                    {routeInfo.requiredRoles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {currentUserRole && (
                  <div>
                    <span className="font-medium">Your current role:</span>
                    <div className="mt-1">
                      <Badge
                        className={`text-xs ${getRoleColor(currentUserRole)}`}
                      >
                        {formatRole(currentUserRole)}
                      </Badge>
                    </div>
                  </div>
                )}

                {authorizedRoute && reason === "cross_dashboard_access" && (
                  <div>
                    <span className="font-medium">
                      Your authorized dashboard:
                    </span>
                    <div className="mt-1 font-mono bg-green-50 p-2 rounded border text-left text-green-700">
                      {getAuthorizedDashboardName(authorizedRoute)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            {userDashboard && userDashboard !== "/" && (
              <Link href={userDashboard}>
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  {authorizedRoute && reason === "cross_dashboard_access"
                    ? `Go to ${getAuthorizedDashboardName(authorizedRoute)}`
                    : "My Dashboard"}
                </Button>
              </Link>
            )}
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              {reason === "unknown_role"
                ? "Need help with your account role?"
                : "Need access to this resource?"}
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="link" size="sm" asChild>
                <a href="mailto:admin@careerbridge.ai">
                  {reason === "unknown_role"
                    ? "Contact Support"
                    : "Contact Administrator"}
                </a>
              </Button>
              <LogoutButton
                variant="link"
                size="sm"
                showIcon={false}
                showConfirmDialog={true}
              >
                Switch Account
              </LogoutButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
