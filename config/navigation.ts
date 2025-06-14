import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  Brain,
  UserCheck,
  Building,
  FileText,
  BarChart3,
  Shield,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { NavigationItem, User, UserRole } from "@/utils/types/user";

export const navigationConfig: NavigationItem[] = [
  // Common for all roles
  {
    name: "Dashboard",
    id: "dashboard",
    icon: LayoutDashboard,
    roles: ["student", "admin", "employer", "staff"],
  },
  {
    name: "Messages",
    id: "messages",
    icon: MessageSquare,
    roles: ["student", "admin", "employer", "staff"],
  },
  {
    name: "Settings",
    id: "settings",
    icon: Settings,
    roles: ["student", "admin", "employer", "staff"],
  },

  // Student-specific
  {
    name: "Job Opportunities",
    id: "jobs",
    icon: Briefcase,
    roles: ["student"],
  },
  {
    name: "Internships",
    id: "internships",
    icon: GraduationCap,
    roles: ["student"],
  },
  { name: "Alumni Network", id: "alumni", icon: Users, roles: ["student"] },
  { name: "Events", id: "events", icon: Calendar, roles: ["student", "staff"] },
  { name: "Learning Hub", id: "learning", icon: BookOpen, roles: ["student"] },
  {
    name: "Career Analytics",
    id: "analytics",
    icon: TrendingUp,
    roles: ["student"],
  },
  { name: "AI Assistant", id: "ai-assistant", icon: Brain, roles: ["student"] },

  // Admin-specific
  {
    name: "User Management",
    id: "user-management",
    icon: UserCheck,
    roles: ["admin"],
  },
  {
    name: "Platform Analytics",
    id: "platform-analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    name: "Content Management",
    id: "content-management",
    icon: FileText,
    roles: ["admin"],
  },
  {
    name: "System Settings",
    id: "system-settings",
    icon: Shield,
    roles: ["admin"],
  },

  // Employer-specific
  { name: "Post Jobs", id: "post-jobs", icon: UserPlus, roles: ["employer"] },
  {
    name: "Manage Listings",
    id: "manage-listings",
    icon: ClipboardList,
    roles: ["employer"],
  },
  {
    name: "Candidate Pool",
    id: "candidate-pool",
    icon: Users,
    roles: ["employer"],
  },
  {
    name: "Company Profile",
    id: "company-profile",
    icon: Building,
    roles: ["employer"],
  },
  {
    name: "Recruitment Analytics",
    id: "recruitment-analytics",
    icon: TrendingUp,
    roles: ["employer"],
  },

  // Staff-specific
  {
    name: "Student Support",
    id: "student-support",
    icon: Users,
    roles: ["staff"],
  },
  {
    name: "Career Counseling",
    id: "career-counseling",
    icon: Brain,
    roles: ["staff"],
  },
  {
    name: "Event Management",
    id: "event-management",
    icon: Calendar,
    roles: ["staff"],
  },
  { name: "Reports", id: "reports", icon: FileText, roles: ["staff"] },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) =>
    item.roles.includes(
      role.toLocaleLowerCase() as "student" | "admin" | "employer" | "staff"
    )
  );
}
