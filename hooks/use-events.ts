"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getEvents,
  getEventById,
  getFeaturedEvents,
  getUpcomingEvents,
  getMyEvents,
  registerForEvent,
  cancelEventRegistration,
  checkInToEvent,
  submitEventFeedback,
  saveEvent,
  unsaveEvent,
  getSavedEvents,
  Event,
  EventSearchParams,
  EventRegistration,
  RegisterForEventData,
  EventFeedbackData,
  RegistrationStatus,
  EventCategory,
  EventMode,
  EventStatus,
} from "@/lib/api";

export interface UseEventsOptions {
  initialParams?: EventSearchParams;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<EventSearchParams>(
    options.initialParams || {}
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events with search/filter parameters
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["events", searchParams],
    queryFn: () => getEvents(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.autoRefresh
      ? options.refreshInterval || 30000
      : false,
  });

  // Fetch featured events
  const {
    data: featuredEvents,
    isLoading: featuredLoading,
    error: featuredError,
  } = useQuery({
    queryKey: ["events", "featured"],
    queryFn: () => getFeaturedEvents(6),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch upcoming events
  const {
    data: upcomingEvents,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => getUpcomingEvents(10),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user's registered events
  const {
    data: myEvents,
    isLoading: myEventsLoading,
    error: myEventsError,
    refetch: refetchMyEvents,
  } = useQuery({
    queryKey: ["events", "my-events"],
    queryFn: () => getMyEvents(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch saved events
  const {
    data: savedEvents,
    isLoading: savedEventsLoading,
    error: savedEventsError,
    refetch: refetchSavedEvents,
  } = useQuery({
    queryKey: ["events", "saved"],
    queryFn: getSavedEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Register for event mutation
  const registerMutation = useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: RegisterForEventData;
    }) => registerForEvent(eventId, data),
    onSuccess: (data, variables) => {
      toast.success(
        data.status === RegistrationStatus.WAITLISTED
          ? "You have been added to the waitlist!"
          : "Successfully registered for the event!"
      );
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register for event");
    },
  });

  // Cancel registration mutation
  const cancelRegistrationMutation = useMutation({
    mutationFn: (eventId: string) => cancelEventRegistration(eventId),
    onSuccess: () => {
      toast.success("Registration cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel registration");
    },
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (eventId: string) => checkInToEvent(eventId),
    onSuccess: () => {
      toast.success("Successfully checked in to the event!");
      queryClient.invalidateQueries({ queryKey: ["events", "my-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to check in");
    },
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: EventFeedbackData;
    }) => submitEventFeedback(eventId, data),
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });

  // Save event mutation
  const saveEventMutation = useMutation({
    mutationFn: (eventId: string) => saveEvent(eventId),
    onSuccess: () => {
      toast.success("Event saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "saved"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save event");
    },
  });

  // Unsave event mutation
  const unsaveEventMutation = useMutation({
    mutationFn: (eventId: string) => unsaveEvent(eventId),
    onSuccess: () => {
      toast.success("Event removed from saved list");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "saved"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unsave event");
    },
  });

  // Helper functions
  const updateSearchParams = useCallback(
    (newParams: Partial<EventSearchParams>) => {
      setSearchParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, []);

  const searchEvents = useCallback(
    (searchTerm: string) => {
      updateSearchParams({ search: searchTerm, page: 1 });
    },
    [updateSearchParams]
  );

  const filterByCategory = useCallback(
    (category: EventCategory | undefined) => {
      updateSearchParams({ category, page: 1 });
    },
    [updateSearchParams]
  );

  const filterByMode = useCallback(
    (mode: EventMode | undefined) => {
      updateSearchParams({ mode, page: 1 });
    },
    [updateSearchParams]
  );

  const filterByStatus = useCallback(
    (status: EventStatus | undefined) => {
      updateSearchParams({ status, page: 1 });
    },
    [updateSearchParams]
  );

  const filterByLocation = useCallback(
    (city?: string, state?: string, country?: string) => {
      updateSearchParams({ city, state, country, page: 1 });
    },
    [updateSearchParams]
  );

  const filterByDateRange = useCallback(
    (startDateFrom?: string, startDateTo?: string) => {
      updateSearchParams({ startDateFrom, startDateTo, page: 1 });
    },
    [updateSearchParams]
  );

  const toggleFeaturedOnly = useCallback(() => {
    updateSearchParams({
      isFeatured: searchParams.isFeatured ? undefined : true,
      page: 1,
    });
  }, [updateSearchParams, searchParams.isFeatured]);

  const toggleFreeOnly = useCallback(() => {
    updateSearchParams({
      isFree: searchParams.isFree ? undefined : true,
      page: 1,
    });
  }, [updateSearchParams, searchParams.isFree]);

  const changePage = useCallback(
    (page: number) => {
      updateSearchParams({ page });
    },
    [updateSearchParams]
  );

  const changeLimit = useCallback(
    (limit: number) => {
      updateSearchParams({ limit, page: 1 });
    },
    [updateSearchParams]
  );

  const sortEvents = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "asc") => {
      updateSearchParams({ sortBy, sortOrder, page: 1 });
    },
    [updateSearchParams]
  );

  // Action functions
  const handleRegisterForEvent = useCallback(
    (eventId: string, data: RegisterForEventData = {}) => {
      registerMutation.mutate({ eventId, data });
    },
    [registerMutation]
  );

  const handleCancelRegistration = useCallback(
    (eventId: string) => {
      cancelRegistrationMutation.mutate(eventId);
    },
    [cancelRegistrationMutation]
  );

  const handleCheckIn = useCallback(
    (eventId: string) => {
      checkInMutation.mutate(eventId);
    },
    [checkInMutation]
  );

  const handleSubmitFeedback = useCallback(
    (eventId: string, data: EventFeedbackData) => {
      submitFeedbackMutation.mutate({ eventId, data });
    },
    [submitFeedbackMutation]
  );

  const handleSaveEvent = useCallback(
    (eventId: string) => {
      saveEventMutation.mutate(eventId);
    },
    [saveEventMutation]
  );

  const handleUnsaveEvent = useCallback(
    (eventId: string) => {
      unsaveEventMutation.mutate(eventId);
    },
    [unsaveEventMutation]
  );

  // Utility functions
  const isEventRegistered = useCallback(
    (eventId: string) => {
      return (
        myEvents?.some((registration) => registration.eventId === eventId) ||
        false
      );
    },
    [myEvents]
  );

  const isEventSaved = useCallback(
    (eventId: string) => {
      return savedEvents?.some((event) => event.id === eventId) || false;
    },
    [savedEvents]
  );

  const getEventRegistration = useCallback(
    (eventId: string) => {
      return myEvents?.find((registration) => registration.eventId === eventId);
    },
    [myEvents]
  );

  const canCheckIn = useCallback(
    (eventId: string) => {
      const registration = getEventRegistration(eventId);
      if (!registration) return false;

      const now = new Date();
      const eventStart = new Date(registration.event?.startDate || "");
      const timeDiff = eventStart.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      // Can check in 2 hours before and during the event
      return hoursDiff <= 2 && hoursDiff >= -24;
    },
    [getEventRegistration]
  );

  const canSubmitFeedback = useCallback(
    (eventId: string) => {
      const registration = getEventRegistration(eventId);
      if (!registration) return false;

      const now = new Date();
      const eventEnd = new Date(registration.event?.endDate || "");

      // Can submit feedback after event ends
      return now > eventEnd;
    },
    [getEventRegistration]
  );

  // Stats and analytics
  const stats = {
    totalEvents: eventsData?.pagination?.total || 0,
    registeredEvents: myEvents?.length || 0,
    savedEvents: savedEvents?.length || 0,
    attendedEvents: myEvents?.filter((r) => r.checkedInAt).length || 0,
    upcomingRegistrations:
      myEvents?.filter((r) => {
        const eventStart = new Date(r.event?.startDate || "");
        return eventStart > new Date();
      }).length || 0,
  };

  return {
    // Data
    events: eventsData?.events || [],
    pagination: eventsData?.pagination,
    featuredEvents: featuredEvents || [],
    upcomingEvents: upcomingEvents || [],
    myEvents: myEvents || [],
    savedEvents: savedEvents || [],

    // Loading states
    isLoading: eventsLoading || isLoading,
    featuredLoading,
    upcomingLoading,
    myEventsLoading,
    savedEventsLoading,

    // Mutation loading states
    isRegistering: registerMutation.isPending,
    isCancelling: cancelRegistrationMutation.isPending,
    isCheckingIn: checkInMutation.isPending,
    isSubmittingFeedback: submitFeedbackMutation.isPending,
    isSaving: saveEventMutation.isPending || unsaveEventMutation.isPending,

    // Errors
    error:
      eventsError ||
      featuredError ||
      upcomingError ||
      myEventsError ||
      savedEventsError,

    // Search and filter state
    searchParams,

    // Filter functions
    updateSearchParams,
    clearFilters,
    searchEvents,
    filterByCategory,
    filterByMode,
    filterByStatus,
    filterByLocation,
    filterByDateRange,
    toggleFeaturedOnly,
    toggleFreeOnly,
    changePage,
    changeLimit,
    sortEvents,

    // Action functions
    registerForEvent: handleRegisterForEvent,
    cancelRegistration: handleCancelRegistration,
    checkIn: handleCheckIn,
    submitFeedback: handleSubmitFeedback,
    saveEvent: handleSaveEvent,
    unsaveEvent: handleUnsaveEvent,

    // Utility functions
    isEventRegistered,
    isEventSaved,
    getEventRegistration,
    canCheckIn,
    canSubmitFeedback,

    // Refresh functions
    refetch: refetchEvents,
    refetchMyEvents,
    refetchSavedEvents,

    // Stats
    stats,
  };
}

// Hook for single event details
export function useEvent(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["events", eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const incrementViewCount = useCallback(() => {
    // Optimistically update the view count
    if (event) {
      queryClient.setQueryData(["events", eventId], {
        ...event,
        viewCount: event.viewCount + 1,
      });
    }
  }, [event, eventId, queryClient]);

  return {
    event,
    isLoading,
    error,
    refetch,
    incrementViewCount,
  };
}
