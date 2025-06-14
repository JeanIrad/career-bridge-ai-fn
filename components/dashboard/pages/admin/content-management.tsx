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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Image,
  Video,
  Calendar,
  Briefcase,
  Users,
  BookOpen,
  Filter,
  MoreVertical,
} from "lucide-react";

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      status: "active",
      applications: 45,
      posted: "2024-03-01",
      expires: "2024-04-01",
      type: "Full-time",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "DataFlow Analytics",
      status: "pending",
      applications: 23,
      posted: "2024-03-05",
      expires: "2024-04-05",
      type: "Internship",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Tech Career Fair 2024",
      organizer: "Career Services",
      status: "upcoming",
      attendees: 150,
      date: "2024-03-15",
      type: "Career Fair",
    },
    {
      id: 2,
      title: "Alumni Networking Night",
      organizer: "Alumni Association",
      status: "active",
      attendees: 75,
      date: "2024-03-20",
      type: "Networking",
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "Sarah Johnson",
      status: "published",
      enrolled: 1250,
      rating: 4.8,
      category: "Web Development",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Dr. Michael Chen",
      status: "draft",
      enrolled: 0,
      rating: 0,
      category: "Data Science",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Platform Maintenance Scheduled",
      content:
        "System will be down for maintenance on March 10th from 2-4 AM EST.",
      status: "published",
      priority: "high",
      created: "2024-03-01",
    },
    {
      id: 2,
      title: "New Feature: AI Career Assistant",
      content:
        "We're excited to announce our new AI-powered career guidance feature.",
      status: "draft",
      priority: "medium",
      created: "2024-03-05",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage platform content, listings, and announcements
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Job Listings
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Published Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search job listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Job Listing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>
                Manage all job postings and internship opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobListings.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge
                          variant={
                            job.status === "active" ? "default" : "secondary"
                          }
                        >
                          {job.status}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{job.applications} applications</span>
                        <span>Posted: {job.posted}</span>
                        <span>Expires: {job.expires}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Events & Workshops</CardTitle>
              <CardDescription>
                Manage career events, workshops, and networking sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge
                          variant={
                            event.status === "active" ? "default" : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Organized by {event.organizer}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{event.attendees} attendees</span>
                        <span>Date: {event.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Courses</CardTitle>
              <CardDescription>
                Manage educational content and skill development courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{course.enrolled} enrolled</span>
                        {course.rating > 0 && (
                          <span>Rating: {course.rating}/5</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Announcements</CardTitle>
              <CardDescription>
                Manage system announcements and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <Badge
                          variant={
                            announcement.status === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {announcement.status}
                        </Badge>
                        <Badge
                          variant={
                            announcement.priority === "high"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.content}
                      </p>
                      <span className="text-xs text-gray-500">
                        Created: {announcement.created}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage images, videos, and other media assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4 text-center">
                  <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium">Images</h4>
                  <p className="text-sm text-gray-600">234 files</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium">Videos</h4>
                  <p className="text-sm text-gray-600">12 files</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium">Documents</h4>
                  <p className="text-sm text-gray-600">89 files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
