import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { toastErrorStyles, toastSuccessStyles } from "../utils";
import {
  UserSearchParams,
  PaginatedUsersResponse,
  UserProfile,
  PaginationParams,
} from "./users";

// ============= ADMIN-SPECIFIC TYPES =============

export interface AdminUserFilters {
  search?: string;
  roles?: string[];
  accountStatus?: string[];
  verificationStatus?: "verified" | "unverified" | "all";
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  lastActiveRange?: {
    startDate: string;
    endDate: string;
  };
  universities?: string[];
  companies?: string[];
  departments?: string[];
}

export interface AdminUserSearchParams extends UserSearchParams {
  filters?: AdminUserFilters;
}

export interface BulkUserAction {
  userIds: string[];
  action:
    | "verify"
    | "unverify"
    | "activate"
    | "deactivate"
    | "suspend"
    | "delete";
  reason?: string;
}

// ============= ENHANCED USER FETCHING FOR ADMINS =============

/**
 * Fetch all users with enhanced admin filters
 */
export const useAdminUsers = (params: AdminUserSearchParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        // Build API parameters using the new flattened structure
        const apiParams: any = {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "createdAt",
          sortOrder: params.sortOrder || "desc",
        };

        // Add filter parameters directly at the top level
        if (params.filters) {
          if (params.filters.search && params.filters.search.trim() !== "") {
            apiParams.search = params.filters.search.trim();
          }

          if (params.filters.roles && params.filters.roles.length > 0) {
            apiParams.roles = params.filters.roles;
          }

          if (
            params.filters.verificationStatus &&
            params.filters.verificationStatus !== "all"
          ) {
            apiParams.isVerified =
              params.filters.verificationStatus === "verified";
          }

          // Add other admin-specific filters
          if (
            params.filters.universities &&
            params.filters.universities.length > 0
          ) {
            apiParams.universities = params.filters.universities;
          }

          if (params.filters.companies && params.filters.companies.length > 0) {
            // Note: The backend might not support this yet, but we can add it
            // apiParams.companies = params.filters.companies;
          }
        }

        // Log the parameters being sent for debugging
        console.log("Admin API Parameters being sent:", apiParams);

        // Use the new admin-specific endpoint
        const response = await api.get("/users/admin/users", {
          params: apiParams,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching admin users:", error);
        console.error("Error response:", error.response?.data);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch users pending verification
 */
export const usePendingVerificationUsers = (params: UserSearchParams = {}) => {
  return useQuery({
    queryKey: ["admin", "users", "pending-verification", params],
    queryFn: async (): Promise<PaginatedUsersResponse> => {
      try {
        // Build API parameters in the structure the backend expects
        const apiParams: any = {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "createdAt",
          sortOrder: params.sortOrder || "desc",
        };

        // Build the filters object with unverified filter
        const filters: any = {
          isVerified: false,
        };

        // Add other filters if they exist
        if (params.filters?.search) {
          filters.search = params.filters.search;
        }

        if (params.filters?.roles && params.filters.roles.length > 0) {
          filters.roles = params.filters.roles;
        }

        apiParams.filters = filters;

        const response = await api.get("/users/search", { params: apiParams });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching pending verification users:", error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Fetch recently registered users
 */
export const useRecentUsers = (days: number = 7, limit: number = 10) => {
  return useQuery({
    queryKey: ["admin", "users", "recent", days, limit],
    queryFn: async (): Promise<UserProfile[]> => {
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Build API parameters in the structure the backend expects
        const apiParams: any = {
          limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        };

        // Add date range filters
        const filters: any = {
          // Note: We'd need to check if the backend supports date range filters
          // For now, we'll just use basic sorting
        };

        if (Object.keys(filters).length > 0) {
          apiParams.filters = filters;
        }

        const response = await api.get("/users/search", { params: apiParams });
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
 * Perform bulk actions on multiple users
 */
export const useBulkUserAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bulkAction: BulkUserAction) => {
      try {
        const response = await api.post("/users/admin/bulk-action", bulkAction);
        return response.data;
      } catch (error: any) {
        console.error("Error performing bulk action:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      const actionText =
        variables.action === "verify"
          ? "verified"
          : variables.action === "unverify"
            ? "unverified"
            : variables.action === "activate"
              ? "activated"
              : variables.action === "deactivate"
                ? "deactivated"
                : variables.action === "suspend"
                  ? "suspended"
                  : "deleted";

      toast.success(
        `Successfully ${actionText} ${variables.userIds.length} user(s)`,
        toastSuccessStyles
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to perform bulk action";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

// ============= INDIVIDUAL USER MANAGEMENT ACTIONS =============

/**
 * Suspend a user account (Admin only)
 */
export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason?: string }) => {
      try {
        const response = await api.patch(`/users/${params.userId}/suspend`, {
          reason: params.reason,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error suspending user:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success("User suspended successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to suspend user";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Activate a user account (Admin only)
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason?: string }) => {
      try {
        const response = await api.patch(`/users/${params.userId}/activate`, {
          reason: params.reason,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error activating user:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success("User activated successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to activate user";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Deactivate a user account (Admin only)
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason?: string }) => {
      try {
        const response = await api.patch(`/users/${params.userId}/deactivate`, {
          reason: params.reason,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error deactivating user:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success("User deactivated successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate user";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Soft delete a user account (Admin only)
 */
export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; reason?: string }) => {
      try {
        const response = await api.delete(`/users/${params.userId}/soft`, {
          data: { reason: params.reason },
        });
        return response.data;
      } catch (error: any) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["users", "profile", variables.userId],
      });

      toast.success("User deleted successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Send a message to a user
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (params: {
      recipientId: string;
      content: string;
      groupId?: string;
    }) => {
      try {
        const response = await api.post("/chats/messages", {
          recipientId: params.recipientId,
          content: params.content,
          groupId: params.groupId,
        });
        return response.data;
      } catch (error: any) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Message sent successfully", toastSuccessStyles);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      toast.error(errorMessage, toastErrorStyles);
    },
  });
};

/**
 * Helper to build admin search parameters
 */
export const buildAdminUserSearchParams = (
  filters: AdminUserFilters = {},
  pagination: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): AdminUserSearchParams => {
  return {
    page: pagination.page || 1,
    limit: pagination.limit || 20,
    sortBy: pagination.sortBy || "createdAt",
    sortOrder: pagination.sortOrder || "desc",
    filters,
  };
};

// Create User Hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      // Basic Information
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      role: string;

      // Organization Information
      organizationName?: string;
      organizationWebsite?: string;
      organizationDescription?: string;
      organizationSize?: string;
      industry?: string;

      // Location
      country?: string;
      state?: string;
      city?: string;

      // Role & Permissions
      jobTitle?: string;
      department?: string;

      // University Specific
      universityType?: string;
      accreditation?: string;
      university?: string;

      // Employer Specific (Enhanced Company Fields)
      createCompany?: boolean;
      companyName?: string;
      companyType?: string;
      foundedYear?: number;
      specializations?: string[];
      companySize?: string;
      companyDescription?: string;
      companyWebsite?: string;
      companyIndustry?: string;
      companyAddress?: string;
      companyCity?: string;
      companyState?: string;
      companyCountry?: string;
      companyPhone?: string;
      companyEmail?: string;
      companyLinkedIn?: string;
      companyTwitter?: string;
      companyFacebook?: string;

      // Admin Specific
      adminLevel?: string;
      permissions?: string[];

      // Account Settings
      sendWelcomeEmail?: boolean;
      requirePasswordReset?: boolean;
      isVerified?: boolean;
      accountStatus?: string;
    }) => {
      const response = await api.post("/users/admin/create", userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch ALL user-related queries to update the table and stats
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });

      // Also invalidate user stats query with correct pattern
      queryClient.invalidateQueries({ queryKey: ["users", "stats"] });

      // Show success message
      toast.success(
        data.data.temporaryPassword
          ? `User created successfully! Password setup link sent to ${data.data.user.email}`
          : `User created successfully! Welcome email sent to ${data.data.user.email}`
      );
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create user";
      toast.error(errorMessage);
    },
  });
};
