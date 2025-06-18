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
  Calendar,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Building2,
  Video,
  Star,
  Bookmark,
  Plus,
} from "lucide-react";

export function StudentEvents() {
  const events = [
    {
      id: 1,
      title: "Tech Career Fair 2024",
      type: "Career Fair",
      date: "2024-03-15",
      time: "10:00 AM - 4:00 PM",
      location: "University Center, Main Hall",
      format: "In-Person",
      organizer: "Stanford Career Services",
      attendees: 250,
      companies: 45,
      description:
        "Connect with top tech companies and explore internship and full-time opportunities.",
      tags: ["Technology", "Internships", "Full-time", "Networking"],
      registered: true,
      saved: false,
      featured: true,
    },
    {
      id: 2,
      title: "AI & Machine Learning Workshop",
      type: "Workshop",
      date: "2024-03-20",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Event",
      format: "Virtual",
      organizer: "Google AI",
      attendees: 180,
      companies: 1,
      description:
        "Hands-on workshop covering the latest trends in AI and machine learning applications.",
      tags: ["AI", "Machine Learning", "Technical", "Hands-on"],
      registered: false,
      saved: true,
      featured: false,
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      type: "Competition",
      date: "2024-03-25",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Hub, Auditorium",
      format: "In-Person",
      organizer: "Entrepreneurship Club",
      attendees: 120,
      companies: 8,
      description:
        "Present your startup ideas to a panel of investors and industry experts.",
      tags: ["Entrepreneurship", "Startups", "Pitching", "Investment"],
      registered: false,
      saved: false,
      featured: false,
    },
    {
      id: 4,
      title: "Women in Tech Panel",
      type: "Panel Discussion",
      date: "2024-04-02",
      time: "7:00 PM - 8:30 PM",
      location: "Student Union, Conference Room A",
      format: "Hybrid",
      organizer: "Women in Computing",
      attendees: 95,
      companies: 6,
      description:
        "Inspiring panel discussion with successful women leaders in technology.",
      tags: ["Diversity", "Leadership", "Inspiration", "Networking"],
      registered: true,
      saved: true,
      featured: false,
    },
    {
      id: 5,
      title: "Resume & Interview Bootcamp",
      type: "Workshop",
      date: "2024-04-08",
      time: "1:00 PM - 4:00 PM",
      location: "Career Center, Workshop Room",
      format: "In-Person",
      organizer: "Career Development Office",
      attendees: 60,
      companies: 3,
      description:
        "Intensive workshop to perfect your resume and ace your interviews.",
      tags: ["Career Prep", "Resume", "Interviews", "Skills"],
      registered: false,
      saved: false,
      featured: false,
    },
    {
      id: 6,
      title: "Alumni Networking Mixer",
      type: "Networking",
      date: "2024-04-12",
      time: "6:00 PM - 8:00 PM",
      location: "Downtown Conference Center",
      format: "In-Person",
      organizer: "Alumni Association",
      attendees: 200,
      companies: 25,
      description:
        "Connect with alumni working at top companies across various industries.",
      tags: ["Alumni", "Networking", "Industry", "Mentorship"],
      registered: false,
      saved: false,
      featured: true,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Career Fair":
        return "bg-blue-100 text-blue-700";
      case "Workshop":
        return "bg-green-100 text-green-700";
      case "Competition":
        return "bg-purple-100 text-purple-700";
      case "Panel Discussion":
        return "bg-orange-100 text-orange-700";
      case "Networking":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Virtual":
        return Video;
      case "Hybrid":
        return Building2;
      default:
        return MapPin;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events & Opportunities</h1>
          <p className="text-muted-foreground">
            Discover career fairs, workshops, and networking events
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title, type, or organizer..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold">8</p>
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
                  Registered Events
                </p>
                <p className="text-2xl font-bold">3</p>
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
                  Saved Events
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Bookmark className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Events Attended
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Listings */}
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => {
          const FormatIcon = getFormatIcon(event.format);
          return (
            <Card
              key={event.id}
              className={`hover:shadow-md transition-shadow ${event.featured ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      {event.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {event.registered && (
                        <Badge className="bg-green-100 text-green-700">
                          Registered
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge variant="outline">{event.format}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.organizer}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Bookmark
                      className={`w-4 h-4 ${event.saved ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FormatIcon className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees} attendees
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {event.companies} companies
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={event.registered}
                  >
                    {event.registered ? "Registered" : "Register"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Events</Button>
      </div>
    </div>
  );
}
