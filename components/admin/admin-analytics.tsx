"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Calendar,
  Download,
  Filter,
  Globe,
  Zap,
  Target,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar as CalendarIcon,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  FileJson,
  File,
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";
import {
  useComprehensiveAnalytics,
  useExportAnalytics,
  type AnalyticsFilters,
  type ExportReport,
} from "@/lib/actions/users";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  pink: "#ec4899",
  purple: "#8b5cf6",
  indigo: "#6366f1",
  teal: "#14b8a6",
  gradient: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"],
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.pink,
  COLORS.purple,
];

const TIME_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "6m", label: "Last 6 months" },
  { value: "1y", label: "Last year" },
  { value: "all", label: "All time" },
];

const USER_ROLES = [
  { value: "STUDENT", label: "Students" },
  { value: "ALUMNI", label: "Alumni" },
  { value: "EMPLOYER", label: "Employers" },
  { value: "PROFESSOR", label: "Professors" },
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const ACCOUNT_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

const EXPORT_FORMATS = [
  { value: "csv", label: "CSV", icon: FileSpreadsheet },
  { value: "json", label: "JSON", icon: FileJson },
  { value: "xlsx", label: "Excel", icon: FileSpreadsheet },
  { value: "pdf", label: "PDF", icon: File },
];

const REPORT_TYPES = [
  { value: "comprehensive", label: "Comprehensive Report" },
  { value: "users", label: "User Analytics" },
  { value: "growth", label: "Growth Report" },
  { value: "engagement", label: "Engagement Report" },
  { value: "geographic", label: "Geographic Report" },
];

export function AdminAnalytics() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeRange: "30d",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportConfig, setExportConfig] = useState<Partial<ExportReport>>({
    reportType: "comprehensive",
    format: "csv",
    includeCharts: false,
  });

  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useComprehensiveAnalytics(filters);
  const exportMutation = useExportAnalytics();

  // Filter handlers
  const updateFilter = (key: keyof AnalyticsFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ timeRange: "30d" });
  };

  const handleExport = () => {
    if (!exportConfig.reportType || !exportConfig.format) return;

    const exportData: ExportReport = {
      reportType: exportConfig.reportType as any,
      format: exportConfig.format as any,
      filters,
      includeCharts: exportConfig.includeCharts,
    };

    exportMutation.mutate(exportData);
    setShowExportDialog(false);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.roles?.length) count++;
    if (filters.genders?.length) count++;
    if (filters.countries?.length) count++;
    if (filters.isVerified !== undefined) count++;
    if (filters.accountStatus?.length) count++;
    return count;
  }, [filters]);

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (error) {
    return <AnalyticsErrorState error={error} />;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const formatNumber = (num: number | null | undefined) => {
    const safeNum = num ?? 0;
    if (safeNum >= 1000000) return `${(safeNum / 1000000).toFixed(1)}M`;
    if (safeNum >= 1000) return `${(safeNum / 1000).toFixed(1)}K`;
    return safeNum.toString();
  };

  const formatPercentage = (num: number | null | undefined) =>
    `${(num ?? 0).toFixed(1)}%`;

  const formatDuration = (minutes: number | null | undefined) => {
    const safeMinutes = minutes ?? 0;
    const hours = Math.floor(safeMinutes / 60);
    const mins = Math.floor(safeMinutes % 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  // Prepare chart data
  const userGrowthData = (analytics.userGrowth || []).map((item) => ({
    ...item,
    monthName: new Date(item.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
  }));

  const genderData = [
    {
      name: "Male",
      value: analytics.genderDistribution?.male || 0,
      color: COLORS.primary,
    },
    {
      name: "Female",
      value: analytics.genderDistribution?.female || 0,
      color: COLORS.pink,
    },
    {
      name: "Other",
      value: analytics.genderDistribution?.other || 0,
      color: COLORS.purple,
    },
    {
      name: "Not Specified",
      value: analytics.genderDistribution?.notSpecified || 0,
      color: COLORS.secondary,
    },
  ].filter((item) => item.value > 0);

  const roleData = [
    {
      name: "Students",
      value: analytics.roleDistribution?.students || 0,
      color: COLORS.primary,
    },
    {
      name: "Alumni",
      value: analytics.roleDistribution?.alumni || 0,
      color: COLORS.success,
    },
    {
      name: "Employers",
      value: analytics.roleDistribution?.employers || 0,
      color: COLORS.warning,
    },
    {
      name: "Professors",
      value: analytics.roleDistribution?.professors || 0,
      color: COLORS.purple,
    },
  ];

  const platformUsageData = (analytics.platformUsage || []).map(
    (item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
    })
  );

  const geographicData = (analytics.geographicData || []).slice(0, 6); // Top 6 countries

  const activityData = [
    {
      name: "Daily",
      value: analytics.activityMetrics?.dailyActiveUsers || 0,
      color: COLORS.primary,
    },
    {
      name: "Weekly",
      value: analytics.activityMetrics?.weeklyActiveUsers || 0,
      color: COLORS.success,
    },
    {
      name: "Monthly",
      value: analytics.activityMetrics?.monthlyActiveUsers || 0,
      color: COLORS.warning,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive platform analytics and insights
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={filters.timeRange}
            onValueChange={(value) => updateFilter("timeRange", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        value={filters.startDate || ""}
                        onChange={(e) =>
                          updateFilter("startDate", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        value={filters.endDate || ""}
                        onChange={(e) =>
                          updateFilter("endDate", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* User Roles */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">User Roles</Label>
                  <div className="space-y-2">
                    {USER_ROLES.map((role) => (
                      <div
                        key={role.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={role.value}
                          checked={filters.roles?.includes(role.value) || false}
                          onCheckedChange={(checked) => {
                            const currentRoles = filters.roles || [];
                            if (checked) {
                              updateFilter("roles", [
                                ...currentRoles,
                                role.value,
                              ]);
                            } else {
                              updateFilter(
                                "roles",
                                currentRoles.filter((r) => r !== role.value)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={role.value} className="text-sm">
                          {role.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gender</Label>
                  <div className="space-y-2">
                    {GENDERS.map((gender) => (
                      <div
                        key={gender.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={gender.value}
                          checked={
                            filters.genders?.includes(gender.value) || false
                          }
                          onCheckedChange={(checked) => {
                            const currentGenders = filters.genders || [];
                            if (checked) {
                              updateFilter("genders", [
                                ...currentGenders,
                                gender.value,
                              ]);
                            } else {
                              updateFilter(
                                "genders",
                                currentGenders.filter((g) => g !== gender.value)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={gender.value} className="text-sm">
                          {gender.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Verification Status
                  </Label>
                  <Select
                    value={
                      filters.isVerified === undefined
                        ? "all"
                        : filters.isVerified.toString()
                    }
                    onValueChange={(value) => {
                      if (value === "all") {
                        updateFilter("isVerified", undefined);
                      } else {
                        updateFilter("isVerified", value === "true");
                      }
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="true">Verified Only</SelectItem>
                      <SelectItem value="false">Unverified Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Account Status</Label>
                  <div className="space-y-2">
                    {ACCOUNT_STATUSES.map((status) => (
                      <div
                        key={status.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={status.value}
                          checked={
                            filters.accountStatus?.includes(status.value) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            const currentStatuses = filters.accountStatus || [];
                            if (checked) {
                              updateFilter("accountStatus", [
                                ...currentStatuses,
                                status.value,
                              ]);
                            } else {
                              updateFilter(
                                "accountStatus",
                                currentStatuses.filter(
                                  (s) => s !== status.value
                                )
                              );
                            }
                          }}
                        />
                        <Label htmlFor={status.value} className="text-sm">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showExportDialog} onOpenChange={setShowExportDialog}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Export Report</h4>
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Report Type</Label>
                  <Select
                    value={exportConfig.reportType}
                    onValueChange={(value) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        reportType: value as any,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Format */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Format</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPORT_FORMATS.map((format) => (
                      <Button
                        key={format.value}
                        variant={
                          exportConfig.format === format.value
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setExportConfig((prev) => ({
                            ...prev,
                            format: format.value as any,
                          }))
                        }
                        className="justify-start"
                      >
                        <format.icon className="h-4 w-4 mr-2" />
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Include Charts */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={exportConfig.includeCharts || false}
                    onCheckedChange={(checked) =>
                      setExportConfig((prev) => ({
                        ...prev,
                        includeCharts: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="includeCharts" className="text-sm">
                    Include charts and visualizations
                  </Label>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    onClick={handleExport}
                    disabled={exportMutation.isPending}
                    className="flex-1"
                  >
                    {exportMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowExportDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={formatNumber(analytics.overview.totalUsers || 0)}
          change={analytics.overview.userGrowthRate}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Active Users"
          value={formatNumber(analytics.overview.activeUsers || 0)}
          change={15.2}
          icon={Activity}
          color="green"
        />
        <KPICard
          title="Page Views"
          value={formatNumber(analytics.overview.pageViews || 0)}
          change={8.7}
          icon={Eye}
          color="purple"
        />
        <KPICard
          title="Engagement Rate"
          value={formatPercentage(
            analytics.activityMetrics.engagementRate || 0
          )}
          change={-2.1}
          icon={Target}
          color="orange"
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>
                  Monthly user registration and total user growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="monthName"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="newUsers"
                        fill={COLORS.primary}
                        name="New Users"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalUsers"
                        stroke={COLORS.success}
                        strokeWidth={3}
                        name="Total Users"
                        dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Platform Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Platform Usage
                </CardTitle>
                <CardDescription>
                  Feature adoption and usage statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformUsageData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis
                        type="category"
                        dataKey="feature"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value, name) => [
                          formatNumber(value as number),
                          "Usage Count",
                        ]}
                      />
                      <Bar
                        dataKey="usageCount"
                        fill={COLORS.secondary}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  User Activity
                </CardTitle>
                <CardDescription>
                  Daily, weekly, and monthly active users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [
                          formatNumber(value as number),
                          "Active Users",
                        ]}
                      />
                      <Bar
                        dataKey="value"
                        fill={COLORS.success}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Growth Rate Analysis</CardTitle>
                <CardDescription>
                  Month-over-month growth rate trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient
                          id="growthGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={COLORS.success}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={COLORS.success}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="monthName"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Growth Rate"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="growthRate"
                        stroke={COLORS.success}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#growthGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      User Growth Rate
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      +{analytics.overview.userGrowthRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Retention Rate
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {analytics.overview.retentionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Bounce Rate
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      {analytics.overview.bounceRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg. Session
                    </span>
                    <span className="text-sm font-medium">
                      {formatDuration(
                        analytics.overview.averageSessionDuration
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Role Distribution
                </CardTitle>
                <CardDescription>
                  User distribution by role type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [
                          formatNumber(value as number),
                          "Users",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink-600" />
                  Gender Distribution
                </CardTitle>
                <CardDescription>User distribution by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [
                          formatNumber(value as number),
                          "Users",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Adoption Rates</CardTitle>
                <CardDescription>
                  Percentage of users who have used each feature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformUsageData.map((feature, index) => (
                    <div key={feature.feature} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{feature.feature}</span>
                        <span className="font-medium">
                          {formatPercentage(feature.adoptionRate)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${feature.adoptionRate}%`,
                            backgroundColor: feature.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
                <CardDescription>
                  User session and engagement analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(analytics.overview.totalSessions)}
                      </div>
                      <div className="text-sm text-blue-600">
                        Total Sessions
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatDuration(
                          analytics.activityMetrics.averageSessionDuration
                        )}
                      </div>
                      <div className="text-sm text-green-600">Avg. Session</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Engagement Rate
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {formatPercentage(
                          analytics.activityMetrics.engagementRate
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Daily Active Users
                      </span>
                      <span className="text-sm font-medium">
                        {formatNumber(
                          analytics.activityMetrics.dailyActiveUsers
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Weekly Active Users
                      </span>
                      <span className="text-sm font-medium">
                        {formatNumber(
                          analytics.activityMetrics.weeklyActiveUsers
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Monthly Active Users
                      </span>
                      <span className="text-sm font-medium">
                        {formatNumber(
                          analytics.activityMetrics.monthlyActiveUsers
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>User distribution by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="countryCode"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value, name, props) => [
                          formatNumber(value as number),
                          props.payload.country,
                        ]}
                      />
                      <Bar
                        dataKey="userCount"
                        fill={COLORS.primary}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Countries with the most users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geographicData.slice(0, 8).map((country, index) => (
                    <div
                      key={country.countryCode}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatNumber(country.userCount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage(country.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  change: number | null | undefined;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "orange";
}

function KPICard({ title, value, change, icon: Icon, color }: KPICardProps) {
  // Handle null/undefined change values
  const safeChange = change ?? 0;
  const isPositive = safeChange >= 0;

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {safeChange.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton Component
function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Error State Component
function AnalyticsErrorState({ error }: { error: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="text-red-500">
        <BarChart3 className="w-16 h-16" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Failed to load analytics data
        </h3>
        <p className="text-gray-500 mt-2">
          {error?.message || "An error occurred while fetching analytics data"}
        </p>
      </div>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="mt-4"
      >
        Try Again
      </Button>
    </div>
  );
}
