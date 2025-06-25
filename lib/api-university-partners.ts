import { getToken } from "./auth-utils";
import { API_URL } from "./config";

// Enhanced interfaces matching our new schema
export interface University {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  timezone?: string;
  type: UniversityType;
  accreditation?: string;
  establishedYear?: number;
  studentCount?: number;
  facultyCount?: number;
  worldRanking?: number;
  nationalRanking?: number;
  isTopTier: boolean;
  logo?: string;
  banner?: string;
  colors?: any;
  departments: string[];
  popularMajors: string[];
  graduationRate?: number;
  employmentRate?: number;
  isPartnershipReady: boolean;
  partnershipEmail?: string;
  partnershipContact?: string;
  isActive: boolean;
  isVerified: boolean;
  recommendationScore?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    partnerships: number;
    campusEvents: number;
  };
}

export interface UniversityPartnership {
  id: string;
  title: string;
  description?: string;
  status: PartnershipStatus;
  priority: PartnershipPriority;
  startDate?: string;
  endDate?: string;
  renewalDate?: string;
  isRenewable: boolean;
  partnershipType: PartnershipType[];
  targetStudentYear: StudentYear[];
  targetMajors: string[];
  targetSkills: string[];
  annualHiringGoal: number;
  internshipGoal: number;
  coopGoal: number;
  entryLevelGoal: number;
  studentsHired: number;
  internsHired: number;
  coopStudentsHired: number;
  applicationsReceived: number;
  benefits?: any;
  scholarshipAmount?: number;
  equipmentDonation?: string;
  guestLectures: boolean;
  industryProjects: boolean;
  researchCollaboration: boolean;
  requirements?: any;
  exclusiveAccess: boolean;
  minimumGPA?: number;
  requiredCertifications: string[];
  companyContactName?: string;
  companyContactEmail?: string;
  companyContactPhone?: string;
  universityContactName?: string;
  universityContactEmail?: string;
  campusRecruitment: boolean;
  virtualRecruitment: boolean;
  careerFairs: boolean;
  infoSessions: boolean;
  networkingEvents: boolean;
  partnershipFee?: number;
  recruitmentFee?: number;
  currency: string;
  avgTimeToHire?: number;
  retentionRate?: number;
  satisfactionScore?: number;
  contractSigned: boolean;
  contractUrl?: string;
  complianceNotes?: string;
  lastActivityDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  universityId: string;
  companyId: string;
  createdById: string;
  university?: University;
  company?: {
    id: string;
    name: string;
    logo?: string;
    industry: string;
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    campusEvents: number;
    recruitmentCampaigns: number;
  };
}

export interface UniversityEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  eventType: string;
  isVirtual: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  registrationDeadline?: string;
  isPublic: boolean;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityVisit {
  id: string;
  purpose: string;
  visitDate: string;
  duration: number;
  location: string;
  attendees: string[];
  agenda: string;
  notes?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  createdAt: string;
  updatedAt: string;
}

// Enums
export enum UniversityType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  COMMUNITY_COLLEGE = "COMMUNITY_COLLEGE",
  TECHNICAL_SCHOOL = "TECHNICAL_SCHOOL",
  RESEARCH_UNIVERSITY = "RESEARCH_UNIVERSITY",
  LIBERAL_ARTS = "LIBERAL_ARTS",
  HISTORICALLY_BLACK = "HISTORICALLY_BLACK",
  WOMEN_COLLEGE = "WOMEN_COLLEGE",
  RELIGIOUS = "RELIGIOUS",
  MILITARY = "MILITARY",
  ONLINE = "ONLINE",
  FOR_PROFIT = "FOR_PROFIT",
}

export enum PartnershipStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
  REJECTED = "REJECTED",
}

