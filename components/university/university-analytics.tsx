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
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  Download,
  Filter,
  GraduationCap,
  Building2,
} from "lucide-react";

export function UniversityAnalytics() {
  const analyticsData = [
    { label: "Student Engagement", value: "89%", change: "+5.2%", trend: "up" },
    { label: "Job Placement Rate", value: "94%", change: "+3.1%", trend: "up" },
    {
      label: "Industry Partnerships",
      value: "127",
      change: "+12",
      trend: "up",
    },
    {
      label: "Alumni Participation",
      value: "76%",
      change: "+8.3%",
      trend: "up",
    },
  ];

  const departmentPerformance = [
    {
      department: "Computer Science",
      students: 856,
      placement: 89,
      satisfaction: 4.8,
    },
    {
      department: "Engineering",
      students: 634,
      placement: 85,
      satisfaction: 4.6,
    },
    {
      department: "Business Administration",
      students: 523,
      placement: 82,
      satisfaction: 4.5,
    },
    {
      department: "Data Science",
      students: 398,
      placement: 91,
      satisfaction: 4.9,
    },
  ];

  const partnerPerformance = [
    { company: "Google", hires: 34, satisfaction: 4.9, events: 8 },
    { company: "Microsoft", hires: 28, satisfaction: 4.8, events: 6 },
    { company: "Apple", hires: 22, satisfaction: 4.7, events: 4 },
    { company: "Amazon", hires: 31, satisfaction: 4.6, events: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for university performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs text-emerald-600">{metric.change}</p>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Department Performance
            </CardTitle>
            <CardDescription>
              Academic department metrics and outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{dept.department}</h3>
                    <Badge variant="secondary">
                      {dept.placement}% Placement
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Students:</span>
                      <p className="font-semibold">{dept.students}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Placement Rate:
                      </span>
                      <p className="font-semibold">{dept.placement}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Satisfaction:
                      </span>
                      <p className="font-semibold">{dept.satisfaction}/5.0</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partner Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Industry Partner Performance
            </CardTitle>
            <CardDescription>
              Top performing industry partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnerPerformance.map((partner, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{partner.company}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {partner.satisfaction}
                      </span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hires:</span>
                      <p className="font-semibold">{partner.hires}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Events:</span>
                      <p className="font-semibold">{partner.events}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <p className="font-semibold">
                        {partner.satisfaction}/5.0
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement Trends</CardTitle>
            <CardDescription>
              Monthly student activity and engagement patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              [Chart Placeholder - Student Engagement Over Time]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placement Success Rate</CardTitle>
            <CardDescription>
              Job placement trends by department and semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              [Chart Placeholder - Placement Rate Trends]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
