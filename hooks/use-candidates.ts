import { useState, useCallback } from "react";
import { getToken } from "@/lib/auth-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  avatar?: string;
  headline?: string;
  bio?: string;
  skills: Array<{
    id: string;
    name: string;
    endorsements?: number;
  }>;
  location?: string;
  // Application-specific fields
  applicationId?: string;
  jobId?: string;
  jobTitle?: string;
  applicationDate?: string;
  status?: string;
  rating?: number;
  notes?: string;
  resumeUrl?: string;
}

interface CandidateStats {
  totalCandidates: number;
  interviewsScheduled: number;
  offersExtended: number;
  averageRating: number;
}

interface CandidateQuery {
  search?: string;
  status?: string;
  jobId?: string;
  university?: string;
  major?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useCandidates() {
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

  // Get all candidates from job applications
  const getCandidates = useCallback(
    async (
      query: CandidateQuery = {}
    ): Promise<PaginatedResponse<Candidate>> => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        const response = await makeRequest(`/candidates?${searchParams}`);
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

  // Get candidate statistics
  const getCandidateStats = useCallback(async (): Promise<CandidateStats> => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeRequest("/candidates/stats");
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [makeRequest]);

  // Get candidates from all applications across jobs
  const getAllCandidatesFromApplications = useCallback(
    async (
      query: CandidateQuery = {}
    ): Promise<PaginatedResponse<Candidate>> => {
      try {
        setLoading(true);
        setError(null);

        const searchParams = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });

        // Get all applications from employer's jobs
        const response = await makeRequest(
          `/jobs/my-jobs/all-applications?${searchParams}`
        );

        // Transform applications to candidate format
        const candidates = response.data.map((app: any) => ({
          id: app.user.id,
          firstName: app.user.firstName,
          lastName: app.user.lastName,
          email: app.user.email,
          phoneNumber: app.user.phoneNumber,
          university: app.user.university,
          major: app.user.major,
          graduationYear: app.user.graduationYear,
          gpa: app.user.gpa,
          avatar: app.user.avatar,
          headline: app.user.headline,
          bio: app.user.bio,
          skills: app.user.skills || [],
          location: [app.user.city, app.user.state, app.user.country]
            .filter(Boolean)
            .join(", "),
          // Application-specific data
          applicationId: app.id,
          jobId: app.jobId,
          jobTitle: app.job?.title,
          applicationDate: app.createdAt,
          status: app.status,
          rating: app.rating || 0,
          notes: app.notes,
          resumeUrl: app.resumeUrl,
        }));

        return {
          data: candidates,
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

  return {
    loading,
    error,
    getCandidates,
    getCandidateStats,
    getAllCandidatesFromApplications,
  };
}
