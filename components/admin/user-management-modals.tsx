"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
  MessageSquare,
  Eye,
  Calendar,
  MapPin,
  GraduationCap,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

// ============= TYPES =============

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accountStatus: string;
  isVerified: boolean;
  avatar?: string;
  headline?: string;
  bio?: string;
  city?: string;
  country?: string;
  university?: string;
  company?: string;
  createdAt: string;
  lastLoginAt?: string;
  education?: any[];
  experiences?: any[];
  skills?: any[];
}

export interface UserActionModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  isLoading?: boolean;
}

// ============= CONFIRMATION DIALOGS =============

export function DeleteUserConfirmDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm({ userId: user?.id, reason: reason.trim() || undefined });
    setReason("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Delete User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action will soft delete the user account.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-red-50 p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="mt-1 text-sm text-red-700">
              User{" "}
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>{" "}
              will be deleted and their account will be deactivated. This action
              can be reversed within 30 days.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-reason">Reason (Optional)</Label>
            <Textarea
              id="delete-reason"
              placeholder="Enter reason for deletion..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UnverifyUserConfirmDialog({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm({
      userId: user?.id,
      isVerified: false,
      verificationNote: reason.trim() || "Unverified by admin",
    });
    setReason("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <ShieldAlert className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Unverify User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This will remove verification status from the user.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-orange-50 p-3">
            <p className="text-sm text-orange-700">
              User{" "}
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>{" "}
              will lose their verified status and may have limited access to
              certain features.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unverify-reason">Reason</Label>
            <Textarea
              id="unverify-reason"
              placeholder="Enter reason for unverification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Unverify User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============= ACTION MODALS =============

export function SuspendUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm({ userId: user?.id, reason: reason.trim() });
      setReason("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                Suspend {user?.firstName} {user?.lastName}'s account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border bg-red-50 p-3">
            <p className="text-sm text-red-700">
              This user will be unable to access their account until
              reactivated.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason *</Label>
            <Textarea
              id="suspend-reason"
              placeholder="Enter reason for suspension..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reason.trim() || isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suspend User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ActivateUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ userId: user?.id, reason: reason.trim() || undefined });
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle>Activate User</DialogTitle>
              <DialogDescription>
                Activate {user?.firstName} {user?.lastName}'s account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border bg-green-50 p-3">
            <p className="text-sm text-green-700">
              This user will regain full access to their account.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activate-reason">Reason (Optional)</Label>
            <Textarea
              id="activate-reason"
              placeholder="Enter reason for activation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeactivateUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ userId: user?.id, reason: reason.trim() || undefined });
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <UserX className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <DialogTitle>Deactivate User</DialogTitle>
              <DialogDescription>
                Deactivate {user?.firstName} {user?.lastName}'s account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              This user's account will be temporarily disabled.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deactivate-reason">Reason (Optional)</Label>
            <Textarea
              id="deactivate-reason"
              placeholder="Enter reason for deactivation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SendMessageModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: UserActionModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onConfirm({ recipientId: user?.id, content: message.trim() });
      setMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription>
                Send a message to {user?.firstName} {user?.lastName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-content">Message *</Label>
            <Textarea
              id="message-content"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!message.trim() || message.length > 500 || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ViewUserProfileModal({
  user,
  isOpen,
  onClose,
}: Omit<UserActionModalProps, "onConfirm">) {
  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "STUDENT":
      case "ALUMNI":
        return GraduationCap;
      case "EMPLOYER":
        return Building2;
      case "PROFESSOR":
      case "UNIVERSITY_STAFF":
      case "ADMIN":
      case "SUPER_ADMIN":
        return Shield;
      default:
        return User;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return CheckCircle;
      case "INACTIVE":
        return XCircle;
      case "SUSPENDED":
        return AlertTriangle;
      default:
        return Clock;
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

  const RoleIcon = getRoleIcon(user.role);
  const StatusIcon = getStatusIcon(user.accountStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback className="text-lg">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">
                  {user.firstName} {user.lastName}
                </DialogTitle>
                {user.isVerified && (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                )}
              </div>
              <DialogDescription className="text-base">
                {user.headline || user.email}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <RoleIcon className="h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge
                  className={`flex items-center gap-1 ${getStatusColor(user.accountStatus)}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {user.accountStatus}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Verified Status
                  </Label>
                  <p
                    className={`font-medium ${user.isVerified ? "text-green-600" : "text-orange-600"}`}
                  >
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
                {user.city && (
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.city}
                      {user.country && `, ${user.country}`}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bio */}
            {user.bio && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.bio}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Education */}
            {user.education && user.education.length > 0 && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {user.education.map((edu: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">
                          {edu.degree} in {edu.field}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.institution}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Experience */}
            {user.experiences && user.experiences.length > 0 && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {user.experiences.map((exp: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {exp.company?.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: any, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill.name}
                      {skill.endorsements > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          ({skill.endorsements})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
