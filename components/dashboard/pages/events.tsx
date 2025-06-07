"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar as CalendarIcon,
  Users,
  Filter,
  Plus,
  ExternalLink,
  Bookmark,
  Share2
} from "lucide-react";

export function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: "Tech Career Fair 2024",
      description: "Connect with top tech companies and explore career opportunities in software engineering, data science, and product management.",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "University Campus - Main Hall",
      type: "Career Fair",
      attendees: 150,
      maxAttendees: 200,
      organizer: "Career Services",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      isRegistered: true,
      isFeatured: true,
      tags: ["Technology", "Networking", "Career"]
    },
    {
      id: 2,
      title: "Alumni Networking Night",
      description: "An evening of networking with successful alumni from various industries. Great opportunity to build professional connections.",
      date: "March 20, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Downtown Convention Center",
      type: "Networking",
      attendees: 75,
      maxAttendees: 100,
      organizer: "Alumni Association",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      isRegistered: false,
      isFeatured: true,
      tags: ["Alumni", "Networking", "Professional"]
    },
    {
      id: 3,
      title: "Resume Workshop",
      description: "Learn how to craft a compelling resume that stands out to employers. Get personalized feedback from career experts.",
      date: "March 25, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      type: "Workshop",
      attendees: 45,
      maxAttendees: 50,
      organizer: "Career Development Center",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      isRegistered: true,
      isFeatured: false,
      tags: ["Resume", "Career", "Skills"]
    },
    {
      id: 4,
      title: "Startup Pitch Competition",
      description: "Watch innovative student startups pitch their ideas to a panel of investors and industry experts.",
      date: "April 2, 2024",
      time: "1:00 PM - 5:00 PM",
      location: "Innovation Hub - Auditorium",
      type: "Competition",
      attendees: 120,
      maxAttendees: 150,
      organizer: "Entrepreneurship Club",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      isRegistered: false,
      isFeatured: false,
      tags: ["Startup", "Innovation", "Competition"]
    },
    {
      id: 5,
      title: "Data Science Bootcamp",
      description: "Intensive 2-day bootcamp covering machine learning, data analysis, and visualization techniques.",
      date: "April 8, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Computer Science Building",
      type: "Bootcamp",
      attendees: 30,
      maxAttendees: 40,
      organizer: "Data Science Society",
      image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      isRegistered: false,
      isFeatured: true,
      tags: ["Data Science", "Learning", "Technical"]
    }
  ];

  const myEvents = events.filter(event => event.isRegistered);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || event.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Workshops</h1>
          <p className="text-gray-600 mt-2">Discover opportunities to learn, network, and grow</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search events, workshops, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Career Fair">Career Fair</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Bootcamp">Bootcamp</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Events */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.filter(e => e.isFeatured).map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-blue-600">Featured</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{event.type}</Badge>
                      <span className="text-sm text-gray-500">{event.organizer}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant={event.isRegistered ? "secondary" : "default"}
                      >
                        {event.isRegistered ? "Registered" : "Register"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Events */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Events</h2>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge variant="secondary">{event.type}</Badge>
                              {event.isFeatured && <Badge className="bg-blue-600">Featured</Badge>}
                            </div>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.attendees}/{event.maxAttendees}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant={event.isRegistered ? "secondary" : "default"}
                              size="sm"
                            >
                              {event.isRegistered ? "Registered" : "Register"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-1 h-4 w-4" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Registered Events</CardTitle>
              <CardDescription>Events you've registered for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="ghost" size="sm">Cancel</Button>
                    </div>
                  </div>
                ))}
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
                <CardDescription>Events scheduled for the coming weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-lg font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.time} • {event.location}</p>
                      </div>
                      <Badge variant="secondary">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}