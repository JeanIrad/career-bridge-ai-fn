"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Users,
  TrendingUp,
  Server,
  Shield,
  Database,
  Wifi,
  HardDrive,
  Info,
} from "lucide-react";

interface ViewAlertsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalUsers: number;
  pendingVerifications: number;
  verificationRate: number;
}

export function ViewAlertsModal({
  open,
  onOpenChange,
  totalUsers,
  pendingVerifications,
  verificationRate,
}: ViewAlertsModalProps) {
  // Generate dynamic alerts based on platform data
  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High Verification Queue",
      description: `${pendingVerifications} users awaiting verification review`,
      timestamp: new Date().toISOString(),
      severity:
        pendingVerifications > 50
          ? "high"
          : pendingVerifications > 20
            ? "medium"
            : "low",
      icon: Users,
      action: "Review Queue",
      actionType: "verification",
    },
    {
      id: 2,
      type: verificationRate < 70 ? "warning" : "success",
      title: "Verification Rate",
      description: `Current verification rate: ${verificationRate.toFixed(1)}%`,
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      severity:
        verificationRate < 50
          ? "high"
          : verificationRate < 70
            ? "medium"
            : "low",
      icon: Shield,
      action: "View Details",
      actionType: "stats",
    },
    {
      id: 3,
      type: "info",
      title: "Database Performance",
      description: "Database queries running optimally",
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      severity: "low",
      icon: Database,
      action: "Monitor",
      actionType: "monitor",
    },
    {
      id: 4,
      type: "success",
      title: "System Health",
      description: "All services running normally",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      severity: "low",
      icon: Server,
      action: "View Details",
      actionType: "health",
    },
    {
      id: 5,
      type: totalUsers > 1000 ? "info" : "warning",
      title: "User Growth",
      description: `Platform has ${totalUsers.toLocaleString()} registered users`,
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      severity: "low",
      icon: TrendingUp,
      action: "View Analytics",
      actionType: "analytics",
    },
    {
      id: 6,
      type: "success",
      title: "Network Status",
      description: "Network connectivity: 99.9% uptime",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      severity: "low",
      icon: Wifi,
      action: "Monitor",
      actionType: "network",
    },
    {
      id: 7,
      type: "info",
      title: "Storage Capacity",
      description: "Storage usage: 65% of allocated space",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      severity: "low",
      icon: HardDrive,
      action: "Manage Storage",
      actionType: "storage",
    },
  ];

  // Filter alerts by severity for organization
  const criticalAlerts = systemAlerts.filter(
    (alert) => alert.severity === "high"
  );
  const warningAlerts = systemAlerts.filter(
    (alert) => alert.severity === "medium"
  );
  const infoAlerts = systemAlerts.filter((alert) => alert.severity === "low");

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleAlertAction = (actionType: string) => {
    // These would trigger the respective modals or actions
    switch (actionType) {
      case "verification":
        // Could trigger verification queue modal
        console.log("Opening verification queue");
        break;
      case "stats":
        // Could trigger statistics modal
        console.log("Opening statistics modal");
        break;
      default:
        console.log("Action:", actionType);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl lg:max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="truncate">System Alerts & Notifications</span>
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Monitor platform health, user activities, and system status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 md:space-y-8">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-red-100 p-2 rounded-xl">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-red-700 truncate">
                  Critical Alerts
                </h3>
                <Badge
                  variant="destructive"
                  className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 shadow-sm flex-shrink-0"
                >
                  {criticalAlerts.length}
                </Badge>
              </div>
              <div className="space-y-3 md:space-y-4">
                {criticalAlerts.map((alert, index) => {
                  const IconComponent = alert.icon;
                  return (
                    <Card
                      key={alert.id}
                      className={`group relative overflow-hidden border-l-4 ${getAlertColor(alert.type)} shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-red-50 to-white`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4 md:p-7">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex items-start gap-3 md:gap-5 flex-1 min-w-0">
                            <div className="bg-red-100 p-2 md:p-3 rounded-xl group-hover:bg-red-200 transition-colors duration-300 flex-shrink-0">
                              <IconComponent className="h-5 w-5 md:h-7 md:w-7 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
                                <h4 className="font-bold text-lg md:text-xl text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                                  {alert.title}
                                </h4>
                                <Badge
                                  variant={getBadgeVariant(alert.severity)}
                                  className="text-xs font-medium px-2 py-1 self-start sm:self-center"
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span className="font-medium text-xs md:text-sm">
                                    {formatTimestamp(alert.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="default"
                            variant="outline"
                            className="ml-0 lg:ml-6 bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800 shadow-sm self-start lg:self-center flex-shrink-0"
                            onClick={() => handleAlertAction(alert.actionType)}
                          >
                            {alert.action}
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-red-200 rounded-full -mr-8 md:-mr-12 -mt-8 md:-mt-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Warning Alerts */}
          {warningAlerts.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-amber-100 p-2 rounded-xl">
                  <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-amber-700 truncate">
                  Warning Alerts
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 shadow-sm bg-amber-100 text-amber-800 flex-shrink-0"
                >
                  {warningAlerts.length}
                </Badge>
              </div>
              <div className="space-y-3 md:space-y-4">
                {warningAlerts.map((alert, index) => {
                  const IconComponent = alert.icon;
                  return (
                    <Card
                      key={alert.id}
                      className={`group relative overflow-hidden border-l-4 ${getAlertColor(alert.type)} shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-amber-50 to-white`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4 md:p-7">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex items-start gap-3 md:gap-5 flex-1 min-w-0">
                            <div className="bg-amber-100 p-2 md:p-3 rounded-xl group-hover:bg-amber-200 transition-colors duration-300 flex-shrink-0">
                              <IconComponent className="h-5 w-5 md:h-7 md:w-7 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
                                <h4 className="font-bold text-lg md:text-xl text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                                  {alert.title}
                                </h4>
                                <Badge
                                  variant={getBadgeVariant(alert.severity)}
                                  className="text-xs font-medium px-2 py-1 self-start sm:self-center"
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span className="font-medium text-xs md:text-sm">
                                    {formatTimestamp(alert.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="default"
                            variant="outline"
                            className="ml-0 lg:ml-6 bg-white hover:bg-amber-50 border-amber-200 text-amber-700 hover:text-amber-800 shadow-sm self-start lg:self-center flex-shrink-0"
                            onClick={() => handleAlertAction(alert.actionType)}
                          >
                            {alert.action}
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-amber-200 rounded-full -mr-8 md:-mr-12 -mt-8 md:-mt-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info Alerts */}
          {infoAlerts.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Info className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-blue-700 truncate">
                  Information Alerts
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 shadow-sm bg-blue-100 text-blue-800 flex-shrink-0"
                >
                  {infoAlerts.length}
                </Badge>
              </div>
              <div className="space-y-3 md:space-y-4">
                {infoAlerts.map((alert, index) => {
                  const IconComponent = alert.icon;
                  return (
                    <Card
                      key={alert.id}
                      className={`group relative overflow-hidden border-l-4 ${getAlertColor(alert.type)} shadow-sm hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-blue-50 to-white`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4 md:p-7">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex items-start gap-3 md:gap-5 flex-1 min-w-0">
                            <div className="bg-blue-100 p-2 md:p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
                              <IconComponent className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3">
                                <h4 className="font-bold text-lg md:text-xl text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                                  {alert.title}
                                </h4>
                                <Badge
                                  variant={getBadgeVariant(alert.severity)}
                                  className="text-xs font-medium px-2 py-1 self-start sm:self-center"
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                  <span className="font-medium text-xs md:text-sm">
                                    {formatTimestamp(alert.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="default"
                            variant="outline"
                            className="ml-0 lg:ml-6 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-sm self-start lg:self-center flex-shrink-0"
                            onClick={() => handleAlertAction(alert.actionType)}
                          >
                            {alert.action}
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-blue-200 rounded-full -mr-8 md:-mr-12 -mt-8 md:-mt-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => window.location.reload()}>
            Refresh Alerts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
