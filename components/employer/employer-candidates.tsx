"use client";

import { useState, useEffect } from "react";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Eye,
  MessageCircle,
  Loader2,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { MessageCandidateDialog } from "./dialogs/message-candidate-dialog";
import { ScheduleInterviewDialog } from "./dialogs/schedule-interview-dialog";
import { CandidateProfileDialog } from "./dialogs/candidate-profile-dialog";

export function EmployerCandidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidateStats, setCandidateStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [jobs, setJobs] = useState<any[]>([]);

  // Dialog states
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [movingCandidateId, setMovingCandidateId] = useState<string | null>(
    null
  );

  const {
    loading,
    error,
    getAllCandidatesFromApplications,
    getCandidateStats,
  } = useCandidates();
  const { getMyJobs, updateApplicationStatus } = useJobs();

  useEffect(() => {
    fetchCandidates();
    fetchCandidateStats();
    fetchJobs();
  }, [currentPage, searchTerm, statusFilter, jobFilter]);

  const fetchCandidates = async () => {
    try {
      const query: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) query.search = searchTerm;
      if (statusFilter !== "all") query.status = statusFilter;
      if (jobFilter !== "all") query.jobId = jobFilter;

      const response = await getAllCandidatesFromApplications(query);
      setCandidates(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error("Failed to fetch candidates:", err);
      toast.error("Failed to load candidates");
    }
  };

  const fetchCandidateStats = async () => {
    try {
      // For now, calculate stats from applications
      // This could be moved to a dedicated endpoint later
      const allCandidatesResponse = await getAllCandidatesFromApplications({
        limit: 1000,
      });
      const allCandidates = allCandidatesResponse.data;

      const stats = {
        totalCandidates: allCandidates.length,
        interviewsScheduled: allCandidates.filter(
          (c: any) => c.status === "INTERVIEW_SCHEDULED"
        ).length,
        offersExtended: allCandidates.filter(
          (c: any) => c.status === "OFFER_EXTENDED"
        ).length,
        averageRating:
          allCandidates.reduce(
            (acc: number, c: any) => acc + (c.rating || 0),
            0
          ) / allCandidates.length || 0,
      };

      setCandidateStats(stats);
    } catch (err: any) {
      console.error("Failed to fetch candidate stats:", err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await getMyJobs({ limit: 100 });
      setJobs(response.data);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REVIEWED":
        return "bg-blue-100 text-blue-700";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-100 text-purple-700";
      case "SHORTLISTED":
        return "bg-green-100 text-green-700";
      case "OFFER_EXTENDED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Under Review";
      case "REVIEWED":
        return "Reviewed";
      case "INTERVIEW_SCHEDULED":
        return "Interview Scheduled";
      case "SHORTLISTED":
        return "Shortlisted";
      case "OFFER_EXTENDED":
        return "Offer Extended";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const handleViewProfile = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowProfileDialog(true);
  };

  const handleMessage = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowMessageDialog(true);
  };

  const handleScheduleInterview = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowInterviewDialog(true);
  };

  const handleMoveToNextStage = async (candidate: any) => {
    try {
      setMovingCandidateId(candidate.id);

      if (!candidate.jobId || !candidate.applicationId) {
        toast.error("Missing job or application information");
        return;
      }

      // Define status progression
      const statusProgression: { [key: string]: string } = {
        PENDING: "REVIEWED",
        REVIEWED: "SHORTLISTED",
        SHORTLISTED: "INTERVIEWED",
        INTERVIEWED: "ACCEPTED",
      };

      const nextStatus = statusProgression[candidate.status];
      if (!nextStatus) {
        toast.error("Cannot move to next stage from current status");
        return;
      }

      await updateApplicationStatus(
        candidate.jobId,
        candidate.applicationId,
        nextStatus,
        `Application moved to ${nextStatus.toLowerCase()} stage`
      );

      toast.success(
        `Moved ${candidate.firstName} ${candidate.lastName} to ${nextStatus.toLowerCase()} stage!`
      );

      // Refresh the candidates list
      fetchCandidates();
      fetchCandidateStats();
    } catch (error: any) {
      console.error("Failed to move to next stage:", error);
      toast.error("Failed to move to next stage");
    } finally {
      setMovingCandidateId(null);
    }
  };

  const handleDialogSuccess = () => {
    fetchCandidates();
    fetchCandidateStats();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Candidates
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchCandidates}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidate Management</h1>
          <p className="text-muted-foreground">
            Review and manage job applicants and potential candidates
          </p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Talent Pool
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Candidates
                </p>
                <p className="text-2xl font-bold">
                  {candidateStats?.totalCandidates || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Interviews Scheduled
                </p>
                <p className="text-2xl font-bold">
                  {candidateStats?.interviewsScheduled || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Offers Extended
                </p>
                <p className="text-2xl font-bold">
                  {candidateStats?.offersExtended || 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Rating
                </p>
                <p className="text-2xl font-bold">
                  {candidateStats?.averageRating?.toFixed(1) || "0.0"}
                </p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>
                Review candidate profiles and manage applications
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Under Review</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="INTERVIEW_SCHEDULED">
                    Interview Scheduled
                  </SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="OFFER_EXTENDED">Offer Extended</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Job Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Candidates Found
              </h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm || statusFilter !== "all" || jobFilter !== "all"
                  ? "No candidates match your current filters. Try adjusting your search criteria."
                  : "You haven't received any job applications yet. Share your job postings to attract candidates."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <div
                  key={`${candidate.id}-${candidate.applicationId}`}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg">
                          {candidate.firstName.charAt(0)}
                          {candidate.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-xl">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                          {candidate.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">
                                {candidate.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Applied for: {candidate.jobTitle}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {candidate.university && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {candidate.university}
                            </span>
                          )}
                          {candidate.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {candidate.location}
                            </span>
                          )}
                          {candidate.graduationYear && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Class of {candidate.graduationYear}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(candidate.status)}>
                        {getStatusLabel(candidate.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Academic Info</h4>
                      <div className="space-y-1 text-sm">
                        {candidate.major && (
                          <p>
                            <span className="text-muted-foreground">
                              Major:
                            </span>{" "}
                            {candidate.major}
                          </p>
                        )}
                        {candidate.gpa && (
                          <p>
                            <span className="text-muted-foreground">GPA:</span>{" "}
                            {candidate.gpa}
                          </p>
                        )}
                        {candidate.graduationYear && (
                          <p>
                            <span className="text-muted-foreground">
                              Graduation:
                            </span>{" "}
                            {candidate.graduationYear}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contact Info</h4>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {candidate.email}
                        </p>
                        {candidate.phoneNumber && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {candidate.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Application</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">
                            Applied:
                          </span>{" "}
                          {formatDate(candidate.applicationDate)}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Status:</span>{" "}
                          {getStatusLabel(candidate.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills
                          .slice(0, 8)
                          .map((skill: any, index: number) => (
                            <Badge key={index} variant="secondary">
                              {typeof skill === "string" ? skill : skill.name}
                            </Badge>
                          ))}
                        {candidate.skills.length > 8 && (
                          <Badge variant="outline">
                            +{candidate.skills.length - 8} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {candidate.notes && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        {candidate.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProfile(candidate)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessage(candidate)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      {candidate.resumeUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(candidate.resumeUrl, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScheduleInterview(candidate)}
                        disabled={candidate.status === "REJECTED"}
                      >
                        Schedule Interview
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          candidate.status === "REJECTED" ||
                          movingCandidateId === candidate.id
                        }
                        onClick={() => handleMoveToNextStage(candidate)}
                      >
                        {movingCandidateId === candidate.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Moving...
                          </>
                        ) : (
                          "Move to Next Stage"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} candidates
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedCandidate && (
        <>
          <MessageCandidateDialog
            open={showMessageDialog}
            onOpenChange={setShowMessageDialog}
            candidate={{
              id: selectedCandidate.id,
              firstName: selectedCandidate.firstName,
              lastName: selectedCandidate.lastName,
              email: selectedCandidate.email,
              avatar: selectedCandidate.avatar,
              university: selectedCandidate.university,
              major: selectedCandidate.major,
            }}
            jobTitle={selectedCandidate.jobTitle || ""}
            jobId={selectedCandidate.jobId || ""}
            applicationId={selectedCandidate.applicationId || ""}
            onSuccess={handleDialogSuccess}
          />

          <ScheduleInterviewDialog
            open={showInterviewDialog}
            onOpenChange={setShowInterviewDialog}
            candidate={{
              id: selectedCandidate.id,
              firstName: selectedCandidate.firstName,
              lastName: selectedCandidate.lastName,
              email: selectedCandidate.email,
              avatar: selectedCandidate.avatar,
              university: selectedCandidate.university,
              major: selectedCandidate.major,
            }}
            jobTitle={selectedCandidate.jobTitle || ""}
            jobId={selectedCandidate.jobId || ""}
            applicationId={selectedCandidate.applicationId || ""}
            onSuccess={handleDialogSuccess}
          />

          <CandidateProfileDialog
            open={showProfileDialog}
            onOpenChange={setShowProfileDialog}
            candidateId={selectedCandidate.id}
            candidateName={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
          />
        </>
      )}
    </div>
  );
}
