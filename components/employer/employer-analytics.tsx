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
  Eye,
  Download,
  Calendar,
  Target,
  Award,
} from "lucide-react";

export function EmployerAnalytics() {
  const analyticsData = [
    { label: "Job Views", value: "1,546", change: "+23%", trend: "up" },
    { label: "Applications", value: "324", change: "+18%", trend: "up" },
    { label: "Conversion Rate", value: "21%", change: "+5%", trend: "up" },
    { label: "Time to Hire", value: "18 days", change: "-3 days", trend: "up" },
  ];

  const topPerformingJobs = [
    {
      title: "Software Engineering Intern",
      applications: 78,
      views: 456,
      conversion: 17.1,
    },
    {
      title: "Data Science Graduate",
      applications: 92,
      views: 623,
      conversion: 14.8,
    },
    {
      title: "Product Marketing Intern",
      applications: 45,
      views: 289,
      conversion: 15.6,
    },
    {
      title: "UX Design Co-op",
      applications: 34,
      views: 178,
      conversion: 19.1,
    },
  ];

  const universityPartners = [
    {
      name: "Stanford University",
      applications: 89,
      hires: 12,
      satisfaction: 4.8,
    },
    { name: "UC Berkeley", applications: 76, hires: 9, satisfaction: 4.6 },
    { name: "MIT", applications: 54, hires: 8, satisfaction: 4.9 },
    { name: "Caltech", applications: 43, hires: 6, satisfaction: 4.7 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your recruitment performance and insights
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
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
        {/* Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Performing Job Postings
            </CardTitle>
            <CardDescription>
              Job postings with highest engagement and conversion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingJobs.map((job, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{job.title}</h3>
                    <Badge variant="secondary">
                      {job.conversion}% conversion
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Views:</span>
                      <p className="font-semibold">{job.views}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Applications:
                      </span>
                      <p className="font-semibold">{job.applications}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Conversion:</span>
                      <p className="font-semibold">{job.conversion}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* University Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              University Partner Performance
            </CardTitle>
            <CardDescription>
              Performance metrics by university partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {universityPartners.map((university, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{university.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {university.satisfaction}
                      </span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Applications:
                      </span>
                      <p className="font-semibold">{university.applications}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hires:</span>
                      <p className="font-semibold">{university.hires}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Success Rate:
                      </span>
                      <p className="font-semibold">
                        {Math.round(
                          (university.hires / university.applications) * 100
                        )}
                        %
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
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>
              Monthly application volume and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              [Chart Placeholder - Application Trends Over Time]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>
              Candidate progression through hiring stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              [Chart Placeholder - Hiring Funnel Visualization]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
