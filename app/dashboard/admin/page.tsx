"use client";

import { AdminDashboardGuard } from "@/components/auth/RoleBasedAccess";
import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminUsers } from "@/components/admin/admin-users";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { AdminSettings } from "@/components/admin/admin-settings";
import { AdminSecurity } from "@/components/admin/admin-security";
import { AdminModeration } from "@/components/admin/admin-moderation";
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

export default function AdminDashboard() {
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
      badge: "2,547",
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
      badge: "15",
      content: <AdminModeration />,
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
  const user = getStoredUser();

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
