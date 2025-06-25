"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Users,
  Search,
  Filter,
  Star,
  MessageCircle,
  Calendar,
  Award,
  Building2,
  GraduationCap,
  Clock,
  Video,
  Target,
  MessageSquare,
  MapPin,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface MentorProfile {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  industries: string[];
  yearsOfExperience: number;
  currentRole: string;
  currentCompany: string;
  isAvailable: boolean;
  maxMentees: number;
  currentMentees: number;
  preferredMeetingMode: string;
  timeZone?: string;
  hourlyRate?: number;
  isPaidMentor: boolean;
  isVerified: boolean;
  averageRating?: number;
  totalReviews: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  _count: {
    mentorReviews: number;
    mentorshipSessions: number;
  };
}

interface MentorshipRequest {
  id: string;
  title: string;
  description: string;
  goals: string[];
  status: string;
  requestedAt: string;
  respondedAt?: string;
  mentorResponse?: string;
  mentor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    currentRole: string;
    currentCompany: string;
  };
}

interface MentorshipSession {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingMode: string;
  meetingLink?: string;
  mentor: {
    user: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    currentRole: string;
  };
  mentorship?: {
    id: string;
    title: string;
  };
}

interface MenteeDashboard {
  activeMentorships: number;
  totalSessions: number;
  upcomingSessions: number;
  pendingRequests: number;
  completedGoals: number;
  totalGoals: number;
  goalCompletionRate: number;
}

