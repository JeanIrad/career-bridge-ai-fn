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
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  Building2,
  Video,
  Edit,
  Eye,
} from "lucide-react";

export function EmployerEvents() {
  const events = [
    {
      id: 1,
      title: "TechCorp Virtual Career Fair",
      type: "Career Fair",
      date: "2024-03-22",
      time: "10:00 AM - 4:00 PM",
      location: "Virtual Event",
      registrations: 145,
      capacity: 200,
      universities: ["Stanford", "UC Berkeley", "MIT", "Caltech"],
      status: "Upcoming",
      description:
        "Join us for our annual virtual career fair featuring opportunities across all departments.",
    },
    {
      id: 2,
      title: "Engineering Campus Visit - Stanford",
      type: "Campus Visit",
      date: "2024-03-28",
      time: "2:00 PM - 5:00 PM",
      location: "Stanford University, Engineering Quad",
      registrations: 35,
      capacity: 50,
      universities: ["Stanford University"],
      status: "Upcoming",
      description:
        "On-campus recruitment event focused on engineering roles and internships.",
    },
    {
      id: 3,
      title: "Data Science Workshop",
      type: "Workshop",
      date: "2024-04-05",
      time: "1:00 PM - 3:00 PM",
      location: "TechCorp HQ, Conference Room A",
      registrations: 28,
      capacity: 30,
      universities: ["UC Berkeley", "Stanford"],
      status: "Upcoming",
      description:
        "Hands-on workshop covering real-world data science challenges and solutions.",
    },
    {
      id: 4,
      title: "Alumni Networking Mixer",
      type: "Networking",
      date: "2024-02-15",
      time: "6:00 PM - 8:00 PM",
      location: "Downtown Conference Center",
      registrations: 67,
      capacity: 80,
      universities: ["MIT", "Stanford", "UC Berkeley"],
      status: "Completed",
      description:
        "Networking event connecting current employees with university alumni.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Career Fair":
        return Building2;
      case "Campus Visit":
        return MapPin;
      case "Workshop":
        return Users;
      case "Networking":
        return Users;
      case "Virtual Event":
        return Video;
      default:
        return Calendar;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events & Recruitment</h1>
          <p className="text-muted-foreground">
            Manage campus visits, career fairs, and recruitment events
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold">208</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Partner Universities
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Building2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Attendance
                </p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage your recruitment events and campus activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {events.map((event) => {
              const TypeIcon = getTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {event.title}
                          </h3>
                          <Badge variant="outline">{event.type}</Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Registration Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Registered:</span>
                          <span className="font-medium">
                            {event.registrations}/{event.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(event.registrations / event.capacity) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(
                            (event.registrations / event.capacity) * 100
                          )}
                          % capacity
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Partner Universities</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.universities.map((uni, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {uni}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Event Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          {event.type}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Status:</span>{" "}
                          {event.status}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            Capacity:
                          </span>{" "}
                          {event.capacity} attendees
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-1" />
                        Attendees
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {event.status === "Upcoming" && (
                        <>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Event
                          </Button>
                          <Button size="sm">Manage Event</Button>
                        </>
                      )}
                      {event.status === "Completed" && (
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
