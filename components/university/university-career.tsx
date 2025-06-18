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
  TrendingUp,
  Award,
  Target,
  Calendar,
  MessageCircle,
  FileText,
  BookOpen,
  Star,
} from "lucide-react";

export function UniversityCareer() {
  const careerStats = [
    {
      label: "Students Served",
      value: "2,891",
      change: "+234 this semester",
      icon: Users,
    },
    {
      label: "Job Placements",
      value: "892",
      change: "+67 this quarter",
      icon: Briefcase,
    },
    {
      label: "Career Counseling",
      value: "1,456",
      change: "+89 this month",
      icon: MessageCircle,
    },
    {
      label: "Success Rate",
      value: "94%",
      change: "+3% this year",
      icon: Award,
    },
  ];

  const departmentPerformance = [
    { department: "Computer Science", students: 856, placed: 762, rate: 89 },
    { department: "Engineering", students: 634, placed: 539, rate: 85 },
    {
      department: "Business Administration",
      students: 523,
      placed: 429,
      rate: 82,
    },
    { department: "Data Science", students: 398, placed: 362, rate: 91 },
    { department: "Design & Arts", students: 287, placed: 218, rate: 76 },
  ];

  const careerServices = [
    {
      service: "Resume Review",
      description: "Professional resume review and optimization",
      studentsServed: 1234,
      satisfaction: 4.8,
      nextAvailable: "Tomorrow 2:00 PM",
    },
    {
      service: "Mock Interviews",
      description: "Practice interviews with industry professionals",
      studentsServed: 892,
      satisfaction: 4.9,
      nextAvailable: "Today 4:00 PM",
    },
    {
      service: "Career Counseling",
      description: "One-on-one career guidance and planning",
      studentsServed: 1456,
      satisfaction: 4.7,
      nextAvailable: "Next Week",
    },
    {
      service: "Industry Workshops",
      description: "Skills workshops led by industry experts",
      studentsServed: 678,
      satisfaction: 4.6,
      nextAvailable: "Friday 1:00 PM",
    },
  ];

  const upcomingPrograms = [
    {
      title: "Tech Interview Bootcamp",
      date: "March 25-27, 2024",
      participants: 45,
      instructor: "Google Engineers",
      type: "Workshop",
    },
    {
      title: "Finance Career Panel",
      date: "April 2, 2024",
      participants: 78,
      instructor: "Wall Street Professionals",
      type: "Panel",
    },
    {
      title: "Startup Pitch Workshop",
      date: "April 8, 2024",
      participants: 32,
      instructor: "Venture Capitalists",
      type: "Workshop",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Services</h1>
          <p className="text-muted-foreground">
            Support student career development and job placement success
          </p>
        </div>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Program
        </Button>
      </div>

      {/* Career Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {careerStats.map((stat, index) => (
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
        {/* Department Performance */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Placement Rate by Department
              </CardTitle>
              <CardDescription>
                Job placement success across different academic departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{dept.department}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      {dept.rate}% Placement Rate
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Total Students:
                      </span>
                      <p className="font-semibold">{dept.students}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Placed:</span>
                      <p className="font-semibold">{dept.placed}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Success Rate:
                      </span>
                      <p className="font-semibold">{dept.rate}%</p>
                    </div>
                  </div>
                  <Progress value={dept.rate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Career Services Overview
              </CardTitle>
              <CardDescription>
                Available career support services and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {careerServices.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{service.service}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {service.satisfaction}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">
                          Students Served:
                        </span>
                        <p className="font-semibold">
                          {service.studentsServed.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Next Available:
                        </span>
                        <p className="font-semibold">{service.nextAvailable}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Manage Service
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Counseling
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Updates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Resource Library
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Programs</CardTitle>
              <CardDescription>
                Scheduled career development programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPrograms.map((program, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{program.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {program.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>{program.date}</p>
                      <p>{program.participants} participants</p>
                      <p>Led by: {program.instructor}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Manage
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
