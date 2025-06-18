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
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Search,
  Filter,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  MessageCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";

export function UniversityStudents() {
  const students = [
    {
      id: 1,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@stanford.edu",
      major: "Computer Science",
      year: "Senior",
      gpa: "3.8",
      status: "Active",
      lastLogin: "2 hours ago",
      applications: 12,
      interviews: 3,
      offers: 1,
      profileCompletion: 85,
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@stanford.edu",
      major: "Data Science",
      year: "Junior",
      gpa: "3.7",
      status: "Active",
      lastLogin: "1 day ago",
      applications: 8,
      interviews: 2,
      offers: 0,
      profileCompletion: 70,
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@stanford.edu",
      major: "Business Administration",
      year: "Senior",
      gpa: "3.9",
      status: "Active",
      lastLogin: "3 hours ago",
      applications: 15,
      interviews: 5,
      offers: 2,
      profileCompletion: 95,
    },
    {
      id: 4,
      name: "James Thompson",
      email: "james.thompson@stanford.edu",
      major: "Engineering",
      year: "Sophomore",
      gpa: "3.6",
      status: "Inactive",
      lastLogin: "2 weeks ago",
      applications: 3,
      interviews: 0,
      offers: 0,
      profileCompletion: 45,
    },
  ];

  const studentStats = [
    {
      label: "Total Students",
      value: "3,247",
      change: "+156 this semester",
      icon: GraduationCap,
    },
    {
      label: "Active Users",
      value: "2,891",
      change: "+89 this week",
      icon: Users,
    },
    {
      label: "Job Applications",
      value: "1,456",
      change: "+234 this month",
      icon: TrendingUp,
    },
    {
      label: "Successful Placements",
      value: "892",
      change: "+67 this quarter",
      icon: Award,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Graduated":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getYearColor = (year: string) => {
    switch (year) {
      case "Freshman":
        return "bg-purple-100 text-purple-700";
      case "Sophomore":
        return "bg-blue-100 text-blue-700";
      case "Junior":
        return "bg-orange-100 text-orange-700";
      case "Senior":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            Monitor student engagement and career development progress
          </p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Send Announcement
        </Button>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat, index) => (
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>
                View and manage student profiles and career progress
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {student.name}
                        </h3>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {student.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={getYearColor(student.year)}>
                          {student.year}
                        </Badge>
                        <Badge variant="outline">{student.major}</Badge>
                        <span className="text-sm text-muted-foreground">
                          GPA: {student.gpa}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {student.applications}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applications
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {student.interviews}
                    </p>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {student.offers}
                    </p>
                    <p className="text-xs text-muted-foreground">Offers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {student.profileCompletion}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Profile Complete
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.lastLogin}</p>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Profile completion: {student.profileCompletion}%
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm">Career Guidance</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
