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
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEmployerAnalytics } from "@/hooks/use-employer-analytics";

export default function EmployerDashboard() {
  // Get current user data for dynamic display
  const { user: currentUser, loading: userLoading } = useCurrentUser();

  // Get employer analytics for badge counts
  const { dashboardData, loading: analyticsLoading } =
    useEmployerAnalytics("30d");

  // Calculate real badge counts from employer data
  const totalApplications = dashboardData?.summary?.totalApplications || 0;
  const activeJobs = dashboardData?.summary?.activeJobs || 0;
  const pendingReviews = dashboardData?.summary?.pendingReviews || 0;

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
      badge: analyticsLoading ? "..." : activeJobs.toString(),
      content: <EmployerJobs />,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      badge: analyticsLoading ? "..." : totalApplications.toString(),
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
      badge: pendingReviews > 0 ? pendingReviews.toString() : undefined,
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

  // Dynamic user name from real data
  const userName = userLoading
    ? "Loading..."
    : currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : "Employer";

  return (
    <EmployerDashboardGuard>
      <TabbedDashboardLayout
        tabs={tabs}
        userRole="Employer"
        userName={userName}
        defaultTab="overview"
      />
    </EmployerDashboardGuard>
  );
}
