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
