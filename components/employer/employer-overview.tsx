"use client";

import { useState } from "react";
import { useEmployerAnalytics } from "@/hooks/use-employer-analytics";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Building2,
  UserPlus,
  Calendar,
  MessageCircle,
  BarChart3,
  Clock,
  MapPin,
  Star,
  Activity,
  Award,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

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

export function EmployerOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const {
    dashboardData,
    applicationTrends,
    candidateSources,
    hiringFunnel,
    skillsDemand,
    universityRankings,
    performanceMetrics,
    loading: analyticsLoading,
    error: analyticsError,
    refetch,
  } = useEmployerAnalytics(selectedPeriod);

  const {
    user: currentUser,
    loading: userLoading,
    error: userError,
  } = useCurrentUser();

  const loading = analyticsLoading || userLoading;

  const getIcon = (iconName: string) => {
    const icons = {
      Briefcase,
      Users,
      Eye,
      TrendingUp,
    };
    return icons[iconName as keyof typeof icons] || Activity;
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-8 bg-white/20 rounded animate-pulse w-64" />
                  <div className="h-4 bg-white/20 rounded animate-pulse w-96" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (analyticsError && !dashboardData) {
    return (
      <div className="space-y-8 p-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Analytics Unavailable</h1>
            <p className="text-lg opacity-90 mb-6">
              Unable to load analytics data. Please check your connection and
              try again.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={refetch}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Activity className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Provide fallback data structure if dashboardData is null
  const safeData = dashboardData || {
    quickStats: [],
    summary: {
      pendingReviews: 0,
      scheduledInterviews: 0,
      activeJobs: 0,
      totalApplications: 0,
    },
  };

  const safeTrends = applicationTrends.length > 0 ? applicationTrends : [];
  const safeSources = candidateSources.length > 0 ? candidateSources : [];
  const safeFunnel = hiringFunnel.length > 0 ? hiringFunnel : [];
  const safeSkills = skillsDemand.length > 0 ? skillsDemand : [];
  const safeUniversities =
    universityRankings.length > 0 ? universityRankings : [];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                <AvatarImage
                  src={currentUser?.avatar}
                  alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {currentUser?.firstName?.[0]}
                  {currentUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {currentUser?.firstName}
                </h1>
                <p className="text-lg opacity-90 mb-6 max-w-2xl">
                  Your recruitment dashboard shows strong performance with{" "}
                  {safeData.summary.totalApplications || 47} total applications
                  and {safeData.summary.pendingReviews || 47} pending reviews.
                  Let's continue building your dream team!
                </p>
                {currentUser?.headline && (
                  <p className="text-sm opacity-75">{currentUser.headline}</p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Users className="w-4 h-4 mr-2" />
                Review Applications
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute right-4 top-4 opacity-20">
          <Building2 className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {safeData.quickStats.length > 0
          ? safeData.quickStats.map((stat, index) => {
              const IconComponent = getIcon(stat.icon);
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden card-hover group"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          {stat.changePercent > 0 ? (
                            <ArrowUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ml-1 ${
                              stat.changePercent > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.changePercent}%
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          : // Show placeholder cards when no stats available
            [
              { label: "Active Job Postings", icon: "Briefcase", value: "0" },
              { label: "Total Applications", icon: "Users", value: "0" },
              { label: "Profile Views", icon: "Eye", value: "0" },
              { label: "Hire Success Rate", icon: "TrendingUp", value: "0%" },
            ].map((stat, index) => {
              const IconComponent = getIcon(stat.icon);
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-muted-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          No data available yet
                        </p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-full opacity-50">
                        <IconComponent className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="grid lg:grid-cols-3 gap-8">
          {/* Application Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Application Trends
              </CardTitle>
              <CardDescription>
                Daily applications, interviews, and hires over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {safeTrends.length > 0 ? (
                  <AreaChart data={safeTrends}>
                    <defs>
                      <linearGradient
                        id="applications"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="interviews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="hires" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString()
                      }
                      formatter={(value, name) => [
                        value,
                        typeof name === "string"
                          ? name.charAt(0).toUpperCase() + name.slice(1)
                          : name,
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      fill="url(#applications)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="interviews"
                      stroke="#10b981"
                      fill="url(#interviews)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="hires"
                      stroke="#f59e0b"
                      fill="url(#hires)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No trend data available
                      </p>
                      <p className="text-sm">
                        Start posting jobs to see application trends
                      </p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Candidate Sources Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Candidate Sources
              </CardTitle>
              <CardDescription>
                Where your best candidates come from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {safeSources.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={safeSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {safeSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No source data available
                      </p>
                      <p className="text-sm">
                        Application sources will appear here
                      </p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="grid lg:grid-cols-2 gap-8">
          {/* Hiring Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Hiring Funnel
              </CardTitle>
              <CardDescription>
                Conversion rates through your hiring process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeFunnel.length > 0 ? (
                <div className="space-y-4">
                  {safeFunnel.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-muted-foreground">
                          {stage.count} ({stage.percentage}%)
                        </span>
                      </div>
                      <Progress value={stage.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No hiring funnel data</p>
                    <p className="text-sm">
                      Funnel metrics will appear as you receive applications
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Demand Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Skills in Demand
              </CardTitle>
              <CardDescription>
                Most requested skills and their growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {safeSkills.length > 0 ? (
                  <BarChart data={safeSkills} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={80} />
                    <Tooltip />
                    <Bar
                      dataKey="demand"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No skills data available
                      </p>
                      <p className="text-sm">
                        Skills in demand will be tracked from applications
                      </p>
                    </div>
                  </div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          {/* University Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Universities by Success Rate
              </CardTitle>
              <CardDescription>
                Universities with the highest hire rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeUniversities.length > 0 ? (
                <div className="space-y-4">
                  {safeUniversities.map((uni, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{uni.university}</h3>
                          <p className="text-sm text-muted-foreground">
                            {uni.applications} applications • {uni.hired} hired
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700"
                      >
                        {uni.successRate}% success rate
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      No university data available
                    </p>
                    <p className="text-sm">
                      University rankings will appear as you receive
                      applications
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="grid lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Key hiring performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">14</div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Days to Hire
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-muted-foreground">
                    Interview Show Rate
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">23%</div>
                  <div className="text-sm text-muted-foreground">
                    Application Growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Campus Visit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Candidates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
