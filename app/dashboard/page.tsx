"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, Building, Settings, ArrowRight } from "lucide-react";

interface UserData {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email: string;
  status: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleInvalidAccountStatus = useCallback(
    (status: string, email: string) => {
      localStorage.removeItem("careerBridgeAIToken");
      localStorage.removeItem("user");

      const statusRoutes: Record<string, string> = {
        PENDING: `/account-status?status=not_verified&email=${encodeURIComponent(email)}`,
        INACTIVE: "/account-status?status=inactive",
        SUSPENDED: "/account-status?status=suspended",
        LOCKED: "/account-status?status=locked",
      };

      const targetRoute =
        statusRoutes[status] || `/account-status?status=inactive`;
      router.push(targetRoute);
    },
    [router]
  );

  useEffect(() => {
    const redirectToRoleDashboard = () => {
      try {
        const token = localStorage.getItem("careerBridgeAIToken");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(userStr) as UserData;
        setUser(userData);

        // Check account status
        if (userData.status !== "ACTIVE") {
          handleInvalidAccountStatus(userData.status, userData.email);
          return;
        }

        // Define role-based dashboard routes
        const roleDashboardRoutes: Record<string, string> = {
          STUDENT: "/dashboard/student",
          ALUMNI: "/dashboard/student",
          EMPLOYER: "/dashboard/employer",
          ADMIN: "/dashboard/admin",
          SUPER_ADMIN: "/dashboard/admin",
          PROFESSOR: "/dashboard/university",
          UNIVERSITY_STAFF: "/dashboard/university",
        };

        const targetRoute = roleDashboardRoutes[userData.role];

        if (targetRoute) {
          // Add a small delay to show the redirect page
          setTimeout(() => {
            router.push(targetRoute);
          }, 1000);
        } else {
          // Unknown role, show error
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard redirect error:", error);
        router.push("/login");
      }
    };

    redirectToRoleDashboard();
  }, [router, handleInvalidAccountStatus]);

  const getRoleInfo = (role: string) => {
    const roleInfo: Record<
      string,
      {
        title: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
      }
    > = {
      STUDENT: {
        title: "Student Dashboard",
        description:
          "Access your career development resources and opportunities",
        icon: User,
      },
      ALUMNI: {
        title: "Alumni Dashboard",
        description:
          "Connect with your network and explore career opportunities",
        icon: User,
      },
      EMPLOYER: {
        title: "Employer Dashboard",
        description: "Manage job postings and connect with talented candidates",
        icon: Building,
      },
      ADMIN: {
        title: "Admin Dashboard",
        description: "Manage users, content, and system settings",
        icon: Settings,
      },
      SUPER_ADMIN: {
        title: "Super Admin Dashboard",
        description: "Full system administration and management",
        icon: Settings,
      },
      PROFESSOR: {
        title: "Professor Dashboard",
        description: "Manage courses and student career development",
        icon: Users,
      },
      UNIVERSITY_STAFF: {
        title: "University Staff Dashboard",
        description: "Support student career services and programs",
        icon: Users,
      },
    };

    return (
      roleInfo[role] || {
        title: "Dashboard",
        description: "Welcome to your dashboard",
        icon: User,
      }
    );
  };

  if (loading) {
    const roleInfo = user
      ? getRoleInfo(user.role)
      : { title: "Dashboard", description: "Loading...", icon: User };
    const IconComponent = roleInfo.icon;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <IconComponent className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              {user ? `Welcome, ${user.firstName || "User"}!` : "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {roleInfo.title}
              </h3>
              <p className="text-gray-600 text-sm">{roleInfo.description}</p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <span className="text-sm">Redirecting to your dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state for unknown roles
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">Access Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Your account role is not recognized. Please contact support for
            assistance.
          </p>
          <div className="space-y-2">
            <Button onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                window.open("mailto:support@careerbridge.ai", "_blank")
              }
              className="w-full"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
