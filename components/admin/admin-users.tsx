"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Building2,
  GraduationCap,
  Activity,
  Shield,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateUserModal } from "@/components/admin/create-user-modal";
import {
  useUserStats,
  useVerifyUser,
  useUpdateAccountStatus,
  type UserProfile,
} from "@/lib/actions/users";
import {
  useAdminUsers,
  buildAdminUserSearchParams,
  type AdminUserFilters,
  useSuspendUser,
  useActivateUser,
  useDeactivateUser,
  useSoftDeleteUser,
  useSendMessage,
} from "@/lib/actions/admin-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DeleteUserConfirmDialog,
  UnverifyUserConfirmDialog,
  SuspendUserModal,
  ActivateUserModal,
  DeactivateUserModal,
  SendMessageModal,
  ViewUserProfileModal,
} from "./user-management-modals";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function AdminUsers() {
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [pageSize] = useState(10);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [modals, setModals] = useState({
    viewProfile: false,
    sendMessage: false,
    suspend: false,
    activate: false,
    deactivate: false,
    delete: false,
    unverify: false,
  });

  // Debounce search input with 500ms delay
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Build search parameters using admin-specific filters
  const filters: AdminUserFilters = {
    search: debouncedSearchTerm || undefined,
    roles: roleFilter !== "all" ? [roleFilter] : undefined,
    // Temporarily disable account status filter until backend supports it
    // accountStatus: statusFilter !== "all" ? [statusFilter] : undefined,
    verificationStatus:
      verificationFilter !== "all"
        ? (verificationFilter as "verified" | "unverified")
        : undefined,
  };

  const searchParams = buildAdminUserSearchParams(filters, {
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch data using the admin-specific actions
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useAdminUsers(searchParams);

  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError,
  } = useUserStats();

  // Mutations for user management
  const verifyUserMutation = useVerifyUser();
  const updateStatusMutation = useUpdateAccountStatus();
  const suspendUserMutation = useSuspendUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();
  const deleteUserMutation = useSoftDeleteUser();
  const sendMessageMutation = useSendMessage();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, roleFilter, verificationFilter]);

  // Event handlers
  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleRoleFilter = useCallback((value: string) => {
    setRoleFilter(value);
  }, []);

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleVerificationFilter = useCallback((value: string) => {
    setVerificationFilter(value);
  }, []);

  const handleVerifyUser = (
    userId: string,
    isVerified: boolean,
    verificationNote?: string
  ) => {
    verifyUserMutation.mutate({
      userId,
      isVerified,
      verificationNote,
    });
  };

  const handleSuspendUser = (data: { userId: string; reason?: string }) => {
    suspendUserMutation.mutate(data, {
      onSuccess: () => closeModal("suspend"),
    });
  };

  const handleActivateUser = (data: { userId: string; reason?: string }) => {
    activateUserMutation.mutate(data, {
      onSuccess: () => closeModal("activate"),
    });
  };

  const handleDeactivateUser = (data: { userId: string; reason?: string }) => {
    deactivateUserMutation.mutate(data, {
      onSuccess: () => closeModal("deactivate"),
    });
  };

  const handleDeleteUser = (data: { userId: string; reason?: string }) => {
    deleteUserMutation.mutate(data, {
      onSuccess: () => closeModal("delete"),
    });
  };

  const handleSendMessage = (data: {
    recipientId: string;
    content: string;
  }) => {
    sendMessageMutation.mutate(data, {
      onSuccess: () => closeModal("sendMessage"),
    });
  };

  const handleUnverifyUser = (data: {
    userId: string;
    isVerified: boolean;
    verificationNote?: string;
  }) => {
    verifyUserMutation.mutate(data, {
      onSuccess: () => closeModal("unverify"),
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRefresh = useCallback(() => {
    refetchUsers();
  }, [refetchUsers]);

  // Helper functions
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "STUDENT":
      case "ALUMNI":
        return GraduationCap;
      case "EMPLOYER":
        return Building2;
      case "PROFESSOR":
      case "UNIVERSITY_STAFF":
        return Shield;
      case "ADMIN":
      case "SUPER_ADMIN":
        return Shield;
      default:
        return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700";
      case "SUSPENDED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border rounded">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );

  // Modal handlers
  const openModal = (modalType: keyof typeof modals, user: UserProfile) => {
    setSelectedUser(user);
    setModals((prev) => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modalType]: false }));
    setSelectedUser(null);
  };

  const closeAllModals = () => {
    setModals({
      viewProfile: false,
      sendMessage: false,
      suspend: false,
      activate: false,
      deactivate: false,
      delete: false,
      unverify: false,
    });
    setSelectedUser(null);
  };

  // Helper functions for rendering action buttons
  const getActionButtons = (user: any) => {
    const actions = [];

    // View Profile
    actions.push(
      <DropdownMenuItem
        key="view"
        onClick={() => openModal("viewProfile", user)}
        className="cursor-pointer"
      >
        <Eye className="mr-2 h-4 w-4" />
        View Profile
      </DropdownMenuItem>
    );

    // Send Message
    actions.push(
      <DropdownMenuItem
        key="message"
        onClick={() => openModal("sendMessage", user)}
        className="cursor-pointer"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Send Message
      </DropdownMenuItem>
    );

    actions.push(<DropdownMenuSeparator key="sep1" />);

    // Verification Actions
    if (user.isVerified) {
      actions.push(
        <DropdownMenuItem
          key="unverify"
          onClick={() => openModal("unverify", user)}
          className="cursor-pointer text-orange-600"
        >
          <ShieldAlert className="mr-2 h-4 w-4" />
          Unverify User
        </DropdownMenuItem>
      );
    } else {
      actions.push(
        <DropdownMenuItem
          key="verify"
          onClick={() => handleVerifyUser(user.id, true, "Verified by admin")}
          disabled={verifyUserMutation.isPending}
          className="cursor-pointer text-green-600"
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Verify User
        </DropdownMenuItem>
      );
    }

    // Status Actions
    switch (user.accountStatus) {
      case "ACTIVE":
        actions.push(
          <DropdownMenuItem
            key="suspend"
            onClick={() => openModal("suspend", user)}
            className="cursor-pointer text-red-600"
          >
            <UserX className="mr-2 h-4 w-4" />
            Suspend User
          </DropdownMenuItem>
        );
        actions.push(
          <DropdownMenuItem
            key="deactivate"
            onClick={() => openModal("deactivate", user)}
            className="cursor-pointer text-gray-600"
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Deactivate User
          </DropdownMenuItem>
        );
        break;
      case "SUSPENDED":
      case "INACTIVE":
        actions.push(
          <DropdownMenuItem
            key="activate"
            onClick={() => openModal("activate", user)}
            className="cursor-pointer text-green-600"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Activate User
          </DropdownMenuItem>
        );
        break;
    }

    actions.push(<DropdownMenuSeparator key="sep2" />);

    // Delete Action
    actions.push(
      <DropdownMenuItem
        key="delete"
        onClick={() => openModal("delete", user)}
        className="cursor-pointer text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete User
      </DropdownMenuItem>
    );

    return actions;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all platform users across different roles
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <CreateUserModal />
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : statsError ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load user statistics
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : userStats ? (
          <>
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold">{userStats.totalUsers}</p>
                    <p className="text-xs text-emerald-600">
                      {userStats.verificationRate.toFixed(1)}% verified
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">
                      {userStats.activeUsers}
                    </p>
                    <p className="text-xs text-emerald-600">
                      {(
                        (userStats.activeUsers / userStats.totalUsers) *
                        100
                      ).toFixed(1)}
                      % active
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Verified Users
                    </p>
                    <p className="text-2xl font-bold">
                      {userStats.verifiedUsers}
                    </p>
                    <p className="text-xs text-emerald-600">
                      {userStats.totalUsers - userStats.verifiedUsers} pending
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Students
                    </p>
                    <p className="text-2xl font-bold">
                      {userStats.roleDistribution.students}
                    </p>
                    <p className="text-xs text-emerald-600">
                      Alumni: {userStats.roleDistribution.alumni}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={roleFilter} onValueChange={handleRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="ALUMNI">Alumni</SelectItem>
                    <SelectItem value="EMPLOYER">Employers</SelectItem>
                    <SelectItem value="PROFESSOR">Professors</SelectItem>
                    <SelectItem value="UNIVERSITY_STAFF">
                      University Staff
                    </SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Temporarily hide account status filter until backend supports it */}
              {/* <div>
                <label className="text-sm font-medium">Account Status</label>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div>
                <label className="text-sm font-medium">Verification</label>
                <Select
                  value={verificationFilter}
                  onValueChange={handleVerificationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                    <SelectItem value="unverified">Unverified Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users... (searches after 500ms)"
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className="pl-10"
                  />
                  {usersLoading && searchInput && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {usersData?.success
                  ? `Showing ${usersData.data.length} of ${usersData.pagination.total} users`
                  : "Complete list of platform users with management options"}
              </CardDescription>
            </div>
            {!showFilters && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            renderLoadingSkeleton()
          ) : usersError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load users. Please try again.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-2"
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : usersData?.success &&
            usersData.data &&
            usersData.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.data.map((user: UserProfile) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.avatar}
                                alt={user.firstName}
                              />
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {user.firstName} {user.lastName}
                                </span>
                                {user.isVerified && (
                                  <UserCheck className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <RoleIcon className="w-4 h-4 text-muted-foreground" />
                            <span>{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {user.city || user.country || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.accountStatus)}>
                            {user.accountStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatLastActive(user.updatedAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {getActionButtons(user)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {usersData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {usersData.pagination.page} of{" "}
                    {usersData.pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!usersData.pagination.hasPrev}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!usersData.pagination.hasNext}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============= MODALS ============= */}
      <ViewUserProfileModal
        user={selectedUser}
        isOpen={modals.viewProfile}
        onClose={() => closeModal("viewProfile")}
      />

      <SendMessageModal
        user={selectedUser}
        isOpen={modals.sendMessage}
        onClose={() => closeModal("sendMessage")}
        onConfirm={handleSendMessage}
        isLoading={sendMessageMutation.isPending}
      />

      <SuspendUserModal
        user={selectedUser}
        isOpen={modals.suspend}
        onClose={() => closeModal("suspend")}
        onConfirm={handleSuspendUser}
        isLoading={suspendUserMutation.isPending}
      />

      <ActivateUserModal
        user={selectedUser}
        isOpen={modals.activate}
        onClose={() => closeModal("activate")}
        onConfirm={handleActivateUser}
        isLoading={activateUserMutation.isPending}
      />

      <DeactivateUserModal
        user={selectedUser}
        isOpen={modals.deactivate}
        onClose={() => closeModal("deactivate")}
        onConfirm={handleDeactivateUser}
        isLoading={deactivateUserMutation.isPending}
      />

      <DeleteUserConfirmDialog
        user={selectedUser}
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onConfirm={handleDeleteUser}
        isLoading={deleteUserMutation.isPending}
      />

      <UnverifyUserConfirmDialog
        user={selectedUser}
        isOpen={modals.unverify}
        onClose={() => closeModal("unverify")}
        onConfirm={handleUnverifyUser}
        isLoading={verifyUserMutation.isPending}
      />
    </div>
  );
}
