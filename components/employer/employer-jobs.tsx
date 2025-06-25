"use client";

import { useState, useEffect } from "react";
import { useJobs } from "@/hooks/use-jobs";
import { useCurrentUser } from "@/hooks/use-current-user";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  MapPin,
  Users,
  DollarSign,
  MoreHorizontal,
  TrendingUp,
  Building2,
  Calendar,
  Trash2,
  Pause,
  Play,
  BarChart3,
  FileText,
  AlertCircle,
  Mail,
  Phone,
  GraduationCap,
  Star,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  shortlistCandidate,
  rejectApplication,
  scheduleInterview,
  messageCandidate,
} from "@/lib/api";
import { MessageCandidateDialog } from "./dialogs/message-candidate-dialog";
import { ScheduleInterviewDialog } from "./dialogs/schedule-interview-dialog";
import { RejectApplicationDialog } from "./dialogs/reject-application-dialog";
import { CandidateProfileDialog } from "./dialogs/candidate-profile-dialog";
import { EditJobDialog } from "./dialogs/edit-job-dialog";
import { DeleteJobDialog } from "./dialogs/delete-job-dialog";
import { MoveStageDialog } from "./dialogs/move-stage-dialog";
import { getToken } from "@/lib/auth-utils";

interface CreateJobForm {
  title: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  applicationDeadline: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Direct API calls for employer functionality
const getMyJobs = async (query: any) => {
  const token = getToken();
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE_URL}/jobs/my-jobs?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch jobs");
  return response.json();
};

const createJob = async (jobData: any) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) throw new Error("Failed to create job");
  return response.json();
};

const updateJobStatus = async (jobId: string, status: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update job status");
  return response.json();
};

const deleteJob = async (jobId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete job");
  return response.json();
};

const getJobStats = async (jobId: string) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch job stats");
  return response.json();
};

const getMyJobStats = async (period: string) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/jobs/my-stats?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch job stats");
  return response.json();
};

const getJobApplications = async (jobId: string, query: any) => {
  const token = getToken();
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/jobs/${jobId}/applications?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch applications");
  return response.json();
};

const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  message?: string
) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, message }),
    }
  );

  if (!response.ok) throw new Error("Failed to update application status");
  return response.json();
};

