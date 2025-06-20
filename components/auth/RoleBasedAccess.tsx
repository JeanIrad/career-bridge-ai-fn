"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Loader2, Home } from "lucide-react";

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: string[];
  dashboardType: "admin" | "student" | "employer" | "university";
  fallbackRoute?: string;
}

// Define strict role mappings
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  SUPER_ADMIN: "/dashboard/admin",
  STUDENT: "/dashboard/student",
  ALUMNI: "/dashboard/student",
  EMPLOYER: "/dashboard/employer",
  PROFESSOR: "/dashboard/university",
  UNIVERSITY_STAFF: "/dashboard/university",
};

const DASHBOARD_TITLES: Record<string, string> = {
  admin: "Admin Dashboard",
  student: "Student Dashboard",
  employer: "Employer Dashboard",
  university: "University Dashboard",
};

export function RoleBasedAccess({
  children,
  allowedRoles,
  dashboardType,
  fallbackRoute,
}: RoleBasedAccessProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkAccess = () => {
      try {
        // Get user data from localStorage
        const token = localStorage.getItem("careerBridgeAIToken");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          // No authentication data, redirect to login
          router.push(
            `/login?redirect=${window.location.pathname}&error=authentication_required`
          );
          return;
        }

        const userData = JSON.parse(userStr);
        const role = userData.role;
        const name = userData.firstName || userData.name || "User";

        setUserRole(role);
        setUserName(name);

        // Check if user has access to this dashboard
        if (!allowedRoles.includes(role)) {
          // User doesn't have access to this dashboard
          setHasAccess(false);
          setError(
            `Access denied. Your role (${role}) is not authorized to access the ${DASHBOARD_TITLES[dashboardType]}.`
          );

          // Redirect to their appropriate dashboard after a delay
          const correctDashboard = ROLE_DASHBOARD_MAP[role];
          if (
            correctDashboard &&
            correctDashboard !== window.location.pathname
          ) {
            setTimeout(() => {
              router.push(correctDashboard);
            }, 3000);
          } else if (fallbackRoute) {
            setTimeout(() => {
              router.push(fallbackRoute);
            }, 3000);
          } else {
            // If no correct dashboard found, redirect to unauthorized page
            setTimeout(() => {
              router.push(
                `/unauthorized?attempted=${window.location.pathname}&role=${role}`
              );
            }, 3000);
          }
        } else {
          // User has access
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Role access check failed:", error);
        setError("Failed to verify access permissions. Please log in again.");
        setTimeout(() => {
          router.push(
            `/login?redirect=${window.location.pathname}&error=session_invalid`
          );
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [allowedRoles, dashboardType, fallbackRoute, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl">Verifying Access...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Please wait while we verify your permissions for the{" "}
              {DASHBOARD_TITLES[dashboardType]}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied state
  if (!hasAccess) {
    const correctDashboard = userRole ? ROLE_DASHBOARD_MAP[userRole] : null;
    const correctDashboardName = correctDashboard
      ? DASHBOARD_TITLES[
          correctDashboard.split("/")[2] as keyof typeof DASHBOARD_TITLES
        ]
      : null;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Your Role:</strong> {userRole}
              </p>
              <p>
                <strong>Required Roles:</strong> {allowedRoles.join(", ")}
              </p>
              {correctDashboardName && (
                <p>
                  <strong>Your Dashboard:</strong> {correctDashboardName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {correctDashboard &&
                correctDashboard !== window.location.pathname && (
                  <Button
                    onClick={() => router.push(correctDashboard)}
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to {correctDashboardName}
                  </Button>
                )}

              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Sign In with Different Account
              </Button>
            </div>

            {correctDashboard &&
              correctDashboard !== window.location.pathname && (
                <p className="text-xs text-gray-500">
                  You will be automatically redirected to your dashboard in a
                  few seconds...
                </p>
              )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
}

// Convenience components for each dashboard type
export function AdminDashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedAccess
      allowedRoles={["ADMIN", "SUPER_ADMIN"]}
      dashboardType="admin"
      fallbackRoute="/unauthorized"
    >
      {children}
    </RoleBasedAccess>
  );
}

export function StudentDashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedAccess
      allowedRoles={["STUDENT", "ALUMNI"]}
      dashboardType="student"
      fallbackRoute="/unauthorized"
    >
      {children}
    </RoleBasedAccess>
  );
}

export function EmployerDashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedAccess
      allowedRoles={["EMPLOYER"]}
      dashboardType="employer"
      fallbackRoute="/unauthorized"
    >
      {children}
    </RoleBasedAccess>
  );
}

export function UniversityDashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleBasedAccess
      allowedRoles={["PROFESSOR", "UNIVERSITY_STAFF"]}
      dashboardType="university"
      fallbackRoute="/unauthorized"
    >
      {children}
    </RoleBasedAccess>
  );
}
