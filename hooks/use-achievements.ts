"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getToken } from "@/lib/auth-utils";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  points: number;
  rarity: string;
  progress: number;
  requirement?: string;
}

export interface AchievementStats {
  totalPoints: number;
  achievementsEarned: number;
  completionRate: number;
  currentStreak: number;
  level: number;
  levelTitle: string;
  progressToNextLevel: number;
  xpToNextLevel: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser: boolean;
}

// Mock API functions - replace with real API calls
const mockFetchAchievements = async (): Promise<Achievement[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "1",
      title: "JavaScript Master",
      description: "Completed 10 JavaScript courses with excellent grades",
      category: "Learning",
      icon: "BookOpen",
      earned: true,
      earnedDate: "2024-02-15",
      points: 500,
      rarity: "Common",
      progress: 100,
    },
    {
      id: "2",
      title: "Quick Learner",
      description: "Finished 3 courses in one week",
      category: "Learning",
      icon: "TrendingUp",
      earned: true,
      earnedDate: "2024-01-20",
      points: 300,
      rarity: "Uncommon",
      progress: 100,
    },
    {
      id: "3",
      title: "Interview Ace",
      description: "Successfully completed 5 technical interviews",
      category: "Career",
      icon: "Briefcase",
      earned: true,
      earnedDate: "2024-03-01",
      points: 750,
      rarity: "Rare",
      progress: 100,
    },
    {
      id: "4",
      title: "Team Player",
      description: "Participated in 5 group projects",
      category: "Collaboration",
      icon: "Users",
      earned: false,
      points: 400,
      rarity: "Common",
      progress: 60,
      requirement: "3/5 projects completed",
    },
    {
      id: "5",
      title: "Consistent Learner",
      description: "Maintain a 30-day study streak",
      category: "Learning",
      icon: "Calendar",
      earned: false,
      points: 600,
      rarity: "Uncommon",
      progress: 80,
      requirement: "24/30 days completed",
    },
    {
      id: "6",
      title: "Networking Pro",
      description: "Connect with 50 professionals",
      category: "Networking",
      icon: "MessageCircle",
      earned: false,
      points: 350,
      rarity: "Common",
      progress: 45,
      requirement: "23/50 connections made",
    },
    {
      id: "7",
      title: "Skill Collector",
      description: "Master 20 different technical skills",
      category: "Skills",
      icon: "Target",
      earned: false,
      points: 800,
      rarity: "Epic",
      progress: 30,
      requirement: "6/20 skills mastered",
    },
    {
      id: "8",
      title: "Early Bird",
      description: "Complete morning study sessions for 14 days",
      category: "Habits",
      icon: "Clock",
      earned: false,
      points: 250,
      rarity: "Common",
      progress: 85,
      requirement: "12/14 days completed",
    },
  ];
};

const mockFetchAchievementStats = async (): Promise<AchievementStats> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalPoints: 2150,
    achievementsEarned: 3,
    completionRate: 75,
    currentStreak: 24,
    level: 12,
    levelTitle: "Learning Enthusiast",
    progressToNextLevel: 86,
    xpToNextLevel: 350,
  };
};

const mockFetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return [
    {
      rank: 1,
      name: "Sarah Chen",
      points: 3450,
      avatar: "SC",
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Michael Rodriguez",
      points: 3200,
      avatar: "MR",
      isCurrentUser: false,
    },
    { rank: 3, name: "You", points: 2150, avatar: "AJ", isCurrentUser: true },
    {
      rank: 4,
      name: "Emily Watson",
      points: 1980,
      avatar: "EW",
      isCurrentUser: false,
    },
    {
      rank: 5,
      name: "James Park",
      points: 1750,
      avatar: "JP",
      isCurrentUser: false,
    },
  ];
};

