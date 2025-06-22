"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

// ============= TYPES =============

export enum ContentType {
  POST = "POST",
  COMMENT = "COMMENT",
  MESSAGE = "MESSAGE",
  PROFILE = "PROFILE",
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  JOB_POSTING = "JOB_POSTING",
  COMPANY_DESCRIPTION = "COMPANY_DESCRIPTION",
  USER_BIO = "USER_BIO",
  REVIEW = "REVIEW",
}

export enum ModerationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
  UNDER_REVIEW = "UNDER_REVIEW",
  AUTO_APPROVED = "AUTO_APPROVED",
  AUTO_REJECTED = "AUTO_REJECTED",
}

export enum ModerationAction {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  FLAG = "FLAG",
  ESCALATE = "ESCALATE",
  REQUEST_EDIT = "REQUEST_EDIT",
  TEMPORARY_HIDE = "TEMPORARY_HIDE",
  PERMANENT_BAN = "PERMANENT_BAN",
  WARNING = "WARNING",
}

export enum ViolationType {
  SPAM = "SPAM",
  HARASSMENT = "HARASSMENT",
  HATE_SPEECH = "HATE_SPEECH",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  COPYRIGHT_VIOLATION = "COPYRIGHT_VIOLATION",
  FAKE_INFORMATION = "FAKE_INFORMATION",
  VIOLENCE = "VIOLENCE",
  ADULT_CONTENT = "ADULT_CONTENT",
  DISCRIMINATION = "DISCRIMINATION",
  SCAM = "SCAM",
  OFF_TOPIC = "OFF_TOPIC",
  DUPLICATE_CONTENT = "DUPLICATE_CONTENT",
}

export enum SeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AutoModerationRule {
  PROFANITY_FILTER = "PROFANITY_FILTER",
  SPAM_DETECTION = "SPAM_DETECTION",
  LINK_VALIDATION = "LINK_VALIDATION",
  IMAGE_CONTENT_SCAN = "IMAGE_CONTENT_SCAN",
  SENTIMENT_ANALYSIS = "SENTIMENT_ANALYSIS",
  DUPLICATE_DETECTION = "DUPLICATE_DETECTION",
  RATE_LIMITING = "RATE_LIMITING",
}

// ============= INTERFACES =============

export interface ModerationRequest {
  id: string;
  contentType: ContentType;
  contentId: string;
  content: string;
  authorId?: string;
  reporterId?: string;
  status: ModerationStatus;
  severity: SeverityLevel;
  violationTypes: ViolationType[];
  moderatorId?: string;
  moderatorNotes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  metadata?: any;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reporter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  moderator?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ModerationStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  flaggedRequests: number;
  autoModeratedRequests: number;
  averageResolutionTime: number;
  topViolationTypes: Array<{
    type: ViolationType;
    count: number;
    percentage: number;
  }>;
  contentTypeBreakdown: Array<{
    type: ContentType;
    count: number;
    percentage: number;
  }>;
  moderatorPerformance: Array<{
    moderatorId: string;
    moderatorName: string;
    requestsHandled: number;
    averageResolutionTime: number;
  }>;
}

export interface ModerationFilters {
  contentType?: ContentType;
  status?: ModerationStatus;
  severity?: SeverityLevel;
  violationTypes?: ViolationType[];
  authorId?: string;
  moderatorId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  flaggedOnly?: boolean;
  autoModeratedOnly?: boolean;
}

export interface CreateModerationRequest {
  contentType: ContentType;
  contentId: string;
  content: string;
  authorId?: string;
  reporterId?: string;
  reason?: string;
  severity?: SeverityLevel;
  metadata?: any;
}

export interface ModerationDecision {
  action: ModerationAction;
  reason?: string;
  violationTypes?: ViolationType[];
  moderatorNotes?: string;
  notifyAuthor?: boolean;
  customMessage?: string;
}

export interface BulkModerationAction {
  contentIds: string[];
  action: ModerationAction;
  reason?: string;
  notifyAuthors?: boolean;
}

export interface AutoModerationRuleConfig {
  ruleType: AutoModerationRule;
  enabled: boolean;
  configuration?: any;
  threshold?: number;
  action?: ModerationAction;
}

export interface ReportContentData {
  contentId: string;
  contentType: ContentType;
  violationType: ViolationType;
  reason: string;
  additionalInfo?: string;
}

export interface ModerationTrends {
  timeline: Array<{
    date: string;
    totalRequests: number;
    pendingRequests: number;
    resolvedRequests: number;
  }>;
  violationTrends: Array<{
    violationType: ViolationType;
    data: Array<{
      date: string;
      count: number;
    }>;
  }>;
  moderatorActivity: Array<{
    moderatorId: string;
    moderatorName: string;
    data: Array<{
      date: string;
      requestsHandled: number;
    }>;
  }>;
  responseTimesTrend: Array<{
    date: string;
    averageResponseTime: number;
  }>;
}