export enum PartnershipPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum PartnershipType {
  INTERNSHIP_PROGRAM = "INTERNSHIP_PROGRAM",
  FULL_TIME_RECRUITMENT = "FULL_TIME_RECRUITMENT",
  CO_OP_PROGRAM = "CO_OP_PROGRAM",
  RESEARCH_COLLABORATION = "RESEARCH_COLLABORATION",
  GUEST_LECTURES = "GUEST_LECTURES",
  SCHOLARSHIP_PROGRAM = "SCHOLARSHIP_PROGRAM",
  EQUIPMENT_DONATION = "EQUIPMENT_DONATION",
  MENTORSHIP_PROGRAM = "MENTORSHIP_PROGRAM",
  CAREER_SERVICES = "CAREER_SERVICES",
  PROJECT_BASED = "PROJECT_BASED",
  CONSULTING = "CONSULTING",
  STARTUP_INCUBATION = "STARTUP_INCUBATION",
}

export enum StudentYear {
  FRESHMAN = "FRESHMAN",
  SOPHOMORE = "SOPHOMORE",
  JUNIOR = "JUNIOR",
  SENIOR = "SENIOR",
  GRADUATE = "GRADUATE",
  PHD = "PHD",
  POST_DOC = "POST_DOC",
}

// Request/Response interfaces
export interface CreatePartnershipData {
  universityId: string;
  companyId: string;
  title: string;
  description?: string;
  priority?: PartnershipPriority;
  partnershipType?: PartnershipType[];
  targetStudentYear?: StudentYear[];
  targetMajors?: string[];
  targetSkills?: string[];
  annualHiringGoal?: number;
  internshipGoal?: number;
  coopGoal?: number;
  entryLevelGoal?: number;
  benefits?: any;
  scholarshipAmount?: number;
  equipmentDonation?: string;
  guestLectures?: boolean;
  industryProjects?: boolean;
  researchCollaboration?: boolean;
  requirements?: any;
  exclusiveAccess?: boolean;
  minimumGPA?: number;
  requiredCertifications?: string[];
  companyContactName?: string;
  companyContactEmail?: string;
  companyContactPhone?: string;
  campusRecruitment?: boolean;
  virtualRecruitment?: boolean;
  careerFairs?: boolean;
  infoSessions?: boolean;
  networkingEvents?: boolean;
  partnershipFee?: number;
  recruitmentFee?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface UniversitySearchParams {
  search?: string;
  country?: string;
  type?: UniversityType;
  isPartnershipReady?: boolean;
  page?: number;
  limit?: number;
}

export interface PartnershipFilters {
  status?: PartnershipStatus;
  priority?: PartnershipPriority;
  partnershipType?: PartnershipType;
  page?: number;
  limit?: number;
}

export interface PartnershipAnalytics {
  totalPartnerships: number;
  activePartnerships: number;
  pendingPartnerships: number;
  draftPartnerships: number;
  totalHiringGoals: number;
  totalInternshipGoals: number;
  totalStudentsHired: number;
  totalInternsHired: number;
  universityTypes: Record<string, number>;
  topTierPartnerships: number;
  partnershipTypes: Record<string, number>;
  recentPartnerships: number;
}

export interface PartnershipStats {
  totalApplications: number;
  totalHires: number;
  averageTimeToHire: number;
  topSkills: string[];
  applicationTrends: any[];
  hiringTrends: any[];
  universityRankings: any[];
  departmentPerformance: any[];
  lastEventDate?: string | null;
  lastVisitDate?: string | null;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============= UNIVERSITY OPERATIONS =============

export const searchUniversities = async (
  params: UniversitySearchParams = {}
): Promise<{
  universities: University[];
  pagination: any;
}> => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.country) searchParams.append("country", params.country);
  if (params.type) searchParams.append("type", params.type);
  if (params.isPartnershipReady !== undefined)
    searchParams.append(
      "isPartnershipReady",
      params.isPartnershipReady.toString()
    );
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());

  const response = await fetch(
    `${API_URL}/university-partners/universities?${searchParams}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to search universities");
  }

  return response.json();
};

export const getUniversityById = async (id: string): Promise<University> => {
  const response = await fetch(
    `${API_URL}/university-partners/universities/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch university");
  }

  return response.json();
};

// ============= PARTNERSHIP OPERATIONS =============

export const createPartnership = async (
  data: CreatePartnershipData
): Promise<UniversityPartnership> => {
  const response = await fetch(`${API_URL}/university-partners/partnerships`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create partnership");
  }

  return response.json();
};

