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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  MessageCircle,
  Send,
  User,
  MessageSquare,
  Loader2,
  Mail,
} from "lucide-react";
import { messageCandidate, sendDirectMessage } from "@/lib/api";
import { toast } from "sonner";
import { MessageCandidateData } from "@/types/application-actions";

interface MessageCandidateDialogProps {
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

export function MessageCandidateDialog({
  open,
  onOpenChange,
  candidate,
  jobTitle,
  jobId,
  applicationId,
  onSuccess,
}: MessageCandidateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showRealTimeChat, setShowRealTimeChat] = useState(false);
  const [formData, setFormData] = useState<MessageCandidateData>({
    subject: `Regarding your application for ${jobTitle}`,
    message: `Hi ${candidate.firstName},\n\nI hope this message finds you well. I wanted to reach out regarding your application for the ${jobTitle} position at our company.\n\n\n\nBest regards,\nHiring Team`,
  });
  const [errors, setErrors] = useState<Partial<MessageCandidateData>>({});
  const [messageType, setMessageType] = useState<"email" | "direct">("email");
  const [messageContent, setMessageContent] = useState("");
  const [subject, setSubject] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<MessageCandidateData> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject too long";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message too long";
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
      await messageCandidate(jobId, applicationId, formData);
      toast.success(
        `Message sent to ${candidate.firstName} ${candidate.lastName}`,
        {
          description:
            "The candidate will receive your message via email and in-app notification.",
        }
      );
      setFormData({
        subject: `Regarding your application for ${jobTitle}`,
        message: `Hi ${candidate.firstName},\n\nI hope this message finds you well. I wanted to reach out regarding your application for the ${jobTitle} position at our company.\n\n\n\nBest regards,\nHiring Team`,
      });
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDirectMessage = async () => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await sendDirectMessage(candidate.id, messageContent);
      toast.success(
        `Direct message sent to ${candidate.firstName} ${candidate.lastName}`,
        {
          description: "The message was delivered instantly via chat system.",
        }
      );
      setMessageContent("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to send direct message:", error);
      toast.error("Failed to send message", {
        description: "Please try again or use email instead.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    // Implementation for sending email
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send Message to Candidate
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to the candidate. They will receive it
              via email and in-app notification.
            </DialogDescription>
          </DialogHeader>

          {/* Communication Type Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <Button
              type="button"
              variant={messageType === "email" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMessageType("email")}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Message
            </Button>
            <Button
              type="button"
              variant={messageType === "direct" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMessageType("direct")}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Direct Message
            </Button>
          </div>

          {messageType === "direct" ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Direct Message</h3>
                <p className="text-muted-foreground">
                  Send an instant message to {candidate.firstName}{" "}
                  {candidate.lastName}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendDirectMessage();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="directMessage">Message</Label>
                  <Textarea
                    id="directMessage"
                    placeholder="Type your message here..."
                    className="min-h-[120px] resize-none"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    maxLength={1000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Message will be sent instantly</span>
                    <span>{messageContent?.length || 0}/1000</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMessageType("email")}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back to Email
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <>
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
                  <p className="text-sm text-muted-foreground">
                    {candidate.email}
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
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    className={`min-h-[200px] resize-none ${errors.message ? "border-red-500" : ""}`}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Be professional and respectful</span>
                    <span>{formData.message?.length || 0}/2000</span>
                  </div>
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
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
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !formData.message.trim() ||
                      !formData.subject.trim()
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Sending..." : "Send Email"}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Real-time chat integration will be added here */}
    </>
  );
}
