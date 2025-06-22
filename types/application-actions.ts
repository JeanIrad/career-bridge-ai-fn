// Application Action Models

export interface MessageCandidateData {
  subject: string;
  message: string;
}

export interface ScheduleInterviewData {
  scheduledDate: string;
  scheduledTime: string;
  interviewType: "PHONE" | "VIDEO" | "IN_PERSON";
  location?: string;
  meetingLink?: string;
  notes?: string;
  duration?: number; // in minutes
}

export interface RejectApplicationData {
  reason: string;
  feedback?: string;
  allowReapplication?: boolean;
}

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  avatar?: string;
  headline?: string;
  bio?: string;
  skills: Array<{
    id: string;
    name: string;
    endorsements?: number;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    grade?: string;
  }>;
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    location?: string;
  }>;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface ApplicationActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface NotificationData {
  title: string;
  content: string;
  type: "MESSAGE" | "INTERVIEW" | "APPLICATION_STATUS" | "GENERAL";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  link?: string;
}
