"use client";

import { UniversityDashboardGuard } from "@/components/auth/RoleBasedAccess";
import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { UniversityOverview } from "@/components/university/university-overview";
import { UniversityStudents } from "@/components/university/university-students";
import { UniversityPartners } from "@/components/university/university-paterners";
import { UniversityEvents } from "@/components/university/university-events";
import { UniversityCareer } from "@/components/university/university-career";
import { UniversityMessages } from "@/components/university/university-messages";
import { UniversityProfile } from "@/components/university/university-profile";
import { UniversityAnalytics } from "@/components/university/university-analytics";
import { UniversityAlumni } from "@/components/university/university-alumni";
import {
  Home,
  Users,
  Building2,
  Calendar,
  Briefcase,
  MessageCircle,
  School,
  BarChart3,
  HandHeart,
} from "lucide-react";

export default function UniversityDashboard() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      content: <UniversityOverview />,
    },
    {
      id: "students",
      label: "Student Management",
      icon: Users,
      badge: "3,247",
      content: <UniversityStudents />,
    },
    {
      id: "partners",
      label: "Industry Partners",
      icon: Building2,
      badge: "127",
      content: <UniversityPartners />,
    },
    {
      id: "events",
      label: "Events & Programs",
      icon: Calendar,
      content: <UniversityEvents />,
    },
    {
      id: "career",
      label: "Career Services",
      icon: Briefcase,
      content: <UniversityCareer />,
    },
    {
      id: "messages",
      label: "Communications",
      icon: MessageCircle,
      badge: "18",
      content: <UniversityMessages />,
    },
    {
      id: "profile",
      label: "University Profile",
      icon: School,
      content: <UniversityProfile />,
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      content: <UniversityAnalytics />,
    },
    {
      id: "alumni",
      label: "Alumni Network",
      icon: HandHeart,
      content: <UniversityAlumni />,
    },
  ];

  return (
    <UniversityDashboardGuard>
      <TabbedDashboardLayout
        tabs={tabs}
        userRole="University Staff"
        userName="Dr. Maria Rodriguez"
        defaultTab="overview"
      />
    </UniversityDashboardGuard>
  );
}