export const getCompanyPartnerships = async (
  companyId: string,
  filters: PartnershipFilters = {}
): Promise<{
  partnerships: UniversityPartnership[];
  pagination: any;
}> => {
  const searchParams = new URLSearchParams();
  if (filters.status) searchParams.append("status", filters.status);
  if (filters.priority) searchParams.append("priority", filters.priority);
  if (filters.partnershipType)
    searchParams.append("partnershipType", filters.partnershipType);
  if (filters.page) searchParams.append("page", filters.page.toString());
  if (filters.limit) searchParams.append("limit", filters.limit.toString());

  const response = await fetch(
    `${API_URL}/university-partners/partnerships/company/${companyId}?${searchParams}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch partnerships");
  }

  return response.json();
};

export const getPartnershipById = async (
  id: string
): Promise<UniversityPartnership> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch partnership");
  }

  return response.json();
};

export const updatePartnership = async (
  id: string,
  data: Partial<CreatePartnershipData>
): Promise<UniversityPartnership> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update partnership");
  }

  return response.json();
};

export const deletePartnership = async (id: string): Promise<void> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete partnership");
  }
};

export const submitPartnership = async (
  id: string
): Promise<UniversityPartnership> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/${id}/submit`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit partnership");
  }

  return response.json();
};

// ============= ANALYTICS AND RECOMMENDATIONS =============

export const getPartnershipAnalytics = async (
  companyId: string
): Promise<PartnershipAnalytics> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/company/${companyId}/analytics`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch analytics");
  }

  return response.json();
};

export const getPartnershipRecommendations = async (
  companyId: string
): Promise<University[]> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/company/${companyId}/recommendations`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch recommendations");
  }

  return response.json();
};

// ============= UTILITY FUNCTIONS =============

export const getPartnershipStatusLabel = (
  status: PartnershipStatus
): string => {
  const labels: Record<PartnershipStatus, string> = {
    [PartnershipStatus.DRAFT]: "Draft",
    [PartnershipStatus.PENDING]: "Pending Review",
    [PartnershipStatus.UNDER_REVIEW]: "Under Review",
    [PartnershipStatus.APPROVED]: "Approved",
    [PartnershipStatus.ACTIVE]: "Active",
    [PartnershipStatus.PAUSED]: "Paused",
    [PartnershipStatus.EXPIRED]: "Expired",
    [PartnershipStatus.TERMINATED]: "Terminated",
    [PartnershipStatus.REJECTED]: "Rejected",
  };
  return labels[status] || status;
};

export const getPartnershipStatusColor = (
  status: PartnershipStatus
): string => {
  const colors: Record<PartnershipStatus, string> = {
    [PartnershipStatus.DRAFT]: "gray",
    [PartnershipStatus.PENDING]: "yellow",
    [PartnershipStatus.UNDER_REVIEW]: "blue",
    [PartnershipStatus.APPROVED]: "green",
    [PartnershipStatus.ACTIVE]: "green",
    [PartnershipStatus.PAUSED]: "orange",
    [PartnershipStatus.EXPIRED]: "red",
    [PartnershipStatus.TERMINATED]: "red",
    [PartnershipStatus.REJECTED]: "red",
  };
  return colors[status] || "gray";
};

export const getPriorityLabel = (priority: PartnershipPriority): string => {
  const labels: Record<PartnershipPriority, string> = {
    [PartnershipPriority.LOW]: "Low Priority",
    [PartnershipPriority.MEDIUM]: "Medium Priority",
    [PartnershipPriority.HIGH]: "High Priority",
    [PartnershipPriority.CRITICAL]: "Critical Priority",
  };
  return labels[priority] || priority;
};

