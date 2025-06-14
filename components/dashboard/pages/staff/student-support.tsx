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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MessageSquare,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  Phone,
  Mail,
  Video,
  FileText,
  GraduationCap,
  Briefcase,
} from "lucide-react";

export function StudentSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const supportTickets = [
    {
      id: 1,
      student: {
        name: "Alex Thompson",
        email: "alex.thompson@university.edu",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Computer Science",
        year: "Senior",
      },
      subject: "Resume Review Request",
      category: "Career Guidance",
      priority: "medium",
      status: "open",
      created: "2024-03-08",
      lastUpdate: "2024-03-08",
      description:
        "I need help reviewing my resume for software engineering positions. I'm particularly concerned about highlighting my internship experience.",
    },
    {
      id: 2,
      student: {
        name: "Sarah Chen",
        email: "sarah.chen@university.edu",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Data Science",
        year: "Junior",
      },
      subject: "Interview Preparation Help",
      category: "Interview Prep",
      priority: "high",
      status: "in-progress",
      created: "2024-03-07",
      lastUpdate: "2024-03-08",
      description:
        "I have a technical interview next week for a data science internship. Can we schedule a mock interview session?",
    },
    {
      id: 3,
      student: {
        name: "Michael Rodriguez",
        email: "michael.r@university.edu",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Business Administration",
        year: "Sophomore",
      },
      subject: "Career Path Guidance",
      category: "Career Planning",
      priority: "low",
      status: "resolved",
      created: "2024-03-05",
      lastUpdate: "2024-03-07",
      description:
        "I'm unsure about my career direction. I'm interested in both marketing and finance. Can we discuss potential career paths?",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      student: "Emily Johnson",
      time: "10:00 AM",
      date: "Today",
      type: "Career Counseling",
      duration: "45 min",
      mode: "In-person",
    },
    {
      id: 2,
      student: "David Kim",
      time: "2:00 PM",
      date: "Today",
      type: "Resume Review",
      duration: "30 min",
      mode: "Virtual",
    },
    {
      id: 3,
      student: "Lisa Wang",
      time: "9:00 AM",
      date: "Tomorrow",
      type: "Interview Prep",
      duration: "60 min",
      mode: "In-person",
    },
  ];

  const stats = [
    { label: "Active Cases", value: "23", change: "+5", icon: Users },
    {
      label: "Resolved This Week",
      value: "18",
      change: "+3",
      icon: CheckCircle,
    },
    { label: "Avg Response Time", value: "2.4h", change: "-0.3h", icon: Clock },
    {
      label: "Student Satisfaction",
      value: "4.8",
      change: "+0.1",
      icon: AlertCircle,
    },
  ];

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      !selectedPriority || ticket.priority === selectedPriority;
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
        );
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Support</h1>
          <p className="text-gray-600 mt-2">
            Manage student inquiries and provide career guidance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last week
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tickets by student name or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
              <CardDescription>
                Manage student support requests and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={ticket.student.avatar}
                            alt={ticket.student.name}
                          />
                          <AvatarFallback>
                            {ticket.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{ticket.subject}</h4>
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>{ticket.student.name}</strong> •{" "}
                            {ticket.student.major} • {ticket.student.year}
                          </p>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {ticket.created}</span>
                            <span>Last update: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled student meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600">
                            {appointment.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.date}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{appointment.student}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.type}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {appointment.duration}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {appointment.mode}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.mode === "Virtual" && (
                          <Button variant="outline" size="sm">
                            <Video className="mr-1 h-4 w-4" />
                            Join
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Bulk Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View All Students
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Career Resources
                </CardTitle>
                <CardDescription>
                  Helpful resources for student guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Resume Templates</h4>
                    <p className="text-sm text-gray-600">
                      Industry-specific resume formats
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Interview Guide</h4>
                    <p className="text-sm text-gray-600">
                      Common questions and best practices
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Salary Negotiation Tips</h4>
                    <p className="text-sm text-gray-600">
                      How to negotiate job offers
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Development
                </CardTitle>
                <CardDescription>
                  Tools for student growth and planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Career Assessment Tool</h4>
                    <p className="text-sm text-gray-600">
                      Help students discover their interests
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Launch
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Goal Setting Worksheet</h4>
                    <p className="text-sm text-gray-600">
                      Structure career planning sessions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Industry Insights</h4>
                    <p className="text-sm text-gray-600">
                      Latest trends and job market data
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
