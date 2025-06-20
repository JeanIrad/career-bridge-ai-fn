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
        // Build API parameters in the structure the backend expects
        const apiParams: any = {
          page: params.page || 1,
          limit: params.limit || 10,
          sortBy: params.sortBy || "createdAt",
          sortOrder: params.sortOrder || "desc",
        };

        // Build the filters using bracket notation that NestJS can parse
        if (params.filters) {
          if (params.filters.search) {
            apiParams["filters[search]"] = params.filters.search;
          }

          if (params.filters.roles && params.filters.roles.length > 0) {
            // For arrays, use multiple parameters with the same name
            params.filters.roles.forEach((role, index) => {
              apiParams[`filters[roles][${index}]`] = role;
            });
          }

          if (
            params.filters.verificationStatus &&
            params.filters.verificationStatus !== "all"
          ) {
            apiParams["filters[isVerified]"] =
              params.filters.verificationStatus === "verified";
          }
        }

        const response = await api.get("/users/search", { params: apiParams });
        return response.data;
      } catch (error: any) {
        console.error("Error fetching admin users:", error);
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
