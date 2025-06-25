import { getToken } from "./auth-utils";
import {
  MessageCandidateData,
  ScheduleInterviewData,
  RejectApplicationData,
  CandidateProfile,
} from "@/types/application-actions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============= JOB SEARCH & RECOMMENDATIONS =============

export interface JobSearchFilters {
  search?: string;
  location?: string;
  jobType?: string[];
  experience?: string[];
  salary?: { min: number; max: number };
  skills?: string[];
  company?: string[];
  industry?: string[];
  remoteOnly?: boolean;
  deadline?: string;
  companySize?: string[];
  benefits?: string[];
  workSchedule?: string[];
  page?: number;
  limit?: number;
}

export interface UserPreferences {
  careerGoals?: string[];
  workEnvironment?: "remote" | "onsite" | "hybrid" | "any";
  companyCulture?: string[];
  learningOpportunities?: boolean;
  workLifeBalance?: number;
  salaryImportance?: number;
  growthPotential?: number;
  industryPreferences?: string[];
  roleTypes?: string[];
  preferredBenefits?: string[];
}

export const searchJobs = async (filters: JobSearchFilters = {}) => {
  const token = getToken();
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.append(key, value.join(","));
        }
      } else if (
        typeof value === "object" &&
        value.min !== undefined &&
        value.max !== undefined
      ) {
        queryParams.append(`${key}_min`, value.min.toString());
        queryParams.append(`${key}_max`, value.max.toString());
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search jobs");
  }

  return response.json();
};

export const getJobById = async (jobId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job details");
  }

  return response.json();
};

export const getAIRecommendations = async (
  limit = 20,
  includeAnalytics = true,
  filters?: JobSearchFilters,
  preferences?: UserPreferences
) => {
  const token = getToken();
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    includeAnalytics: includeAnalytics.toString(),
  });

  // Add filters directly (without filters_ prefix)
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            queryParams.append(key, value.join(","));
          }
        } else if (
          typeof value === "object" &&
          value.min !== undefined &&
          value.max !== undefined
        ) {
          // Handle salary range
          if (value.min !== undefined)
            queryParams.append(`${key}_min`, value.min.toString());
          if (value.max !== undefined)
            queryParams.append(`${key}_max`, value.max.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }

  // Add preferences directly (without preferences_ prefix)
  if (preferences) {
    Object.entries(preferences).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            queryParams.append(key, value.join(","));
          }
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/recommendations/enhanced?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI recommendations");
  }

  return response.json();
};

export const getLearningRecommendations = async () => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/recommendations/enhanced/learning`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch learning recommendations");
  }

  return response.json();
};

export const getCareerPathAnalysis = async () => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/recommendations/enhanced/career-path`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch career path analysis");
  }

  return response.json();
};

export const getMarketIntelligence = async (
  skills?: string[],
  location?: string,
  industry?: string
) => {
  const token = getToken();
  const queryParams = new URLSearchParams();

  if (skills && skills.length > 0) {
    queryParams.append("skills", skills.join(","));
  }
  if (location) {
    queryParams.append("location", location);
  }
  if (industry) {
    queryParams.append("industry", industry);
  }

  const response = await fetch(
    `${API_BASE_URL}/recommendations/enhanced/market-intelligence?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch market intelligence");
  }

  return response.json();
};

export const getCareerDashboard = async () => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/recommendations/enhanced/dashboard`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch career dashboard");
  }

  return response.json();
};

export const saveJob = async (jobId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to save job");
  }

  return response.json();
};

export const unsaveJob = async (jobId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/unsave`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to unsave job");
  }

  return response.json();
};

export const applyToJob = async (
  jobId: string,
  applicationData: {
    resumeUrl?: string;
    coverLetter?: string;
    additionalDocuments?: string[];
  }
) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error("Failed to apply to job");
  }

  return response.json();
};

export const getMyApplications = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const token = getToken();
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/applications/my-applications?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }

  return response.json();
};

export const getSavedJobs = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/saved`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch saved jobs");
  }

  return response.json();
};

