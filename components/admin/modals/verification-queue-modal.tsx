"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  X,
  ChevronRight,
} from "lucide-react";
import {
  usePendingVerificationUsers,
  useVerifyUser,
} from "@/lib/actions/admin-users";
import { toast } from "sonner";

interface VerificationQueueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerificationQueueModal({
  open,
  onOpenChange,
}: VerificationQueueModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [verificationNote, setVerificationNote] = useState("");

  const {
    data: pendingUsers,
    isLoading,
    refetch,
  } = usePendingVerificationUsers({
    limit: 50,
  });
  const verifyUserMutation = useVerifyUser();

  // Filter users based on search and role
  const filteredUsers =
    pendingUsers?.data?.filter((user: any) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    }) || [];

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await verifyUserMutation.mutateAsync({
        userId,
        isVerified,
        verificationNote: verificationNote || undefined,
      });

      toast.success(
        `User ${isVerified ? "verified" : "rejected"} successfully`
      );

      setVerificationNote("");
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update verification status");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "alumni":
        return "bg-green-100 text-green-800";
      case "employer":
        return "bg-purple-100 text-purple-800";
      case "professor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "student":
        return GraduationCap;
      case "alumni":
        return User;
      case "employer":
        return Briefcase;
      case "professor":
        return Building;
      default:
        return User;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case "student":
        return "outline";
      case "alumni":
        return "default";
      case "employer":
        return "destructive";
      case "professor":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <UserCheck className="h-5 w-5 md:h-6 md:w-6" />
            <span className="truncate">User Verification Queue</span>
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Review and verify user accounts awaiting approval
          </DialogDescription>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 md:pl-10 h-10 md:h-12 text-sm md:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48 h-10 md:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="STUDENT">Students</SelectItem>
              <SelectItem value="ALUMNI">Alumni</SelectItem>
              <SelectItem value="EMPLOYER">Employers</SelectItem>
              <SelectItem value="PROFESSOR">Professors</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
            }}
            className="h-10 md:h-12 px-4 md:px-6 border-gray-200 hover:bg-gray-50"
          >
            <X className="h-3 w-3 md:h-4 md:w-4 mr-2" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 overflow-hidden">
          {/* User List */}
          <div className="flex-1 lg:w-1/2 xl:w-2/5">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">
                Pending Verifications ({filteredUsers.length})
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Select a user to view details and take action
              </p>
            </div>
            <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[400px] md:max-h-[500px] pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">Loading users...</p>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm || roleFilter !== "all"
                      ? "No users match your filters"
                      : "No users pending verification"}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <Card
                    key={user.id}
                    className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-0 ${
                      selectedUser?.id === user.id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
                        : "bg-white hover:bg-gray-50 border-gray-100"
                    }`}
                    onClick={() => setSelectedUser(user)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-white shadow-lg">
                            <AvatarImage
                              src={user.avatar}
                              alt={user.firstName}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm md:text-lg font-semibold">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-amber-100 p-1 rounded-full border-2 border-white">
                            <Clock className="h-2 w-2 md:h-3 md:w-3 text-amber-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-bold text-sm md:text-lg text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge
                              variant={getRoleBadgeVariant(user.role)}
                              className="text-xs font-medium px-2 py-1 shadow-sm self-start sm:self-center"
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-xs md:text-sm mb-2 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
                            <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="font-medium">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                            {user.city && (
                              <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="font-medium truncate max-w-20">
                                  {user.city}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {selectedUser?.id === user.id && (
                            <div className="bg-blue-100 p-2 rounded-full">
                              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-blue-200 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* User Details Panel */}
          {selectedUser && (
            <div className="w-96 border-l pl-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback className="text-xl">
                      {getInitials(
                        selectedUser.firstName,
                        selectedUser.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-xl mb-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600 mb-3">{selectedUser.email}</p>
                  <Badge
                    className={`${getRoleBadgeColor(selectedUser.role)} text-sm`}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Profile Information</h4>

                  {selectedUser.headline && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Headline
                      </label>
                      <p className="text-sm mt-1">{selectedUser.headline}</p>
                    </div>
                  )}

                  {selectedUser.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Bio
                      </label>
                      <p className="text-sm mt-1 leading-relaxed">
                        {selectedUser.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Location
                    </label>
                    <p className="text-sm mt-1">
                      {selectedUser.city || "Not specified"}
                      {selectedUser.country && `, ${selectedUser.country}`}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Registration Date
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Verification Notes</h4>
                  <Textarea
                    placeholder="Add notes about this verification decision..."
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleVerifyUser(selectedUser.id, true)}
                    disabled={verifyUserMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleVerifyUser(selectedUser.id, false)}
                    disabled={verifyUserMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-500">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
            pending verification
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => refetch()}>Refresh</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
