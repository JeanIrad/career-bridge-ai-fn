"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Award,
  Calendar,
  MapPin,
  Users,
  Target,
  Lightbulb,
} from "lucide-react";
import { Event, EventFeedbackData } from "@/lib/api";
import { format } from "date-fns";

const feedbackSchema = z.object({
  overallRating: z.number().min(1).max(5),
  contentRating: z.number().min(1).max(5).optional(),
  organizationRating: z.number().min(1).max(5).optional(),
  venueRating: z.number().min(1).max(5).optional(),
  networkingRating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
  improvements: z.string().optional(),
  highlights: z.string().optional(),
  wouldRecommend: z.boolean().optional(),
  wouldAttendAgain: z.boolean().optional(),
  isAnonymous: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface EventFeedbackDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFeedbackData) => void;
  isLoading?: boolean;
}

export function EventFeedbackDialog({
  event,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: EventFeedbackDialogProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [contentRating, setContentRating] = useState(0);
  const [organizationRating, setOrganizationRating] = useState(0);
  const [venueRating, setVenueRating] = useState(0);
  const [networkingRating, setNetworkingRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      wouldRecommend: true,
      wouldAttendAgain: true,
      isAnonymous: false,
      isPublic: true,
    },
  });

  const watchWouldRecommend = watch("wouldRecommend");
  const watchWouldAttendAgain = watch("wouldAttendAgain");
  const watchIsAnonymous = watch("isAnonymous");
  const watchIsPublic = watch("isPublic");

  // Star rating component
  const StarRating = ({
    rating,
    onRatingChange,
    label,
    description,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
    description?: string;
  }) => (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 && (
            <>
              {rating}/5 -{" "}
              {rating === 1
                ? "Poor"
                : rating === 2
                  ? "Fair"
                  : rating === 3
                    ? "Good"
                    : rating === 4
                      ? "Very Good"
                      : "Excellent"}
            </>
          )}
        </span>
      </div>
    </div>
  );

  const handleFormSubmit = (data: FeedbackFormData) => {
    const feedbackData: EventFeedbackData = {
      ...data,
      overallRating,
      contentRating: contentRating > 0 ? contentRating : undefined,
      organizationRating:
        organizationRating > 0 ? organizationRating : undefined,
      venueRating: venueRating > 0 ? venueRating : undefined,
      networkingRating: networkingRating > 0 ? networkingRating : undefined,
    };

    onSubmit(feedbackData);
  };

  const handleClose = () => {
    reset();
    setOverallRating(0);
    setContentRating(0);
    setOrganizationRating(0);
    setVenueRating(0);
    setNetworkingRating(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Your Feedback</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Help us improve future events by sharing your experience
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(new Date(event.startDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.currentAttendees} attendees</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Overall Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StarRating
                  rating={overallRating}
                  onRatingChange={(rating) => {
                    setOverallRating(rating);
                    setValue("overallRating", rating);
                  }}
                  label="How would you rate this event overall?"
                  description="Consider all aspects of your experience"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="flex items-center space-x-3">
                    <ThumbsUp className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="wouldRecommend" className="text-sm">
                        Would you recommend this event to others?
                      </Label>
                      <Switch
                        id="wouldRecommend"
                        checked={watchWouldRecommend}
                        onCheckedChange={(checked) =>
                          setValue("wouldRecommend", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="wouldAttendAgain" className="text-sm">
                        Would you attend similar events?
                      </Label>
                      <Switch
                        id="wouldAttendAgain"
                        checked={watchWouldAttendAgain}
                        onCheckedChange={(checked) =>
                          setValue("wouldAttendAgain", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Ratings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rate specific aspects of the event (optional)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StarRating
                    rating={contentRating}
                    onRatingChange={(rating) => {
                      setContentRating(rating);
                      setValue("contentRating", rating);
                    }}
                    label="Content Quality"
                    description="Speakers, topics, materials"
                  />

                  <StarRating
                    rating={organizationRating}
                    onRatingChange={(rating) => {
                      setOrganizationRating(rating);
                      setValue("organizationRating", rating);
                    }}
                    label="Organization"
                    description="Planning, timing, communication"
                  />

                  <StarRating
                    rating={venueRating}
                    onRatingChange={(rating) => {
                      setVenueRating(rating);
                      setValue("venueRating", rating);
                    }}
                    label="Venue & Facilities"
                    description="Location, accessibility, amenities"
                  />

                  <StarRating
                    rating={networkingRating}
                    onRatingChange={(rating) => {
                      setNetworkingRating(rating);
                      setValue("networkingRating", rating);
                    }}
                    label="Networking Opportunities"
                    description="Connections, interactions, value"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Written Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Written Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="highlights">
                    <Award className="w-4 h-4 inline mr-2" />
                    What were the highlights of this event?
                  </Label>
                  <Textarea
                    id="highlights"
                    placeholder="Share what you enjoyed most about the event..."
                    {...register("highlights")}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Additional Comments
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share any additional thoughts about your experience..."
                    {...register("feedback")}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvements">
                    <Lightbulb className="w-4 h-4 inline mr-2" />
                    Suggestions for Improvement
                  </Label>
                  <Textarea
                    id="improvements"
                    placeholder="How could this event be improved for future attendees?"
                    {...register("improvements")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic" className="text-sm font-medium">
                      Make feedback public
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow others to see your feedback (without personal
                      details)
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={watchIsPublic}
                    onCheckedChange={(checked) => setValue("isPublic", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="isAnonymous"
                      className="text-sm font-medium"
                    >
                      Submit anonymously
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Hide your name from the feedback
                    </p>
                  </div>
                  <Switch
                    id="isAnonymous"
                    checked={watchIsAnonymous}
                    onCheckedChange={(checked) =>
                      setValue("isAnonymous", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <DialogFooter className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading || overallRating === 0}
            className="min-w-[120px]"
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
