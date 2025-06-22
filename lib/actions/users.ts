import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { toastErrorStyles, toastSuccessStyles } from "../utils";

// ============= TYPES & INTERFACES =============

export interface UserSearchFilters {
  search?: string;
  roles?: string[];
  skills?: string[];
  cities?: string[];
  countries?: string[];
  fields?: string[];
  institutions?: string[];
  universities?: string[];
  isVerified?: boolean;
  graduationYears?: number[];
  minGpa?: number;
  maxGpa?: number;
  availability?: string[];
  minExperience?: number;
  maxExperience?: number;
  visibility?: string[];
  studentIds?: string[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserSearchParams extends PaginationParams {
  filters?: UserSearchFilters;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  accountStatus: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  city?: string;
  country?: string;
  visibility: string;
  education: any[];
  experiences: any[];
  skills: any[];
  createdAt: string;
  updatedAt: string;
  // Extended profile fields
  phoneNumber?: string;
  address?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  interests?: string[];
  isPublic?: boolean;
  socialLinks?: any;
  // Student/Alumni specific
  university?: string;
  studentId?: string;
  gpa?: number;
  graduationYear?: number;
  availability?: string;
}

export interface PaginatedUsersResponse {
  success: boolean;
  data: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  roleDistribution: {
    students: number;
    alumni: number;
    employers: number;
    professors: number;
  };
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    notSpecified: number;
  };
  activeUsers: number;
  verificationRate: number;
}

export interface UserGrowth {
  month: string;
  newUsers: number;
  totalUsers: number;
  growthRate: number;
}

export interface ActivityMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
}

export interface PlatformUsage {
  feature: string;
  usageCount: number;
  adoptionRate: number;
  growthRate: number;
}

export interface GeographicData {
  country: string;
  userCount: number;
  percentage: number;
  countryCode: string;
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  userGrowthRate: number;
  retentionRate: number;
}

export interface ComprehensiveAnalytics {
  overview: AnalyticsOverview;
  userGrowth: UserGrowth[];
  activityMetrics: ActivityMetrics;
  platformUsage: PlatformUsage[];
  geographicData: GeographicData[];
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    notSpecified: number;
  };
  roleDistribution: {
    students: number;
    alumni: number;
    employers: number;
    professors: number;
  };
}

export interface RecommendationFilters {
  targetRoles: string[];
  requiredSkills?: string[];
  preferredLocations?: string[];
  minExperience?: number;
  industries?: string[];
}

export interface RecommendationParams extends PaginationParams {
  filters: RecommendationFilters;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  roles?: string[];
  genders?: string[];
  countries?: string[];
  isVerified?: boolean;
  accountStatus?: string[];
  timeRange?: "7d" | "30d" | "90d" | "6m" | "1y" | "all";
}

export interface ExportReport {
  reportType:
    | "comprehensive"
    | "users"
    | "growth"
    | "engagement"
    | "geographic";
  format: "csv" | "json" | "xlsx" | "pdf";
  filters?: AnalyticsFilters;
  sections?: string[];
  includeCharts?: boolean;
}

// ============= GENERAL USER FETCHING =============

/**
 * Fetch all users with advanced search and filtering
 */