export interface ModerationQueueSummary {
  pendingCount: number;
  flaggedCount: number;
  urgentCount: number;
  averageWaitTime: number;
  topViolations: Array<{
    type: ViolationType;
    count: number;
  }>;
}

export interface PaginatedModerationResponse {
  success: boolean;
  message: string;
  data: ModerationRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: ModerationFilters;
  stats?: {
    totalPending: number;
    totalFlagged: number;
    totalToday: number;
  };
}

// ============= API FUNCTIONS =============

// Get moderation requests with filters
export const getModerationRequests = async (
  filters: ModerationFilters = {}
): Promise<PaginatedModerationResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const response = await api.get(
    `/content-moderation/requests?${params.toString()}`
  );
  return response.data;
};

// Get specific moderation request
export const getModerationRequest = async (
  requestId: string
): Promise<ModerationRequest> => {
  const response = await api.get(`/content-moderation/requests/${requestId}`);
  return response.data.data;
};

// Create moderation request
export const createModerationRequest = async (
  data: CreateModerationRequest
): Promise<ModerationRequest> => {
  const response = await api.post("/content-moderation/requests", data);
  return response.data.data;
};

// Process moderation decision
export const processModerationDecision = async (
  requestId: string,
  decision: ModerationDecision
): Promise<ModerationRequest> => {
  const response = await api.patch(
    `/content-moderation/requests/${requestId}/decision`,
    decision
  );
  return response.data.data;
};

// Bulk moderation action
export const bulkModerationAction = async (
  data: BulkModerationAction
): Promise<any> => {
  const response = await api.post(
    "/content-moderation/requests/bulk-action",
    data
  );
  return response.data;
};

// Get auto-moderation rules
export const getAutoModerationRules = async (): Promise<
  Record<string, any>
> => {
  const response = await api.get("/content-moderation/auto-moderation/rules");
  return response.data.data;
};

// Update auto-moderation rules
export const updateAutoModerationRules = async (
  rules: AutoModerationRuleConfig[]
): Promise<any> => {
  const response = await api.patch(
    "/content-moderation/auto-moderation/rules",
    { rules }
  );
  return response.data;
};

// Test auto-moderation
export const testAutoModeration = async (
  content: string,
  contentType: ContentType
): Promise<any> => {
  const response = await api.post("/content-moderation/auto-moderation/test", {
    content,
    contentType,
  });
  return response.data.data;
};

// Get moderation statistics
export const getModerationStats = async (
  startDate?: string,
  endDate?: string,
  granularity?: "hour" | "day" | "week" | "month"
): Promise<ModerationStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (granularity) params.append("granularity", granularity);

  const response = await api.get(
    `/content-moderation/analytics/stats?${params.toString()}`
  );
  return response.data.data;
};

// Get moderation trends
export const getModerationTrends = async (
  startDate?: string,
  endDate?: string,
  granularity?: "hour" | "day" | "week" | "month"
): Promise<ModerationTrends> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (granularity) params.append("granularity", granularity);

  const response = await api.get(
    `/content-moderation/analytics/trends?${params.toString()}`
  );
  return response.data.data;
};

// Export moderation data
export const exportModerationData = async (
  format: "csv" | "json" | "excel" = "csv",
  startDate?: string,
  endDate?: string
): Promise<any> => {
  const params = new URLSearchParams();
  params.append("format", format);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await api.get(
    `/content-moderation/analytics/export?${params.toString()}`
  );
  return response.data.data;
};

// Get moderation queue summary
export const getModerationQueueSummary =
  async (): Promise<ModerationQueueSummary> => {
    const response = await api.get("/content-moderation/queue/summary");
    return response.data.data;
  };

// Get moderation guidelines
export const getModerationGuidelines = async (): Promise<any> => {
  const response = await api.get("/content-moderation/guidelines");
  return response.data.data;
};

// Report content
export const reportContent = async (data: ReportContentData): Promise<any> => {
  const response = await api.post("/content-moderation/report", data);
  return response.data.data;
};

// ============= REACT QUERY HOOKS =============

// Hook to get moderation requests
export const useModerationRequests = (filters: ModerationFilters = {}) => {
  return useQuery({
    queryKey: ["moderation-requests", filters],
    queryFn: () => getModerationRequests(filters),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get specific moderation request
export const useModerationRequest = (requestId: string) => {
  return useQuery({
    queryKey: ["moderation-request", requestId],
    queryFn: () => getModerationRequest(requestId),
    enabled: !!requestId,
  });
};

// Hook to create moderation request
export const useCreateModerationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModerationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderation-requests"] });
      toast.success("Moderation request created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create moderation request"
      );
    },
  });
};

