"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User, AlertTriangle } from "lucide-react";
import { rejectApplication } from "@/lib/api";
import { toast } from "sonner";
import { RejectApplicationData } from "@/types/application-actions";

const rejectionReasons = [
  "Qualifications don't match requirements",
  "Position has been filled",
  "Experience level not suitable",
  "Skills gap too significant",
  "Location requirements not met",
  "Salary expectations don't align",
  "Application incomplete",
  "Better candidates selected",
  "Other",
];

interface RejectApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    university?: string;
    major?: string;
  };
  jobTitle: string;
  jobId: string;
  applicationId: string;
  onSuccess?: () => void;
}

export function RejectApplicationDialog({
  open,
  onOpenChange,
  candidate,
  jobTitle,
  jobId,
  applicationId,
  onSuccess,
}: RejectApplicationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RejectApplicationData>({
    reason: "",
    feedback: "",
    allowReapplication: false,
  });
  const [errors, setErrors] = useState<Partial<RejectApplicationData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RejectApplicationData> = {};

    if (!formData.reason) {
      newErrors.reason = "Please select a rejection reason";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await rejectApplication(jobId, applicationId, formData);
      toast.success(
        `Application rejected for ${candidate.firstName} ${candidate.lastName}`,
        {
          description:
            "The candidate will receive a professional rejection email with feedback.",
        }
      );
      setFormData({
        reason: "",
        feedback: "",
        allowReapplication: false,
      });
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error("Failed to reject application", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <X className="w-5 h-5" />
            Reject Application
          </DialogTitle>
          <DialogDescription>
            Provide a reason for rejection. The candidate will receive a
            professional email with your feedback.
          </DialogDescription>
        </DialogHeader>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">
              This action cannot be undone
            </h4>
            <p className="text-sm text-red-700 mt-1">
              The candidate will be notified via email and their application
              status will be permanently changed to rejected.
            </p>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={candidate.avatar}
              alt={`${candidate.firstName} ${candidate.lastName}`}
            />
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{candidate.email}</p>
            <p className="text-sm text-muted-foreground">
              Application for: {jobTitle}
            </p>
            {candidate.university && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {candidate.university}
                </Badge>
                {candidate.major && (
                  <Badge variant="outline" className="text-xs">
                    {candidate.major}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) =>
                setFormData({ ...formData, reason: value })
              }
            >
              <SelectTrigger className={errors.reason ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a reason for rejection" />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback to help the candidate improve (this will be included in the rejection email)"
              className="min-h-[120px] resize-none"
              value={formData.feedback || ""}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Be professional and constructive. This feedback will help the
              candidate grow.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowReapplication"
              checked={formData.allowReapplication}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, allowReapplication: !!checked })
              }
            />
            <Label
              htmlFor="allowReapplication"
              className="text-sm font-normal cursor-pointer"
            >
              Allow candidate to reapply for future positions
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