// Real API functions
const fetchAchievements = async (): Promise<Achievement[]> => {
  const token = getToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/achievements`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch achievements");
  }

  const result = await response.json();
  return result.data || [];
};

const fetchAchievementStats = async (): Promise<AchievementStats> => {
  const token = getToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/achievements/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch achievement stats");
  }

  const result = await response.json();
  return result.data;
};

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const token = getToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/achievements/leaderboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  const result = await response.json();
  // Transform backend leaderboard format to frontend format
  return (result.data || []).map((entry: any, index: number) => ({
    rank: entry.rank || index + 1,
    name: `${entry.firstName} ${entry.lastName}`,
    points: entry.totalPoints,
    avatar: entry.avatar || "",
    isCurrentUser: false, // This would need to be determined by comparing user IDs
  }));
};

export function useAchievements() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  // Fetch achievements
  const {
    data: achievements = [],
    isLoading: achievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch achievement stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["achievement-stats"],
    queryFn: fetchAchievementStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch leaderboard
  const {
    data: leaderboard = [],
    isLoading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useQuery({
    queryKey: ["achievement-leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });

  // Refresh all achievement data
  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        refetchAchievements(),
        refetchStats(),
        refetchLeaderboard(),
      ]);
      toast.success("Achievements refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh achievements:", error);
      toast.error("Failed to refresh achievements");
    }
  }, [refetchAchievements, refetchStats, refetchLeaderboard]);

  // Invalidate and refetch all achievement data
  const invalidateAndRefetch = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["achievements"] });
      await queryClient.invalidateQueries({ queryKey: ["achievement-stats"] });
      await queryClient.invalidateQueries({
        queryKey: ["achievement-leaderboard"],
      });
      toast.success("Achievements data updated");
    } catch (error) {
      console.error("Failed to invalidate achievements:", error);
      toast.error("Failed to update achievements");
    }
  }, [queryClient]);

  // Calculate derived stats
  const earnedAchievements = achievements.filter((a) => a.earned);
  const unearnedAchievements = achievements.filter((a) => !a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);
  const completionRate =
    achievements.length > 0
      ? Math.round((earnedAchievements.length / achievements.length) * 100)
      : 0;

  // Loading states
  const isLoading = achievementsLoading || statsLoading || leaderboardLoading;
  const hasError = achievementsError || statsError || leaderboardError;

  return {
    // Data
    achievements,
    stats,
    leaderboard,
    earnedAchievements,
    unearnedAchievements,
    totalPoints,
    completionRate,

    // Loading states
    isLoading,
    achievementsLoading,
    statsLoading,
    leaderboardLoading,

    // Error states
    hasError,
    achievementsError,
    statsError,
    leaderboardError,

    // Actions
    refreshAll,
    invalidateAndRefetch,
    refetchAchievements,
    refetchStats,
    refetchLeaderboard,
  };
}

// Hook for tracking specific achievement progress
export function useAchievementProgress(achievementId: string) {
  const { achievements } = useAchievements();
  const achievement = achievements.find((a) => a.id === achievementId);

  return {
    achievement,
    progress: achievement?.progress || 0,
    isEarned: achievement?.earned || false,
    requirement: achievement?.requirement,
  };
}

// Hook for achievement categories
export function useAchievementCategories() {
  const { achievements } = useAchievements();

  const categories = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = {
          name: achievement.category,
          achievements: [],
          earned: 0,
          total: 0,
          progress: 0,
        };
      }

      acc[achievement.category].achievements.push(achievement);
      acc[achievement.category].total += 1;

      if (achievement.earned) {
        acc[achievement.category].earned += 1;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        name: string;
        achievements: Achievement[];
        earned: number;
        total: number;
        progress: number;
      }
    >
  );

  // Calculate progress for each category
  Object.values(categories).forEach((category) => {
    category.progress =
      category.total > 0
        ? Math.round((category.earned / category.total) * 100)
        : 0;
  });

  return {
    categories: Object.values(categories),
    categoryMap: categories,
  };
}
