"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Building,
  MessageSquare,
  UserPlus,
  Filter,
  GraduationCap,
  Calendar,
  Users,
  Star,
  Briefcase,
  Award,
  Clock,
  ExternalLink
} from "lucide-react";

export function AlumniNetwork() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const alumni = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      graduationYear: "2019",
      major: "Computer Science",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      connections: 245,
      isConnected: false,
      skills: ["React", "Python", "Machine Learning", "Leadership"],
      bio: "Passionate about building scalable systems and mentoring new graduates.",
      experience: "5+ years",
      mentoring: true
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      graduationYear: "2018",
      major: "Business Administration",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      connections: 189,
      isConnected: true,
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
      bio: "Leading product initiatives that impact millions of users worldwide.",
      experience: "6+ years",
      mentoring: true
    },
    {
      id: 3,
      name: "Emily Johnson",
      title: "UX Design Lead",
      company: "Apple",
      location: "Cupertino, CA",
      graduationYear: "2020",
      major: "Design",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      connections: 156,
      isConnected: false,
      skills: ["User Research", "Figma", "Design Systems", "Prototyping"],
      bio: "Creating intuitive experiences that delight users and drive business growth.",
      experience: "4+ years",
      mentoring: true
    },
    {
      id: 4,
      name: "David Kim",
      title: "Data Scientist",
      company: "Netflix",
      location: "Los Gatos, CA",
      graduationYear: "2017",
      major: "Statistics",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      connections: 203,
      isConnected: false,
      skills: ["Python", "TensorFlow", "SQL", "Statistics"],
      bio: "Using data to understand user behavior and improve content recommendations.",
      experience: "7+ years",
      mentoring: false
    },
    {
      id: 5,
      name: "Jessica Wang",
      title: "Marketing Director",
      company: "Airbnb",
      location: "San Francisco, CA",
      graduationYear: "2016",
      major: "Marketing",
      avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      connections: 312,
      isConnected: true,
      skills: ["Digital Marketing", "Brand Strategy", "Analytics", "Growth"],
      bio: "Building global marketing strategies that connect people and places.",
      experience: "8+ years",
      mentoring: true
    }
  ];

  const events = [
    {
      id: 1,
      title: "Alumni Tech Meetup",
      date: "March 15, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "San Francisco, CA",
      attendees: 45,
      type: "Networking",
      description: "Connect with fellow alumni working in tech companies across the Bay Area."
    },
    {
      id: 2,
      title: "Career Panel: Breaking into Product",
      date: "March 22, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "Virtual Event",
      attendees: 120,
      type: "Panel",
      description: "Learn from alumni who successfully transitioned into product management roles."
    },
    {
      id: 3,
      title: "Alumni Mentorship Program Launch",
      date: "April 5, 2024",
      time: "5:00 PM - 7:00 PM",
      location: "University Campus",
      attendees: 80,
      type: "Program",
      description: "Kick-off event for our new structured mentorship program."
    }
  ];

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || person.company === selectedCompany;
    const matchesYear = !selectedYear || person.graduationYear === selectedYear;
    
    return matchesSearch && matchesCompany && matchesYear;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>
        <p className="text-gray-600 mt-2">Connect with graduates and expand your professional network</p>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="events">Events & Meetups</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search alumni by name, company, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Companies</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Netflix">Netflix</SelectItem>
                    <SelectItem value="Airbnb">Airbnb</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Graduation Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    <SelectItem value="2016">2016</SelectItem>
                    <SelectItem value="2017">2017</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alumni Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAlumni.map((person) => (
              <Card key={person.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{person.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{person.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">{person.company}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">{person.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{person.bio}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      <GraduationCap className="mr-1 h-3 w-3" />
                      Class of {person.graduationYear}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {person.experience}
                    </Badge>
                    {person.mentoring && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        <Award className="mr-1 h-3 w-3" />
                        Mentor
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {person.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {person.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      {person.connections} connections
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Message
                      </Button>
                      <Button size="sm" variant={person.isConnected ? "secondary" : "default"}>
                        <UserPlus className="mr-1 h-4 w-4" />
                        {person.isConnected ? "Connected" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
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
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        {event.attendees} attending
                      </div>
                      <Button>Register</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Find a Mentor</CardTitle>
                <CardDescription>
                  Connect with experienced alumni who can guide your career journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alumni.filter(a => a.mentoring).slice(0, 3).map((mentor) => (
                  <div key={mentor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{mentor.name}</h4>
                        <p className="text-sm text-gray-600">{mentor.title} at {mentor.company}</p>
                      </div>
                    </div>
                    <Button size="sm">Request Mentorship</Button>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  View All Mentors
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Become a Mentor</CardTitle>
                <CardDescription>
                  Share your experience and help current students succeed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Why Mentor?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Give back to your alma mater</li>
                    <li>• Develop leadership skills</li>
                    <li>• Expand your professional network</li>
                    <li>• Make a meaningful impact</li>
                  </ul>
                </div>
                <Button className="w-full">
                  Apply to be a Mentor
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}