export const getJobStats = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch job statistics");
  }

  return response.json();
};

// ============= JOB APPLICATION MANAGEMENT =============

export const shortlistCandidate = async (
  jobId: string,
  applicationId: string,
  message?: string
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/shortlist`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to shortlist candidate");
  }

  return response.json();
};

export const rejectApplication = async (
  jobId: string,
  applicationId: string,
  data: RejectApplicationData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/reject`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reject application");
  }

  return response.json();
};

export const scheduleInterview = async (
  jobId: string,
  applicationId: string,
  interviewData: ScheduleInterviewData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/schedule-interview`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interviewData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to schedule interview");
  }

  return response.json();
};

export const messageCandidate = async (
  jobId: string,
  applicationId: string,
  messageData: MessageCandidateData
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications/${applicationId}/message`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const getCandidateProfile = async (
  userId: string
): Promise<CandidateProfile> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch candidate profile");
  }

  return response.json();
};

// ============= CHAT MANAGEMENT =============

export const getConversations = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const data = await response.json();
  console.log("CHATS RESPONSE", data);
  return data;
};

export const getConversationMessages = async (
  conversationId: string,
  limit = 50,
  offset = 0
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/chats/${conversationId}?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversation messages");
  }

  const data = await response.json();
  console.log("CHATS ARE RETRIEVED =======>", data);
  return data;
};

export async function sendMessage(
  content: string,
  targetUserId?: string,
  options?: {
    attachments?: string[];
    metadata?: any;
    replyTo?: string;
    groupId?: string;
  }
) {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      content,
      targetUserId,
      ...options,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return data;
}

export async function sendDirectMessage(targetUserId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/messages/direct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      targetUserId,
      content,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send direct message");
  }

  return data;
}

export const createChatGroup = async (
  name: string,
  members: string[],
  description?: string
) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats/groups`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      members,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat group");
  }

  return response.json();
};

export const getUserGroups = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/chats/groups`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user groups");
  }

  return response.json();
};

export async function getUsers(options?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.role) params.append("role", options.role);
  if (options?.search) params.append("search", options.search);

  const response = await fetch(`${API_BASE_URL}/users?${params}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data;
}

// User Profile APIs
export const getCurrentUser = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch current user");
  return response.json();
};

export const updateUserProfile = async (updates: any) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
};

export const getUniversities = async (search = "", limit = 50) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/users/universities?search=${encodeURIComponent(search)}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch universities");
  return response.json();
};

export const addSkill = async (skillName: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/me/skills`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: skillName }),
  });

  if (!response.ok) throw new Error("Failed to add skill");
  return response.json();
};

export const removeSkill = async (skillId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/me/skills/${skillId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to remove skill");
  return response.json();
};

// ============= STUDENT EDUCATION MANAGEMENT =============

export const addStudentEducation = async (educationData: {
  universityId: string;
  degree?: string;
  major?: string;
  minor?: string;
  gpa?: number;
  maxGpa?: number;
  graduationYear?: number;
  startYear?: number;
  status?: string;
  activities?: string[];
  honors?: string[];
  isCurrently?: boolean;
}) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/student-education`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(educationData),
  });

  if (!response.ok) throw new Error("Failed to add education record");
  return response.json();
};

export const getStudentEducations = async () => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/student-education`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch education records");
  return response.json();
};

export const updateStudentEducation = async (
  educationId: string,
  updateData: {
    degree?: string;
    major?: string;
    minor?: string;
    gpa?: number;
    maxGpa?: number;
    graduationYear?: number;
    startYear?: number;
    status?: string;
    activities?: string[];
    honors?: string[];
    isCurrently?: boolean;
  }
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/users/student-education/${educationId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) throw new Error("Failed to update education record");
  return response.json();
};

