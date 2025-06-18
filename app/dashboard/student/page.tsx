"use client";

import { TabbedDashboardLayout } from "@/components/layout/tabbed-dashboard-layout";
import { StudentOverview } from "@/components/student/student-overview";
import { StudentJobs } from "@/components/student/student-jobs";
import { StudentInternships } from "@/components/student/student-internships";
import { StudentMentorship } from "@/components/student/student-mentorship";
import { StudentEvents } from "@/components/student/student-events";
import { StudentMessages } from "@/components/student/student-messages";
import { StudentProfile } from "@/components/student/student-profile";
import { StudentLearning } from "@/components/student/student-learning";
import { StudentAchievements } from "@/components/student/student-achievements";
import {
  Home,
  Briefcase,
  Building2,
  Users,
  Calendar,
  MessageCircle,
  BookOpen,
  Award,
  User,
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
      id: "jobs",
      label: "Job Search",
      icon: Briefcase,
      badge: "125",
      content: <StudentJobs />,
    },
    {
      id: "internships",
      label: "Internships",
      icon: Building2,
      badge: "45",
      content: <StudentInternships />,
    },
    {
      id: "mentorship",
      label: "Mentorship",
      icon: Users,
      content: <StudentMentorship />,
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      badge: "8",
      content: <StudentEvents />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      badge: "3",
      content: <StudentMessages />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      content: <StudentProfile />,
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
      icon: Award,
      content: <StudentAchievements />,
    },
  ];

  return (
    <TabbedDashboardLayout
      tabs={tabs}
      userRole="Student"
      userName="Alex Johnson"
      defaultTab="overview"
    />
  );
}
