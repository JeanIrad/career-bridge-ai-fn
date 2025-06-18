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
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Activity,
  Users,
  Globe,
} from "lucide-react";

export function AdminSecurity() {
  const securityAlerts = [
    {
      type: "Failed Login Attempts",
      description: "Multiple failed login attempts from IP 192.168.1.100",
      severity: "high",
      time: "5 minutes ago",
      status: "Active",
    },
    {
      type: "Suspicious Activity",
      description: "Unusual data access pattern detected",
      severity: "medium",
      time: "1 hour ago",
      status: "Investigating",
    },
    {
      type: "Password Policy Violation",
      description: "User attempted to set weak password",
      severity: "low",
      time: "2 hours ago",
      status: "Resolved",
    },
  ];

  const securityMetrics = [
    { label: "Active Sessions", value: "1,856", icon: Activity },
    { label: "Failed Logins (24h)", value: "23", icon: Lock },
    { label: "Blocked IPs", value: "12", icon: Shield },
    { label: "Security Scans", value: "4", icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security & Compliance</h1>
          <p className="text-muted-foreground">
            Monitor security threats and maintain platform compliance
          </p>
        </div>
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Recent security events requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityAlerts.map((alert, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{alert.time}</span>
                    <Badge variant="outline">{alert.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Tools
            </CardTitle>
            <CardDescription>
              Security management and monitoring tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              User Access Review
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="w-4 h-4 mr-2" />
              IP Whitelist Management
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Security Policy Update
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Audit Log Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