export const deleteStudentEducation = async (educationId: string) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/users/student-education/${educationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to delete education record");
  return response.json();
};

// ============= CV UPLOAD =============

export const uploadCV = async (cvUrl: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/upload-cv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cvUrl }),
  });

  if (!response.ok) throw new Error("Failed to upload CV");
  return response.json();
};

// Events API
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  type: string;
  category: EventCategory;
  tags: string[];
  startDate: string;
  endDate: string;
  timezone: string;
  duration?: number;
  location: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  mode: EventMode;
  meetingLink?: string;
  streamingUrl?: string;
  capacity: number;
  currentAttendees: number;
  registrationDeadline?: string;
  registrationFee: number;
  isRegistrationOpen: boolean;
  requiresApproval: boolean;
  status: EventStatus;
  isPublic: boolean;
  isFeatured: boolean;
  priority: EventPriority;
  bannerImage?: string;
  gallery?: string[];
  agenda?: any;
  speakers?: any;
  sponsors?: any;
  resources?: string[];
  enableNetworking: boolean;
  enableChat: boolean;
  enableQA: boolean;
  viewCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
    website?: string;
  };
  university?: {
    id: string;
    name: string;
    logo?: string;
    website?: string;
  };
  registrations?: EventRegistration[];
  feedback?: EventFeedback[];
  _count: {
    registrations: number;
    attendees: number;
    feedback: number;
  };
  isRegistered?: boolean;
  isSaved?: boolean;
}

export enum EventCategory {
  CAREER_FAIR = "CAREER_FAIR",
  JOB_FAIR = "JOB_FAIR",
  NETWORKING_EVENT = "NETWORKING_EVENT",
  TECH_TALK = "TECH_TALK",
  WORKSHOP = "WORKSHOP",
  WEBINAR = "WEBINAR",
  CONFERENCE = "CONFERENCE",
  SEMINAR = "SEMINAR",
  HACKATHON = "HACKATHON",
  COMPETITION = "COMPETITION",
  PANEL_DISCUSSION = "PANEL_DISCUSSION",
  INTERVIEW_PREP = "INTERVIEW_PREP",
  RESUME_REVIEW = "RESUME_REVIEW",
  SKILL_BUILDING = "SKILL_BUILDING",
  INDUSTRY_MIXER = "INDUSTRY_MIXER",
  STARTUP_PITCH = "STARTUP_PITCH",
  RESEARCH_SYMPOSIUM = "RESEARCH_SYMPOSIUM",
  MENTORSHIP_EVENT = "MENTORSHIP_EVENT",
  COMPANY_SHOWCASE = "COMPANY_SHOWCASE",
  VIRTUAL_BOOTH = "VIRTUAL_BOOTH",
  CAMPUS_VISIT = "CAMPUS_VISIT",
  INFO_SESSION = "INFO_SESSION",
  OPEN_HOUSE = "OPEN_HOUSE",
  GRADUATION_EVENT = "GRADUATION_EVENT",
  ALUMNI_MEETUP = "ALUMNI_MEETUP",
}

export enum EventMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  HYBRID = "HYBRID",
}

