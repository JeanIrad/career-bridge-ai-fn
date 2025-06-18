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
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Building2,
  UserPlus,
  Calendar,
  MessageCircle,
  BarChart3,
  Clock,
  MapPin,
  Star,
} from "lucide-react";

export function EmployerOverview() {
  const quickStats = [
    {
      label: "Active Job Postings",
      value: "8",
      change: "+2 this month",
      icon: Briefcase,
    },
    {
      label: "Total Applications",
      value: "324",
      change: "+47 this week",
      icon: Users,
    },
    {
      label: "Profile Views",
      value: "1,248",
      change: "+89 this week",
      icon: Eye,
    },
    {
      label: "Hire Success Rate",
      value: "78%",
      change: "+5% this month",
      icon: TrendingUp,
    },
  ];

  const recentApplications = [
    {
      name: "Emily Rodriguez",
      position: "Software Engineering Intern",
      university: "Stanford University",
      major: "Computer Science",
      gpa: "3.8",
      skills: ["React", "Python", "Machine Learning"],
      appliedDate: "2 hours ago",
      match: 94,
    },
    {
      name: "Michael Chen",
      position: "Data Analyst Intern",
      university: "UC Berkeley",
      major: "Statistics",
      gpa: "3.7",
      skills: ["SQL", "R", "Tableau"],
      appliedDate: "5 hours ago",
      match: 89,
    },
    {
      name: "Sarah Williams",
      position: "UX Design Intern",
      university: "MIT",
      major: "Design & Technology",
      gpa: "3.9",
      skills: ["Figma", "User Research", "Prototyping"],
      appliedDate: "1 day ago",
      match: 91,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, Jennifer! 🚀
          </h1>
          <p className="text-lg opacity-90 mb-6">
            You have 47 new applications and 2 upcoming campus events. Let's
            find your next great hire!
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Review Applications
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Post New Job
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <Building2 className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-emerald-600">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Recent Applications
              </CardTitle>
              <CardDescription>
                Review and manage candidate applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentApplications.map((application, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {application.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          {application.match}% Match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {application.position}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {application.appliedDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">
                        University:{" "}
                      </span>
                      <span className="font-medium">
                        {application.university}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Major: </span>
                      <span className="font-medium">{application.major}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPA: </span>
                      <span className="font-medium">{application.gpa}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {application.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">Interview</Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Campus Visit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Candidates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Hiring Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hiring Pipeline</CardTitle>
              <CardDescription>Current recruitment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Applications Review</span>
                    <span>47 pending</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Phone Screening</span>
                    <span>12 scheduled</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Technical Interviews</span>
                    <span>8 scheduled</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Final Interviews</span>
                    <span>3 scheduled</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