export const getPartnershipTypeLabel = (type: PartnershipType): string => {
  const labels: Record<PartnershipType, string> = {
    [PartnershipType.INTERNSHIP_PROGRAM]: "Internship Program",
    [PartnershipType.FULL_TIME_RECRUITMENT]: "Full-time Recruitment",
    [PartnershipType.CO_OP_PROGRAM]: "Co-op Program",
    [PartnershipType.RESEARCH_COLLABORATION]: "Research Collaboration",
    [PartnershipType.GUEST_LECTURES]: "Guest Lectures",
    [PartnershipType.SCHOLARSHIP_PROGRAM]: "Scholarship Program",
    [PartnershipType.EQUIPMENT_DONATION]: "Equipment Donation",
    [PartnershipType.MENTORSHIP_PROGRAM]: "Mentorship Program",
    [PartnershipType.CAREER_SERVICES]: "Career Services",
    [PartnershipType.PROJECT_BASED]: "Project-based Collaboration",
    [PartnershipType.CONSULTING]: "Consulting",
    [PartnershipType.STARTUP_INCUBATION]: "Startup Incubation",
  };
  return labels[type] || type;
};

export const getStudentYearLabel = (year: StudentYear): string => {
  const labels: Record<StudentYear, string> = {
    [StudentYear.FRESHMAN]: "Freshman",
    [StudentYear.SOPHOMORE]: "Sophomore",
    [StudentYear.JUNIOR]: "Junior",
    [StudentYear.SENIOR]: "Senior",
    [StudentYear.GRADUATE]: "Graduate",
    [StudentYear.PHD]: "PhD",
    [StudentYear.POST_DOC]: "Post-doc",
  };
  return labels[year] || year;
};

export const getPartnershipPriorityLabel = (
  priority: PartnershipPriority
): string => {
  const labels: Record<PartnershipPriority, string> = {
    [PartnershipPriority.LOW]: "Low",
    [PartnershipPriority.MEDIUM]: "Medium",
    [PartnershipPriority.HIGH]: "High",
    [PartnershipPriority.CRITICAL]: "Critical",
  };
  return labels[priority] || priority;
};

export const getUniversityRecommendations = async (
  companyId: string
): Promise<{
  success: boolean;
  data: University[];
}> => {
  try {
    const response = await fetch(
      `${API_URL}/university-partners/partnerships/company/${companyId}/recommendations`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching university recommendations:", error);
    throw error;
  }
};

// Event management functions
export const createEvent = async (
  eventData: Partial<UniversityEvent>
): Promise<UniversityEvent> => {
  try {
    const response = await fetch(`${API_URL}/university-partners/events`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const getEvents = async (
  params: any = {}
): Promise<{
  events: UniversityEvent[];
  pagination: any;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/university-partners/events?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<UniversityEvent>
): Promise<UniversityEvent> => {
  try {
    const response = await fetch(
      `${API_URL}/university-partners/events/${eventId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}/university-partners/events/${eventId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const getPartnershipStats = async (
  partnershipId: string
): Promise<PartnershipStats> => {
  const response = await fetch(
    `${API_URL}/university-partners/partnerships/${partnershipId}/stats`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch partnership stats");
  }

  const data = await response.json();
  return data.data;
};

// ============= VISIT MANAGEMENT (PLACEHOLDER) =============

export const createVisit = async (
  partnershipId: string,
  visitData: any
): Promise<UniversityVisit> => {
  // Placeholder implementation
  return {
    id: `visit-${Date.now()}`,
    purpose: visitData.purpose,
    visitDate: visitData.visitDate,
    duration: visitData.duration,
    location: visitData.location,
    attendees: visitData.attendees,
    agenda: visitData.agenda,
    notes: visitData.notes,
    status: "SCHEDULED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getPartnershipVisits = async (
  partnershipId: string
): Promise<UniversityVisit[]> => {
  // Placeholder implementation
  return [];
};

export const updateVisit = async (
  visitId: string,
  visitData: any
): Promise<UniversityVisit> => {
  // Placeholder implementation
  return {
    id: visitId,
    purpose: visitData.purpose,
    visitDate: visitData.visitDate,
    duration: visitData.duration,
    location: visitData.location,
    attendees: visitData.attendees,
    agenda: visitData.agenda,
    notes: visitData.notes,
    status: visitData.status || "SCHEDULED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const deleteVisit = async (visitId: string): Promise<void> => {
  // Placeholder implementation
  console.log(`Deleting visit ${visitId}`);
};
