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
import { Textarea } from "@/components/ui/textarea";
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
  Brain,
  Calendar,
  Users,
  FileText,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  MessageSquare,
  Video,
  Phone,
} from "lucide-react";

export function CareerCounseling() {
  const [selectedStudent, setSelectedStudent] = useState("");

  const counselingSessions = [
    {
      id: 1,
      student: {
        name: "Alex Thompson",
        email: "alex.thompson@university.edu",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Computer Science",
        year: "Senior",
        gpa: "3.8",
      },
      sessionType: "Career Planning",
      date: "2024-03-08",
      time: "10:00 AM",
      duration: "45 min",
      status: "completed",
      goals: [
        "Identify career interests",
        "Explore tech industry roles",
        "Create action plan",
      ],
      notes:
        "Student is interested in software engineering and data science. Discussed various career paths and recommended networking with alumni.",
      nextSteps: [
        "Research companies",
        "Update resume",
        "Schedule mock interview",
      ],
      followUpDate: "2024-03-15",
    },
    {
      id: 2,
      student: {
        name: "Sarah Chen",
        email: "sarah.chen@university.edu",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Business Administration",
        year: "Junior",
        gpa: "3.6",
      },
      sessionType: "Interview Preparation",
      date: "2024-03-09",
      time: "2:00 PM",
      duration: "60 min",
      status: "scheduled",
      goals: [
        "Practice interview skills",
        "Review common questions",
        "Build confidence",
      ],
      notes: "",
      nextSteps: [],
      followUpDate: "",
    },
    {
      id: 3,
      student: {
        name: "Michael Rodriguez",
        email: "michael.r@university.edu",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        major: "Marketing",
        year: "Sophomore",
        gpa: "3.4",
      },
      sessionType: "Resume Review",
      date: "2024-03-10",
      time: "11:00 AM",
      duration: "30 min",
      status: "scheduled",
      goals: [
        "Review resume content",
        "Improve formatting",
        "Highlight achievements",
      ],
      notes: "",
      nextSteps: [],
      followUpDate: "",
    },
  ];

  const assessmentTools = [
    {
      name: "Career Interest Inventory",
      description:
        "Helps students identify their career interests and preferences",
      duration: "15-20 minutes",
      type: "Self-Assessment",
    },
    {
      name: "Skills Assessment",
      description:
        "Evaluates current skills and identifies areas for development",
      duration: "25-30 minutes",
      type: "Skills Evaluation",
    },
    {
      name: "Personality Type Indicator",
      description: "Determines personality type and suitable career matches",
      duration: "10-15 minutes",
      type: "Personality Test",
    },
    {
      name: "Values Clarification",
      description:
        "Identifies core values and how they align with career choices",
      duration: "20-25 minutes",
      type: "Values Assessment",
    },
  ];

  const stats = [
    { label: "Total Sessions", value: "156", change: "+23", icon: Users },
    { label: "This Week", value: "12", change: "+3", icon: Calendar },
    {
      label: "Avg Session Rating",
      value: "4.8",
      change: "+0.2",
      icon: TrendingUp,
    },
    { label: "Follow-up Rate", value: "89%", change: "+5%", icon: CheckCircle },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Career Counseling
          </h1>
          <p className="text-gray-600 mt-2">
            Provide personalized career guidance and support to students
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Sessions
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
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
                  last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Counseling Sessions</TabsTrigger>
          <TabsTrigger value="assessments">Assessment Tools</TabsTrigger>
          <TabsTrigger value="plans">Development Plans</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle>Counseling Sessions</CardTitle>
              <CardDescription>
                Manage and track student counseling sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {counselingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={session.student.avatar}
                            alt={session.student.name}
                          />
                          <AvatarFallback>
                            {session.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {session.student.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {session.student.major} • {session.student.year} •
                            GPA: {session.student.gpa}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {session.sessionType}
                            </Badge>
                            {getStatusBadge(session.status)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{session.date}</p>
                        <p className="text-sm text-gray-600">
                          {session.time} • {session.duration}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium mb-2">Session Goals</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {session.goals.map((goal, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-blue-600" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {session.nextSteps.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Next Steps</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {session.nextSteps.map((step, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Session Notes</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {session.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-600">
                        {session.followUpDate &&
                          `Follow-up scheduled: ${session.followUpDate}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
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

        <TabsContent value="assessments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Career Assessment Tools
              </CardTitle>
              <CardDescription>
                Help students discover their interests, skills, and career
                preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {assessmentTools.map((tool, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{tool.name}</h4>
                        <Badge variant="outline" className="mt-1">
                          {tool.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {tool.duration}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      {tool.description}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Assign to Student</Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                Recent assessment completions and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Alex Thompson</h4>
                    <p className="text-sm text-gray-600">
                      Completed Career Interest Inventory
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Sarah Chen</h4>
                    <p className="text-sm text-gray-600">
                      Completed Skills Assessment
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Development Plans</CardTitle>
              <CardDescription>
                Create and track personalized career development plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alex">Alex Thompson</SelectItem>
                    <SelectItem value="sarah">Sarah Chen</SelectItem>
                    <SelectItem value="michael">Michael Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Create New Plan</Button>
              </div>

              {selectedStudent && (
                <div className="border rounded-lg p-6">
                  <h4 className="font-medium mb-4">
                    Development Plan for Alex Thompson
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="careerGoal">Primary Career Goal</Label>
                      <Input
                        id="careerGoal"
                        placeholder="e.g., Software Engineer at a tech company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6months">6 months</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                          <SelectItem value="2years">2 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="strengths">Current Strengths</Label>
                      <Textarea
                        id="strengths"
                        placeholder="List student's current strengths and skills..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="development">Areas for Development</Label>
                      <Textarea
                        id="development"
                        placeholder="Identify skills and areas that need improvement..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="actions">Action Steps</Label>
                      <Textarea
                        id="actions"
                        placeholder="Specific actions and milestones to achieve the goal..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button>Save Plan</Button>
                      <Button variant="outline">Save as Template</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Counseling Resources</CardTitle>
                <CardDescription>
                  Tools and materials for effective counseling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Career Exploration Workbook</h4>
                    <p className="text-sm text-gray-600">
                      Structured exercises for career discovery
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Goal Setting Framework</h4>
                    <p className="text-sm text-gray-600">
                      SMART goals template for students
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Industry Research Guide</h4>
                    <p className="text-sm text-gray-600">
                      How to research careers and industries
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Development</CardTitle>
                <CardDescription>
                  Resources for counselor growth and training
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Counseling Best Practices</h4>
                    <p className="text-sm text-gray-600">
                      Evidence-based counseling techniques
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Assessment Interpretation</h4>
                    <p className="text-sm text-gray-600">
                      How to interpret assessment results
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Crisis Intervention Guide</h4>
                    <p className="text-sm text-gray-600">
                      Handling difficult situations
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
