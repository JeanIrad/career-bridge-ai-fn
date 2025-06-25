"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/use-events";
import {
  EventCategory,
  EventMode,
  EventStatus,
  Event,
  RegistrationStatus,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Share2,
  Eye,
  Building,
  GraduationCap,
  Zap,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { toast } from "sonner";
import { EventRegistrationDialog } from "@/components/student/dialogs/event-registration-dialog";
import { EventFeedbackDialog } from "@/components/student/dialogs/event-feedback-dialog";

interface StudentEventsProps {
  className?: string;
}

export default function StudentEvents({ className }: StudentEventsProps) {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [eventToRegister, setEventToRegister] = useState<Event | null>(null);
  const [eventToFeedback, setEventToFeedback] = useState<Event | null>(null);

  const {
    events,
    featuredEvents,
    upcomingEvents,
    myEvents,
    savedEvents,
    pagination,
    isLoading,
    featuredLoading,
    upcomingLoading,
    myEventsLoading,
    savedEventsLoading,
    isRegistering,
    isCancelling,
    isSaving,
    searchParams,
    searchEvents,
    filterByCategory,
    filterByMode,
    filterByStatus,
    filterByLocation,
    filterByDateRange,
    toggleFeaturedOnly,
    toggleFreeOnly,
    clearFilters,
    changePage,
    sortEvents,
    registerForEvent,
    cancelRegistration,
    saveEvent,
    unsaveEvent,
    isEventRegistered,
    isEventSaved,
    getEventRegistration,
    canCheckIn,
    canSubmitFeedback,
    stats,
    refetch,
  } = useEvents({
    initialParams: { limit: 12 },
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
  });

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    searchEvents(value);
  };

  // Handle registration dialog
  const handleOpenRegistrationDialog = (event: Event) => {
    setEventToRegister(event);
    setRegistrationDialogOpen(true);
  };

  // Handle feedback dialog
  const handleOpenFeedbackDialog = (event: Event) => {
    setEventToFeedback(event);
    setFeedbackDialogOpen(true);
  };

  // Handle registration with data
  const handleRegisterWithData = (data: any) => {
    if (eventToRegister) {
      registerForEvent(eventToRegister.id, data);
      setRegistrationDialogOpen(false);
      setEventToRegister(null);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = (data: any) => {
    if (eventToFeedback) {
      // Submit feedback using the hook
      // submitFeedback(eventToFeedback.id, data);
      setFeedbackDialogOpen(false);
      setEventToFeedback(null);
    }
  };

  // Event category options
  const categoryOptions = [
    { value: EventCategory.CAREER_FAIR, label: "Career Fair" },
    { value: EventCategory.JOB_FAIR, label: "Job Fair" },
    { value: EventCategory.NETWORKING_EVENT, label: "Networking" },
    { value: EventCategory.TECH_TALK, label: "Tech Talk" },
    { value: EventCategory.WORKSHOP, label: "Workshop" },
    { value: EventCategory.WEBINAR, label: "Webinar" },
    { value: EventCategory.CONFERENCE, label: "Conference" },
    { value: EventCategory.HACKATHON, label: "Hackathon" },
    { value: EventCategory.COMPETITION, label: "Competition" },
    { value: EventCategory.INTERVIEW_PREP, label: "Interview Prep" },
    { value: EventCategory.RESUME_REVIEW, label: "Resume Review" },
    { value: EventCategory.SKILL_BUILDING, label: "Skill Building" },
    { value: EventCategory.MENTORSHIP_EVENT, label: "Mentorship" },
    { value: EventCategory.COMPANY_SHOWCASE, label: "Company Showcase" },
    { value: EventCategory.ALUMNI_MEETUP, label: "Alumni Meetup" },
  ];

  // Get category label
  const getCategoryLabel = (category: EventCategory) => {
    return (
      categoryOptions.find((opt) => opt.value === category)?.label || category
    );
  };

  // Get event status color
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return "bg-blue-100 text-blue-800";
      case EventStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case EventStatus.COMPLETED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get registration status color
  const getRegistrationStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.REGISTERED:
        return "bg-blue-100 text-blue-800";
      case RegistrationStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case RegistrationStatus.WAITLISTED:
        return "bg-yellow-100 text-yellow-800";
      case RegistrationStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Event card component
  const EventCard = ({
    event,
    showActions = true,
  }: {
    event: Event;
    showActions?: boolean;
  }) => {
    const isRegistered = isEventRegistered(event.id);
    const isSaved = isEventSaved(event.id);
    const registration = getEventRegistration(event.id);
    const isEventFull = event.currentAttendees >= event.capacity;
    const isRegistrationOpen =
      event.isRegistrationOpen &&
      (event.registrationDeadline
        ? isBefore(new Date(), new Date(event.registrationDeadline))
        : true);

    return (
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryLabel(event.category)}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                  {event.status}
                </Badge>
                {event.isFeatured && (
                  <Badge className="text-xs bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {event.registrationFee === 0 && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    Free
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {event.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {event.shortDescription || event.description}
              </p>
            </div>
            {showActions && (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    isSaved ? unsaveEvent(event.id) : saveEvent(event.id)
                  }
                  disabled={isSaving}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {format(new Date(event.startDate), "MMM dd, yyyy")} at{" "}
                  {format(new Date(event.startDate), "h:mm a")}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {event.duration
                    ? `${event.duration} minutes`
                    : `${formatDistanceToNow(new Date(event.endDate))} duration`}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>
                  {event.mode === EventMode.ONLINE
                    ? "Online Event"
                    : event.mode === EventMode.HYBRID
                      ? `Hybrid - ${event.location}`
                      : event.location}
                </span>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                <span>
                  {event.currentAttendees} / {event.capacity} registered
                </span>
                {event.capacity > 0 && (
                  <div className="flex-1 ml-2">
                    <Progress
                      value={(event.currentAttendees / event.capacity) * 100}
                      className="h-1"
                    />
                  </div>
                )}
              </div>

              {/* Company/University */}
              {(event.company || event.university) && (
                <div className="flex items-center text-sm text-muted-foreground">
                  {event.company ? (
                    <>
                      <Building className="w-4 h-4 mr-2" />
                      <span>{event.company.name}</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>{event.university?.name}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Registration Status */}
            {isRegistered && registration && (
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs ${getRegistrationStatusColor(registration.status)}`}
                >
                  {registration.status}
                </Badge>
                {registration.checkedInAt && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Checked In
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>

                {!isRegistered ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenRegistrationDialog(event)}
                    disabled={
                      isRegistering || !isRegistrationOpen || isEventFull
                    }
                    className="flex-1"
                  >
                    {isRegistering
                      ? "Registering..."
                      : !isRegistrationOpen
                        ? "Registration Closed"
                        : isEventFull
                          ? "Event Full"
                          : "Register"}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => cancelRegistration(event.id)}
                    disabled={isCancelling}
                    className="flex-1"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Stats cards
  const StatsCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        {trend && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Events</h1>
          <p className="text-muted-foreground">
            Discover and register for career events, workshops, and networking
            opportunities
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={CalendarIcon}
          trend="+12% from last month"
        />
        <StatsCard
          title="Registered"
          value={stats.registeredEvents}
          icon={CheckCircle}
        />
        <StatsCard
          title="Saved Events"
          value={stats.savedEvents}
          icon={Bookmark}
        />
        <StatsCard title="Attended" value={stats.attendedEvents} icon={Award} />
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="registered">My Events</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={searchParams.category || "all"}
                onValueChange={(value) =>
                  filterByCategory(
                    value === "all" ? undefined : (value as EventCategory)
                  )
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={searchParams.mode || "all"}
                onValueChange={(value) =>
                  filterByMode(
                    value === "all" ? undefined : (value as EventMode)
                  )
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value={EventMode.ONLINE}>Online</SelectItem>
                  <SelectItem value={EventMode.OFFLINE}>In-Person</SelectItem>
                  <SelectItem value={EventMode.HYBRID}>Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={toggleFeaturedOnly}
                className={
                  searchParams.isFeatured
                    ? "bg-yellow-50 border-yellow-200"
                    : ""
                }
              >
                <Star className="w-4 h-4 mr-2" />
                Featured
              </Button>

              <Button
                variant="outline"
                onClick={toggleFreeOnly}
                className={
                  searchParams.isFree ? "bg-green-50 border-green-200" : ""
                }
              >
                Free
              </Button>

              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new
                events.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* My Events Tab */}
        <TabsContent value="registered" className="space-y-6">
          {myEventsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No registered events
              </h3>
              <p className="text-muted-foreground">
                You haven't registered for any events yet. Browse events to get
                started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((registration) => (
                <Card key={registration.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`text-xs ${getRegistrationStatusColor(registration.status)}`}
                          >
                            {registration.status}
                          </Badge>
                          {registration.checkedInAt && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Checked In
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold mb-1">
                          {registration.event?.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {registration.event &&
                              format(
                                new Date(registration.event.startDate),
                                "MMM dd, yyyy"
                              )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {registration.event &&
                              format(
                                new Date(registration.event.startDate),
                                "h:mm a"
                              )}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {registration.event?.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {registration.event &&
                          canCheckIn(registration.event.id) && (
                            <Button size="sm" variant="outline">
                              Check In
                            </Button>
                          )}

                        {registration.event &&
                          canSubmitFeedback(registration.event.id) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleOpenFeedbackDialog(registration.event!)
                              }
                            >
                              Submit Feedback
                            </Button>
                          )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEvent(registration.event!)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Saved Events Tab */}
        <TabsContent value="saved" className="space-y-6">
          {savedEventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : savedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved events</h3>
              <p className="text-muted-foreground">
                Save events you're interested in to view them later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Featured Events Tab */}
        <TabsContent value="featured" className="space-y-6">
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No featured events</h3>
              <p className="text-muted-foreground">
                Check back later for featured events and opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Event banner */}
              {selectedEvent.bannerImage && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.bannerImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Event details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>
                          {format(
                            new Date(selectedEvent.startDate),
                            "EEEE, MMMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>
                          {format(new Date(selectedEvent.startDate), "h:mm a")}{" "}
                          - {format(new Date(selectedEvent.endDate), "h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>
                          {selectedEvent.currentAttendees} /{" "}
                          {selectedEvent.capacity} registered
                        </span>
                      </div>
                    </div>
                  </div>

                  {(selectedEvent.company || selectedEvent.university) && (
                    <div>
                      <h3 className="font-semibold mb-2">Organizer</h3>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              selectedEvent.company?.logo ||
                              selectedEvent.university?.logo
                            }
                          />
                          <AvatarFallback>
                            {selectedEvent.company?.name?.[0] ||
                              selectedEvent.university?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedEvent.company?.name ||
                              selectedEvent.university?.name}
                          </p>
                          {selectedEvent.company?.website && (
                            <a
                              href={selectedEvent.company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Registration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Fee:</span>
                        <span className="font-medium">
                          {selectedEvent.registrationFee === 0
                            ? "Free"
                            : `$${selectedEvent.registrationFee}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Deadline:</span>
                        <span className="font-medium">
                          {selectedEvent.registrationDeadline
                            ? format(
                                new Date(selectedEvent.registrationDeadline),
                                "MMM dd, yyyy"
                              )
                            : "No deadline"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Status:</span>
                        <Badge
                          className={`text-xs ${getStatusColor(selectedEvent.status)}`}
                        >
                          {selectedEvent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  onClick={() => {
                    if (isEventSaved(selectedEvent.id)) {
                      unsaveEvent(selectedEvent.id);
                    } else {
                      saveEvent(selectedEvent.id);
                    }
                  }}
                  variant="outline"
                  disabled={isSaving}
                >
                  {isEventSaved(selectedEvent.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save Event
                    </>
                  )}
                </Button>

                {!isEventRegistered(selectedEvent.id) ? (
                  <Button
                    onClick={() => registerForEvent(selectedEvent.id)}
                    disabled={
                      isRegistering || !selectedEvent.isRegistrationOpen
                    }
                    className="flex-1"
                  >
                    {isRegistering ? "Registering..." : "Register for Event"}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => cancelRegistration(selectedEvent.id)}
                    disabled={isCancelling}
                    className="flex-1"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Registration Dialog */}
      {eventToRegister && (
        <EventRegistrationDialog
          event={eventToRegister}
          open={registrationDialogOpen}
          onOpenChange={setRegistrationDialogOpen}
          onRegister={(data) => {
            registerForEvent(eventToRegister.id, data);
            setRegistrationDialogOpen(false);
            setEventToRegister(null);
          }}
          isLoading={isRegistering}
        />
      )}

      {/* Feedback Dialog */}
      {eventToFeedback && (
        <EventFeedbackDialog
          event={eventToFeedback}
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          onSubmit={(data) => {
            // submitFeedback(eventToFeedback.id, data);
            toast.success("Thank you for your feedback!");
            setFeedbackDialogOpen(false);
            setEventToFeedback(null);
          }}
          isLoading={false}
        />
      )}
    </div>
  );
}
