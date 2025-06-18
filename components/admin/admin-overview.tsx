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
  Users,
  Activity,
  TrendingUp,
  Database,
  Shield,
  AlertTriangle,
  UserCheck,
  Building2,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

export function AdminOverview() {
  const platformStats = [
    {
      label: "Total Users",
      value: "25,487",
      change: "+1,247 this month",
      icon: Users,
    },
    {
      label: "Active Sessions",
      value: "1,856",
      change: "+156 vs yesterday",
      icon: Activity,
    },
    {
      label: "Platform Uptime",
      value: "99.9%",
      change: "Last 30 days",
      icon: TrendingUp,
    },
    {
      label: "Data Storage",
      value: "847 GB",
      change: "+45 GB this month",
      icon: Database,
    },
  ];

  const userBreakdown = [
    {
      type: "Students/Alumni",
      count: 18567,
      percentage: 73,
      color: "bg-blue-500",
    },
    { type: "Employers", count: 4521, percentage: 18, color: "bg-emerald-500" },
    {
      type: "University Staff",
      count: 1876,
      percentage: 7,
      color: "bg-orange-500",
    },
    { type: "Admins", count: 523, percentage: 2, color: "bg-purple-500" },
  ];

  const recentActivities = [
    {
      type: "User Registration",
      description: "47 new users registered in the last hour",
      time: "5 minutes ago",
      severity: "info",
    },
    {
      type: "Security Alert",
      description: "Failed login attempts from suspicious IP",
      time: "15 minutes ago",
      severity: "warning",
    },
    {
      type: "System Update",
      description: "Database maintenance completed successfully",
      time: "2 hours ago",
      severity: "success",
    },
    {
      type: "Content Report",
      description: "Job posting flagged for review",
      time: "3 hours ago",
      severity: "warning",
    },
  ];

  const systemHealth = [
    {
      service: "API Gateway",
      status: "Healthy",
      uptime: "99.98%",
      response: "45ms",
    },
    {
      service: "Database",
      status: "Healthy",
      uptime: "99.95%",
      response: "12ms",
    },
    {
      service: "Chat Service",
      status: "Warning",
      uptime: "98.2%",
      response: "150ms",
    },
    {
      service: "File Storage",
      status: "Healthy",
      uptime: "99.99%",
      response: "8ms",
    },
  ];

  const pendingActions = [
    {
      title: "Content Moderation Queue",
      count: 15,
      description: "Posts and messages awaiting review",
      action: "Review Now",
      priority: "high",
    },
    {
      title: "User Verification Requests",
      count: 28,
      description: "University staff and employers pending verification",
      action: "Process",
      priority: "medium",
    },
    {
      title: "System Updates",
      count: 3,
      description: "Security patches ready for deployment",
      action: "Schedule",
      priority: "high",
    },
    {
      title: "Data Backup",
      count: 1,
      description: "Weekly backup completion pending",
      action: "Initiate",
      priority: "low",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            System Administrator Panel 🛡️
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Platform running smoothly with 25,487 active users. 3 alerts require
            attention.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              View Alerts
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              System Health
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <Shield className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-emerald-600">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Distribution
              </CardTitle>
              <CardDescription>Platform user breakdown by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBreakdown.map((user, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{user.type}</span>
                      <span>
                        {user.count.toLocaleString()} ({user.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${user.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${user.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent System Activity
              </CardTitle>
              <CardDescription>
                Real-time platform events and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.severity === "warning"
                          ? "bg-yellow-500"
                          : activity.severity === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {activity.type}
                        </span>
                        <Badge
                          variant={
                            activity.severity === "warning"
                              ? "destructive"
                              : activity.severity === "success"
                                ? "secondary"
                                : "default"
                          }
                          className="text-xs"
                        >
                          {activity.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Activities
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Actions</CardTitle>
              <CardDescription>
                Items requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.map((action, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{action.title}</span>
                    <Badge
                      variant={
                        action.priority === "high"
                          ? "destructive"
                          : action.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {action.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {action.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    {action.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Approve Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Scan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Backup Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Content Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Monitoring
          </CardTitle>
          <CardDescription>
            Real-time status of critical platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      service.status === "Healthy"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="font-medium">{service.service}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        service.status === "Healthy"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response:</span>
                    <span className="font-medium">{service.response}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
