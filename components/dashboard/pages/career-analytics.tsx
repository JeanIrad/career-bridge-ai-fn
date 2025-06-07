"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Briefcase,
  Target,
  Award,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2
} from "lucide-react";

export function CareerAnalytics() {
  const profileMetrics = {
    views: { current: 89, change: 12, trend: 'up' },
    applications: { current: 12, change: 3, trend: 'up' },
    responses: { current: 5, change: 1, trend: 'up' },
    networkGrowth: { current: 47, change: 5, trend: 'up' }
  };

  const skillsData = [
    { skill: 'React', level: 85, demand: 'High', growth: '+15%' },
    { skill: 'JavaScript', level: 90, demand: 'High', growth: '+8%' },
    { skill: 'Python', level: 70, demand: 'Very High', growth: '+22%' },
    { skill: 'Node.js', level: 75, demand: 'High', growth: '+12%' },
    { skill: 'TypeScript', level: 80, demand: 'High', growth: '+18%' },
    { skill: 'AWS', level: 60, demand: 'Very High', growth: '+25%' }
  ];

  const industryInsights = [
    {
      industry: 'Technology',
      growth: '+15%',
      avgSalary: '$95k',
      openings: 1250,
      trend: 'up'
    },
    {
      industry: 'Healthcare',
      growth: '+12%',
      avgSalary: '$78k',
      openings: 890,
      trend: 'up'
    },
    {
      industry: 'Finance',
      growth: '+8%',
      avgSalary: '$88k',
      openings: 567,
      trend: 'up'
    },
    {
      industry: 'Education',
      growth: '+5%',
      avgSalary: '$65k',
      openings: 445,
      trend: 'up'
    }
  ];

  const careerPath = [
    {
      role: 'Junior Developer',
      current: true,
      timeline: 'Current',
      skills: ['HTML/CSS', 'JavaScript', 'React'],
      salary: '$65k - $75k'
    },
    {
      role: 'Mid-Level Developer',
      current: false,
      timeline: '1-2 years',
      skills: ['Advanced React', 'Node.js', 'Databases'],
      salary: '$75k - $95k'
    },
    {
      role: 'Senior Developer',
      current: false,
      timeline: '3-5 years',
      skills: ['System Design', 'Leadership', 'Architecture'],
      salary: '$95k - $120k'
    },
    {
      role: 'Tech Lead',
      current: false,
      timeline: '5+ years',
      skills: ['Team Management', 'Strategy', 'Mentoring'],
      salary: '$120k - $150k'
    }
  ];

  const recommendations = [
    {
      type: 'Skill',
      title: 'Learn AWS Cloud Services',
      description: 'Cloud skills are in high demand. AWS certification could increase your market value by 25%.',
      priority: 'High',
      timeToComplete: '2-3 months'
    },
    {
      type: 'Network',
      title: 'Connect with Tech Leaders',
      description: 'Expand your network by connecting with 5 senior developers in your target companies.',
      priority: 'Medium',
      timeToComplete: '1 month'
    },
    {
      type: 'Experience',
      title: 'Contribute to Open Source',
      description: 'Open source contributions can showcase your skills and attract employer attention.',
      priority: 'Medium',
      timeToComplete: 'Ongoing'
    },
    {
      type: 'Certification',
      title: 'Get React Certification',
      description: 'Validate your React skills with an official certification to stand out to employers.',
      priority: 'Low',
      timeToComplete: '1 month'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and optimize your career strategy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="market">Market Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileMetrics.views.current}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +{profileMetrics.views.change} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileMetrics.applications.current}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +{profileMetrics.applications.change} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interview Invites</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileMetrics.responses.current}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +{profileMetrics.responses.change} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Growth</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profileMetrics.networkGrowth.current}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  +{profileMetrics.networkGrowth.change} new connections
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Career Progress */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Career Path Progress
                </CardTitle>
                <CardDescription>Your journey to your target role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerPath.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.current 
                        ? 'bg-blue-600 text-white' 
                        : index < careerPath.findIndex(s => s.current)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.role}</h4>
                      <p className="text-sm text-gray-600">{step.timeline} • {step.salary}</p>
                      <div className="flex gap-1 mt-1">
                        {step.skills.slice(0, 2).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {step.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{step.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Success Rate
                </CardTitle>
                <CardDescription>Your application performance over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Rate</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Interview Rate</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Offer Rate</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Your response rate is above average! Focus on interview preparation to improve conversion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills Assessment
              </CardTitle>
              <CardDescription>Your current skill levels and market demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillsData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <Badge variant={skill.demand === 'Very High' ? 'default' : 'secondary'}>
                          {skill.demand} Demand
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">{skill.growth}</span>
                        <span className="text-sm text-gray-600">{skill.level}%</span>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Skill Gap Analysis</h4>
                <p className="text-sm text-yellow-700">
                  Consider improving your AWS and Python skills to match market demand and increase your competitiveness.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Industry Growth Trends
                </CardTitle>
                <CardDescription>Job market trends by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryInsights.map((industry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{industry.industry}</h4>
                        <p className="text-sm text-gray-600">{industry.openings} open positions</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-medium">{industry.growth}</span>
                        </div>
                        <p className="text-sm text-gray-600">{industry.avgSalary} avg</p>
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
                  Salary Benchmarks
                </CardTitle>
                <CardDescription>How your target salary compares to market</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Entry Level (0-2 years)</span>
                    <span className="text-sm font-medium">$65k - $85k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mid Level (2-5 years)</span>
                    <span className="text-sm font-medium">$85k - $110k</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Senior Level (5+ years)</span>
                    <span className="text-sm font-medium">$110k - $150k</span>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Good news!</strong> Your target salary range aligns well with market rates for your experience level.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>AI-powered suggestions to accelerate your career growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{rec.type}</Badge>
                        <Badge variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'default' : 'secondary'}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{rec.timeToComplete}</span>
                    </div>
                    <h4 className="font-medium mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    <Button size="sm">Take Action</Button>
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