export function EmployerJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] =
    useState<any>(null);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [applicationStats, setApplicationStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobStats, setJobStats] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({});

  // Dialog states for application actions
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showMoveStageDialog, setShowMoveStageDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const { loading, error } = useJobs();

  const { user: currentUser } = useCurrentUser();

  const [createJobForm, setCreateJobForm] = useState<CreateJobForm>({
    title: "",
    description: "",
    requirements: [],
    type: "Full-time",
    location: "",
    salary: {
      min: 0,
      max: 0,
      currency: "RWF",
      period: "monthly",
    },
    applicationDeadline: "",
  });

  // Fetch jobs and stats
  const fetchJobs = async () => {
    try {
      const query: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) query.search = searchTerm;
      if (statusFilter !== "all") query.status = statusFilter.toUpperCase();

      const response = await getMyJobs(query);
      setJobs(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to load jobs");
    }
  };

  const fetchJobStats = async () => {
    try {
      const stats = await getMyJobStats("30d");
      setJobStats(stats);
    } catch (err: any) {
      console.error("Failed to fetch job stats:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchJobStats();
  }, []);

  const handleCreateJob = async () => {
    try {
      // Validate form
      if (
        !createJobForm.title ||
        !createJobForm.description ||
        !createJobForm.location
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const jobData = {
        ...createJobForm,
        requirements: createJobForm.requirements.filter(
          (req) => req.trim() !== ""
        ),
        applicationDeadline: new Date(
          createJobForm.applicationDeadline
        ).toISOString(),
      };

      await createJob(jobData);
      toast.success("Job created successfully!");
      setShowCreateDialog(false);
      setCreateJobForm({
        title: "",
        description: "",
        requirements: [],
        type: "Full-time",
        location: "",
        salary: { min: 0, max: 0, currency: "RWF", period: "monthly" },
        applicationDeadline: "",
      });
      fetchJobs();
      fetchJobStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to create job");
    }
  };

  const handleStatusChange = async (
    jobId: string,
    newStatus: "ACTIVE" | "CLOSED"
  ) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast.success(`Job ${newStatus.toLowerCase()} successfully!`);
      fetchJobs();
      fetchJobStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to update job status");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      setDeleteLoading(true);
      await deleteJob(jobId);
      toast.success("Job deleted successfully!");
      setShowDeleteDialog(false);
      fetchJobs();
      fetchJobStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete job");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDelete = (job: any) => {
    setSelectedJob(job);
    setShowDeleteDialog(true);
  };

  const handleViewStats = async (job: any) => {
    try {
      const stats = await getJobStats(job.id);
      setSelectedJob({ ...job, stats });
      setShowStatsDialog(true);
    } catch (err: any) {
      toast.error("Failed to load job statistics");
    }
  };

  const handleViewApplications = async (job: any) => {
    try {
      setSelectedJobForApplications(job);
      setShowApplicationsDialog(true);

      // Fetch applications for this job
      const applicationsResponse = await getJobApplications(job.id, {
        page: 1,
        limit: 50,
      });
      setJobApplications(applicationsResponse.data);

      // Fetch job stats
      const statsResponse = await getJobStats(job.id);
      setApplicationStats(statsResponse);
    } catch (err: any) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to load applications");
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: string,
    applicantName: string
  ) => {
    try {
      const jobId = selectedJobForApplications?.id;
      if (!jobId) {
        toast.error("Job information not available");
        return;
      }

      // Find the application to get full candidate info
      const application = jobApplications.find(
        (app) => app.id === applicationId
      );
      if (!application) {
        toast.error("Application not found");
        return;
      }

      switch (action) {
        case "shortlist":
          await shortlistCandidate(jobId, applicationId);
          toast.success(`${applicantName} has been shortlisted!`);
          // Refresh applications list
          await handleViewApplications(selectedJobForApplications);
          break;
        case "nextStage":
          setSelectedApplication(application);
          setShowMoveStageDialog(true);
          break;
        case "reject":
          setSelectedApplication(application);
          setShowRejectDialog(true);
          break;
        case "message":
          setSelectedApplication(application);
          setShowMessageDialog(true);
          break;
        case "interview":
          setSelectedApplication(application);
          setShowInterviewDialog(true);
          break;
        case "profile":
          setSelectedApplication(application);
          setShowProfileDialog(true);
          break;
        default:
          break;
      }
    } catch (err: any) {
      console.error("Application action failed:", err);
      toast.error(`Failed to perform action: ${err.message}`);
    }
  };

  const handleDialogSuccess = async () => {
    // Refresh applications list after any action
    if (selectedJobForApplications) {
      await handleViewApplications(selectedJobForApplications);
    }
  };

  const handleMoveStage = async (
    applicationId: string,
    newStatus: string,
    message?: string
  ) => {
    const jobId = selectedJobForApplications?.id;
    if (!jobId) {
      throw new Error("Job information not available");
    }

    // Use the updateApplicationStatus function with correct signature
    await updateApplicationStatus(applicationId, newStatus, message);
  };

  const addRequirement = () => {
    setCreateJobForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setCreateJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  const removeRequirement = (index: number) => {
    setCreateJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatSalary = (salary: any) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified";

    const { min, max, currency = "RWF", period = "monthly" } = salary;
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
      }
      return amount.toLocaleString();
    };

    const currencySymbol = currency === "RWF" ? "RWF" : currency;

    if (min && max) {
      return `${currencySymbol} ${formatAmount(min)}-${formatAmount(max)} ${period}`;
    } else if (min) {
      return `${currencySymbol} ${formatAmount(min)}+ ${period}`;
    } else if (max) {
      return `Up to ${currencySymbol} ${formatAmount(max)} ${period}`;
    }
    return "Not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  const handleEditJob = (job: any) => {
    setSelectedJob(job);
    setShowEditDialog(true);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <p className="text-muted-foreground">
              Loading your job postings...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage your job postings and track applications
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the details for your new job posting
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={createJobForm.title}
                  onChange={(e) =>
                    setCreateJobForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select
                    value={createJobForm.type}
                    onValueChange={(value) =>
                      setCreateJobForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={createJobForm.location}
                    onChange={(e) =>
                      setCreateJobForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="e.g. Kigali, Rwanda"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={createJobForm.description}
                  onChange={(e) =>
                    setCreateJobForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Requirements</Label>
                <div className="space-y-2">
                  {createJobForm.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={req}
                        onChange={(e) =>
                          updateRequirement(index, e.target.value)
                        }
                        placeholder="e.g. Bachelor's degree in Computer Science"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Salary Range (RWF Monthly)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="salaryMin"
                      type="number"
                      value={createJobForm.salary.min || ""}
                      onChange={(e) =>
                        setCreateJobForm((prev) => ({
                          ...prev,
                          salary: {
                            ...prev.salary,
                            min: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      placeholder="Min (e.g. 500,000)"
                    />
                    <Input
                      type="number"
                      value={createJobForm.salary.max || ""}
                      onChange={(e) =>
                        setCreateJobForm((prev) => ({
                          ...prev,
                          salary: {
                            ...prev.salary,
                            max: parseInt(e.target.value) || 0,
                          },
                        }))
                      }
                      placeholder="Max (e.g. 800,000)"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter amounts in Rwandan Francs (RWF)
                  </p>
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={createJobForm.applicationDeadline}
                    onChange={(e) =>
                      setCreateJobForm((prev) => ({
                        ...prev,
                        applicationDeadline: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateJob} disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {jobStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Jobs
                  </p>
                  <p className="text-3xl font-bold">
                    {jobStats.overview.totalJobs}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-bold">
                    {jobStats.overview.activeJobs}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold">
                    {jobStats.overview.totalApplications}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Applications
                  </p>
                  <p className="text-3xl font-bold">
                    {jobStats.overview.averageApplicationsPerJob}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Job Postings</CardTitle>
          <CardDescription>
            {pagination.total || 0} total jobs • Page {pagination.page || 1} of{" "}
            {pagination.totalPages || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No job postings yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first job posting to start attracting candidates
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Job Posting
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(job.salary)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {getDaysUntilDeadline(job.applicationDeadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewApplications(job)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Applications
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewStats(job)}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Statistics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditJob(job)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(
                              job.id,
                              job.status === "ACTIVE" ? "CLOSED" : "ACTIVE"
                            )
                          }
                        >
                          {job.status === "ACTIVE" ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Close Job
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Reopen Job
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(job)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job._count.applications} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 500) + 100} views
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplications(job)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Applications ({job._count.applications})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplications(job)}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Statistics
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
                of {pagination.total} jobs
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

      {/* Job Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Job Statistics - {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Detailed analytics for this job posting
            </DialogDescription>
          </DialogHeader>
          {selectedJob?.stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {selectedJob.stats.overview.totalApplications}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Applications
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {selectedJob.stats.overview.totalInterviews}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Interviews Scheduled
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {selectedJob.stats.overview.conversionRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Conversion Rate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedJob.stats.topUniversities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Top Universities</h4>
                  <div className="space-y-2">
                    {selectedJob.stats.topUniversities.map(
                      (uni: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <span>{uni.university}</span>
                          <Badge variant="secondary">
                            {uni.count} applications
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedJob.stats.topSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Most Common Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.stats.topSkills.map(
                      (skill: any, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill.skill} ({skill.count})
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Applications Dialog */}
      <Dialog
        open={showApplicationsDialog}
        onOpenChange={setShowApplicationsDialog}
      >
        <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Applications for {selectedJobForApplications?.title}
            </DialogTitle>
            <DialogDescription>
              Review and manage applications for this job posting
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden min-h-0">
            <Tabs defaultValue="applications" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="applications">
                  Applications ({jobApplications.length})
                </TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent
                value="applications"
                className="flex-1 overflow-y-auto mt-4 space-y-1"
              >
                {jobApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Users className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Applications Yet
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      This job posting hasn't received any applications yet.
                      Share the job posting to attract more candidates.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pb-4">
                    {jobApplications.map((application: any) => (
                      <Card
                        key={application.id}
                        className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <Avatar className="w-14 h-14 border-2 border-gray-100">
                                <AvatarImage
                                  src={application.user?.avatar}
                                  alt={`${application.user?.firstName} ${application.user?.lastName}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                                  {application.user?.firstName?.[0]}
                                  {application.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h4 className="font-semibold text-lg text-gray-900">
                                    {application.user?.firstName}{" "}
                                    {application.user?.lastName}
                                  </h4>
                                  <Badge
                                    variant={
                                      application.status === "PENDING"
                                        ? "secondary"
                                        : application.status === "REVIEWED"
                                          ? "default"
                                          : application.status === "SHORTLISTED"
                                            ? "default"
                                            : application.status === "REJECTED"
                                              ? "destructive"
                                              : "outline"
                                    }
                                    className={
                                      application.status === "SHORTLISTED"
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : application.status === "PENDING"
                                          ? "bg-orange-100 text-orange-700 border-orange-200"
                                          : ""
                                    }
                                  >
                                    {application.status.charAt(0) +
                                      application.status.slice(1).toLowerCase()}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                                  {application.user?.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-blue-500" />
                                      <span className="truncate">
                                        {application.user.email}
                                      </span>
                                    </div>
                                  )}
                                  {application.user?.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-green-500" />
                                      <span>
                                        {application.user.phoneNumber}
                                      </span>
                                    </div>
                                  )}
                                  {application.user?.university && (
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="w-4 h-4 text-purple-500" />
                                      <span className="truncate">
                                        {application.user.university}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {application.user?.major && (
                                  <div className="mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                      Major:{" "}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {application.user.major}
                                    </span>
                                    {application.user?.graduationYear && (
                                      <span className="text-sm text-gray-500">
                                        {" "}
                                        • Class of{" "}
                                        {application.user.graduationYear}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {application.coverLetter && (
                                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                      Cover Letter:
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                      {application.coverLetter}
                                    </p>
                                  </div>
                                )}

                                {application.user?.skills &&
                                  application.user.skills.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-sm font-medium text-gray-700 mb-2">
                                        Skills:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {application.user.skills
                                          .slice(0, 6)
                                          .map((skill: any, index: number) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                              {skill.name || skill}
                                            </Badge>
                                          ))}
                                        {application.user.skills.length > 6 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-gray-50"
                                          >
                                            +
                                            {application.user.skills.length - 6}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Applied {formatDate(application.createdAt)}
                                  </div>
                                  {application.user?.gpa && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      GPA: {application.user.gpa}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-shrink-0">
                              {application.resumeUrl ? (
                                <div className="flex gap-1">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() =>
                                      window.open(
                                        application.resumeUrl,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = application.resumeUrl;
                                      link.download = `${application.user?.firstName}_${application.user?.lastName}_Resume.pdf`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  <Download className="w-4 h-4 mr-2" />
                                  No Resume
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onSelect={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "shortlist",
                                        `${application.user?.firstName} ${application.user?.lastName}`
                                      )
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Shortlist Candidate
                                  </DropdownMenuItem>
                                  {/* Change Stage button - only show if not at final stage */}
                                  {application.status !== "ACCEPTED" &&
                                    application.status !== "REJECTED" && (
                                      <DropdownMenuItem
                                        className="text-blue-600"
                                        onSelect={() => {
                                          handleApplicationAction(
                                            application.id,
                                            "nextStage",
                                            `${application.user?.firstName} ${application.user?.lastName}`
                                          );
                                        }}
                                      >
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        Change Stage
                                      </DropdownMenuItem>
                                    )}
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "message",
                                        `${application.user?.firstName} ${application.user?.lastName}`
                                      )
                                    }
                                  >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "interview",
                                        `${application.user?.firstName} ${application.user?.lastName}`
                                      )
                                    }
                                  >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule Interview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "profile",
                                        `${application.user?.firstName} ${application.user?.lastName}`
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={() =>
                                      handleApplicationAction(
                                        application.id,
                                        "reject",
                                        `${application.user?.firstName} ${application.user?.lastName}`
                                      )
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="overview"
                className="flex-1 overflow-y-auto mt-4"
              >
                {applicationStats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-700">
                                Total Applications
                              </p>
                              <p className="text-2xl font-bold text-blue-900">
                                {applicationStats.overview?.totalApplications ||
                                  jobApplications.length}
                              </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-700">
                                Pending Review
                              </p>
                              <p className="text-2xl font-bold text-orange-900">
                                {
                                  jobApplications.filter(
                                    (app) => app.status === "PENDING"
                                  ).length
                                }
                              </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-orange-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-emerald-700">
                                Shortlisted
                              </p>
                              <p className="text-2xl font-bold text-emerald-900">
                                {
                                  jobApplications.filter(
                                    (app) => app.status === "SHORTLISTED"
                                  ).length
                                }
                              </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-700">
                                Interviews
                              </p>
                              <p className="text-2xl font-bold text-purple-900">
                                {applicationStats.overview?.totalInterviews ||
                                  0}
                              </p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Application Status Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Status Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            "PENDING",
                            "REVIEWED",
                            "SHORTLISTED",
                            "REJECTED",
                          ].map((status) => {
                            const count = jobApplications.filter(
                              (app) => app.status === status
                            ).length;
                            const percentage =
                              jobApplications.length > 0
                                ? (count / jobApplications.length) * 100
                                : 0;
                            return (
                              <div key={status} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium capitalize">
                                    {status.toLowerCase()}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Loading statistics...</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="analytics"
                className="flex-1 overflow-y-auto mt-4"
              >
                {jobApplications.length > 0 ? (
                  <div className="space-y-6">
                    {/* University Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          University Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const universityStats = jobApplications.reduce(
                            (acc: any, app: any) => {
                              const university =
                                app.user?.university || "Unknown";
                              acc[university] = (acc[university] || 0) + 1;
                              return acc;
                            },
                            {}
                          );

                          const sortedUniversities = Object.entries(
                            universityStats
                          )
                            .sort(
                              ([, a], [, b]) => (b as number) - (a as number)
                            )
                            .slice(0, 5);

                          return (
                            <div className="space-y-3">
                              {sortedUniversities.map(
                                ([university, count], index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600">
                                          #{index + 1}
                                        </span>
                                      </div>
                                      <span className="font-medium">
                                        {university}
                                      </span>
                                    </div>
                                    <Badge variant="secondary">
                                      {count as number} applications
                                    </Badge>
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>

                    {/* Skills Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Most Common Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const skillsStats = jobApplications.reduce(
                            (acc: any, app: any) => {
                              app.user?.skills?.forEach((skill: any) => {
                                const skillName = skill.name || skill;
                                acc[skillName] = (acc[skillName] || 0) + 1;
                              });
                              return acc;
                            },
                            {}
                          );

                          const sortedSkills = Object.entries(skillsStats)
                            .sort(
                              ([, a], [, b]) => (b as number) - (a as number)
                            )
                            .slice(0, 10);

                          return sortedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sortedSkills.map(([skill, count], index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-sm"
                                >
                                  {skill} ({count as number})
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">
                              No skills data available
                            </p>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        No analytics data available
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Action Dialogs */}
      {selectedApplication && (
        <>
          <MessageCandidateDialog
            open={showMessageDialog}
            onOpenChange={setShowMessageDialog}
            candidate={{
              id: selectedApplication.user.id,
              firstName: selectedApplication.user.firstName,
              lastName: selectedApplication.user.lastName,
              email: selectedApplication.user.email,
              avatar: selectedApplication.user.avatar,
              university: selectedApplication.user.university,
              major: selectedApplication.user.major,
            }}
            jobTitle={selectedJobForApplications?.title || ""}
            jobId={selectedJobForApplications?.id || ""}
            applicationId={selectedApplication.id}
            onSuccess={handleDialogSuccess}
          />

          <ScheduleInterviewDialog
            open={showInterviewDialog}
            onOpenChange={setShowInterviewDialog}
            candidate={{
              id: selectedApplication.user.id,
              firstName: selectedApplication.user.firstName,
              lastName: selectedApplication.user.lastName,
              email: selectedApplication.user.email,
              avatar: selectedApplication.user.avatar,
              university: selectedApplication.user.university,
              major: selectedApplication.user.major,
            }}
            jobTitle={selectedJobForApplications?.title || ""}
            jobId={selectedJobForApplications?.id || ""}
            applicationId={selectedApplication.id}
            onSuccess={handleDialogSuccess}
          />

          <RejectApplicationDialog
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            candidate={{
              id: selectedApplication.user.id,
              firstName: selectedApplication.user.firstName,
              lastName: selectedApplication.user.lastName,
              email: selectedApplication.user.email,
              avatar: selectedApplication.user.avatar,
              university: selectedApplication.user.university,
              major: selectedApplication.user.major,
            }}
            jobTitle={selectedJobForApplications?.title || ""}
            jobId={selectedJobForApplications?.id || ""}
            applicationId={selectedApplication.id}
            onSuccess={handleDialogSuccess}
          />

          <CandidateProfileDialog
            open={showProfileDialog}
            onOpenChange={setShowProfileDialog}
            candidateId={selectedApplication.user.id}
            candidateName={`${selectedApplication.user.firstName} ${selectedApplication.user.lastName}`}
          />

          <MoveStageDialog
            open={showMoveStageDialog}
            onOpenChange={setShowMoveStageDialog}
            application={selectedApplication}
            onSuccess={handleDialogSuccess}
            onMoveStage={handleMoveStage}
          />
        </>
      )}

      {/* Edit Job Dialog */}
      {selectedJob && (
        <EditJobDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          job={selectedJob}
          onSuccess={() => {
            fetchJobs();
            fetchJobStats();
          }}
        />
      )}

      {/* Delete Job Dialog */}
      {selectedJob && (
        <DeleteJobDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          jobTitle={selectedJob.title}
          loading={deleteLoading}
          onConfirm={() => handleDeleteJob(selectedJob.id)}
        />
      )}
    </div>
  );
}
