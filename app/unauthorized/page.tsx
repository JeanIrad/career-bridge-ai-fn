"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { LogoutButton } from "@/components/auth/logout-button";
import { getRoleDashboardRoute } from "@/lib/auth-utils";
import { Shield, AlertTriangle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [attemptedRoute, setAttemptedRoute] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    setAttemptedRoute(searchParams.get("attempted") || "");
    setUserRole(searchParams.get("role") || "");
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

  const routeInfo = getRouteDescription(attemptedRoute);
  const currentUserRole = user?.role || userRole;
  const userDashboard = currentUserRole
    ? getRoleDashboardRoute(currentUserRole)
    : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-red-600">403</div>
            <CardTitle className="text-3xl">Access Denied</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              You don't have permission to access this resource.
            </p>

            {attemptedRoute && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">
                    Access Restriction Details
                  </span>
                </div>

                <div className="space-y-2 text-sm">
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
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Link href={userDashboard}>
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                My Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Need access to this resource?
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="link" size="sm" asChild>
                <a href="mailto:admin@careerbridge.ai">Contact Administrator</a>
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
