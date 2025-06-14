"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Database,
  Mail,
  Bell,
  Globe,
  Key,
  Server,
  Settings,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    userRegistration: true,
    autoApproval: false,
    maintenanceMode: false,
    analyticsTracking: true,
    backupEnabled: true,
  });

  const systemStatus = [
    {
      service: "Web Server",
      status: "online",
      uptime: "99.9%",
      lastCheck: "2 min ago",
    },
    {
      service: "Database",
      status: "online",
      uptime: "99.8%",
      lastCheck: "1 min ago",
    },
    {
      service: "Email Service",
      status: "online",
      uptime: "99.7%",
      lastCheck: "3 min ago",
    },
    {
      service: "File Storage",
      status: "warning",
      uptime: "98.5%",
      lastCheck: "5 min ago",
    },
    {
      service: "Analytics",
      status: "online",
      uptime: "99.9%",
      lastCheck: "1 min ago",
    },
  ];

  const recentBackups = [
    {
      date: "2024-03-08 02:00",
      size: "2.3 GB",
      status: "completed",
      type: "Full Backup",
    },
    {
      date: "2024-03-07 02:00",
      size: "2.1 GB",
      status: "completed",
      type: "Full Backup",
    },
    {
      date: "2024-03-06 14:30",
      size: "450 MB",
      status: "completed",
      type: "Incremental",
    },
    {
      date: "2024-03-06 02:00",
      size: "2.0 GB",
      status: "completed",
      type: "Full Backup",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "offline":
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure platform settings and monitor system health
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Configuration
              </CardTitle>
              <CardDescription>
                Basic platform settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="Career Bridge AI" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformUrl">Platform URL</Label>
                  <Input
                    id="platformUrl"
                    defaultValue="https://careerbridge.ai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    defaultValue="support@careerbridge.ai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Max Users</Label>
                  <Input id="maxUsers" type="number" defaultValue="10000" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">User Registration</h4>
                    <p className="text-sm text-gray-600">
                      Allow new users to register accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, userRegistration: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-Approval</h4>
                    <p className="text-sm text-gray-600">
                      Automatically approve new user registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproval}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, autoApproval: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-gray-600">
                      Put the platform in maintenance mode
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, maintenanceMode: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    defaultValue="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">
                    Lockout Duration (minutes)
                  </Label>
                  <Input id="lockoutDuration" type="number" defaultValue="15" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Password Requirements</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requireUppercase"
                      defaultChecked
                    />
                    <Label htmlFor="requireUppercase">
                      Require uppercase letters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requireLowercase"
                      defaultChecked
                    />
                    <Label htmlFor="requireLowercase">
                      Require lowercase letters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="requireNumbers" defaultChecked />
                    <Label htmlFor="requireNumbers">Require numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="requireSpecial" />
                    <Label htmlFor="requireSpecial">
                      Require special characters
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys & Integrations
              </CardTitle>
              <CardDescription>
                Manage external service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailApiKey">Email Service API Key</Label>
                <Input
                  id="emailApiKey"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analyticsKey">Analytics Tracking ID</Label>
                <Input id="analyticsKey" placeholder="GA-XXXXXXXXX-X" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storageKey">File Storage API Key</Label>
                <Input
                  id="storageKey"
                  type="password"
                  placeholder="••••••••••••••••"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Send email notifications to users
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Alerts</h4>
                    <p className="text-sm text-gray-600">
                      Receive alerts for system issues
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">User Activity Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Notify admins of user activities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Email Templates</h4>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Welcome Email Template
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Password Reset Template
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Job Alert Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health Monitor
              </CardTitle>
              <CardDescription>
                Monitor system services and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium">{service.service}</h4>
                        <p className="text-sm text-gray-600">
                          Uptime: {service.uptime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(service.status)}
                      <p className="text-xs text-gray-500 mt-1">
                        Last check: {service.lastCheck}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Server Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Size</span>
                  <span className="text-sm font-medium">2.3 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="text-sm font-medium">45/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Query Performance</span>
                  <span className="text-sm font-medium">12ms avg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Bandwidth Usage</span>
                  <span className="text-sm font-medium">234 MB/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Sessions</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Response Time</span>
                  <span className="text-sm font-medium">245ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Recovery
              </CardTitle>
              <CardDescription>
                Manage system backups and recovery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Backups</h4>
                  <p className="text-sm text-gray-600">
                    Enable scheduled automatic backups
                  </p>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, backupEnabled: checked })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">
                    Retention Period (days)
                  </Label>
                  <Input id="retentionPeriod" type="number" defaultValue="30" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Create Backup Now</Button>
                <Button variant="outline">Test Recovery</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
              <CardDescription>
                View and manage recent backup files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBackups.map((backup, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{backup.type}</h4>
                      <p className="text-sm text-gray-600">{backup.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 mb-1">
                        {backup.status}
                      </Badge>
                      <p className="text-sm text-gray-600">{backup.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
