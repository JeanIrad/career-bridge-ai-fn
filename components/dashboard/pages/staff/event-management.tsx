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
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";

export function EventManagement() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const events = [
    {
      id: 1,
      title: "Tech Career Fair 2024",
      description:
        "Annual career fair featuring top technology companies and startups.",
      date: "2024-03-15",
      time: "10:00 AM - 4:00 PM",
      location: "University Campus - Main Hall",
      type: "Career Fair",
      status: "upcoming",
      capacity: 200,
      registered: 156,
      waitlist: 12,
      organizer: "Career Services",
      budget: "$15,000",
      expenses: "$12,500",
      companies: 25,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
    },
    {
      id: 2,
      title: "Alumni Networking Night",
      description: "Connect with successful alumni from various industries.",
      date: "2024-03-20",
      time: "6:00 PM - 9:00 PM",
      location: "Downtown Convention Center",
      type: "Networking",
      status: "upcoming",
      capacity: 100,
      registered: 78,
      waitlist: 5,
      organizer: "Alumni Association",
      budget: "$8,000",
      expenses: "$6,200",
      companies: 0,
      image:
        "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
    },
    {
      id: 3,
      title: "Resume Workshop Series",
      description: "Three-part workshop series on crafting effective resumes.",
      date: "2024-03-25",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      type: "Workshop",
      status: "upcoming",
      capacity: 50,
      registered: 45,
      waitlist: 8,
      organizer: "Career Development Center",
      budget: "$2,000",
      expenses: "$1,500",
      companies: 0,
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
    },
    {
      id: 4,
      title: "Industry Panel: Future of AI",
      description: "Panel discussion with AI industry leaders and researchers.",
      date: "2024-02-28",
      time: "7:00 PM - 8:30 PM",
      location: "University Auditorium",
      type: "Panel",
      status: "completed",
      capacity: 150,
      registered: 142,
      waitlist: 0,
      organizer: "Computer Science Department",
      budget: "$5,000",
      expenses: "$4,800",
      companies: 5,
      image:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
    },
  ];

  const stats = [
    { label: "Total Events", value: "24", change: "+6", icon: CalendarIcon },
    { label: "Total Attendees", value: "1,247", change: "+234", icon: Users },
    {
      label: "Avg Attendance Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
    },
    { label: "Events This Month", value: "8", change: "+2", icon: CheckCircle },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || event.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "ongoing":
        return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCapacityStatus = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90)
      return { color: "text-red-600", status: "Nearly Full" };
    if (percentage >= 70)
      return { color: "text-yellow-600", status: "Filling Up" };
    return { color: "text-green-600", status: "Available" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-2">
            Plan, organize, and manage career development events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
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

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">All Events</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events by title or type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="grid gap-6">
            {filteredEvents.map((event) => {
              const capacityStatus = getCapacityStatus(
                event.registered,
                event.capacity
              );
              return (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-6">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {event.title}
                              </h3>
                              {getStatusBadge(event.status)}
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {event.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>
                              {event.registered}/{event.capacity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">
                              Organizer: {event.organizer}
                            </span>
                            <span
                              className={`font-medium ${capacityStatus.color}`}
                            >
                              {capacityStatus.status}
                            </span>
                            {event.waitlist > 0 && (
                              <span className="text-orange-600">
                                {event.waitlist} on waitlist
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Mail className="mr-1 h-4 w-4" />
                              Contact Attendees
                            </Button>
                            <Button size="sm">Manage Event</Button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Registration Progress</span>
                            <span>
                              {Math.round(
                                (event.registered / event.capacity) * 100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(event.registered / event.capacity) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>
                Plan and organize a new career development event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventTitle">Event Title *</Label>
                  <Input
                    id="eventTitle"
                    placeholder="e.g. Spring Career Fair 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career-fair">Career Fair</SelectItem>
                      <SelectItem value="networking">
                        Networking Event
                      </SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="panel">Panel Discussion</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="info-session">Info Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event, its purpose, and what attendees can expect..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date *</Label>
                  <Input id="eventDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input id="startTime" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input id="endTime" type="time" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. University Campus - Main Hall"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Maximum number of attendees"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input id="organizer" placeholder="e.g. Career Services" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Event budget in USD"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Registration Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements for attendees..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3">
                <Button size="lg">Create Event</Button>
                <Button variant="outline" size="lg">
                  Save as Draft
                </Button>
                <Button variant="outline" size="lg">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Events scheduled for the coming weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter((e) => e.status === "upcoming")
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">
                            {event.time} • {event.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{event.type}</Badge>
                            <span className="text-xs text-gray-500">
                              {event.registered}/{event.capacity} registered
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
                <CardDescription>Key metrics for your events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Attendance Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">No-Show Rate</span>
                    <span className="font-medium">13%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Event Rating</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Repeat Attendees</span>
                    <span className="font-medium">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Event Types</CardTitle>
                <CardDescription>
                  Most attended event categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Career Fairs</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Workshops</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Networking Events</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: "18%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Panel Discussions</span>
                      <span>9%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: "9%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Financial summary of events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    $45,000
                  </div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    $38,200
                  </div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    $6,800
                  </div>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">85%</div>
                  <p className="text-sm text-gray-600">Budget Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
