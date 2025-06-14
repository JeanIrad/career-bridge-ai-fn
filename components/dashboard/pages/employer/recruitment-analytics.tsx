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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Clock,
  Target,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
} from "lucide-react";

export function RecruitmentAnalytics() {
  const overviewStats = [
    {
      label: "Total Applications",
      value: "456",
      change: "+23%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Active Job Listings",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Briefcase,
    },
    {
      label: "Avg. Time to Hire",
      value: "18 days",
      change: "-3 days",
      trend: "up",
      icon: Clock,
    },
    {
      label: "Hire Rate",
      value: "12.5%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
    },
  ];

  const jobPerformance = [
    {
      title: "Senior Software Engineer",
      applications: 89,
      views: 234,
      hires: 2,
      status: "active",
      posted: "2024-03-01",
      avgTimeToHire: "21 days",
    },
    {
      title: "Frontend Developer Intern",
      applications: 67,
      views: 156,
      hires: 1,
      status: "active",
      posted: "2024-03-05",
      avgTimeToHire: "14 days",
    },
    {
      title: "Product Manager",
      applications: 45,
      views: 123,
      hires: 0,
      status: "paused",
      posted: "2024-02-28",
      avgTimeToHire: "-",
    },
    {
      title: "UX Designer",
      applications: 78,
      views: 189,
      hires: 1,
      status: "filled",
      posted: "2024-02-15",
      avgTimeToHire: "16 days",
    },
  ];

  const candidateMetrics = [
    { source: "University Partnerships", applications: 156, percentage: 34 },
    { source: "Job Boards", applications: 123, percentage: 27 },
    { source: "Referrals", applications: 89, percentage: 20 },
    { source: "Social Media", applications: 67, percentage: 15 },
    { source: "Direct Applications", applications: 21, percentage: 4 },
  ];

  const hiringFunnel = [
    { stage: "Applications Received", count: 456, percentage: 100 },
    { stage: "Initial Screening", count: 234, percentage: 51 },
    { stage: "Phone Interview", count: 123, percentage: 27 },
    { stage: "Technical Interview", count: 67, percentage: 15 },
    { stage: "Final Interview", count: 34, percentage: 7 },
    { stage: "Offers Extended", count: 18, percentage: 4 },
    { stage: "Offers Accepted", count: 12, percentage: 3 },
  ];

  const topUniversities = [
    { name: "MIT", applications: 45, hires: 3 },
    { name: "Stanford University", applications: 38, hires: 2 },
    { name: "UC Berkeley", applications: 32, hires: 2 },
    { name: "Carnegie Mellon", applications: 28, hires: 1 },
    { name: "Georgia Tech", applications: 24, hires: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Recruitment Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Track your hiring performance and optimize recruitment strategies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendIcon
                    className={`h-3 w-3 mr-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  />
                  <span
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Performance</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Analytics</TabsTrigger>
          <TabsTrigger value="funnel">Hiring Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recruitment Trends
                </CardTitle>
                <CardDescription>
                  Monthly hiring performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Applications This Month</span>
                    <span className="font-medium">456 (+23%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Successful Hires</span>
                    <span className="font-medium">12 (+4)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost per Hire</span>
                    <span className="font-medium">$3,200 (-$400)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality of Hire Score</span>
                    <span className="font-medium">8.4/10 (+0.3)</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Great Progress!</strong> Your hiring efficiency
                    improved by 15% this month.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Hiring Goals
                </CardTitle>
                <CardDescription>
                  Progress towards quarterly targets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Software Engineers</span>
                    <span>8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Product Managers</span>
                    <span>2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Designers</span>
                    <span>3/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Interns</span>
                    <span>6/8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Application Sources
              </CardTitle>
              <CardDescription>
                Where your best candidates are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidateMetrics.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {source.source}
                        </span>
                        <span className="text-sm text-gray-600">
                          {source.applications} applications
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Listing Performance</CardTitle>
              <CardDescription>
                How each of your job postings is performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPerformance.map((job, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">
                          Posted: {job.posted}
                        </p>
                      </div>
                      <Badge
                        variant={
                          job.status === "active"
                            ? "default"
                            : job.status === "filled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="h-4 w-4" />
                          Applications
                        </div>
                        <div className="font-medium">{job.applications}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="h-4 w-4" />
                          Views
                        </div>
                        <div className="font-medium">{job.views}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Target className="h-4 w-4" />
                          Hires
                        </div>
                        <div className="font-medium">{job.hires}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          Avg. Time to Hire
                        </div>
                        <div className="font-medium">{job.avgTimeToHire}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <BarChart3 className="h-4 w-4" />
                          Conversion Rate
                        </div>
                        <div className="font-medium">
                          {job.applications > 0
                            ? ((job.hires / job.applications) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Universities</CardTitle>
                <CardDescription>
                  Universities with the most applications and hires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUniversities.map((university, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{university.name}</h4>
                        <p className="text-sm text-gray-600">
                          {university.applications} applications
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {university.hires} hires
                        </div>
                        <div className="text-xs text-gray-500">
                          {(
                            (university.hires / university.applications) *
                            100
                          ).toFixed(1)}
                          % rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Candidate Quality Metrics</CardTitle>
                <CardDescription>
                  Assessment of candidate quality and fit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Average GPA</span>
                    <span className="font-medium">3.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Relevant Experience</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Technical Skills Match</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Culture Fit Score</span>
                    <span className="font-medium">8.2/10</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Most In-Demand Skills</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>JavaScript</span>
                      <span>67% of candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Python</span>
                      <span>54% of candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>React</span>
                      <span>45% of candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Machine Learning</span>
                      <span>32% of candidates</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Hiring Funnel Analysis
              </CardTitle>
              <CardDescription>
                Track candidates through each stage of your hiring process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hiringFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {stage.count} candidates
                        </span>
                        <span className="text-sm font-medium">
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    {index < hiringFunnel.length - 1 && (
                      <div className="text-xs text-gray-500 text-right">
                        {(
                          (hiringFunnel[index + 1].count / stage.count) *
                          100
                        ).toFixed(1)}
                        % conversion to next stage
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Funnel Insights
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Strongest conversion: Applications to Screening (51%)
                  </li>
                  <li>
                    • Improvement opportunity: Technical to Final Interview
                    (50%)
                  </li>
                  <li>• Excellent offer acceptance rate: 67%</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Time to Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">18</div>
                  <p className="text-sm text-gray-600">Average days</p>
                  <p className="text-xs text-green-600 mt-1">
                    3 days faster than last month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Hire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">$3,200</div>
                  <p className="text-sm text-gray-600">Average cost</p>
                  <p className="text-xs text-green-600 mt-1">
                    $400 less than last month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Offer Acceptance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">67%</div>
                  <p className="text-sm text-gray-600">Acceptance rate</p>
                  <p className="text-xs text-green-600 mt-1">
                    Above industry average
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
