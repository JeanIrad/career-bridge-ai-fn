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
} from "lucide-react";

export function StudentAchievements() {
  const achievements = [
    {
      id: 1,
      title: "JavaScript Master",
      description: "Completed 10 JavaScript courses with excellent grades",
      category: "Learning",
      icon: BookOpen,
      earned: true,
      earnedDate: "2024-02-15",
      points: 500,
      rarity: "Common",
      progress: 100,
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Finished 3 courses in one week",
      category: "Learning",
      icon: TrendingUp,
      earned: true,
      earnedDate: "2024-01-20",
      points: 300,
      rarity: "Uncommon",
      progress: 100,
    },
    {
      id: 3,
      title: "Interview Ace",
      description: "Successfully completed 5 technical interviews",
      category: "Career",
      icon: Briefcase,
      earned: true,
      earnedDate: "2024-03-01",
      points: 750,
      rarity: "Rare",
      progress: 100,
    },
    {
      id: 4,
      title: "Team Player",
      description: "Participated in 5 group projects",
      category: "Collaboration",
      icon: Users,
      earned: false,
      points: 400,
      rarity: "Common",
      progress: 60,
      requirement: "3/5 projects completed",
    },
    {
      id: 5,
      title: "Consistent Learner",
      description: "Maintain a 30-day study streak",
      category: "Learning",
      icon: Calendar,
      earned: false,
      points: 600,
      rarity: "Uncommon",
      progress: 80,
      requirement: "24/30 days completed",
    },
    {
      id: 6,
      title: "Networking Pro",
      description: "Connect with 50 professionals",
      category: "Networking",
      icon: MessageCircle,
      earned: false,
      points: 350,
      rarity: "Common",
      progress: 45,
      requirement: "23/50 connections made",
    },
    {
      id: 7,
      title: "Skill Collector",
      description: "Master 20 different technical skills",
      category: "Skills",
      icon: Target,
      earned: false,
      points: 800,
      rarity: "Epic",
      progress: 30,
      requirement: "6/20 skills mastered",
    },
    {
      id: 8,
      title: "Early Bird",
      description: "Complete morning study sessions for 14 days",
      category: "Habits",
      icon: Clock,
      earned: false,
      points: 250,
      rarity: "Common",
      progress: 85,
      requirement: "12/14 days completed",
    },
  ];

  const stats = [
    { label: "Total Points", value: "2,150", icon: Star },
    { label: "Achievements Earned", value: "8", icon: Trophy },
    { label: "Completion Rate", value: "75%", icon: CheckCircle },
    { label: "Current Streak", value: "24 days", icon: Calendar },
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 3450, avatar: "SC" },
    { rank: 2, name: "Michael Rodriguez", points: 3200, avatar: "MR" },
    { rank: 3, name: "You", points: 2150, avatar: "AJ", isCurrentUser: true },
    { rank: 4, name: "Emily Watson", points: 1980, avatar: "EW" },
    { rank: 5, name: "James Park", points: 1750, avatar: "JP" },
  ];

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
        <Button>
          <Trophy className="w-4 h-4 mr-2" />
          View Leaderboard
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
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
                        <achievement.icon className="w-5 h-5" />
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
                            className={getCategoryColor(achievement.category)}
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
                ))}
              </div>
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
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  Level 12
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Learning Enthusiast
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level 13</span>
                    <span>2,150 / 2,500 XP</span>
                  </div>
                  <Progress value={86} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    350 XP to next level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Leaderboard</CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
