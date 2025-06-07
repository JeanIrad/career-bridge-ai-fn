"use client";

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

interface DashboardContentProps {
  activeTab: string;
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'jobs':
        return <JobOpportunities />;
      case 'internships':
        return <Internships />;
      case 'alumni':
        return <AlumniNetwork />;
      case 'messages':
        return <Messages />;
      case 'events':
        return <Events />;
      case 'learning':
        return <LearningHub />;
      case 'analytics':
        return <CareerAnalytics />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}