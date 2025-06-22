'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  Users,
  Activity,
  Target,
} from 'lucide-react';
import {
  ModerationStats,
  getViolationTypeLabel,
  getContentTypeLabel,
} from '@/lib/actions/content-moderation';

interface ModerationAnalyticsTabProps {
  stats: ModerationStats | undefined;
  isLoading: boolean;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#ff0000',
  '#00ffff',
  '#ff00ff',
  '#ffff00',
  '#0000ff',
];

export function ModerationAnalyticsTab({
  stats,
  isLoading,
}: ModerationAnalyticsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          No analytics data available
        </h3>
        <p className="text-muted-foreground">
          Analytics data will appear here once moderation requests are
          processed.
        </p>
      </div>
    );
  }

  const approvalRate =
    stats.totalRequests > 0
      ? (
          ((stats.approvedRequests + stats.autoModeratedRequests) /
            stats.totalRequests) *
          100
        ).toFixed(1)
      : '0';

  const rejectionRate =
    stats.totalRequests > 0
      ? ((stats.rejectedRequests / stats.totalRequests) * 100).toFixed(1)
      : '0';

  const autoModerationRate =
    stats.totalRequests > 0
      ? ((stats.autoModeratedRequests / stats.totalRequests) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalRequests.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Resolution
                </p>
                <p className="text-2xl font-bold">
                  {stats.averageResolutionTime}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Approval Rate
                </p>
                <p className="text-2xl font-bold">{approvalRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Auto-Moderated
                </p>
                <p className="text-2xl font-bold">{autoModerationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-bold">{stats.approvedRequests}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold">{stats.rejectedRequests}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-xl font-bold">{stats.flaggedRequests}</p>
              </div>
              <Flag className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Moderated</p>
                <p className="text-xl font-bold">
                  {stats.autoModeratedRequests}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Violation Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Top Violation Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topViolationTypes.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topViolationTypes.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="type"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                      tickFormatter={(value) => getViolationTypeLabel(value)}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, 'Count']}
                      labelFormatter={(label) => getViolationTypeLabel(label)}
                    />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {stats.topViolationTypes
                    .slice(0, 5)
                    .map((violation, index) => (
                      <div
                        key={violation.type}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm">
                            {getViolationTypeLabel(violation.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {violation.count}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {violation.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No violation data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Content Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.contentTypeBreakdown.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.contentTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) =>
                        `${getContentTypeLabel(type)}: ${percentage.toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.contentTypeBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, 'Count']}
                      labelFormatter={(label) => getContentTypeLabel(label)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {stats.contentTypeBreakdown.map((content, index) => (
                    <div
                      key={content.type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm">
                          {getContentTypeLabel(content.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {content.count}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {content.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No content type data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderator Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Moderator Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.moderatorPerformance.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.moderatorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="moderatorName"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="requestsHandled"
                      fill="#3b82f6"
                      name="Requests Handled"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="averageResolutionTime"
                      fill="#10b981"
                      name="Avg Resolution (min)"
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Moderator</th>
                        <th className="text-right p-2">Requests Handled</th>
                        <th className="text-right p-2">Avg Resolution Time</th>
                        <th className="text-right p-2">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.moderatorPerformance.map((moderator) => {
                        const efficiency =
                          moderator.requestsHandled /
                          (moderator.averageResolutionTime || 1);
                        const performanceLevel =
                          efficiency > 2
                            ? 'excellent'
                            : efficiency > 1
                              ? 'good'
                              : 'needs-improvement';

                        return (
                          <tr key={moderator.moderatorId} className="border-b">
                            <td className="p-2 font-medium">
                              {moderator.moderatorName}
                            </td>
                            <td className="p-2 text-right">
                              {moderator.requestsHandled}
                            </td>
                            <td className="p-2 text-right">
                              {moderator.averageResolutionTime}m
                            </td>
                            <td className="p-2 text-right">
                              <Badge
                                variant={
                                  performanceLevel === 'excellent'
                                    ? 'default'
                                    : performanceLevel === 'good'
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className={
                                  performanceLevel === 'excellent'
                                    ? 'bg-green-100 text-green-800'
                                    : performanceLevel === 'good'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {performanceLevel === 'excellent'
                                  ? 'Excellent'
                                  : performanceLevel === 'good'
                                    ? 'Good'
                                    : 'Needs Improvement'}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No moderator performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Efficiency</span>
              </div>
              <p className="text-sm text-blue-800">
                {autoModerationRate}% of requests are handled automatically,
                reducing manual workload.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Quality</span>
              </div>
              <p className="text-sm text-green-800">
                {approvalRate}% approval rate indicates good content quality on
                the platform.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">
                  Response Time
                </span>
              </div>
              <p className="text-sm text-orange-800">
                Average resolution time of {stats.averageResolutionTime} minutes
                ensures quick response.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
