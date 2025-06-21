"use client";

import { EmployerDashboardGuard } from "@/components/auth/RoleBasedAccess";
import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { EmployerOverview } from "@/components/employer/employer-overview";
import { EmployerJobs } from "@/components/employer/employer-jobs";
import { EmployerCandidates } from "@/components/employer/employer-candidates";
import { EmployerEvents } from "@/components/employer/employer-events";
import { EmployerMessages } from "@/components/employer/employer-messages";
import { EmployerProfile } from "@/components/employer/employer-profile";
import { EmployerAnalytics } from "@/components/employer/employer-analytics";
import { EmployerUniversities } from "@/components/employer/employer-universities";
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  MessageCircle,
  Building2,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { useUserStats } from "@/lib/actions/users";

export default function EmployerDashboard() {
  // Get real-time user statistics
  const { data: userStats, isLoading: statsLoading } = useUserStats();

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      content: <EmployerOverview />,
    },
    {
      id: "jobs",
      label: "Job Postings",
      icon: Briefcase,
      content: <EmployerJobs />,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      badge: statsLoading
        ? "..."
        : userStats?.roleDistribution?.students?.toString() || "0",
      content: <EmployerCandidates />,
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      content: <EmployerEvents />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      content: <EmployerMessages />,
    },
    {
      id: "profile",
      label: "Company Profile",
      icon: Building2,
      content: <EmployerProfile />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      content: <EmployerAnalytics />,
    },
    {
      id: "universities",
      label: "University Partners",
      icon: GraduationCap,
      content: <EmployerUniversities />,
    },
  ];

  return (
    <EmployerDashboardGuard>
      <TabbedDashboardLayout
        tabs={tabs}
        userRole="Employer"
        userName="Jennifer Smith"
        defaultTab="overview"
      />
    </EmployerDashboardGuard>
  );
}
