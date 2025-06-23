"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  Globe,
  Video,
  Building,
  CheckCircle,
  AlertTriangle,
  Target,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Star,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  UniversityPartnership,
  UniversityEvent,
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "@/lib/api-university-partners";

interface UniversityEventsProps {
  partnership: UniversityPartnership;
}

export function UniversityEvents({ partnership }: UniversityEventsProps) {
  const [events, setEvents] = useState<UniversityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [eventMetrics, setEventMetrics] = useState({
    totalAttendees: 0,
    averageAttendance: 0,
    engagementRate: 0,
    upcomingEvents: 0,
    pastEvents: 0,
  });

  useEffect(() => {
    loadEvents();
  }, [partnership.id]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await getEvents(partnership.id);
      setEvents(data);
      calculateEventMetrics(data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEventMetrics = (eventData: UniversityEvent[]) => {
    const now = new Date();
    const pastEvents = eventData.filter((e) => new Date(e.endDate) < now);
    const upcoming = eventData.filter((e) => new Date(e.startDate) > now);
    const totalAttendees = pastEvents.reduce(
      (sum, e) => sum + (e.attendees || 0),
      0
    );
    const averageAttendance = pastEvents.length
      ? Math.round(totalAttendees / pastEvents.length)
      : 0;
    const engagementRate = pastEvents.length
      ? Math.round(
          (totalAttendees /
            pastEvents.reduce((sum, e) => sum + (e.capacity || 0), 0)) *
            100
        )
      : 0;

    setEventMetrics({
      totalAttendees,
      averageAttendance,
      engagementRate,
      upcomingEvents: upcoming.length,
      pastEvents: pastEvents.length,
    });
  };

  const handleCreateEvent = async () => {
    try {
      setIsLoading(true);
      const event = await createEvent(partnership.id, newEventData);
      setEvents((prev) => [event, ...prev]);
      setShowNewEventDialog(false);
      setNewEventData({
        title: "",
        description: "",
        eventType: "CAREER_FAIR",
        startDate: "",
        endDate: "",
        location: "",
        mode: "OFFLINE",
        capacity: 0,
        registrationDeadline: "",
      });
      toast.success("Event created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "CAREER_FAIR":
        return <Users className="w-4 h-4" />;
      case "INFO_SESSION":
        return <Globe className="w-4 h-4" />;
      case "WORKSHOP":
        return <Building className="w-4 h-4" />;
      case "TECH_TALK":
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventModeIcon = (mode: string) => {
    switch (mode) {
      case "ONLINE":
        return <Video className="w-4 h-4" />;
      case "OFFLINE":
        return <Building className="w-4 h-4" />;
      case "HYBRID":
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "ONGOING":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
      default:
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>
                Track event performance and engagement
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewEventDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {eventMetrics.totalAttendees}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Attendees
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Target className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {eventMetrics.averageAttendance}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg. Attendance
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {eventMetrics.engagementRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Engagement Rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {eventMetrics.upcomingEvents}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming Events
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-8 h-8 text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">
                    {eventMetrics.pastEvents}
                  </div>
                  <p className="text-sm text-muted-foreground">Past Events</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Timeline */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Event Timeline</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Events Scheduled
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule your first event with {partnership.universityName}
                  </p>
                  <Button onClick={() => setShowNewEventDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              ) : (
                events
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime()
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {event.eventType === "CAREER_FAIR" ? (
                          <Building2 className="w-6 h-6 text-primary" />
                        ) : event.eventType === "WORKSHOP" ? (
                          <GraduationCap className="w-6 h-6 text-primary" />
                        ) : event.eventType === "RECRUITMENT" ? (
                          <Briefcase className="w-6 h-6 text-primary" />
                        ) : (
                          <Award className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge
                            variant={
                              new Date(event.startDate) > new Date()
                                ? "default"
                                : "secondary"
                            }
                          >
                            {new Date(event.startDate) > new Date()
                              ? "Upcoming"
                              : "Past"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {new Date(event.startDate).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{event.location || "Online"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {event.attendees || 0}/{event.capacity || "∞"}
                            </span>
                          </div>
                        </div>
                        {event.feedback && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-1 text-sm mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">
                                {typeof event.feedback === "object" &&
                                "rating" in event.feedback
                                  ? (event.feedback as any).rating
                                  : "N/A"}
                              </span>
                              <span className="text-muted-foreground">
                                Average Rating
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {typeof event.feedback === "object" &&
                              "comments" in event.feedback
                                ? (event.feedback as any).comments
                                : "No feedback available"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Event Dialog */}
      <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {partnership.universityName}
            </DialogDescription>
          </DialogHeader>
          {/* Event form goes here */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
