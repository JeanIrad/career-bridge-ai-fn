"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
  Home,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  Building2,
  GraduationCap,
  UserCheck,
  Briefcase,
  TrendingUp,
  School,
  Award,
  BookOpen,
  HandHeart,
} from "lucide-react";

export default function UniversityDashboard() {
  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard/university" },
    {
      icon: Users,
      label: "Student Management",
      href: "/dashboard/university/students",
      badge: "3,247",
    },
    {
      icon: Building2,
      label: "Industry Partners",
      href: "/dashboard/university/partners",
      badge: "127",
    },
    {
      icon: Calendar,
      label: "Events & Programs",
      href: "/dashboard/university/events",
    },
    {
      icon: Briefcase,
      label: "Career Services",
      href: "/dashboard/university/career",
    },
    {
      icon: MessageCircle,
      label: "Communications",
      href: "/dashboard/university/messages",
      badge: "18",
    },
    {
      icon: BarChart3,
      label: "Analytics & Reports",
      href: "/dashboard/university/analytics",
    },
    {
      icon: HandHeart,
      label: "Alumni Network",
      href: "/dashboard/university/alumni",
    },
  ];

  const universityStats = [
    {
      label: "Active Students",
      value: "3,247",
      change: "+156 this semester",
      icon: GraduationCap,
    },
    {
      label: "Industry Partners",
      value: "127",
      change: "+12 this month",
      icon: Building2,
    },
    {
      label: "Job Placements",
      value: "892",
      change: "+89 this quarter",
      icon: Briefcase,
    },
    {
      label: "Alumni Network",
      value: "15,600+",
      change: "+234 new members",
      icon: Award,
    },
  ];

  const studentEngagement = [
    { department: "Computer Science", total: 856, active: 742, placement: 89 },
    { department: "Engineering", total: 634, active: 567, placement: 85 },
    {
      department: "Business Administration",
      total: 523,
      active: 445,
      placement: 82,
    },
    { department: "Data Science", total: 398, active: 356, placement: 91 },
    { department: "Design & Arts", total: 287, active: 234, placement: 76 },
  ];

  const recentActivities = [
    {
      type: "New Partnership",
      description:
        "Microsoft signed partnership agreement for internship program",
      time: "2 hours ago",
      priority: "high",
    },
    {
      type: "Event Registration",
      description: "Tech Career Fair 2024 - 245 students registered",
      time: "4 hours ago",
      priority: "medium",
    },
    {
      type: "Student Achievement",
      description: "15 students received job offers from partner companies",
      time: "1 day ago",
      priority: "high",
    },
    {
      type: "Alumni Update",
      description: "23 new alumni joined the mentorship program",
      time: "2 days ago",
      priority: "low",
    },
  ];

  const upcomingEvents = [
    {
      title: "Spring Career Fair 2024",
      date: "March 22-23, 2024",
      type: "Career Fair",
      participants: 245,
      companies: 45,
      location: "University Center",
    },
    {
      title: "Industry Leadership Summit",
      date: "April 5, 2024",
      type: "Summit",
      participants: 78,
      companies: 15,
      location: "Virtual Event",
    },
    {
      title: "Alumni Networking Mixer",
      date: "April 12, 2024",
      type: "Networking",
      participants: 156,
      companies: 25,
      location: "Alumni Hall",
    },
  ];

  const topPerformingPartners = [
    {
      company: "Google",
      hires: 34,
      activePostings: 8,
      satisfactionRating: 4.8,
      lastInteraction: "2 days ago",
    },
    {
      company: "Microsoft",
      hires: 28,
      activePostings: 6,
      satisfactionRating: 4.9,
      lastInteraction: "1 day ago",
    },
    {
      company: "Apple",
      hires: 22,
      activePostings: 4,
      satisfactionRating: 4.7,
      lastInteraction: "3 days ago",
    },
    {
      company: "Amazon",
      hires: 31,
      activePostings: 12,
      satisfactionRating: 4.6,
      lastInteraction: "1 day ago",
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userRole="University Staff"
      userName="Dr. Maria Rodriguez"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, Dr. Rodriguez! 🎓
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Spring Career Fair registrations are open with 245 students signed
              up. 12 new industry partnerships this month!
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                View Career Fair
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Manage Partners
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
            <School className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* University Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universityStats.map((stat, index) => (
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
          {/* Student Engagement by Department */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Student Engagement by Department
                </CardTitle>
                <CardDescription>
                  Active participation and placement rates across departments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {studentEngagement.map((dept, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{dept.department}</h3>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700"
                      >
                        {dept.placement}% Placement Rate
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Students:
                        </span>
                        <p className="font-semibold">{dept.total}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Active Users:
                        </span>
                        <p className="font-semibold">{dept.active}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Engagement:
                        </span>
                        <p className="font-semibold">
                          {Math.round((dept.active / dept.total) * 100)}%
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={(dept.active / dept.total) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
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
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="w-4 h-4 mr-2" />
                  Add Industry Partner
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>Latest university updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.priority === "high"
                            ? "bg-emerald-500"
                            : activity.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Performing Industry Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Top Performing Industry Partners
            </CardTitle>
            <CardDescription>
              Your most successful partner relationships and hiring outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {topPerformingPartners.map((partner, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{partner.company}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">
                        {partner.satisfactionRating}/5.0
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">
                        Students Hired:
                      </span>
                      <p className="font-semibold text-lg">{partner.hires}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Active Postings:
                      </span>
                      <p className="font-semibold text-lg">
                        {partner.activePostings}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last contact: {partner.lastInteraction}
                    </span>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming University Events
            </CardTitle>
            <CardDescription>
              Scheduled career development and networking events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Participants:
                      </span>
                      <span className="font-medium">{event.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Companies:</span>
                      <span className="font-medium">{event.companies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-xs">
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    Manage Event
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
