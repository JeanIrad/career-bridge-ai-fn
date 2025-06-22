import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "@/lib/auth-utils";

interface DashboardData {
  quickStats: Array<{
    label: string;
    value: string;
    change: string;
    changePercent: number;
    icon: string;
  }>;
  summary: {
    pendingReviews: number;
    scheduledInterviews: number;
    activeJobs: number;
    totalApplications: number;
  };
}

interface ApplicationTrend {
  date: string;
  applications: number;
  interviews: number;
  hires: number;
}

interface CandidateSource {
  name: string;
  value: number;
  color: string;
}

interface HiringFunnelData {
  stage: string;
  count: number;
  percentage: number;
}

interface SkillDemand {
  skill: string;
  demand: number;
  growth: number;
}

interface UniversityRanking {
  university: string;
  applications: number;
  hired: number;
  successRate: number;
}

interface PerformanceMetrics {
  applicationGrowth: number;
  avgTimeToHire: number;
  responseRate: number;
  interviewShowRate: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  data?: any;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useEmployerAnalytics(period: string = "30d") {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [applicationTrends, setApplicationTrends] = useState<
    ApplicationTrend[]
  >([]);
  const [candidateSources, setCandidateSources] = useState<CandidateSource[]>(
    []
  );
  const [hiringFunnel, setHiringFunnel] = useState<HiringFunnelData[]>([]);
  const [skillsDemand, setSkillsDemand] = useState<SkillDemand[]>([]);
  const [universityRankings, setUniversityRankings] = useState<
    UniversityRanking[]
  >([]);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authentication token using the auth utility
      const token = getToken();
      if (!token) {
        // Don't throw error, just set loading to false and return empty data
        console.warn("No authentication token found, skipping analytics fetch");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all analytics data in parallel
      const results = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/employer-analytics/dashboard-overview`, {
          headers,
        }),
        axios.get(
          `${API_BASE_URL}/employer-analytics/application-trends?period=${period}`,
          { headers }
        ),
        axios.get(`${API_BASE_URL}/employer-analytics/candidate-sources`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/employer-analytics/hiring-funnel`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/employer-analytics/skills-demand`, {
          headers,
        }),
        axios.get(`${API_BASE_URL}/employer-analytics/university-rankings`, {
          headers,
        }),
        axios.get(
          `${API_BASE_URL}/employer-analytics/performance-metrics?period=${period}`,
          { headers }
        ),
        axios.get(`${API_BASE_URL}/employer-analytics/recent-activities`, {
          headers,
        }),
      ]);

      // Process results
      const [
        dashboardResult,
        trendsResult,
        sourcesResult,
        funnelResult,
        skillsResult,
        universitiesResult,
        metricsResult,
        activitiesResult,
      ] = results;

      // Set data from successful requests, use empty arrays for failed ones
      if (dashboardResult.status === "fulfilled") {
        setDashboardData(dashboardResult.value.data);
      }

      if (trendsResult.status === "fulfilled") {
        setApplicationTrends(trendsResult.value.data);
      }

      if (sourcesResult.status === "fulfilled") {
        setCandidateSources(sourcesResult.value.data);
      }

      if (funnelResult.status === "fulfilled") {
        setHiringFunnel(funnelResult.value.data);
      }

      if (skillsResult.status === "fulfilled") {
        setSkillsDemand(skillsResult.value.data);
      }

      if (universitiesResult.status === "fulfilled") {
        setUniversityRankings(universitiesResult.value.data);
      }

      if (metricsResult.status === "fulfilled") {
        setPerformanceMetrics(metricsResult.value.data);
      }

      if (activitiesResult.status === "fulfilled") {
        setRecentActivities(activitiesResult.value.data);
      }

      // Check if any requests failed
      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedRequests.length > 0) {
        console.warn(
          `${failedRequests.length} analytics requests failed, but continuing with available data`
        );
        // Only set error if ALL requests failed
        if (failedRequests.length === results.length) {
          setError(
            "Failed to load analytics data. Please check your connection and try again."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError(
        "Failed to load analytics data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  return {
    dashboardData,
    applicationTrends,
    candidateSources,
    hiringFunnel,
    skillsDemand,
    universityRankings,
    performanceMetrics,
    recentActivities,
    loading,
    error,
    refetch,
  };
}
