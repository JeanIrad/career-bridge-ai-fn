"use client";

import { StudentDashboardGuard } from "@/components/auth/RoleBasedAccess";
import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { StudentOverview } from "@/components/student/student-overview";
import { StudentProfile } from "@/components/student/student-profile";
import { StudentJobs } from "@/components/student/student-jobs";
import { StudentInternships } from "@/components/student/student-internships";
import StudentEvents from "@/components/student/student-events";
import StudentMentorship from "@/components/student/student-mentorship";
import { StudentLearning } from "@/components/student/student-learning";
import { StudentMessages } from "@/components/student/student-messages";
import { StudentAchievements } from "@/components/student/student-achievements";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  Users,
  BookOpen,
  MessageCircle,
  Trophy,
} from "lucide-react";

export default function StudentDashboard() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      content: <StudentOverview />,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      content: <StudentProfile />,
    },
    {
      id: "jobs",
      label: "Job Search",
      icon: Briefcase,
      content: <StudentJobs />,
    },
    {
      id: "internships",
      label: "Internships",
      icon: GraduationCap,
      content: <StudentInternships />,
    },
    {
      id: "events",
      label: "Career Events",
      icon: Calendar,
      content: <StudentEvents />,
    },
    {
      id: "mentorship",
      label: "Mentorship",
      icon: Users,
      content: <StudentMentorship />,
    },
    {
      id: "learning",
      label: "Learning Path",
      icon: BookOpen,
      content: <StudentLearning />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      content: <StudentAchievements />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      content: <StudentMessages />,
    },
  ];

  return (
    <StudentDashboardGuard>
      <TabbedDashboardLayout
        tabs={tabs}
        userRole="Student"
        userName="Sarah Johnson"
        defaultTab="overview"
      />
    </StudentDashboardGuard>
  );
}