export const useSearchUsers = (params: UserSearchParams) => {
  return useQuery({
    queryKey: ["users", "search", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const flatParams = flattenSearchParams(params);
        const response = await api.get("/users/search", { params: flatParams });
        return response.data;
      } catch (error: any) {
        console.error("Error searching users:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch current user profile
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["users", "current"],
    queryFn: async (): Promise<UserProfile> => {
      try {
        const response = await api.get("/users/me");
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching current user:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch user profile by ID
 */
export const useUserProfile = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users", "profile", userId],
    queryFn: async (): Promise<UserProfile> => {
      try {
        const response = await api.get(`/users/${userId}`);
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============= ROLE-BASED USER FETCHING =============

/**
 * Fetch students with filters
 */
export const useStudents = (params: UserSearchParams) => {
  return useQuery({
    queryKey: ["users", "students", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.get("/users/students", {
          params: flattenSearchParams(params),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching students:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch alumni with filters
 */
export const useAlumni = (params: UserSearchParams) => {
  return useQuery({
    queryKey: ["users", "alumni", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.get("/users/alumni", {
          params: flattenSearchParams(params),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching alumni:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch employers with filters
 */
export const useEmployers = (params: UserSearchParams) => {
  return useQuery({
    queryKey: ["users", "employers", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.get("/users/employers", {
          params: flattenSearchParams(params),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching employers:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch professors/university staff with filters
 */
export const useProfessors = (params: UserSearchParams) => {
  return useQuery({
    queryKey: ["users", "professors", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.get("/users/professors", {
          params: flattenSearchParams(params),
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching professors:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============= ADMIN-SPECIFIC USER FETCHING =============

/**
 * Fetch user statistics (Admin only)
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: ["users", "stats"],
    queryFn: async (): Promise<UserStats> => {
      try {
        const response = await api.get("/users/admin/stats");
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching user stats:", error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: true, // Continue refreshing when tab is not active
  });
};

/**
 * Fetch comprehensive analytics data (Admin only)
 */
export const useComprehensiveAnalytics = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ["users", "analytics", filters],
    queryFn: async (): Promise<ComprehensiveAnalytics> => {
      try {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (Array.isArray(value)) {
                if (value.length > 0) {
                  value.forEach((item) => params.append(key, item));
                }
              } else {
                params.append(key, value.toString());
              }
            }
          });
        }

        const queryString = params.toString();
        const url = `/users/admin/analytics${queryString ? `?${queryString}` : ""}`;

        const response = await api.get(url);
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching analytics data:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchIntervalInBackground: true,
  });
};

/**
 * Fetch deleted users (Admin only)
 */
export const useDeletedUsers = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["users", "deleted", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.get("/users/admin/deleted", { params });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching deleted users:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch recent users (Admin only)
 */
export const useRecentUsers = (limit: number = 10) => {
  return useQuery({
    queryKey: ["users", "recent", limit],
    queryFn: async (): Promise<UserProfile[]> => {
      try {
        const response = await api.get("/users/admin/recent", {
          params: { limit },
        });
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching recent users:", error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch users pending verification (Admin only)
 */
export const usePendingVerificationUsers = (limit: number = 10) => {
  return useQuery({
    queryKey: ["users", "pending-verification", limit],
    queryFn: async (): Promise<UserProfile[]> => {
      try {
        const response = await api.get("/users/admin/pending-verification", {
          params: { limit },
        });
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching pending verification users:", error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds (more frequent updates for pending items)
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Auto-refresh every minute
    refetchIntervalInBackground: true,
  });
};

// ============= RECOMMENDATIONS =============

/**
 * Get personalized user recommendations
 */
export const useUserRecommendations = (params: RecommendationParams) => {
  return useQuery({
    queryKey: ["users", "recommendations", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        const response = await api.post("/users/recommendations", params);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching user recommendations:", error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// ============= USER MANAGEMENT ACTIONS =============

/**
 * Verify/unverify a user (Admin only)
 */
export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      isVerified: boolean;
      verificationNote?: string;
    }) => {
      try {
        const response = await api.patch(`/users/${params.userId}/verify`, {
          isVerified: params.isVerified,
          verificationNote: params.verificationNote,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error verifying user:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success(
        `User ${variables.isVerified ? "verified" : "unverified"} successfully`,
        toastSuccessStyles
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update user verification status";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Update user account status (Admin only)
 */
export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      status: string;
      reason?: string;
    }) => {
      try {
        const response = await api.patch(`/users/${params.userId}/status`, {
          status: params.status,
          reason: params.reason,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error updating account status:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success("Account status updated successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update account status";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

// ============= UTILITY FUNCTIONS =============

/**
 * Flatten search parameters for API calls
 */
const flattenSearchParams = (params: UserSearchParams) => {
  const apiParams: any = {
    page: params.page || 1,
    limit: params.limit || 10,
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
  };

  // Add all filter parameters directly at the top level (not nested under filters)
  if (params.filters) {
    // Text search
    if (params.filters.search && params.filters.search.trim() !== "") {
      apiParams.search = params.filters.search.trim();
    }

    // Role filters
    if (params.filters.roles && params.filters.roles.length > 0) {
      apiParams.roles = params.filters.roles;
    }

    // Verification status - FLATTEN TO ROOT LEVEL
    if (params.filters.isVerified !== undefined) {
      apiParams.isVerified = params.filters.isVerified;
    }

    // Skills
    if (params.filters.skills && params.filters.skills.length > 0) {
      apiParams.skills = params.filters.skills;
    }

    // Location filters
    if (params.filters.cities && params.filters.cities.length > 0) {
      apiParams.cities = params.filters.cities;
    }

    if (params.filters.countries && params.filters.countries.length > 0) {
      apiParams.countries = params.filters.countries;
    }

    // Education filters
    if (params.filters.fields && params.filters.fields.length > 0) {
      apiParams.fields = params.filters.fields;
    }

    if (params.filters.institutions && params.filters.institutions.length > 0) {
      apiParams.institutions = params.filters.institutions;
    }

    if (params.filters.universities && params.filters.universities.length > 0) {
      apiParams.universities = params.filters.universities;
    }

    // Academic filters
    if (
      params.filters.graduationYears &&
      params.filters.graduationYears.length > 0
    ) {
      apiParams.graduationYears = params.filters.graduationYears;
    }

    if (params.filters.minGpa !== undefined) {
      apiParams.minGpa = params.filters.minGpa;
    }

    if (params.filters.maxGpa !== undefined) {
      apiParams.maxGpa = params.filters.maxGpa;
    }

    // Availability
    if (params.filters.availability && params.filters.availability.length > 0) {
      apiParams.availability = params.filters.availability;
    }

    // Experience filters
    if (params.filters.minExperience !== undefined) {
      apiParams.minExperience = params.filters.minExperience;
    }

    if (params.filters.maxExperience !== undefined) {
      apiParams.maxExperience = params.filters.maxExperience;
    }

    // Visibility
    if (params.filters.visibility && params.filters.visibility.length > 0) {
      apiParams.visibility = params.filters.visibility;
    }

    // Student IDs
    if (params.filters.studentIds && params.filters.studentIds.length > 0) {
      apiParams.studentIds = params.filters.studentIds;
    }
  }

  // Log for debugging - should show flat parameters now
  console.log(
    "Flattened API Parameters (should be flat, not nested):",
    apiParams
  );

  return apiParams;
};

/**
 * Prefetch user profile for better UX
 */
export const prefetchUserProfile = (queryClient: any, userId: string) => {
  return queryClient.prefetchQuery({
    queryKey: ["users", "profile", userId],
    queryFn: async (): Promise<UserProfile> => {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Invalidate all user-related queries
 */
export const invalidateUserQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: ["users"] });
};

/**
 * Helper function to build search parameters
 */
export const buildUserSearchParams = (
  filters: UserSearchFilters,
  pagination: PaginationParams = {}
): UserSearchParams => {
  return {
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sortBy: pagination.sortBy || "createdAt",
    sortOrder: pagination.sortOrder || "desc",
    filters,
  };
};

// ============= BULK OPERATIONS =============

/**
 * Fetch multiple users by IDs
 */
export const useUsersByIds = (userIds: string[], enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users", "bulk", userIds],
    queryFn: async (): Promise<UserProfile[]> => {
      try {
        const promises = userIds.map((id) => api.get(`/users/${id}`));
        const responses = await Promise.all(promises);
        return responses.map((response) => response.data.data);
      } catch (error: any) {
        console.error("Error fetching users by IDs:", error);
        throw error;
      }
    },
    enabled: enabled && userIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Export analytics report (Admin only)
 */
export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: async (exportData: ExportReport) => {
      const response = await api.post(
        "/users/admin/analytics/export",
        exportData,
        {
          responseType: "blob",
        }
      );

      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Determine file extension based on format
      const extension =
        exportData.format === "xlsx" ? "xlsx" : exportData.format;
      link.download = `analytics-${exportData.reportType}-${new Date().toISOString().split("T")[0]}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response.data;
    },
    onSuccess: () => {
      toast("Export completed successfully!", toastSuccessStyles);
    },
    onError: (error: any) => {
      console.error("Export failed:", error);
      toast(
        error?.response?.data?.message || "Failed to export analytics data",
        toastErrorStyles
      );
    },
  });
};

// ============= PROFILE UPDATE MUTATIONS =============

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  city?: string;
  country?: string;
  address?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  interests?: string[];
  visibility?: string;
  isPublic?: boolean;
  socialLinks?: any;
  // Admin-specific fields
  university?: string;
  studentId?: string;
  gpa?: number;
  graduationYear?: number;
  availability?: string;
}

/**
 * Update current user's profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdateProfileData) => {
      const response = await api.patch("/users/me", updateData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast("Profile updated successfully!", toastSuccessStyles);
      return data;
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to update profile";
      toast(errorMessage, toastErrorStyles);
      throw error;
    },
  });
};

/**
 * Upload user avatar/profile picture
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error uploading avatar:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
      toast.success("Profile picture updated successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload profile picture";
      toast.error(message, toastErrorStyles);
    },
  });
};

/**
 * Upload user resume
 */
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/resume", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error uploading resume:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
      queryClient.invalidateQueries({ queryKey: ["users", "documents"] });
      toast.success("Resume uploaded successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload resume";
      toast.error(message, toastErrorStyles);
    },
  });
};

/**
 * Upload portfolio
 */
export const useUploadPortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/portfolio", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error uploading portfolio:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "documents"] });
      toast.success("Portfolio uploaded successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload portfolio";
      toast.error(message, toastErrorStyles);
    },
  });
};

/**
 * Upload cover letter
 */
export const useUploadCoverLetter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/cover-letter", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error uploading cover letter:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "documents"] });
      toast.success("Cover letter uploaded successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload cover letter";
      toast.error(message, toastErrorStyles);
    },
  });
};

/**
 * Get user documents
 */
export const useUserDocuments = (documentType?: string) => {
  return useQuery({
    queryKey: ["users", "documents", documentType],
    queryFn: async () => {
      try {
        const params = documentType ? { documentType } : {};
        const response = await api.get("/upload/documents", { params });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching documents:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Delete document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      try {
        const response = await api.delete(`/upload/documents/${documentId}`);
        return response.data;
      } catch (error: any) {
        console.error("Error deleting document:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users", "documents"] });
      toast.success("Document deleted successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete document";
      toast.error(message, toastErrorStyles);
    },
  });
};

/**
 * Get document upload guidelines
 */
export const useUploadGuidelines = () => {
  return useQuery({
    queryKey: ["upload", "guidelines"],
    queryFn: async () => {
      try {
        const response = await api.get("/upload/guidelines");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching upload guidelines:", error);
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// ============= PASSWORD MANAGEMENT =============

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Change user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      try {
        const response = await api.patch("/users/me/change-password", data);
        return response.data;
      } catch (error: any) {
        console.error("Error changing password:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Password changed successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message, toastErrorStyles);
    },
  });
};

// ============= DOCUMENT MANAGEMENT =============

export interface Document {
  id: string;
  documentType: string;
  originalName: string;
  url: string;
  fileSize: number;
  fileSizeMB: string;
  uploadedAt: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  isVerified: boolean;
  verificationNotes?: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document: Document;
}

export interface UserDocumentsResponse {
  success: boolean;
  message: string;
  documents: Document[];
}

export interface UploadGuideline {
  allowedFormats: string[];
  maxSize: string;
  description: string;
  verificationRequired: boolean;
  note?: string;
}

export interface UploadGuidelines {
  documentTypes: {
    [key: string]: UploadGuideline;
  };
  general: {
    maxFileSize: string;
    securityNote: string;
    verificationNote: string;
    supportedFeatures: string[];
  };
}

export interface UploadGuidelinesResponse {
  success: boolean;
  message: string;
  guidelines: UploadGuidelines;
}

// ============= EXPORT ALL =============

// export {
//   // Re-export types for convenience
//   type UserProfile,
//   type UserSearchFilters,
//   type PaginationParams,
//   type UserSearchParams,
//   type PaginatedUsersResponse,
//   type UserStats,
//   type RecommendationFilters,
//   type RecommendationParams,
// };
