"use client";

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

export default function EmployerDashboard() {
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
      badge: "8",
      content: <EmployerJobs />,
    },
    {
      id: "candidates",
      label: "Candidates",
      icon: Users,
      badge: "156",
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
      badge: "12",
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
    <TabbedDashboardLayout
      tabs={tabs}
      userRole="Employer"
      userName="Jennifer Smith"
      defaultTab="overview"
    />
  );
}
