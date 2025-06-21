"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Activity,
  TrendingUp,
  Database,
  Shield,
  AlertTriangle,
  UserCheck,
  Building2,
  GraduationCap,
  MessageCircle,
  Loader2,
  Clock,
  UserPlus,
  ArrowUpRight,
  Settings,
  Eye,
  BarChart3,
  Bell,
  PieChart,
} from "lucide-react";
import { useUserStats } from "@/lib/actions/users";
import {
  usePendingVerificationUsers,
  useRecentUsers,
} from "@/lib/actions/admin-users";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Import the new modals
import { ViewAlertsModal } from "./modals/view-alerts-modal";
import { VerificationQueueModal } from "./modals/verification-queue-modal";
import { PlatformStatsModal } from "./modals/platform-stats-modal";

// Define colors for the pie chart
const GENDER_COLORS = {
  male: "#3B82F6", // Blue
  female: "#EC4899", // Pink
  other: "#8B5CF6", // Purple
  notSpecified: "#6B7280", // Gray
};

export function AdminOverview() {
  // Modal states
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const { data: userStats, isLoading, error } = useUserStats();
  const { data: pendingUsers, isLoading: pendingLoading } =
    usePendingVerificationUsers({ limit: 5 });
  const { data: recentUsers, isLoading: recentLoading } = useRecentUsers(7, 5);

  // Prepare data for the pie chart
  const genderData = userStats?.genderDistribution
    ? [
        {
          name: "Male",
          value: userStats.genderDistribution.male,
          color: GENDER_COLORS.male,
        },
        {
          name: "Female",
          value: userStats.genderDistribution.female,
          color: GENDER_COLORS.female,
        },
        {
          name: "Other",
          value: userStats.genderDistribution.other,
          color: GENDER_COLORS.other,
        },
        {
          name: "Not Specified",
          value: userStats.genderDistribution.notSpecified,
          color: GENDER_COLORS.notSpecified,
        },
      ].filter((item) => item.value > 0)
    : [];

  // Calculate percentages
  const totalGenderUsers = genderData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const malePercentage =
    totalGenderUsers > 0
      ? (
          ((userStats?.genderDistribution?.male || 0) / totalGenderUsers) *
          100
        ).toFixed(1)
      : "0";
  const femalePercentage =
    totalGenderUsers > 0
      ? (
          ((userStats?.genderDistribution?.female || 0) / totalGenderUsers) *
          100
        ).toFixed(1)
      : "0";

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Loading Dashboard...
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Error Loading Dashboard
          </h1>
        </div>
        <div className="text-lg text-red-600">
          Unable to fetch platform statistics. Please refresh the page.
        </div>
      </div>
    );
  }

  // Calculate derived stats
  const totalUsers = Number(userStats?.totalUsers) || 0;
  const verifiedUsers = Number(userStats?.verifiedUsers) || 0;
  const pendingVerifications = totalUsers - verifiedUsers;
  const verificationRate =
    typeof userStats?.verificationRate === "number"
      ? userStats.verificationRate
      : totalUsers > 0
        ? (verifiedUsers / totalUsers) * 100
        : 0;
  const activeUsers = Number(userStats?.activeUsers) || 0;
  const pendingCount =
    typeof pendingUsers?.pagination?.total === "number"
      ? pendingUsers.pagination.total
      : pendingVerifications;

  // Platform stats with real data
  const platformStats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: `${Number(verificationRate).toFixed(1)}% verified`,
      icon: Users,
      color: "text-blue-600",
      onClick: () => setShowStatsModal(true),
    },
    {
      label: "Active Users",
      value: activeUsers.toLocaleString(),
      change: `${totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0.0"}% of total`,
      icon: Activity,
      color: "text-green-600",
      onClick: () => setShowStatsModal(true),
    },
    {
      label: "Pending Verifications",
      value: pendingCount.toLocaleString(),
      change: "Require admin review",
      icon: Clock,
      color: pendingCount > 50 ? "text-red-600" : "text-orange-600",
      onClick: () => setShowVerificationModal(true),
    },
    {
      label: "Platform Health",
      value: "99.9%",
      change: "Last 30 days uptime",
      icon: TrendingUp,
      color: "text-purple-600",
      onClick: () => setShowAlertsModal(true),
    },
  ];

  // User breakdown with real data
  const roleDistribution = userStats?.roleDistribution || {
    students: 0,
    alumni: 0,
    employers: 0,
    professors: 0,
  };

  // Ensure all role counts are numbers
  const studentsCount = Number(roleDistribution.students) || 0;
  const alumniCount = Number(roleDistribution.alumni) || 0;
  const employersCount = Number(roleDistribution.employers) || 0;
  const professorsCount = Number(roleDistribution.professors) || 0;

  const totalRoleUsers =
    studentsCount + alumniCount + employersCount + professorsCount;

  const userBreakdown = [
    {
      type: "Students",
      count: studentsCount,
      percentage:
        totalRoleUsers > 0
          ? Math.round((studentsCount / totalRoleUsers) * 100)
          : 0,
      color: "bg-blue-500",
    },
    {
      type: "Alumni",
      count: alumniCount,
      percentage:
        totalRoleUsers > 0
          ? Math.round((alumniCount / totalRoleUsers) * 100)
          : 0,
      color: "bg-emerald-500",
    },
    {
      type: "Employers",
      count: employersCount,
      percentage:
        totalRoleUsers > 0
          ? Math.round((employersCount / totalRoleUsers) * 100)
          : 0,
      color: "bg-orange-500",
    },
    {
      type: "Professors",
      count: professorsCount,
      percentage:
        totalRoleUsers > 0
          ? Math.round((professorsCount / totalRoleUsers) * 100)
          : 0,
      color: "bg-purple-500",
    },
  ];

  const recentActivities = [
    {
      type: "New Registrations",
      description: "Recent user signups (last 7 days)",
      time: "Real-time",
      severity: "info",
      count: Array.isArray(recentUsers) ? recentUsers.length : 0,
    },
    {
      type: "Verification Queue",
      description: "Users awaiting verification",
      time: "Updated now",
      severity: pendingCount > 50 ? "warning" : "info",
      count: pendingCount,
    },
    {
      type: "Platform Health",
      description: "System status monitoring",
      time: "Live",
      severity: "success",
      count: Math.round(Number(verificationRate)),
    },
    {
      type: "Active Sessions",
      description: "Currently active users",
      time: "Real-time",
      severity: "info",
      count: Math.round(activeUsers * 0.8), // Estimated active sessions
    },
  ];

  const systemHealth = [
    {
      service: "User Management",
      status: "Healthy",
      uptime: "99.98%",
      response: `${totalUsers} users`,
    },
    {
      service: "Verification System",
      status: pendingCount > 100 ? "Warning" : "Healthy",
      uptime: `${Number(verificationRate).toFixed(1)}%`,
      response: `${pendingCount} pending`,
    },
    {
      service: "Active Sessions",
      status: "Healthy",
      uptime: "99.95%",
      response: `${activeUsers} active`,
    },
    {
      service: "Platform Health",
      status: "Healthy",
      uptime: "99.99%",
      response: "All systems operational",
    },
  ];

  const pendingActions = [
    {
      title: "User Verification Queue",
      count: pendingCount,
      description: "Users awaiting verification approval",
      action: "Review Now",
      priority: pendingCount > 50 ? "high" : "medium",
    },
    {
      title: "Platform Statistics",
      count: Math.round(Number(verificationRate)),
      description: `${Number(verificationRate).toFixed(1)}% verification rate`,
      action: "View Details",
      priority: Number(verificationRate) < 80 ? "medium" : "low",
    },
    {
      title: "New User Onboarding",
      count: Array.isArray(recentUsers) ? recentUsers.length : 0,
      description: "Recent user registrations to review",
      action: "Monitor",
      priority: "low",
    },
    {
      title: "System Health Check",
      count: 1,
      description: "Regular system maintenance",
      action: "Schedule",
      priority: "low",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Monitor and manage your platform
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAlertsModal(true)}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">View Alerts</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVerificationModal(true)}
            className="flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Verification Queue</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Detailed Stats</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-blue-900">
              {userStats?.totalUsers || 0}
            </div>
            <p className="text-xs md:text-sm text-blue-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Active platform users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Verified Users
            </CardTitle>
            <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-900">
              {userStats?.verifiedUsers || 0}
            </div>
            <p className="text-xs md:text-sm text-green-600 mt-1">
              {userStats?.verificationRate || 0}% verification rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Active Users
            </CardTitle>
            <Activity className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-purple-900">
              {userStats?.activeUsers || 0}
            </div>
            <p className="text-xs md:text-sm text-purple-600 mt-1">
              Currently active accounts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Pending Verification
            </CardTitle>
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-orange-900">
              {(userStats?.totalUsers || 0) - (userStats?.verifiedUsers || 0)}
            </div>
            <p className="text-xs md:text-sm text-orange-600 mt-1">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Gender Distribution */}
        <Card className="bg-gradient-to-br from-pink-50 to-blue-50 border-pink-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-pink-600" />
              Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {genderData.length > 0 ? (
              <>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [value, name]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-700">Male</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {userStats?.genderDistribution?.male || 0} (
                      {malePercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-sm text-gray-700">Female</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {userStats?.genderDistribution?.female || 0} (
                      {femalePercentage}%)
                    </span>
                  </div>
                  {(userStats?.genderDistribution?.other || 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-700">Other</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {userStats?.genderDistribution?.other || 0}
                      </span>
                    </div>
                  )}
                  {(userStats?.genderDistribution?.notSpecified || 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm text-gray-700">
                          Not Specified
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {userStats?.genderDistribution?.notSpecified || 0}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No gender data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Students
                  </Badge>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {userStats?.roleDistribution?.students || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Alumni
                  </Badge>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {userStats?.roleDistribution?.alumni || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800"
                  >
                    Employers
                  </Badge>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {userStats?.roleDistribution?.employers || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    Professors
                  </Badge>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {userStats?.roleDistribution?.professors || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowAlertsModal(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View System Alerts
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowVerificationModal(true)}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Review Verifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowStatsModal(true)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Platform Statistics
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New User
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ViewAlertsModal
        open={showAlertsModal}
        onOpenChange={(open) => setShowAlertsModal(open)}
        totalUsers={userStats?.totalUsers || 0}
        pendingVerifications={
          (userStats?.totalUsers || 0) - (userStats?.verifiedUsers || 0)
        }
        verificationRate={userStats?.verificationRate || 0}
      />
      <VerificationQueueModal
        open={showVerificationModal}
        onOpenChange={(open) => setShowVerificationModal(open)}
      />
      <PlatformStatsModal
        open={showStatsModal}
        onOpenChange={(open) => setShowStatsModal(open)}
        userStats={{
          totalUsers: userStats?.totalUsers || 0,
          verifiedUsers: userStats?.verifiedUsers || 0,
          activeUsers: userStats?.activeUsers || 0,
          verificationRate: userStats?.verificationRate || 0,
          roleDistribution: {
            students: userStats?.roleDistribution?.students || 0,
            alumni: userStats?.roleDistribution?.alumni || 0,
            employers: userStats?.roleDistribution?.employers || 0,
            professors: userStats?.roleDistribution?.professors || 0,
          },
        }}
      />
    </div>
  );
}
