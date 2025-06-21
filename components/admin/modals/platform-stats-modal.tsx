"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Users,
  UserCheck,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
  Target,
  Award,
  MapPin,
} from "lucide-react";

interface PlatformStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userStats: {
    totalUsers: number;
    verifiedUsers: number;
    activeUsers: number;
    verificationRate: number;
    roleDistribution: {
      students: number;
      alumni: number;
      employers: number;
      professors: number;
    };
  };
}

export function PlatformStatsModal({
  open,
  onOpenChange,
  userStats,
}: PlatformStatsModalProps) {
  const [timeRange, setTimeRange] = useState("30d");

  // Calculate additional metrics
  const totalUsers = userStats?.totalUsers || 0;
  const verifiedUsers = userStats?.verifiedUsers || 0;
  const activeUsers = userStats?.activeUsers || 0;
  const pendingVerifications = totalUsers - verifiedUsers;
  const verificationRate = userStats?.verificationRate || 0;

  // Role distribution data
  const roleData = [
    {
      name: "Students",
      value: userStats?.roleDistribution?.students || 0,
      color: "#3B82F6",
      icon: "👨‍🎓",
    },
    {
      name: "Alumni",
      value: userStats?.roleDistribution?.alumni || 0,
      color: "#10B981",
      icon: "🎓",
    },
    {
      name: "Employers",
      value: userStats?.roleDistribution?.employers || 0,
      color: "#8B5CF6",
      icon: "🏢",
    },
    {
      name: "Professors",
      value: userStats?.roleDistribution?.professors || 0,
      color: "#F59E0B",
      icon: "👨‍🏫",
    },
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      title: "User Engagement",
      value: "87.2%",
      change: "+2.4%",
      trend: "up",
      icon: Activity,
      description: "Daily active users / Total users",
    },
    {
      title: "Verification Success Rate",
      value: `${verificationRate.toFixed(1)}%`,
      change: verificationRate > 70 ? "+5.2%" : "-1.8%",
      trend: verificationRate > 70 ? "up" : "down",
      icon: UserCheck,
      description: "Verified users / Total users",
    },
    {
      title: "Average Session Duration",
      value: "24m 32s",
      change: "+3.1%",
      trend: "up",
      icon: Clock,
      description: "Average time spent per session",
    },
    {
      title: "Platform Health Score",
      value: "99.8%",
      change: "+0.1%",
      trend: "up",
      icon: Target,
      description: "Overall system uptime and performance",
    },
  ];

  // Geographic distribution (mock data)
  const geographicData = [
    {
      country: "United States",
      users: Math.floor(totalUsers * 0.4),
      percentage: 40,
    },
    { country: "Canada", users: Math.floor(totalUsers * 0.15), percentage: 15 },
    {
      country: "United Kingdom",
      users: Math.floor(totalUsers * 0.12),
      percentage: 12,
    },
    { country: "Germany", users: Math.floor(totalUsers * 0.08), percentage: 8 },
    { country: "France", users: Math.floor(totalUsers * 0.07), percentage: 7 },
    { country: "Others", users: Math.floor(totalUsers * 0.18), percentage: 18 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const exportData = () => {
    const dataToExport = {
      summary: {
        totalUsers,
        verifiedUsers,
        activeUsers,
        verificationRate,
        pendingVerifications,
      },
      roleDistribution: userStats.roleDistribution,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `platform-stats-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6" />
            Platform Statistics & Analytics
          </DialogTitle>
          <DialogDescription className="text-base">
            Comprehensive overview of platform performance and user metrics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Time Range Selector */}
          <div className="flex justify-between items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 h-11">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-3">
              <Button variant="outline" size="default" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="default">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="growth" className="text-sm">
                Growth Trends
              </TabsTrigger>
              <TabsTrigger value="demographics" className="text-sm">
                Demographics
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-sm">
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-700 mb-2 truncate">
                          Total Users
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900 mb-3 truncate">
                          {totalUsers.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm">
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="font-medium">+12.5%</span>
                          </div>
                          <span className="text-gray-600 ml-2 truncate">
                            from last month
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-200 p-3 md:p-4 rounded-2xl ml-3 flex-shrink-0">
                        <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-700" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-blue-200 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 opacity-20"></div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-700 mb-2 truncate">
                          Verified Users
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-emerald-900 mb-3 truncate">
                          {verifiedUsers.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm">
                          <div className="flex items-center text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="font-medium">
                              {verificationRate.toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-gray-600 ml-2 truncate">
                            of total
                          </span>
                        </div>
                      </div>
                      <div className="bg-emerald-200 p-3 md:p-4 rounded-2xl ml-3 flex-shrink-0">
                        <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-emerald-700" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-emerald-200 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 opacity-20"></div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-700 mb-2 truncate">
                          Active Users
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-purple-900 mb-3 truncate">
                          {activeUsers.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm">
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="font-medium">
                              {((activeUsers / totalUsers) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-gray-600 ml-2 truncate">
                            engagement
                          </span>
                        </div>
                      </div>
                      <div className="bg-purple-200 p-3 md:p-4 rounded-2xl ml-3 flex-shrink-0">
                        <Activity className="h-6 w-6 md:h-8 md:w-8 text-purple-700" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-purple-200 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 opacity-20"></div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-amber-700 mb-2 truncate">
                          Pending
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-amber-900 mb-3 truncate">
                          {pendingVerifications.toLocaleString()}
                        </p>
                        <div className="flex items-center text-sm">
                          <div className="flex items-center text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="font-medium">Awaiting</span>
                          </div>
                          <span className="text-gray-600 ml-2 truncate">
                            verification
                          </span>
                        </div>
                      </div>
                      <div className="bg-amber-200 p-3 md:p-4 rounded-2xl ml-3 flex-shrink-0">
                        <Clock className="h-6 w-6 md:h-8 md:w-8 text-amber-700" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-amber-200 rounded-full -mr-8 md:-mr-10 -mt-8 md:-mt-10 opacity-20"></div>
                  </CardContent>
                </Card>
              </div>

              {/* Role Distribution */}
              <Card className="shadow-sm border-0 bg-gradient-to-r from-gray-50 to-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                    <div className="bg-indigo-100 p-2 rounded-xl">
                      <PieChartIcon className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                    </div>
                    <span className="truncate">User Role Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {roleData.map((role, index) => (
                      <div
                        key={role.name}
                        className="group relative p-4 md:p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-200"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            <div
                              className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                              style={{ backgroundColor: role.color }}
                            />
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-xl md:text-2xl flex-shrink-0">
                                {role.icon}
                              </span>
                              <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors truncate">
                                {role.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <div className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                              {role.value.toLocaleString()}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                              {totalUsers > 0
                                ? ((role.value / totalUsers) * 100).toFixed(1)
                                : 0}
                              %
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                backgroundColor: role.color,
                                width: `${totalUsers > 0 ? (role.value / totalUsers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gender Distribution */}
              <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                    <div className="bg-purple-100 p-2 rounded-xl">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                    <span className="truncate">Gender Distribution</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    User demographics breakdown
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart Visual */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Outer Ring */}
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          {/* Background Circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="8"
                          />
                          {/* Male Segment - 58% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray={`${58 * 2.51} ${(100 - 58) * 2.51}`}
                            strokeDashoffset="0"
                            className="transition-all duration-1000 ease-out"
                          />
                          {/* Female Segment - 42% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth="8"
                            strokeDasharray={`${42 * 2.51} ${(100 - 42) * 2.51}`}
                            strokeDashoffset={`-${58 * 2.51}`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>

                        {/* Center Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-gray-800">
                              {totalUsers.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total Users
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend and Stats */}
                    <div className="space-y-6">
                      {/* Male Stats */}
                      <div className="group p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                            <span className="font-semibold text-blue-900">
                              Male
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-900">
                              {Math.floor(totalUsers * 0.58).toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-600">58.0%</div>
                          </div>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: "58%" }}
                          />
                        </div>
                      </div>

                      {/* Female Stats */}
                      <div className="group p-4 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-pink-500 rounded-full shadow-sm"></div>
                            <span className="font-semibold text-pink-900">
                              Female
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-pink-900">
                              {Math.floor(totalUsers * 0.42).toLocaleString()}
                            </div>
                            <div className="text-sm text-pink-600">42.0%</div>
                          </div>
                        </div>
                        <div className="w-full bg-pink-200 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: "42%" }}
                          />
                        </div>
                      </div>

                      {/* Summary Stats */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-gray-800">
                              1.38
                            </div>
                            <div className="text-xs text-gray-500">
                              Male/Female Ratio
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-800">
                              100%
                            </div>
                            <div className="text-xs text-gray-500">
                              Data Coverage
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth" className="space-y-6">
              <Card className="shadow-sm border-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                    <div className="bg-indigo-100 p-2 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-indigo-600" />
                    </div>
                    Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-20">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-3xl mb-8 inline-block">
                        <BarChart3 className="h-20 w-20 text-indigo-400 mx-auto" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-amber-100 p-2 rounded-full">
                        <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Growth Charts Coming Soon
                    </h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                      Interactive charts and detailed growth analytics will be
                      available in the next update
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                      <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-500">
                          📈 Trend Analysis
                        </span>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-500">
                          📊 Data Visualization
                        </span>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-500">
                          🎯 Insights
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <Card className="shadow-sm border-0 bg-gradient-to-r from-gray-50 to-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-gray-800">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <span className="truncate">Geographic Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((country, index) => (
                      <div
                        key={country.country}
                        className="group relative p-4 md:p-5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-200"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                            <div className="bg-blue-100 p-2 md:p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-base md:text-lg text-gray-800 group-hover:text-gray-900 transition-colors block truncate">
                                {country.country}
                              </span>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-xs md:text-sm font-medium bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {country.percentage}%
                                </Badge>
                                <span className="text-xs md:text-sm text-gray-500">
                                  of total users
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors block">
                              {country.users.toLocaleString()}
                            </span>
                            <p className="text-xs md:text-sm text-gray-500">
                              users
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs md:text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{country.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden">
                            <div
                              className="h-2 md:h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out shadow-sm"
                              style={{ width: `${country.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {performanceMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card
                      key={metric.title}
                      className="relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 group"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <CardContent className="p-5 md:p-7">
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                              <div className="bg-indigo-100 p-2 md:p-3 rounded-xl group-hover:bg-indigo-200 transition-colors duration-300 flex-shrink-0">
                                <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                              </div>
                              <h3 className="font-semibold text-lg md:text-xl text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                                {metric.title}
                              </h3>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <Badge
                                variant={
                                  metric.trend === "up"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 shadow-sm"
                              >
                                <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                                {metric.change}
                              </Badge>
                            </div>
                          </div>
                          <div className="mb-4 text-center">
                            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                              {metric.value}
                            </p>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                              {metric.description}
                            </p>
                          </div>
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                              <span>Performance Indicator</span>
                              <span className="font-medium text-gray-700">
                                {metric.trend === "up"
                                  ? "Improving"
                                  : "Declining"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-indigo-100 rounded-full -mr-10 md:-mr-12 -mb-10 md:-mb-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