export default function StudentMentorship() {
  // const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [dashboard, setDashboard] = useState<MenteeDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(
    null
  );

  // Form states
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    goals: [""],
    duration: 8,
    meetingFrequency: "weekly",
  });

  useEffect(() => {
    loadDashboard();
    loadMentors();
    loadRequests();
    loadSessions();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/mentorship/mentee/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error("Error loading mentee dashboard:", error);
    }
  };

  const loadMentors = async () => {
    try {
      setLoading(true);
      const queryParams: any = {};

      if (searchQuery) queryParams.search = searchQuery;
      if (selectedExpertise && selectedExpertise !== "all")
        queryParams.expertise = [selectedExpertise];
      if (selectedIndustry && selectedIndustry !== "all")
        queryParams.industries = [selectedIndustry];
      queryParams.isAvailable = true;
      queryParams.limit = 20;
      queryParams.offset = 0;

      const response = await api.get("/mentorship/mentors/search", {
        params: queryParams,
      });
      setMentors(response.data.mentors || []);
    } catch (error) {
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get("/mentorship/requests/sent");
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error loading mentorship requests:", error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await api.get("/mentorship/sessions");
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const handleSearch = () => {
    loadMentors();
  };

  const handleRequestMentorship = async () => {
    if (!selectedMentor) return;

    try {
      const goals = requestForm.goals.filter((goal) => goal.trim() !== "");

      await api.post("/mentorship/requests", {
        mentorId: selectedMentor.id,
        title: requestForm.title,
        description: requestForm.description,
        goals,
        duration: requestForm.duration,
        meetingFrequency: requestForm.meetingFrequency,
      });

      toast.success("Mentorship request sent successfully!");

      setShowRequestDialog(false);
      setRequestForm({
        title: "",
        description: "",
        goals: [""],
        duration: 8,
        meetingFrequency: "weekly",
      });
      loadRequests();
      loadDashboard();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send mentorship request"
      );
    }
  };

  const addGoal = () => {
    setRequestForm((prev) => ({
      ...prev,
      goals: [...prev.goals, ""],
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setRequestForm((prev) => ({
      ...prev,
      goals: prev.goals.map((goal, i) => (i === index ? value : goal)),
    }));
  };

  const removeGoal = (index: number) => {
    if (requestForm.goals.length > 1) {
      setRequestForm((prev) => ({
        ...prev,
        goals: prev.goals.filter((_, i) => i !== index),
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const expertiseOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "Product Management",
    "UX Design",
    "UI Design",
    "Data Science",
    "Machine Learning",
    "Marketing",
    "Sales",
    "Business Development",
    "Strategy",
    "Leadership",
  ];

  const industryOptions = [
    "Technology",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "SaaS",
    "Marketing",
    "Design",
    "Data Science",
    "Finance",
    "Consumer Goods",
    "Media",
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorship</h1>
          <p className="text-gray-600 mt-1">
            Connect with experienced professionals to accelerate your career
            growth
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {dashboard && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Active Mentorships
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboard.activeMentorships}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Sessions
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {dashboard.totalSessions}
                        </p>
                      </div>
                      <Video className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Upcoming Sessions
                        </p>
                        <p className="text-2xl font-bold text-orange-600">
                          {dashboard.upcomingSessions}
                        </p>
                      </div>
                      <CalendarIcon className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Goal Completion
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {Math.round(dashboard.goalCompletionRate)}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Completed Goals
                        </span>
                        <span className="text-sm text-gray-600">
                          {dashboard.completedGoals} of {dashboard.totalGoals}
                        </span>
                      </div>
                      <Progress
                        value={dashboard.goalCompletionRate}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600">
                        Keep up the great work! You're making excellent progress
                        on your goals.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setActiveTab("mentors")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Find New Mentors
                      </Button>
                      <Button
                        onClick={() => setActiveTab("sessions")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        View Upcoming Sessions
                      </Button>
                      <Button
                        onClick={() => setActiveTab("goals")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Target className="mr-2 h-4 w-4" />
                        Update Goals
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="mentors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, role, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expertise">Expertise</Label>
                  <Select
                    value={selectedExpertise}
                    onValueChange={setSelectedExpertise}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      {expertiseOptions.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={selectedIndustry}
                    onValueChange={setSelectedIndustry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mentor.user.avatar} />
                        <AvatarFallback>
                          {mentor.user.firstName[0]}
                          {mentor.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {mentor.user.firstName} {mentor.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {mentor.currentRole}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {mentor.currentCompany}
                        </p>
                      </div>
                      {mentor.isVerified && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{mentor.averageRating?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{mentor.totalReviews} reviews</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{mentor.yearsOfExperience}y exp</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          Expertise
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.slice(0, 3).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {mentor.expertise.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mentor.expertise.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {mentor.bio}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm">
                        {mentor.isPaidMentor ? (
                          <span className="font-medium text-green-600">
                            ${mentor.hourlyRate}/hr
                          </span>
                        ) : (
                          <span className="text-gray-600">Free</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowRequestDialog(true);
                        }}
                        disabled={!mentor.isAvailable}
                      >
                        Request Mentorship
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mentors.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mentors found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.mentor.user.avatar} />
                          <AvatarFallback>
                            {request.mentor.user.firstName[0]}
                            {request.mentor.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Mentor: {request.mentor.user.firstName}{" "}
                            {request.mentor.user.lastName} •{" "}
                            {request.mentor.currentRole}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700">{request.description}</p>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Goals:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {request.goals.map((goal, index) => (
                            <Badge key={index} variant="outline">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {request.mentorResponse && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Mentor Response:
                          </p>
                          <p className="text-sm text-green-700">
                            {request.mentorResponse}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Requested on {formatDate(request.requestedAt)}
                        </span>
                        {request.respondedAt && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Responded on {formatDate(request.respondedAt)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {requests.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No mentorship requests
                </h3>
                <p className="text-gray-600">
                  You haven't sent any mentorship requests yet.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab("mentors")}
                >
                  Find Mentors
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.mentor.user.avatar} />
                          <AvatarFallback>
                            {session.mentor.user.firstName[0]}
                            {session.mentor.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {session.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            with {session.mentor.user.firstName}{" "}
                            {session.mentor.user.lastName}
                          </p>
                        </div>
                      </div>

                      {session.description && (
                        <p className="text-gray-700">{session.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDateTime(session.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{session.meetingMode}</span>
                        </div>
                      </div>

                      {session.meetingLink &&
                        session.status === "SCHEDULED" && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                window.open(session.meetingLink, "_blank")
                              }
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Join Meeting
                            </Button>
                          </div>
                        )}
                    </div>

                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sessions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No sessions scheduled
                </h3>
                <p className="text-gray-600">
                  You don't have any mentorship sessions yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Goal tracking coming soon
              </h3>
              <p className="text-gray-600">
                This feature will be available once you have active mentorships.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Mentorship Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
          </DialogHeader>

          {selectedMentor && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedMentor.user.avatar} />
                  <AvatarFallback>
                    {selectedMentor.user.firstName[0]}
                    {selectedMentor.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {selectedMentor.user.firstName}{" "}
                    {selectedMentor.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedMentor.currentRole}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedMentor.currentCompany}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Mentorship Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Career Transition to Software Engineering"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're looking for in this mentorship..."
                    rows={4}
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Goals</Label>
                  <div className="space-y-2">
                    {requestForm.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Goal ${index + 1}`}
                          value={goal}
                          onChange={(e) => updateGoal(index, e.target.value)}
                        />
                        {requestForm.goals.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeGoal(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGoal}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Select
                      value={requestForm.duration.toString()}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          duration: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 weeks</SelectItem>
                        <SelectItem value="8">8 weeks</SelectItem>
                        <SelectItem value="12">12 weeks</SelectItem>
                        <SelectItem value="16">16 weeks</SelectItem>
                        <SelectItem value="24">24 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Meeting Frequency</Label>
                    <Select
                      value={requestForm.meetingFrequency}
                      onValueChange={(value) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          meetingFrequency: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleRequestMentorship}>Send Request</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
