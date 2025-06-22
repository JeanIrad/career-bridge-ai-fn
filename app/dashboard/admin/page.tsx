"use client";

import { AdminDashboardGuard } from "@/components/auth/RoleBasedAccess";
import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminUsers } from "@/components/admin/admin-users";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { AdminSettings } from "@/components/admin/admin-settings";
import { AdminSecurity } from "@/components/admin/admin-security";
import { AdminContentModeration } from "@/components/admin/admin-content-moderation";
import { AdminProfile } from "@/components/admin/admin-profile";
import { AdminData } from "@/components/admin/admin-data";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  Shield,
  User,
  Database,
  MessageCircle,
} from "lucide-react";
import { getStoredUser } from "@/lib/auth-utils";
import { useUserStats } from "@/lib/actions/users";

export default function AdminDashboard() {
  const user = getStoredUser();

  // Get real-time user statistics with automatic refresh every 30 seconds
  const { data: userStats, isLoading: statsLoading } = useUserStats();

  // Calculate pending verifications (total users minus verified users)
  const pendingVerifications = userStats
    ? userStats.totalUsers - userStats.verifiedUsers
    : 0;

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      content: <AdminOverview />,
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      badge: statsLoading ? "..." : userStats?.totalUsers?.toString() || "0",
      content: <AdminUsers />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      content: <AdminAnalytics />,
    },
    // {
    //   id: "data",
    //   label: "Data Management",
    //   icon: Database,
    //   content: <AdminData />,
    // },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      content: <AdminSecurity />,
    },
    {
      id: "moderation",
      label: "Content Moderation",
      icon: MessageCircle,
      badge: statsLoading ? "..." : pendingVerifications.toString(),
      content: <AdminContentModeration />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      content: <AdminProfile />,
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      content: <AdminSettings />,
    },
  ];

  return (
    <AdminDashboardGuard>
      <TabbedDashboardLayout
        tabs={tabs}
        userRole={user?.role}
        userName={user?.firstName + " " + user?.lastName}
        defaultTab="overview"
        user={user}
      />
    </AdminDashboardGuard>
  );
}
