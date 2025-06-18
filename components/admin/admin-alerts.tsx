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
import {
  AlertTriangle,
  Bell,
  Activity,
  Server,
  Database,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function AdminAlerts() {
  const systemAlerts = [
    {
      id: 1,
      type: "System Performance",
      title: "High CPU Usage Detected",
      description: "Server CPU usage has exceeded 85% for the past 10 minutes",
      severity: "High",
      status: "Active",
      timestamp: "5 minutes ago",
      icon: Server,
    },
    {
      id: 2,
      type: "Security",
      title: "Multiple Failed Login Attempts",
      description: "Unusual login activity detected from multiple IP addresses",
      severity: "Critical",
      status: "Active",
      timestamp: "15 minutes ago",
      icon: Shield,
    },
    {
      id: 3,
      type: "Database",
      title: "Database Connection Pool Warning",
      description: "Connection pool utilization at 90%",
      severity: "Medium",
      status: "Monitoring",
      timestamp: "1 hour ago",
      icon: Database,
    },
  ];

  const alertStats = [
    { label: "Active Alerts", value: "3", icon: AlertTriangle },
    { label: "Resolved Today", value: "12", icon: CheckCircle },
    { label: "System Health", value: "98.5%", icon: Activity },
    { label: "Notifications Sent", value: "47", icon: Bell },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Monitoring</h1>
          <p className="text-muted-foreground">
            System alerts and monitoring dashboard
          </p>
        </div>
        <Button>
          <Bell className="w-4 h-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alertStats.map((stat, index) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active System Alerts
          </CardTitle>
          <CardDescription>
            Critical system alerts requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.severity === "Critical"
                        ? "bg-red-100 text-red-600"
                        : alert.severity === "High"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge
                        variant={
                          alert.severity === "Critical"
                            ? "destructive"
                            : alert.severity === "High"
                              ? "destructive"
                              : "default"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline">{alert.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {alert.type} • {alert.timestamp}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
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