export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export enum EventPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum RegistrationStatus {
  REGISTERED = "REGISTERED",
  WAITLISTED = "WAITLISTED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  attendanceStatus?: string;
  registeredAt: string;
  checkedInAt?: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  emergencyContact?: string;
  tshirtSize?: string;
  interests?: string[];
  goals?: string;
  lookingFor?: string[];
  industries?: string[];
  skills?: string[];
  experience?: string;
  event?: Event;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  overallRating: number;
  contentRating?: number;
  organizationRating?: number;
  venueRating?: number;
  networkingRating?: number;
  feedback?: string;
  improvements?: string;
  highlights?: string;
  wouldRecommend?: boolean;
  wouldAttendAgain?: boolean;
  isAnonymous: boolean;
  isPublic: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface EventSearchParams {
  search?: string;
  category?: EventCategory;
  mode?: EventMode;
  status?: EventStatus;
  city?: string;
  state?: string;
  country?: string;
  startDateFrom?: string;
  startDateTo?: string;
  companyId?: string;
  universityId?: string;
  isFeatured?: boolean;
  isFree?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RegisterForEventData {
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  emergencyContact?: string;
  tshirtSize?: string;
  interests?: string[];
  goals?: string;
  lookingFor?: string[];
  industries?: string[];
  skills?: string[];
  experience?: string;
}

export interface EventFeedbackData {
  overallRating: number;
  contentRating?: number;
  organizationRating?: number;
  venueRating?: number;
  networkingRating?: number;
  feedback?: string;
  improvements?: string;
  highlights?: string;
  wouldRecommend?: boolean;
  wouldAttendAgain?: boolean;
  isAnonymous?: boolean;
  isPublic?: boolean;
}

// Events API Functions
export async function getEvents(
  params?: EventSearchParams
): Promise<EventsResponse> {
  try {
    const token = getToken();
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/events?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getEventById(eventId: string): Promise<Event> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function getFeaturedEvents(limit: number = 6): Promise<Event[]> {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_BASE_URL}/events/featured?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching featured events:", error);
    throw error;
  }
}

export async function getUpcomingEvents(limit: number = 10): Promise<Event[]> {
  try {
    const token = getToken();
    const response = await fetch(
      `${API_BASE_URL}/events/upcoming?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
}

export async function getMyEvents(
  status?: RegistrationStatus
): Promise<EventRegistration[]> {
  try {
    const token = getToken();
    const queryParams = new URLSearchParams();
    if (status) {
      queryParams.append("status", status);
    }

    const response = await fetch(
      `${API_BASE_URL}/events/my-events?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch my events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my events:", error);
    throw error;
  }
}

export async function registerForEvent(
  eventId: string,
  data: RegisterForEventData
): Promise<EventRegistration> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register for event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
}

export async function cancelEventRegistration(
  eventId: string
): Promise<{ message: string }> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to cancel registration");
    }

    return await response.json();
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error;
  }
}

export async function checkInToEvent(eventId: string): Promise<any> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/checkin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to check in");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking in to event:", error);
    throw error;
  }
}

export async function submitEventFeedback(
  eventId: string,
  data: EventFeedbackData
): Promise<EventFeedback> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/feedback`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

// Saved Events API (assuming you have a saved events system)
export async function saveEvent(eventId: string): Promise<{ message: string }> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving event:", error);
    throw error;
  }
}

export async function unsaveEvent(
  eventId: string
): Promise<{ message: string }> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/save`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to unsave event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error unsaving event:", error);
    throw error;
  }
}

