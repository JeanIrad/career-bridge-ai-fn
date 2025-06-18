"use client";

import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminUsers } from "@/components/admin/admin-users";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { AdminSettings } from "@/components/admin/admin-settings";
import { AdminSecurity } from "@/components/admin/admin-security";
import { AdminModeration } from "@/components/admin/admin-moderation";
import { AdminAlerts } from "@/components/admin/admin-alerts";
import { AdminData } from "@/components/admin/admin-data";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  Database,
  MessageCircle,
} from "lucide-react";

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
    {
      id: "data",
      label: "Data Management",
      icon: Database,
      content: <AdminData />,
    },
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
      id: "alerts",
      label: "Alerts & Monitoring",
      icon: AlertTriangle,
      badge: "3",
      content: <AdminAlerts />,
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      content: <AdminSettings />,
    },
  ];

  return (
    <TabbedDashboardLayout
      tabs={tabs}
      userRole="System Administrator"
      userName="David Wilson"
      defaultTab="overview"
    />
  );
}
