import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  searchJobs,
  getAIRecommendations,
  saveJob,
  unsaveJob,
  applyToJob,
  getMyApplications,
  getSavedJobs,
  getJobStats,
  JobSearchFilters,
  UserPreferences,
} from "@/lib/api";

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
    insights: string;
  };
}

interface JobStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  savedJobs: number;
  interviewInvites: number;
  responseRate: number;
  recentApplications: number;
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

export const useJobs = (initialFilters?: JobSearchFilters) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobStats, setJobStats] = useState<JobStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    savedJobs: 0,
    interviewInvites: 0,
    responseRate: 0,
    recentApplications: 0,
  });
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobSearchFilters>(
    initialFilters || {
      search: "",
      location: "",
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
      page: 1,
      limit: 20,
    }
  );
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const transformJobData = useCallback((apiJob: any): JobListing => {
    const getCompanyName = (company: any): string => {
      if (typeof company === "string") return company;
      return company?.name || "Unknown Company";
    };

    const formatSalary = (salary: any): string => {
      if (typeof salary === "string") return salary;
      if (salary?.min && salary?.max) {
        return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
      }
      return "Salary not specified";
    };

    return {
      id: apiJob.id,
      title: apiJob.title,
      company: getCompanyName(apiJob.company),
      location: apiJob.location || "Remote",
      type: apiJob.type || "Full-time",
      workSchedule: apiJob.workSchedule || "Standard",
      salary: formatSalary(apiJob.salary),
      posted: apiJob.createdAt || new Date().toISOString(),
      deadline: apiJob.applicationDeadline || "",
      match: apiJob.match || 0,
      description: apiJob.description || "",
      requirements: apiJob.requirements || [],
      benefits: apiJob.benefits || [],
      applicants: apiJob._count?.applications || 0,
      saved: apiJob.saved || false,
      applied: apiJob.hasApplied || false,
      companyLogo: apiJob.company?.logo,
      industry: apiJob.company?.industry || "Technology",
      experience: apiJob.experience || "Entry Level",
      remote: apiJob.remote || false,
      aiRecommendation: apiJob.aiRecommendation,
    };
  }, []);

  const fetchJobs = useCallback(
    async (newFilters?: JobSearchFilters, resetPage = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentFilters = newFilters || filters;
        const currentPage = resetPage ? 1 : page;

        const response = await searchJobs({
          ...currentFilters,
          page: currentPage,
          limit: 20,
        });

        const transformedJobs = response.data.map(transformJobData);

        if (resetPage) {
          setJobs(transformedJobs);
          setPage(1);
        } else {
          setJobs((prev) => [...prev, ...transformedJobs]);
        }

        setHasMore(response.pagination.page < response.pagination.totalPages);
        setPage(currentPage + 1);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch jobs";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, transformJobData]
  );

  const fetchAIRecommendations = useCallback(
    async (preferences?: UserPreferences) => {
      try {
        setLoadingRecommendations(true);
        setError(null);

        const response = await getAIRecommendations(
          20,
          true,
          filters,
          preferences
        );
        const transformedJobs = response.data.map(transformJobData);

        setAIInsights({
          personalizedRecommendations: transformedJobs,
          skillGaps: response.skillGaps || [],
          marketTrends: response.marketTrends || {
            demandScore: 0,
            salaryTrends: "",
            growthProjection: "",
          },
          learningRecommendations: response.learningRecommendations || {
            courses: [],
            certifications: [],
            skills: [],
          },
          careerPath: response.careerPath || {
            nextRoles: [],
            timeToNext: "",
            recommendations: [],
          },
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch AI recommendations";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoadingRecommendations(false);
      }
    },
    [filters, transformJobData]
  );

  const fetchJobStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setError(null);

      const response = await getJobStats();
      setJobStats(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch job statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoadingApplications(true);
      setError(null);

      const response = await getMyApplications();
      setApplications(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch applications";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingApplications(false);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    try {
      setError(null);

      const response = await getSavedJobs();
      const transformedJobs = response.data.map(transformJobData);
      setSavedJobs(transformedJobs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch saved jobs";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [transformJobData]);

  const handleSaveJob = useCallback(async (jobId: string) => {
    try {
      await saveJob(jobId);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, saved: true } : job))
      );

      setFilteredJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, saved: true } : job))
      );

      setJobStats((prev) => ({ ...prev, savedJobs: prev.savedJobs + 1 }));

      toast.success("Job saved successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save job";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleUnsaveJob = useCallback(async (jobId: string) => {
    try {
      await unsaveJob(jobId);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, saved: false } : job))
      );

      setFilteredJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, saved: false } : job))
      );

      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));

      setJobStats((prev) => ({
        ...prev,
        savedJobs: Math.max(0, prev.savedJobs - 1),
      }));

      toast.success("Job removed from saved list.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unsave job";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleApplyJob = useCallback(
    async (jobId: string, applicationData?: any) => {
      try {
        await applyToJob(jobId, applicationData || {});

        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, applied: true } : job
          )
        );

        setFilteredJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, applied: true } : job
          )
        );

        setJobStats((prev) => ({
          ...prev,
          totalApplications: prev.totalApplications + 1,
          pendingApplications: prev.pendingApplications + 1,
        }));

        toast.success("Application submitted successfully!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to apply to job";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchJobs(filters, false);
  }, [fetchJobs, filters, hasMore, loading]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.industry.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.requirements.some((req) => req.toLowerCase().includes(searchLower))
    );

    setFilteredJobs(filtered);
  }, [jobs, searchQuery]);

  useEffect(() => {
    fetchJobs(filters, true);
    fetchJobStats();
    fetchApplications();
    fetchSavedJobs();
    fetchAIRecommendations();
  }, []);

  return {
    jobs,
    filteredJobs,
    savedJobs,
    applications,
    jobStats,
    aiInsights,
    loading,
    loadingRecommendations,
    loadingStats,
    loadingApplications,
    page,
    hasMore,
    fetchJobs,
    fetchAIRecommendations,
    fetchJobStats,
    fetchApplications,
    fetchSavedJobs,
    handleSaveJob,
    handleUnsaveJob,
    handleApplyJob,
    loadMore,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    error,
    clearError,
  };
};
