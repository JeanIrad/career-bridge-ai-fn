import { useState, useEffect, useCallback } from "react";
import {
  searchInternships,
  getInternshipStats,
  saveInternship,
  unsaveInternship,
  applyToInternship,
  getMyInternshipApplications,
  getSavedInternships,
  getInternshipCompanies,
  getInternshipLocations,
  getInternshipTypes,
  type Internship,
  type InternshipSearchFilters,
  type InternshipStats,
  type InternshipApplication,
} from "@/lib/api";
import { toast } from "sonner";

export function useInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<InternshipStats | null>(null);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  // Search internships
  const searchInternshipsData = useCallback(
    async (filters: InternshipSearchFilters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchInternships(filters);
        setInternships(response.internships);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search internships";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await getInternshipStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load internship stats:", err);
    }
  }, []);

  // Save/unsave internship
  const toggleSaveInternship = useCallback(
    async (internshipId: string, isSaved: boolean) => {
      try {
        if (isSaved) {
          await unsaveInternship(internshipId);
          toast.success("Internship removed from saved list");
        } else {
          await saveInternship(internshipId);
          toast.success("Internship saved successfully");
        }

        // Update the internship in the list
        setInternships((prev) =>
          prev.map((internship) =>
            internship.id === internshipId
              ? { ...internship, isSaved: !isSaved }
              : internship
          )
        );

        // Reload stats
        loadStats();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to save/unsave internship";
        toast.error(errorMessage);
      }
    },
    [loadStats]
  );

  // Apply to internship
  const applyToInternshipData = useCallback(
    async (
      internshipId: string,
      applicationData: {
        resumeUrl?: string;
        coverLetter?: string;
        additionalDocuments?: string[];
      }
    ) => {
      try {
        await applyToInternship(internshipId, applicationData);

        // Update the internship in the list to show applied status
        setInternships((prev) =>
          prev.map((internship) =>
            internship.id === internshipId
              ? { ...internship, isApplied: true }
              : internship
          )
        );

        // Update stats immediately in local state
        setStats((prevStats) =>
          prevStats
            ? {
                ...prevStats,
                appliedInternships: prevStats.appliedInternships + 1,
              }
            : prevStats
        );

        toast.success("Application submitted successfully");

        // Reload stats from server to ensure accuracy
        await loadStats();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to apply to internship";
        toast.error(errorMessage);
        throw err;
      }
    },
    [loadStats]
  );

  // Load applications
  const loadApplications = useCallback(
    async (filters?: { status?: string; page?: number; limit?: number }) => {
      try {
        const response = await getMyInternshipApplications(filters);
        setApplications(response.applications);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    },
    []
  );

  // Load saved internships
  const loadSavedInternships = useCallback(async () => {
    try {
      const saved = await getSavedInternships();
      setSavedInternships(saved);
    } catch (err) {
      console.error("Failed to load saved internships:", err);
    }
  }, []);

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const [companiesData, locationsData, typesData] = await Promise.all([
        getInternshipCompanies(),
        getInternshipLocations(),
        getInternshipTypes(),
      ]);

      setCompanies(companiesData);
      setLocations(locationsData);
      setTypes(typesData);
    } catch (err) {
      console.error("Failed to load filter options:", err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    searchInternshipsData();
    loadStats();
    loadFilterOptions();
  }, [searchInternshipsData, loadStats, loadFilterOptions]);

  return {
    internships,
    stats,
    applications,
    savedInternships,
    companies,
    locations,
    types,
    loading,
    error,
    pagination,
    searchInternships: searchInternshipsData,
    toggleSaveInternship,
    applyToInternship: applyToInternshipData,
    loadApplications,
    loadSavedInternships,
    loadStats,
  };
}
