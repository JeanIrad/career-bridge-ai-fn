"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/use-jobs";
import { JobApplicationDialog } from "./dialogs/job-application-dialog";
import { JobDetailsDialog } from "./dialogs/job-details-dialog";
import { toast } from "sonner";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  DollarSign,
  Heart,
  Bookmark,
  Star,
  Users,
  TrendingUp,
  Bot,
  Brain,
  Target,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Zap,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  ExternalLink,
  BarChart3,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { getToken } from "@/lib/auth-utils";
import { useAuth } from "@/contexts/auth-context";

// Types
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workSchedule: string;
  salary: string;
  posted: string;
  deadline: string;
  match: number;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  saved: boolean;
  applied: boolean;
  companyLogo?: string;
  industry: string;
  experience: string;
  remote: boolean;
  aiRecommendation?: {
    reasons: string[];
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    cultureMatch: number;
    salaryMatch: number;
    insights: string;
    strengthsAlignment: string[];
    skillGaps: string[];
    careerImpact: string;
    recommendationScore: number;
  };
}

interface JobFilters {
  search: string;
  location: string;
  jobType: string[];
  experience: string[];
  salary: { min: number; max: number };
  skills: string[];
  company: string[];
  industry: string[];
  remoteOnly: boolean;
  deadline: string;
  companySize: string[];
  benefits: string[];
  workSchedule: string[];
}

interface UserPreferences {
  careerGoals: string[];
  workEnvironment: "remote" | "onsite" | "hybrid" | "any";
  companyCulture: string[];
  learningOpportunities: boolean;
  workLifeBalance: number;
  salaryImportance: number;
  growthPotential: number;
  industryPreferences: string[];
  roleTypes: string[];
  preferredBenefits: string[];
}

