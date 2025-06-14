"use client";

import { useAuth } from "@/contexts/auth-context";

// Student pages
import { DashboardOverview } from "./pages/dashboard-overview";
import { JobOpportunities } from "./pages/job-opportunities";
import { Internships } from "./pages/internships";
import { AlumniNetwork } from "./pages/alumni-network";
import { Messages } from "./pages/messages";
import { Events } from "./pages/events";
import { LearningHub } from "./pages/learning-hub";
import { CareerAnalytics } from "./pages/career-analytics";
import { AIAssistant } from "./pages/ai-assistant";
import { Settings } from "./pages/settings";

// Admin pages
import { UserManagement } from "./pages/admin/user-management";
import { PlatformAnalytics } from "./pages/admin/platform-analytics";
import { ContentManagement } from "./pages/admin/content-management";
import { SystemSettings } from "./pages/admin/system-settings";

// Employer pages
import { PostJobs } from "./pages/employer/post-jobs";
import { ManageListings } from "./pages/employer/manage-listings";
import { CandidatePool } from "./pages/employer/candidate-pool";
import { CompanyProfile } from "./pages/employer/company-profile";
import { RecruitmentAnalytics } from "./pages/employer/recruitment-analytics";

// Staff pages
import { StudentSupport } from "./pages/staff/student-support";
import { CareerCounseling } from "./pages/staff/career-counseling";
import { EventManagement } from "./pages/staff/event-management";
import { Reports } from "./pages/staff/reports";

interface DashboardContentProps {
  activeTab: string;
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const { user } = useAuth();

  if (!user) return null;

  const renderContent = () => {
    // Common pages for all roles
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "messages":
        return <Messages />;
      case "settings":
        return <Settings />;
    }

    // Role-specific pages
    if (user.role === "STUDENT") {
      switch (activeTab) {
        case "jobs":
          return <JobOpportunities />;
        case "internships":
          return <Internships />;
        case "alumni":
          return <AlumniNetwork />;
        case "events":
          return <Events />;
        case "learning":
          return <LearningHub />;
        case "analytics":
          return <CareerAnalytics />;
        case "ai-assistant":
          return <AIAssistant />;
      }
    }

    if (user.role === "ADMIN") {
      switch (activeTab) {
        case "user-management":
          return <UserManagement />;
        case "platform-analytics":
          return <PlatformAnalytics />;
        case "content-management":
          return <ContentManagement />;
        case "system-settings":
          return <SystemSettings />;
      }
    }

    if (user.role === "EMPLOYER") {
      switch (activeTab) {
        case "post-jobs":
          return <PostJobs />;
        case "manage-listings":
          return <ManageListings />;
        case "candidate-pool":
          return <CandidatePool />;
        case "company-profile":
          return <CompanyProfile />;
        case "recruitment-analytics":
          return <RecruitmentAnalytics />;
      }
    }

    if (user.role === "PROFESSOR") {
      switch (activeTab) {
        case "student-support":
          return <StudentSupport />;
        case "career-counseling":
          return <CareerCounseling />;
        case "event-management":
          return <EventManagement />;
        case "events":
          return <Events />;
        case "reports":
          return <Reports />;
      }
    }

    // Default fallback
    return <DashboardOverview />;
  };

  return <div className="space-y-6">{renderContent()}</div>;
}
