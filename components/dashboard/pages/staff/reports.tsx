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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  BarChart3,
  PieChart,
  Filter,
  Plus,
  Eye,
  Share2,
} from "lucide-react";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedReport, setSelectedReport] = useState("");

  const reportTemplates = [
    {
      id: 1,
      name: "Student Engagement Report",
      description: "Track student participation in career services and events",
      category: "Student Analytics",
      frequency: "Monthly",
      lastGenerated: "2024-03-01",
      status: "active",
    },
    {
      id: 2,
      name: "Job Placement Report",
      description: "Monitor graduate employment rates and career outcomes",
      category: "Placement Analytics",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      status: "active",
    },
    {
      id: 3,
      name: "Event Performance Report",
      description: "Analyze attendance and feedback for career events",
      category: "Event Analytics",
      frequency: "Weekly",
      lastGenerated: "2024-03-04",
      status: "active",
    },
    {
      id: 4,
      name: "Alumni Network Report",
      description: "Track alumni engagement and mentorship activities",
      category: "Alumni Analytics",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      status: "active",
    },
    {
      id: 5,
      name: "Employer Partnership Report",
      description: "Monitor relationships with recruiting companies",
      category: "Employer Analytics",
      frequency: "Monthly",
      lastGenerated: "2024-03-01",
      status: "draft",
    },
  ];

  const recentReports = [
    {
      id: 1,
      title: "March 2024 Student Engagement",
      type: "Student Analytics",
      generatedDate: "2024-03-08",
      generatedBy: "Emily Rodriguez",
      size: "2.3 MB",
      downloads: 12,
    },
    {
      id: 2,
      title: "Q1 2024 Job Placement Summary",
      type: "Placement Analytics",
      generatedDate: "2024-03-05",
      generatedBy: "Career Services Team",
      size: "1.8 MB",
      downloads: 25,
    },
    {
      id: 3,
      title: "February Event Performance",
      type: "Event Analytics",
      generatedDate: "2024-03-01",
      generatedBy: "Event Management",
      size: "3.1 MB",
      downloads: 8,
    },
  ];

  const keyMetrics = [
    {
      label: "Total Students Served",
      value: "2,847",
      change: "+12%",
      icon: Users,
    },
    { label: "Job Placements", value: "234", change: "+18%", icon: Briefcase },
    { label: "Events Conducted", value: "45", change: "+8%", icon: Calendar },
    {
      label: "Alumni Engaged",
      value: "567",
      change: "+15%",
      icon: GraduationCap,
    },
  ];

  const chartData = {
    studentEngagement: [
      { month: "Jan", counseling: 45, events: 120, resources: 89 },
      { month: "Feb", counseling: 52, events: 135, resources: 95 },
      { month: "Mar", counseling: 48, events: 142, resources: 103 },
    ],
    placementRates: [
      { field: "Engineering", rate: 92, count: 156 },
      { field: "Business", rate: 87, count: 134 },
      { field: "Design", rate: 84, count: 89 },
      { field: "Marketing", rate: 79, count: 67 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Generate insights and track performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share Dashboard
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> from
                  last period
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="period">Time Period:</Label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts and Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Student Engagement Trends
                </CardTitle>
                <CardDescription>
                  Monthly breakdown of student service utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.studentEngagement.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{data.month} 2024</span>
                        <span>
                          {data.counseling + data.events + data.resources} total
                          interactions
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded"></div>
                          <span className="text-xs">
                            Counseling: {data.counseling}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <span className="text-xs">Events: {data.events}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-600 rounded"></div>
                          <span className="text-xs">
                            Resources: {data.resources}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Job Placement Rates by Field
                </CardTitle>
                <CardDescription>
                  Employment success rates across different majors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.placementRates.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {field.field}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{field.rate}%</span>
                          <Badge variant="outline" className="text-xs">
                            {field.count} students
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          style={{ width: `${field.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tech Career Fair</span>
                    <Badge className="bg-green-100 text-green-800">
                      95% attendance
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resume Workshop</span>
                    <Badge className="bg-green-100 text-green-800">
                      92% attendance
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Alumni Networking</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      78% attendance
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">4.7</div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="w-4 h-4 bg-yellow-400 rounded-sm"
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on 1,247 responses
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Monthly Report
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Trend Analysis
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Pre-configured reports for regular analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge
                            variant={
                              template.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {template.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Frequency: {template.frequency}</span>
                          <span>Last generated: {template.lastGenerated}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Recently generated reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.type}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Generated: {report.generatedDate}</span>
                          <span>By: {report.generatedBy}</span>
                          <span>Size: {report.size}</span>
                          <span>{report.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-1 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>
                Build a custom report with specific metrics and filters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    placeholder="e.g. Q1 Performance Analysis"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student Analytics</SelectItem>
                      <SelectItem value="placement">
                        Placement Analytics
                      </SelectItem>
                      <SelectItem value="event">Event Analytics</SelectItem>
                      <SelectItem value="alumni">Alumni Analytics</SelectItem>
                      <SelectItem value="employer">
                        Employer Analytics
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="powerpoint">PowerPoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Metrics to Include</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="engagement" defaultChecked />
                    <Label htmlFor="engagement">Student Engagement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="placement" defaultChecked />
                    <Label htmlFor="placement">Job Placement Rates</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="satisfaction" />
                    <Label htmlFor="satisfaction">Satisfaction Scores</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="events" />
                    <Label htmlFor="events">Event Attendance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="alumni" />
                    <Label htmlFor="alumni">Alumni Engagement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trends" />
                    <Label htmlFor="trends">Trend Analysis</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg">Generate Report</Button>
                <Button variant="outline" size="lg">
                  Save Template
                </Button>
                <Button variant="outline" size="lg">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