export async function getSavedEvents(): Promise<Event[]> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/events/saved`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch saved events");
  }

  return response.json();
}

// ============= INTERNSHIPS API =============

export interface InternshipSearchFilters {
  search?: string;
  locations?: string[];
  companies?: string[];
  types?: string[];
  duration?: string;
  compensationType?: string;
  minStipend?: number;
  maxStipend?: number;
  graduationYear?: number;
  minGpa?: number;
  majors?: string[];
  skills?: string[];
  housingProvided?: boolean;
  mentorshipProvided?: boolean;
  fullTimeConversion?: boolean;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Internship {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  type: string;
  jobType: string;
  location: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: string;
  };
  applicationDeadline: string;
  status: string;
  isInternship: boolean;
  duration: string;
  customDuration?: string;
  compensationType: string;
  stipendAmount?: number;
  housingProvided: boolean;
  housingStipend?: number;
  transportationStipend?: number;
  mealAllowance?: number;
  academicCredit: boolean;
  creditHours?: number;
  programName?: string;
  cohortSize?: number;
  mentorshipProvided: boolean;
  trainingProvided: boolean;
  networkingEvents: boolean;
  gpaRequirement?: number;
  graduationYear?: number;
  eligibleMajors: string[];
  preferredSkills: string[];
  portfolioRequired: boolean;
  transcriptRequired: boolean;
  applicationOpenDate?: string;
  startDate?: string;
  endDate?: string;
  fullTimeConversion: boolean;
  returnOfferRate?: number;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    website?: string;
    description?: string;
  };
  postedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    applications: number;
  };
  isApplied?: boolean;
  isSaved?: boolean;
}

export interface InternshipStats {
  totalInternships: number;
  appliedInternships: number;
  savedInternships: number;
  interviewInvites: number;
  acceptedApplications: number;
  pendingApplications: number;
}

export interface InternshipApplication {
  id: string;
  resumeUrl: string;
  coverLetter?: string;
  status: string;
  feedback?: string;
  appliedAt: string;
  updatedAt: string;
  job: Internship;
}

export async function searchInternships(
  filters: InternshipSearchFilters = {}
): Promise<{
  internships: Internship[];
  total: number;
  hasMore: boolean;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    pages: number;
    currentPage: number;
  };
}> {
  const token = getToken();
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.append(key, value.join(","));
        }
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/internships/search?${queryParams}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search internships");
  }

  const data = await response.json();

  // Transform userApplication to isApplied for frontend compatibility
  if (data.internships) {
    data.internships = data.internships.map((internship: any) => ({
      ...internship,
      isApplied: !!internship.userApplication,
      userApplication: undefined, // Remove this field to keep interface clean
    }));
  }

  return data;
}

export async function getInternshipById(
  internshipId: string
): Promise<Internship> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/internships/${internshipId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch internship details");
  }

  const data = await response.json();

  // Transform userApplication to isApplied for frontend compatibility
  return {
    ...data,
    isApplied: !!data.userApplication,
    userApplication: undefined, // Remove this field to keep interface clean
  };
}

export async function getInternshipStats(): Promise<InternshipStats> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/internships/dashboard/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch internship stats");
  }

  return response.json();
}

export async function applyToInternship(
  internshipId: string,
  applicationData: {
    resumeUrl?: string;
    coverLetter?: string;
    additionalDocuments?: string[];
  }
): Promise<InternshipApplication> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/internships/applications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      internshipId,
      ...applicationData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to apply to internship");
  }

  return response.json();
}

export async function saveInternship(
  internshipId: string
): Promise<{ message: string }> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/internships/${internshipId}/save`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save internship");
  }

  return response.json();
}

export async function unsaveInternship(
  internshipId: string
): Promise<{ message: string }> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/internships/${internshipId}/unsave`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unsave internship");
  }

  return response.json();
}

export async function getMyInternshipApplications(filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{
  applications: InternshipApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const token = getToken();
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/internships/applications/my?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch internship applications");
  }

  return response.json();
}

export async function getSavedInternships(): Promise<Internship[]> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/internships/saved/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch saved internships");
  }

  return response.json();
}

export async function getInternshipCompanies(): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/internships/popular-companies`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch internship companies");
    }

    const data = await response.json();
    // Handle both string array and object array responses
    return Array.isArray(data)
      ? data.map((item) => (typeof item === "string" ? item : item.name))
      : [];
  } catch (error) {
    console.error("Error fetching internship companies:", error);
    throw error;
  }
}

export async function getInternshipLocations(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/internships/locations`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch internship locations");
    }

    const data = await response.json();
    // Handle both string array and object array responses
    return Array.isArray(data)
      ? data.map((item) => (typeof item === "string" ? item : item.name))
      : [];
  } catch (error) {
    console.error("Error fetching internship locations:", error);
    throw error;
  }
}

export async function getInternshipTypes(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/internships/types`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch internship types");
    }

    const data = await response.json();
    // Handle both string array and object array responses
    return Array.isArray(data)
      ? data.map((item) => (typeof item === "string" ? item : item.name))
      : [];
  } catch (error) {
    console.error("Error fetching internship types:", error);
    throw error;
  }
}
