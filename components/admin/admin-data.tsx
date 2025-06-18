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
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Archive,
  Trash2,
  FileText,
} from "lucide-react";

export function AdminData() {
  const dataStats = [
    {
      label: "Total Storage Used",
      value: "847 GB",
      usage: 68,
      icon: HardDrive,
    },
    { label: "Database Size", value: "234 GB", usage: 45, icon: Database },
    { label: "File Storage", value: "613 GB", usage: 82, icon: Archive },
    { label: "Backup Size", value: "156 GB", usage: 25, icon: Download },
  ];

  const backupHistory = [
    {
      date: "2024-03-15",
      type: "Full Backup",
      size: "156 GB",
      status: "Completed",
      duration: "2h 34m",
    },
    {
      date: "2024-03-14",
      type: "Incremental",
      size: "12 GB",
      status: "Completed",
      duration: "23m",
    },
    {
      date: "2024-03-13",
      type: "Incremental",
      size: "8 GB",
      status: "Completed",
      duration: "18m",
    },
    {
      date: "2024-03-12",
      type: "Incremental",
      size: "15 GB",
      status: "Completed",
      duration: "28m",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">
            Manage platform data, backups, and storage
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{stat.usage}%</span>
                </div>
                <Progress value={stat.usage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Backup History
            </CardTitle>
            <CardDescription>
              Recent backup operations and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backupHistory.map((backup, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{backup.type}</span>
                      <Badge variant="secondary">{backup.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {backup.date} • {backup.size} • {backup.duration}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Operations
            </CardTitle>
            <CardDescription>
              Database and data management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Database Stats
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Export User Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Archive className="w-4 h-4 mr-2" />
              Archive Old Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cleanup Temporary Files
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