// Hook to process moderation decision
export const useProcessModerationDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      decision,
    }: {
      requestId: string;
      decision: ModerationDecision;
    }) => processModerationDecision(requestId, decision),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["moderation-requests"] });
      queryClient.invalidateQueries({
        queryKey: ["moderation-request", variables.requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["moderation-stats"] });
      toast.success("Moderation decision processed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to process moderation decision"
      );
    },
  });
};

// Hook to perform bulk moderation action
export const useBulkModerationAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkModerationAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["moderation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["moderation-stats"] });
      toast.success(
        `Bulk moderation completed: ${data.data.success} successful, ${data.data.failed} failed`
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to perform bulk moderation"
      );
    },
  });
};

// Hook to get auto-moderation rules
export const useAutoModerationRules = () => {
  return useQuery({
    queryKey: ["auto-moderation-rules"],
    queryFn: getAutoModerationRules,
    staleTime: 300000, // 5 minutes
  });
};

// Hook to update auto-moderation rules
export const useUpdateAutoModerationRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAutoModerationRules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auto-moderation-rules"] });
      toast.success("Auto-moderation rules updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update auto-moderation rules"
      );
    },
  });
};

// Hook to test auto-moderation
export const useTestAutoModeration = () => {
  return useMutation({
    mutationFn: ({
      content,
      contentType,
    }: {
      content: string;
      contentType: ContentType;
    }) => testAutoModeration(content, contentType),
    onSuccess: () => {
      toast.success("Auto-moderation test completed");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to test auto-moderation"
      );
    },
  });
};

// Hook to get moderation statistics
export const useModerationStats = (
  startDate?: string,
  endDate?: string,
  granularity?: "hour" | "day" | "week" | "month"
) => {
  return useQuery({
    queryKey: ["moderation-stats", startDate, endDate, granularity],
    queryFn: () => getModerationStats(startDate, endDate, granularity),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Hook to get moderation trends
export const useModerationTrends = (
  startDate?: string,
  endDate?: string,
  granularity?: "hour" | "day" | "week" | "month"
) => {
  return useQuery({
    queryKey: ["moderation-trends", startDate, endDate, granularity],
    queryFn: () => getModerationTrends(startDate, endDate, granularity),
    staleTime: 300000, // 5 minutes
  });
};

// Hook to export moderation data
export const useExportModerationData = () => {
  return useMutation({
    mutationFn: ({
      format,
      startDate,
      endDate,
    }: {
      format?: "csv" | "json" | "excel";
      startDate?: string;
      endDate?: string;
    }) => exportModerationData(format, startDate, endDate),
    onSuccess: (data) => {
      toast.success("Export initiated successfully");
      // Handle download link
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export data");
    },
  });
};

// Hook to get moderation queue summary
export const useModerationQueueSummary = () => {
  return useQuery({
    queryKey: ["moderation-queue-summary"],
    queryFn: getModerationQueueSummary,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get moderation guidelines
export const useModerationGuidelines = () => {
  return useQuery({
    queryKey: ["moderation-guidelines"],
    queryFn: getModerationGuidelines,
    staleTime: 3600000, // 1 hour
  });
};

// Hook to report content
export const useReportContent = () => {
  return useMutation({
    mutationFn: reportContent,
    onSuccess: () => {
      toast.success(
        "Content reported successfully. Our team will review it shortly."
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to report content");
    },
  });
};

// ============= UTILITY FUNCTIONS =============

export const getStatusColor = (status: ModerationStatus): string => {
  switch (status) {
    case ModerationStatus.PENDING:
      return "text-yellow-600 bg-yellow-100";
    case ModerationStatus.APPROVED:
    case ModerationStatus.AUTO_APPROVED:
      return "text-green-600 bg-green-100";
    case ModerationStatus.REJECTED:
    case ModerationStatus.AUTO_REJECTED:
      return "text-red-600 bg-red-100";
    case ModerationStatus.FLAGGED:
      return "text-orange-600 bg-orange-100";
    case ModerationStatus.UNDER_REVIEW:
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case SeverityLevel.LOW:
      return "text-green-600 bg-green-100";
    case SeverityLevel.MEDIUM:
      return "text-yellow-600 bg-yellow-100";
    case SeverityLevel.HIGH:
      return "text-orange-600 bg-orange-100";
    case SeverityLevel.CRITICAL:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getViolationTypeLabel = (type: ViolationType): string => {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getContentTypeLabel = (type: ContentType): string => {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const getModerationActionLabel = (action: ModerationAction): string => {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};
