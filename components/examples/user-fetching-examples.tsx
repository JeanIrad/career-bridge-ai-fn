"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  useSearchUsers,
  useCurrentUser,
  useStudents,
  useAlumni,
  useEmployers,
  useUserStats,
  useUserRecommendations,
  buildUserSearchParams,
  type UserSearchFilters,
  type UserProfile,
} from "@/lib/actions/users";
import {
  useAdminUsers,
  usePendingVerificationUsers,
  useRecentUsers,
  buildAdminUserSearchParams,
  type AdminUserFilters,
} from "@/lib/actions/admin-users";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Building2,
  GraduationCap,
  AlertCircle,
  Loader2,
} from "lucide-react";

/**
 * Example component demonstrating various user fetching patterns
 */
export function UserFetchingExamples() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ============= BASIC USER FETCHING =============

  // Get current user
  const {
    data: currentUser,
    isLoading: currentUserLoading,
    error: currentUserError,
  } = useCurrentUser();

  // Search users with filters
  const userFilters: UserSearchFilters = {
    search: searchTerm || undefined,
    roles: selectedRole !== "all" ? [selectedRole] : undefined,
    isVerified: true,
  };

  const searchParams = buildUserSearchParams(userFilters, {
    page: currentPage,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useSearchUsers(searchParams);

  // ============= ROLE-BASED FETCHING =============

  // Get students
  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    page: 1,
    limit: 5,
    filters: { isVerified: true },
  });

  // Get alumni
  const { data: alumniData, isLoading: alumniLoading } = useAlumni({
    page: 1,
    limit: 5,
    filters: { isVerified: true },
  });

  // Get employers
  const { data: employersData, isLoading: employersLoading } = useEmployers({
    page: 1,
    limit: 5,
    filters: { isVerified: true },
  });

  // ============= ADMIN FEATURES =============

  // Get user statistics (only for admins)
  const { data: userStats, isLoading: statsLoading } = useUserStats();

  // Get recent users (admin only)
  const { data: recentUsers, isLoading: recentUsersLoading } = useRecentUsers(
    7,
    5
  );

  // Get pending verification users (admin only)
  const { data: pendingUsers, isLoading: pendingUsersLoading } =
    usePendingVerificationUsers({
      page: 1,
      limit: 5,
    });

  // ============= RECOMMENDATIONS =============

  // Get user recommendations
  const { data: recommendationsData, isLoading: recommendationsLoading } =
    useUserRecommendations({
      page: 1,
      limit: 5,
      filters: {
        targetRoles: ["STUDENT", "ALUMNI"],
        requiredSkills: ["JavaScript", "React"],
      },
    });

  // ============= RENDER HELPERS =============

  const renderUserCard = (user: UserProfile) => (
    <div
      key={user.id}
      className="flex items-center gap-3 p-3 border rounded-lg"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
        {user.firstName?.charAt(0) || user.email.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
          {user.isVerified && <UserCheck className="w-4 h-4 text-green-500" />}
          <Badge variant="secondary">{user.role}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {user.headline && (
          <p className="text-xs text-muted-foreground mt-1">{user.headline}</p>
        )}
      </div>
    </div>
  );

  const renderLoadingSkeleton = (count: number = 3) => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorAlert = (error: any, title: string) => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {title}: {error?.message || "Unknown error occurred"}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Fetching Examples</h1>
          <p className="text-muted-foreground">
            Demonstration of various user fetching patterns and actions
          </p>
        </div>
      </div>

      {/* Current User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current User
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUserLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ) : currentUserError ? (
            renderErrorAlert(currentUserError, "Failed to load current user")
          ) : currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                {currentUser.firstName?.charAt(0) ||
                  currentUser.email.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <Badge>{currentUser.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>
          ) : (
            renderErrorAlert(null, "No user data available")
          )}
        </CardContent>
      </Card>

      {/* User Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            User Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Controls */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="ALUMNI">Alumni</SelectItem>
                <SelectItem value="EMPLOYER">Employers</SelectItem>
                <SelectItem value="PROFESSOR">Professors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Results */}
          {usersLoading ? (
            renderLoadingSkeleton(5)
          ) : usersError ? (
            renderErrorAlert(usersError, "Failed to load users")
          ) : usersData?.success && usersData.data ? (
            <div className="space-y-3">
              {usersData.data.map(renderUserCard)}

              {/* Pagination Info */}
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {usersData.data.length} of{" "}
                  {usersData.pagination.total} users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!usersData.pagination.hasPrev}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!usersData.pagination.hasNext}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No users found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Role-based User Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              renderLoadingSkeleton(3)
            ) : studentsData?.success && studentsData.data ? (
              <div className="space-y-3">
                {studentsData.data.slice(0, 3).map(renderUserCard)}
                <Button variant="outline" size="sm" className="w-full">
                  View All Students ({studentsData.pagination.total || 0})
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No students found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Alumni */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Alumni
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alumniLoading ? (
              renderLoadingSkeleton(3)
            ) : alumniData?.success && alumniData.data ? (
              <div className="space-y-3">
                {alumniData.data.slice(0, 3).map(renderUserCard)}
                <Button variant="outline" size="sm" className="w-full">
                  View All Alumni ({alumniData.pagination.total || 0})
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No alumni found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Employers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Employers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employersLoading ? (
              renderLoadingSkeleton(3)
            ) : employersData?.success && employersData.data ? (
              <div className="space-y-3">
                {employersData.data.slice(0, 3).map(renderUserCard)}
                <Button variant="outline" size="sm" className="w-full">
                  View All Employers ({employersData.pagination.total || 0})
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No employers found
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Statistics */}
      {userStats && (
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userStats.verifiedUsers}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userStats.activeUsers}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {userStats.verificationRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Verification Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Users & Pending Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsersLoading ? (
              renderLoadingSkeleton(3)
            ) : recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">{recentUsers.map(renderUserCard)}</div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent users
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingUsersLoading ? (
              renderLoadingSkeleton(3)
            ) : pendingUsers?.success &&
              pendingUsers.data &&
              pendingUsers.data.length > 0 ? (
              <div className="space-y-3">
                {pendingUsers.data.map(renderUserCard)}
                <Button variant="outline" size="sm" className="w-full">
                  View All Pending ({pendingUsers.pagination.total})
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No pending verifications
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendationsData?.success && recommendationsData.data && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Users</CardTitle>
          </CardHeader>
          <CardContent>
            {recommendationsLoading ? (
              renderLoadingSkeleton(5)
            ) : (
              <div className="space-y-3">
                {recommendationsData.data.map(renderUserCard)}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UserFetchingExamples;