interface AIInsights {
  personalizedRecommendations: JobListing[];
  skillGaps: string[];
  marketTrends: {
    demandScore: number;
    salaryTrends: string;
    growthProjection: string;
  };
  learningRecommendations: {
    courses: string[];
    certifications: string[];
    skills: string[];
  };
  careerPath: {
    nextRoles: string[];
    timeToNext: string;
    recommendations: string[];
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function StudentJobs() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState<JobListing | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  // const { toast } = useToast();

  // Filters and preferences
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    location: "all",
    jobType: [],
    experience: [],
    salary: { min: 0, max: 200000 },
    skills: [],
    company: [],
    industry: [],
    remoteOnly: false,
    deadline: "",
    companySize: [],
    benefits: [],
    workSchedule: [],
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
    careerGoals: [],
    workEnvironment: "any",
    companyCulture: [],
    learningOpportunities: true,
    workLifeBalance: 7,
    salaryImportance: 6,
    growthPotential: 8,
    industryPreferences: [],
    roleTypes: [],
    preferredBenefits: [],
  });

  // Job statistics
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    newJobs: 0,
    applicationsSent: 0,
    savedJobs: 0,
    interviewInvites: 0,
    responseRate: 0,
  });

  // Helper function to get company name safely
  const getCompanyName = (company: any): string => {
    if (typeof company === "string") return company;
    if (company && typeof company === "object" && company.name)
      return company.name;
    return "Unknown Company";
  };

  // Helper function to get company logo initial
  const getCompanyInitial = (company: any): string => {
    const name = getCompanyName(company);
    return name.charAt(0).toUpperCase();
  };

  // Helper function to format salary
  const formatSalary = (salary: any): string => {
    if (typeof salary === "string") return salary;
    if (salary && typeof salary === "object") {
      const { min, max, currency = "USD" } = salary;
      if (min && max) {
        return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}`;
      } else if (min) {
        return `$${min.toLocaleString()}+ ${currency}`;
      } else if (max) {
        return `Up to $${max.toLocaleString()} ${currency}`;
      }
    }
    return "Salary not specified";
  };

  // Helper function to transform API job data
  const transformJobData = (apiJob: any): JobListing => {
    return {
      ...apiJob,
      company: getCompanyName(apiJob.company),
      industry: apiJob.industry || "Unknown Industry",
      location: apiJob.location || "Unknown Location",
      type: apiJob.type || "Unknown Type",
      workSchedule: apiJob.workSchedule || "Unknown Schedule",
      salary: formatSalary(apiJob.salary),
      requirements: apiJob.requirements || [],
      benefits: apiJob.benefits || [],
    };
  };

  // Fetch jobs from API
  const fetchJobs = useCallback(
    async (resetPage = false) => {
      setLoading(true);
      try {
        const token = getToken();
        const currentPage = resetPage ? 1 : page;

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
          search: filters.search,
          ...(filters.location &&
            filters.location !== "all" && {
              location: filters.location,
            }),
          remoteOnly: filters.remoteOnly.toString(),
          ...(filters.jobType.length > 0 && {
            jobType: filters.jobType.join(","),
          }),
          ...(filters.industry.length > 0 && {
            industry: filters.industry.join(","),
          }),
          ...(filters.experience.length > 0 && {
            experience: filters.experience.join(","),
          }),
        });

        const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        const newJobs = data.data || [];

        if (resetPage) {
          setJobs(newJobs.map(transformJobData));
          setPage(2);
        } else {
          setJobs((prev) => [...prev, ...newJobs.map(transformJobData)]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newJobs.length === 20);
        setJobStats((prev) => ({ ...prev, totalJobs: data.total || 0 }));
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters, page, toast]
  );

  // Fetch AI recommendations
  const fetchAIRecommendations = useCallback(async () => {
    setLoadingRecommendations(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/recommendations/enhanced`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch AI recommendations");

      const data = await response.json();
      // Transform AI recommendations to ensure salary objects are converted to strings
      if (data.personalizedRecommendations) {
        data.personalizedRecommendations =
          data.personalizedRecommendations.map(transformJobData);
      }
      setAIInsights(data);
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      toast.error("Unable to load personalized recommendations at the moment.");
    } finally {
      setLoadingRecommendations(false);
    }
  }, [toast]);

  // Fetch saved jobs
  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/jobs/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch saved jobs");

      const savedJobsData = await response.json();
      const transformedSavedJobs =
        savedJobsData.data?.map(transformJobData) || [];

      // Set saved jobs in separate state
      setSavedJobs(transformedSavedJobs);

      // Also update the main jobs array to mark saved status
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          saved: transformedSavedJobs.some(
            (savedJob: JobListing) => savedJob.id === job.id
          ),
        }))
      );
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  }, [transformJobData]);

  // Fetch job applications
  const fetchMyApplications = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch applications");

      const applicationsData = await response.json();
      const applications = applicationsData.data || [];

      // Transform application data to job format
      const transformedAppliedJobs = applications.map((app: any) => ({
        ...transformJobData(app.job),
        applied: true,
        applicationStatus: app.status,
        appliedAt: app.appliedAt,
      }));

      // Set applied jobs in separate state
      setAppliedJobs(transformedAppliedJobs);

      // Also update the main jobs array to mark applied status
      const appliedJobIds = applications.map((app: any) => app.jobId);
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applied: appliedJobIds.includes(job.id),
        }))
      );
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, [transformJobData]);

  // Fetch job statistics
  const fetchJobStats = useCallback(async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/jobs/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch job stats");

      const statsResponse = await response.json();
      const statsData = statsResponse.data || statsResponse; // Handle both nested and flat responses

      setJobStats({
        totalJobs: statsData.totalJobs || 0,
        applicationsSent: statsData.applicationsSent || 0,
        savedJobs: statsData.savedJobs || 0,
        interviewInvites: statsData.interviewInvites || 0,
        responseRate: statsData.responseRate || 0,
        newJobs: statsData.newJobs || 0,
      });
    } catch (error) {
      console.error("Error fetching job stats:", error);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchJobs(true);
    fetchAIRecommendations();
    fetchSavedJobs();
    fetchMyApplications();
    fetchJobStats();
  }, []);

  // Filter jobs locally
  useEffect(() => {
    let filtered: JobListing[] = [];

    if (
      activeTab === "recommended" &&
      aiInsights?.personalizedRecommendations
    ) {
      filtered = [...aiInsights.personalizedRecommendations];
    } else if (activeTab === "saved") {
      filtered = [...savedJobs];
    } else if (activeTab === "applied") {
      filtered = [...appliedJobs];
    } else {
      // "all" tab
      filtered = [...jobs];
    }

    // Apply additional filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          getCompanyName(job.company).toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, savedJobs, appliedJobs, filters, activeTab, aiInsights]);

  // Use the improved hooks for job actions
  const {
    handleSaveJob: hookSaveJob,
    handleUnsaveJob: hookUnsaveJob,
    handleApplyJob: hookApplyJob,
  } = useJobs();

  // Job actions
  const handleSaveJob = async (jobId: string) => {
    const job =
      jobs.find((j) => j.id === jobId) ||
      savedJobs.find((j) => j.id === jobId) ||
      appliedJobs.find((j) => j.id === jobId);

    if (!job) return;

    if (job.saved) {
      await hookUnsaveJob(jobId);
      // Remove from saved jobs
      setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } else {
      await hookSaveJob(jobId);
      // Add to saved jobs
      setSavedJobs((prev) => [...prev, { ...job, saved: true }]);
    }

    // Update local state in all job arrays
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, saved: !job.saved } : job
      )
    );

    setAppliedJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, saved: !job.saved } : job
      )
    );

    // Refresh job stats
    fetchJobStats();
  };

  const handleApplyJob = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJobForApplication(job);
    }
  };

  const handleSubmitApplication = async (
    jobId: string,
    applicationData: any
  ) => {
    try {
      await hookApplyJob(jobId, applicationData);

      const job =
        jobs.find((j) => j.id === jobId) ||
        savedJobs.find((j) => j.id === jobId);

      if (job) {
        // Add to applied jobs
        setAppliedJobs((prev) => [...prev, { ...job, applied: true }]);
      }

      // Update local state in all job arrays
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job))
      );

      setSavedJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job))
      );

      // Refresh job stats and applications
      fetchJobStats();
      fetchMyApplications();

      toast.success("Your application has been submitted successfully.");
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const handleShareJob = async (jobId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Job Opportunity",
          text: "Check out this job opportunity!",
          url: `${window.location.origin}/jobs/${jobId}`,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `${window.location.origin}/jobs/${jobId}`
        );
        toast.success("Job link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share job.");
    }
  };

  const handleViewJobDetails = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90)
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (match >= 80) return "bg-blue-100 text-blue-700 border-blue-200";
    if (match >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getMatchIcon = (match: number) => {
    if (match >= 90) return <Sparkles className="w-3 h-3" />;
    if (match >= 80) return <Target className="w-3 h-3" />;
    if (match >= 70) return <TrendingUp className="w-3 h-3" />;
    return <BarChart3 className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Insights */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Job Search</h1>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
            >
              <Bot className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Discover personalized opportunities that match your skills and
            career goals
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button
            onClick={fetchAIRecommendations}
            disabled={loadingRecommendations}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loadingRecommendations ? "animate-spin" : ""}`}
            />
            Refresh AI
          </Button>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      {aiInsights && (
        <Card className="border-gradient-to-r from-purple-200 to-blue-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">AI Career Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Market Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={aiInsights?.marketTrends?.demandScore || 0}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">
                    {aiInsights?.marketTrends?.demandScore}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Skill Gaps</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiInsights?.skillGaps?.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Next Role</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {aiInsights?.careerPath?.nextRoles[0] || "Software Engineer"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />
                </div>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="san-francisco">San Francisco</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="seattle">Seattle</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {jobStats.totalJobs}
                </p>
                <p className="text-sm text-muted-foreground">Available Jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Applications
                </p>
                <p className="text-xl font-bold">{jobStats.applicationsSent}</p>
              </div>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Saved Jobs
                </p>
                <p className="text-xl font-bold">{jobStats.savedJobs}</p>
              </div>
              <Bookmark className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Interviews
                </p>
                <p className="text-xl font-bold">{jobStats.interviewInvites}</p>
              </div>
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Response Rate
                </p>
                <p className="text-xl font-bold">{jobStats.responseRate}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New Today
                </p>
                <p className="text-xl font-bold">{jobStats.newJobs}</p>
              </div>
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Job Type</Label>
                <div className="space-y-2">
                  {[
                    "Full-time",
                    "Part-time",
                    "Internship",
                    "Contract",
                    "Remote",
                  ].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        id={type}
                        checked={filters.jobType.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters((prev) => ({
                              ...prev,
                              jobType: [...prev.jobType, type],
                            }));
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              jobType: prev.jobType.filter((t) => t !== type),
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={type} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Experience Level</Label>
                <div className="space-y-2">
                  {[
                    "Entry Level",
                    "Mid Level",
                    "Senior Level",
                    "Lead",
                    "Executive",
                  ].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Switch
                        id={level}
                        checked={filters.experience.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters((prev) => ({
                              ...prev,
                              experience: [...prev.experience, level],
                            }));
                          } else {
                            setFilters((prev) => ({
                              ...prev,
                              experience: prev.experience.filter(
                                (e) => e !== level
                              ),
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={level} className="text-sm">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Salary Range</Label>
                <div className="space-y-4">
                  <Slider
                    value={[filters.salary.min, filters.salary.max]}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({ ...prev, salary: { min, max } }))
                    }
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.salary.min.toLocaleString()}</span>
                    <span>${filters.salary.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-sm font-medium">Work Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Work-Life Balance Importance
                    </Label>
                    <span className="text-sm font-medium">
                      {preferences.workLifeBalance}/10
                    </span>
                  </div>
                  <Slider
                    value={[preferences.workLifeBalance]}
                    onValueChange={([value]) =>
                      setPreferences((prev) => ({
                        ...prev,
                        workLifeBalance: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">
                      Growth Potential Importance
                    </Label>
                    <span className="text-sm font-medium">
                      {preferences.growthPotential}/10
                    </span>
                  </div>
                  <Slider
                    value={[preferences.growthPotential]}
                    onValueChange={([value]) =>
                      setPreferences((prev) => ({
                        ...prev,
                        growthPotential: value,
                      }))
                    }
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    search: "",
                    location: "all",
                    jobType: [],
                    experience: [],
                    salary: { min: 0, max: 200000 },
                    skills: [],
                    company: [],
                    industry: [],
                    remoteOnly: false,
                    deadline: "",
                    companySize: [],
                    benefits: [],
                    workSchedule: [],
                  });
                }}
              >
                Reset Filters
              </Button>
              <Button onClick={() => fetchJobs(true)}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            All Jobs ({activeTab === "all" ? filteredJobs.length : jobs.length})
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Recommended (
            {aiInsights?.personalizedRecommendations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved ({savedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applied" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Applied ({appliedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {loading && filteredJobs.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-6 w-64" />
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-96" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-18" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
                            {getCompanyInitial(job.company)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                {job.title || "Job Title"}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Badge
                                  className={`${getMatchColor(job.match)} flex items-center gap-1`}
                                >
                                  {getMatchIcon(job.match)}
                                  {job.match}% Match
                                </Badge>
                                {job.applied && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-700 border-green-200"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Applied
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-muted-foreground flex items-center gap-1 mb-3">
                              <Building2 className="w-4 h-4" />
                              {getCompanyName(job.company)} •{" "}
                              {job.industry || "Industry"}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location || "Location"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type || "Job Type"} •{" "}
                                {job.workSchedule || "Work Schedule"}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {job.experience}
                              </Badge>
                              {job.remote && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-700"
                                >
                                  Remote
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {job.description}
                            </p>

                            {/* AI Recommendation Insights */}
                            {job.aiRecommendation &&
                              activeTab === "recommended" && (
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4 border border-purple-200">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-purple-900 mb-1">
                                        AI Insights
                                      </p>
                                      <p className="text-xs text-purple-700 mb-2">
                                        {job.aiRecommendation.insights}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {job.aiRecommendation.reasons.map(
                                          (reason, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs bg-white/50"
                                            >
                                              {reason}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium mb-2 text-sm">
                                  Required Skills
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {job.requirements
                                    .slice(0, 4)
                                    .map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {job.requirements.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{job.requirements.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-sm">
                                  Benefits
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {job.benefits
                                    ?.slice(0, 3)
                                    .map((benefit: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {benefit}
                                      </Badge>
                                    ))}
                                  {job.benefits?.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{job.benefits?.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveJob(job.id)}
                            className="hover:bg-yellow-50 hover:border-yellow-300"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${job.saved ? "fill-current text-yellow-600" : ""}`}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-red-50 hover:border-red-300"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Posted {job.posted}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applicants} applicants
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewJobDetails(job.id)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplyJob(job.id)}
                            disabled={job.applied}
                          >
                            {job.applied ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Applied
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Apply Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && !loading && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms to find more
                      opportunities.
                    </p>
                    <Button variant="outline" onClick={() => fetchJobs(true)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Load More Button */}
              {hasMore && filteredJobs.length > 0 && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchJobs()}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Load More Jobs
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Application Dialog */}
      <JobApplicationDialog
        open={!!selectedJobForApplication}
        onOpenChange={(open) => {
          if (!open) setSelectedJobForApplication(null);
        }}
        job={selectedJobForApplication}
        onSubmit={handleSubmitApplication}
      />

      {/* Job Details Dialog */}
      <JobDetailsDialog
        open={!!selectedJob}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
        job={selectedJob}
        onApply={handleApplyJob}
        onSave={handleSaveJob}
        onShare={handleShareJob}
      />
    </div>
  );
}
