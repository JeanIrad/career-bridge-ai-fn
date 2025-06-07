"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Target,
  Award,
  BookOpen
} from "lucide-react";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-blue-100 mb-4">
          Ready to take the next step in your career journey? Here's what's happening today.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            <Target className="mr-2 h-4 w-4" />
            Complete Profile
          </Button>
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
            <BookOpen className="mr-2 h-4 w-4" />
            Take Skill Assessment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Invites</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +5 new connections
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              AI-curated opportunities based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Frontend Developer Intern",
                company: "TechCorp Inc.",
                location: "Remote",
                type: "Internship",
                match: 95
              },
              {
                title: "Software Engineer",
                company: "StartupXYZ",
                location: "San Francisco, CA",
                type: "Full-time",
                match: 88
              },
              {
                title: "Data Science Intern",
                company: "DataFlow",
                location: "New York, NY",
                type: "Internship",
                match: 82
              }
            ].map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{job.location}</span>
                    <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{job.match}% match</div>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Opportunities
            </Button>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Profile Strength
            </CardTitle>
            <CardDescription>
              Complete your profile to get better matches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Add Skills</span>
                <Button size="sm" variant="outline">Add</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Upload Resume</span>
                <Button size="sm" variant="outline">Upload</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Add Projects</span>
                <Button size="sm" variant="outline">Add</Button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> Profiles with 90%+ completion get 3x more views!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                name: "Sarah Chen",
                role: "Alumni - Google",
                message: "Thanks for connecting! Happy to help with your career questions.",
                time: "2h ago",
                avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              },
              {
                name: "TechCorp Recruiter",
                role: "HR Manager",
                message: "We'd like to schedule an interview for the Frontend position.",
                time: "5h ago",
                avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              },
              {
                name: "Mike Johnson",
                role: "Alumni - Microsoft",
                message: "Great meeting you at the networking event!",
                time: "1d ago",
                avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
              }
            ].map((message, index) => (
              <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <img 
                  src={message.avatar} 
                  alt={message.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium truncate">{message.name}</h4>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-xs text-gray-600">{message.role}</p>
                  <p className="text-sm text-gray-800 mt-1 line-clamp-2">{message.message}</p>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Messages
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Tech Career Fair 2024",
                date: "March 15, 2024",
                time: "10:00 AM - 4:00 PM",
                location: "University Campus",
                attendees: 150
              },
              {
                title: "Alumni Networking Night",
                date: "March 20, 2024",
                time: "6:00 PM - 9:00 PM",
                location: "Downtown Convention Center",
                attendees: 75
              },
              {
                title: "Resume Workshop",
                date: "March 25, 2024",
                time: "2:00 PM - 4:00 PM",
                location: "Virtual Event",
                attendees: 45
              }
            ].map((event, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                  <Badge variant="secondary">{event.attendees} attending</Badge>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              View All Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}