import { useState, useEffect, useCallback } from "react";
import { getToken } from "@/lib/auth-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
  salary: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  applicationDeadline: string;
  status: "ACTIVE" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    logo?: string;
    industry: string;
    size: string;
    isVerified?: boolean;
  };
  postedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    applications: number;
  };
  hasApplied?: boolean;
  applicationStatus?: string;
}

interface JobStats {
  overview: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    recentApplications: number;
    averageApplicationsPerJob: number;
  };
  trends: Array<{
    date: string;
    applications: number;
  }>;
  topJobs: Array<{
    id: string;
    title: string;
    applications: number;
    status: string;
  }>;
  period: string;
}

interface CreateJobData {
  title: string;
  description: string;
  requirements: string[];
  type: string;
  location: string;
  salary: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  applicationDeadline: string;
  status?: "ACTIVE" | "CLOSED";
}

interface JobQuery {
  search?: string;
  location?: string;
  type?: string;
  company?: string;
  status?: "ACTIVE" | "CLOSED";
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useJobs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    },
    []
  );

  // ============= EMPLOYER OPERATIONS =============

  const createJob = useCallback(
    async (jobData: CreateJobData): Promise<Job> => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest("/jobs", {
          method: "POST",
          body: JSON.stringify(jobData),
        });
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const getMyJobs = useCallback(
    async (query: JobQuery = {}): Promise<PaginatedResponse<Job>> => {
      try {
        setLoading(true);
        setError(null);
        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const response = await makeRequest(`/jobs/my-jobs?${searchParams}`);
        return {
          data: response.data,
          pagination: response.pagination,
        };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const getMyJobStats = useCallback(
    async (period: string = "30d"): Promise<JobStats> => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(
          `/jobs/my-jobs/stats?period=${period}`
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const updateJob = useCallback(
    async (jobId: string, updateData: Partial<CreateJobData>): Promise<Job> => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(`/jobs/${jobId}`, {
          method: "PUT",
          body: JSON.stringify(updateData),
        });
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const updateJobStatus = useCallback(
    async (jobId: string, status: "ACTIVE" | "CLOSED"): Promise<Job> => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(`/jobs/${jobId}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const deleteJob = useCallback(
    async (jobId: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        await makeRequest(`/jobs/${jobId}`, {
          method: "DELETE",
        });
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // ============= PUBLIC OPERATIONS =============

  const getAllJobs = useCallback(
    async (query: JobQuery = {}): Promise<PaginatedResponse<Job>> => {
      try {
        setLoading(true);
        setError(null);
        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const response = await makeRequest(`/jobs?${searchParams}`);
        return {
          data: response.data,
          pagination: response.pagination,
        };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const getJobById = useCallback(
    async (jobId: string): Promise<Job> => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(`/jobs/${jobId}`);
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const applyToJob = useCallback(
    async (
      jobId: string,
      applicationData: { resumeUrl: string; coverLetter?: string }
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(`/jobs/${jobId}/apply`, {
          method: "POST",
          body: JSON.stringify(applicationData),
        });
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const getJobApplications = useCallback(
    async (jobId: string, query: any = {}) => {
      try {
        setLoading(true);
        setError(null);
        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const response = await makeRequest(
          `/jobs/${jobId}/applications?${searchParams}`
        );
        return {
          data: response.data,
          pagination: response.pagination,
        };
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const getJobStats = useCallback(
    async (jobId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(`/jobs/${jobId}/stats`);
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  // ============= APPLICATION MANAGEMENT =============

  const updateApplicationStatus = useCallback(
    async (
      jobId: string,
      applicationId: string,
      status: string,
      message?: string
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(
          `/jobs/${jobId}/applications/${applicationId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({ status, message }),
          }
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const shortlistCandidate = useCallback(
    async (jobId: string, applicationId: string) => {
      return updateApplicationStatus(jobId, applicationId, "SHORTLISTED");
    },
    [updateApplicationStatus]
  );

  const moveToNextStage = useCallback(
    async (jobId: string, applicationId: string, currentStatus: string) => {
      try {
        setLoading(true);
        setError(null);

        // Define the status progression
        const statusProgression: { [key: string]: string } = {
          PENDING: "REVIEWED",
          REVIEWED: "SHORTLISTED",
          SHORTLISTED: "INTERVIEWED",
          INTERVIEWED: "ACCEPTED",
        };

        const nextStatus = statusProgression[currentStatus];
        if (!nextStatus) {
          throw new Error("Cannot move to next stage from current status");
        }

        const response = await makeRequest(
          `/jobs/${jobId}/applications/${applicationId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: nextStatus,
              message: `Application moved to ${nextStatus.toLowerCase()} stage`,
            }),
          }
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const rejectApplication = useCallback(
    async (jobId: string, applicationId: string, reason?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(
          `/jobs/${jobId}/applications/${applicationId}/reject`,
          {
            method: "POST",
            body: JSON.stringify({ reason }),
          }
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  const scheduleInterview = useCallback(
    async (
      jobId: string,
      applicationId: string,
      interviewData: {
        scheduledDate: string;
        scheduledTime: string;
        interviewType: "PHONE" | "VIDEO" | "IN_PERSON";
        location?: string;
        meetingLink?: string;
        notes?: string;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await makeRequest(
          `/jobs/${jobId}/applications/${applicationId}/schedule-interview`,
          {
            method: "POST",
            body: JSON.stringify(interviewData),
          }
        );
        return response.data;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [makeRequest]
  );

  return {
    loading,
    error,
    // Employer operations
    createJob,
    getMyJobs,
    getMyJobStats,
    updateJob,
    updateJobStatus,
    deleteJob,
    // Public operations
    getAllJobs,
    getJobById,
    applyToJob,
    getJobApplications,
    getJobStats,
    // Application management
    updateApplicationStatus,
    shortlistCandidate,
    moveToNextStage,
    rejectApplication,
    scheduleInterview,
  };
}
