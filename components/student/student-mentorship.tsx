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
  Users,
  Search,
  Filter,
  Star,
  MessageCircle,
  Calendar,
  Award,
  Building2,
  GraduationCap,
  Clock,
  Video,
} from "lucide-react";

export function StudentMentorship() {
  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      experience: "8 years",
      education: "Stanford University - MS Computer Science",
      expertise: [
        "Software Development",
        "Career Growth",
        "Technical Interviews",
        "Leadership",
      ],
      rating: 4.9,
      reviews: 47,
      students: 23,
      responseTime: "< 2 hours",
      price: "$50/session",
      availability: "Available",
      bio: "Passionate about helping students transition into tech careers. Specialized in backend systems and distributed computing.",
      sessions: 156,
      connected: false,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "Meta",
      experience: "6 years",
      education: "UC Berkeley - MBA",
      expertise: [
        "Product Strategy",
        "User Research",
        "Data Analysis",
        "Agile Development",
      ],
      rating: 4.8,
      reviews: 32,
      students: 18,
      responseTime: "< 4 hours",
      price: "$45/session",
      availability: "Available",
      bio: "Former engineer turned PM. Love helping students understand the intersection of technology and business.",
      sessions: 89,
      connected: true,
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      role: "Data Science Director",
      company: "Netflix",
      experience: "10 years",
      education: "MIT - PhD Statistics",
      expertise: [
        "Machine Learning",
        "Statistics",
        "Research",
        "Team Management",
      ],
      rating: 4.9,
      reviews: 28,
      students: 15,
      responseTime: "< 6 hours",
      price: "$60/session",
      availability: "Busy",
      bio: "Research background with industry experience. Helping students navigate data science careers and PhD applications.",
      sessions: 67,
      connected: false,
    },
    {
      id: 4,
      name: "James Park",
      role: "UX Design Lead",
      company: "Airbnb",
      experience: "7 years",
      education: "RISD - MFA Design",
      expertise: [
        "User Experience",
        "Design Systems",
        "Portfolio Review",
        "Creative Direction",
      ],
      rating: 4.7,
      reviews: 41,
      students: 29,
      responseTime: "< 3 hours",
      price: "$40/session",
      availability: "Available",
      bio: "Design leader passionate about creating inclusive experiences. Happy to review portfolios and discuss design careers.",
      sessions: 134,
      connected: false,
    },
  ];

  const myMentors = [
    {
      name: "Michael Rodriguez",
      nextSession: "Tomorrow, 2:00 PM",
      topic: "Product Strategy Discussion",
      type: "Video Call",
    },
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Busy":
        return "bg-yellow-100 text-yellow-700";
      case "Unavailable":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mentorship Program</h1>
          <p className="text-muted-foreground">
            Connect with industry professionals for career guidance and advice
          </p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          My Mentors
        </Button>
      </div>

      {/* My Active Mentorships */}
      {myMentors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Your scheduled mentorship sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myMentors.map((mentor, index) => (
                <div key={index} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {mentor.topic}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mentor.nextSession}</span>
                        <Badge variant="outline">{mentor.type}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm">
                        <Video className="w-4 h-4 mr-1" />
                        Join Session
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by expertise, company, or role..."
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
                  Available Mentors
                </p>
                <p className="text-2xl font-bold">156</p>
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
                  My Mentors
                </p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sessions Completed
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
                  Avg. Rating Given
                </p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentor Listings */}
      <div className="grid md:grid-cols-2 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                  {mentor.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <Badge
                      className={getAvailabilityColor(mentor.availability)}
                    >
                      {mentor.availability}
                    </Badge>
                    {mentor.connected && (
                      <Badge variant="secondary">Connected</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-1">{mentor.role}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{mentor.company}</span>
                    <span>•</span>
                    <span>{mentor.experience} experience</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-medium mb-1">Education</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {mentor.education}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-muted-foreground">
                      ({mentor.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {mentor.students} students mentored
                  </p>
                </div>
                <div>
                  <p className="font-medium">{mentor.price}</p>
                  <p className="text-muted-foreground">
                    Response time: {mentor.responseTime}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={mentor.connected}
                >
                  {mentor.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Mentors</Button>
      </div>
    </div>
  );
}
