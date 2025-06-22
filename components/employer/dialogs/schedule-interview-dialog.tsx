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
import { Input } from "@/components/ui/input";
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
import { Calendar, Clock, MapPin, Video, Phone, User } from "lucide-react";
import { scheduleInterview } from "@/lib/api";
import { toast } from "sonner";
import { ScheduleInterviewData } from "@/types/application-actions";

interface ScheduleInterviewDialogProps {
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

export function ScheduleInterviewDialog({
  open,
  onOpenChange,
  candidate,
  jobTitle,
  jobId,
  applicationId,
  onSuccess,
}: ScheduleInterviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScheduleInterviewData>({
    scheduledDate: "",
    scheduledTime: "",
    interviewType: "VIDEO",
    location: "",
    meetingLink: "",
    notes: "",
    duration: 60,
  });
  const [errors, setErrors] = useState<Partial<ScheduleInterviewData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ScheduleInterviewData> = {};

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Date is required";
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = "Time is required";
    }

    if (formData.interviewType === "IN_PERSON" && !formData.location) {
      newErrors.location = "Location is required for in-person interviews";
    }

    if (formData.interviewType === "VIDEO" && !formData.meetingLink) {
      newErrors.meetingLink = "Meeting link is required for video interviews";
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
      await scheduleInterview(jobId, applicationId, formData);
      toast.success(
        `Interview scheduled with ${candidate.firstName} ${candidate.lastName}`,
        {
          description:
            "The candidate will receive an interview invitation via email and in-app notification.",
        }
      );
      setFormData({
        scheduledDate: "",
        scheduledTime: "",
        interviewType: "VIDEO",
        location: "",
        meetingLink: "",
        notes: "",
        duration: 60,
      });
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      toast.error("Failed to schedule interview", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4" />;
      case "PHONE":
        return <Phone className="w-4 h-4" />;
      case "IN_PERSON":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Schedule an interview with the candidate. They will receive an
            invitation with all the details.
          </DialogDescription>
        </DialogHeader>

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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Interview Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                className={errors.scheduledDate ? "border-red-500" : ""}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.scheduledDate && (
                <p className="text-sm text-red-500">{errors.scheduledDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Interview Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledTime: e.target.value })
                }
                className={errors.scheduledTime ? "border-red-500" : ""}
              />
              {errors.scheduledTime && (
                <p className="text-sm text-red-500">{errors.scheduledTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(value: "PHONE" | "VIDEO" | "IN_PERSON") =>
                  setFormData({ ...formData, interviewType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="PHONE">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Call
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PERSON">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      In Person
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select
                value={formData.duration?.toString() || "60"}
                onValueChange={(value) =>
                  setFormData({ ...formData, duration: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.interviewType === "IN_PERSON" && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter interview location (e.g., Office address, meeting room)"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>
          )}

          {formData.interviewType === "VIDEO" && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                placeholder="Enter video meeting link (Zoom, Teams, Meet, etc.)"
                value={formData.meetingLink || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meetingLink: e.target.value })
                }
                className={errors.meetingLink ? "border-red-500" : ""}
              />
              {errors.meetingLink && (
                <p className="text-sm text-red-500">{errors.meetingLink}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the candidate (preparation instructions, what to bring, etc.)"
              className="min-h-[100px] resize-none"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              These notes will be included in the interview invitation
            </p>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
