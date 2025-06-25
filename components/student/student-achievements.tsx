"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  Briefcase,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAchievements } from "@/hooks/use-achievements";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { useState } from "react";
import { getToken } from "@/lib/auth-utils";

export function StudentAchievements() {
  const { user } = useCurrentUser();
  const { achievements, stats, leaderboard, isLoading, hasError, refreshAll } =
    useAchievements();

  const [isCreating, setIsCreating] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-700";
      case "Uncommon":
        return "bg-green-100 text-green-700";
      case "Rare":
        return "bg-blue-100 text-blue-700";
      case "Epic":
        return "bg-purple-100 text-purple-700";
      case "Legendary":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Learning":
        return "bg-blue-100 text-blue-700";
      case "Career":
        return "bg-emerald-100 text-emerald-700";
      case "Collaboration":
        return "bg-purple-100 text-purple-700";
      case "Networking":
        return "bg-pink-100 text-pink-700";
      case "Skills":
        return "bg-orange-100 text-orange-700";
      case "Habits":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<
      string,
      React.ComponentType<{ className?: string }>
    > = {
      BookOpen,
      TrendingUp,
      Briefcase,
      Users,
      Calendar,
      MessageCircle,
      Target,
      Clock,
    };
    return iconMap[iconName] || Award;
  };

  const handleCreateTestAchievement = async () => {
    setIsCreating(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/achievements/test`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create test achievement");
      }

      await refreshAll();
      toast.success("Test achievement created successfully!");
    } catch (error) {
      console.error("Error creating test achievement:", error);
      toast.error("Failed to create test achievement");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshAll();
    } catch (error) {
      console.error("Failed to refresh achievements:", error);
      toast.error("Failed to refresh achievements");
    }
  };

  if (hasError) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievements & Progress</h1>
            <p className="text-muted-foreground">
              Track your learning milestones and career accomplishments
            </p>
          </div>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Achievements
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading your achievements data.
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements & Progress</h1>
          <p className="text-muted-foreground">
            Track your learning milestones and career accomplishments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateTestAchievement} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4 mr-2" />
            )}
            Create Test Achievement
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Trophy className="w-4 h-4 mr-2" />
            View Leaderboard
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {isLoading
          ? // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          : // Real stats
            stats &&
            [
              {
                label: "Total Points",
                value: stats.totalPoints.toLocaleString(),
                icon: Star,
              },
              {
                label: "Achievements Earned",
                value: stats.achievementsEarned.toString(),
                icon: Trophy,
              },
              {
                label: "Completion Rate",
                value: `${stats.completionRate}%`,
                icon: CheckCircle,
              },
              {
                label: "Current Streak",
                value: `${stats.currentStreak} days`,
                icon: Calendar,
              },
            ].map((stat, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Achievements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Unlock achievements by completing learning goals and career
                milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading skeletons for achievements
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const IconComponent = getIconComponent(achievement.icon);
                    return (
                      <div
                        key={achievement.id}
                        className={`border rounded-lg p-4 transition-all ${
                          achievement.earned
                            ? "bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200"
                            : "hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.earned
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">
                                {achievement.title}
                              </h3>
                              {achievement.earned && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={getCategoryColor(
                                  achievement.category
                                )}
                                variant="secondary"
                              >
                                {achievement.category}
                              </Badge>
                              <Badge
                                className={getRarityColor(achievement.rarity)}
                                variant="outline"
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>

                        {achievement.earned ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-emerald-600">
                              Earned on {achievement.earnedDate}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">
                                {achievement.points} pts
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {achievement.requirement}
                              </span>
                              <span className="font-medium">
                                {achievement.progress}%
                              </span>
                            </div>
                            <Progress
                              value={achievement.progress}
                              className="h-1"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {achievement.points} points when earned
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-16 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-28 mx-auto" />
                    </div>
                  </div>
                </div>
              ) : (
                stats && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      Level {stats.level}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {stats.levelTitle}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Level {stats.level + 1}</span>
                        <span>
                          {stats.totalPoints} /{" "}
                          {stats.totalPoints + stats.xpToNextLevel} XP
                        </span>
                      </div>
                      <Progress
                        value={stats.progressToNextLevel}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {stats.xpToNextLevel} XP to next level
                      </p>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Leaderboard</CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        user.isCurrentUser
                          ? "bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : user.rank === 2
                              ? "bg-gray-100 text-gray-700"
                              : user.rank === 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-xs">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${user.isCurrentUser ? "text-primary" : ""}`}
                        >
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.points.toLocaleString()} points
                        </p>
                      </div>
                      {user.rank <= 3 && (
                        <Trophy
                          className={`w-4 h-4 ${
                            user.rank === 1
                              ? "text-yellow-500"
                              : user.rank === 2
                                ? "text-gray-500"
                                : "text-orange-500"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <Skeleton className="h-3 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Earned "Interview Ace" achievement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Completed React Advanced course</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Joined study group project</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Connected with 3 new mentors</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
