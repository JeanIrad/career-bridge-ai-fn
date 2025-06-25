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
import { Progress } from "@/components/ui/progress";
import {
  RoleGuard,
  AdminOnly,
  EmployerOnly,
  UniversityOnly,
} from "@/components/auth/role-guard";
import {
  Briefcase,
  TrendingUp,
  Users,
  Target,
  MapPin,
  Clock,
  Building2,
  Star,
  Award,
  Calendar,
  BookOpen,
  GraduationCap,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useAchievements } from "@/hooks/use-achievements";

export function StudentOverview() {
  const { user } = useAuth();
  const { achievements, stats, isLoading } = useAchievements();

  const quickStats = [
    {
      label: "Applications Sent",
      value: "12",
      change: "+3 this week",
      icon: Briefcase,
    },
    {
      label: "Profile Views",
      value: "48",
      change: "+12 this week",
      icon: TrendingUp,
    },
    {
      label: "Network Connections",
      value: "156",
      change: "+8 this week",
      icon: Users,
    },
    {
      label: "Achievements",
      value: isLoading ? "..." : `${stats?.achievementsEarned || 0}`,
      change: isLoading ? "Loading..." : `${stats?.totalPoints || 0} points`,
      icon: Award,
    },
  ];

  const jobRecommendations = [
    {
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Internship",
      salary: "$25/hour",
      match: 92,
      posted: "2 days ago",
      skills: ["React", "TypeScript", "CSS"],
    },
    {
      title: "Software Engineering Graduate",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$95k - $120k",
      match: 88,
      posted: "1 week ago",
      skills: ["JavaScript", "Node.js", "MongoDB"],
    },
    {
      title: "UX Design Intern",
      company: "Creative Studio",
      location: "Remote",
      type: "Internship",
      salary: "$20/hour",
      match: 85,
      posted: "3 days ago",
      skills: ["Figma", "User Research", "Prototyping"],
    },
  ];

  const upcomingEvents = [
    {
      title: "Tech Career Fair 2024",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "University Center",
      attendees: 250,
    },
    {
      title: "AI & Machine Learning Workshop",
      date: "March 20, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Event",
      attendees: 180,
    },
    {
      title: "Networking Mixer - Alumni Connect",
      date: "March 25, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Downtown Conference Center",
      attendees: 120,
    },
  ];

  const mentorSpotlight = {
    name: "Sarah Chen",
    role: "Senior Software Engineer at Google",
    experience: "8 years",
    expertise: [
      "Software Development",
      "Career Growth",
      "Technical Interviews",
    ],
    rating: 4.9,
    students: 23,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-lg opacity-90 mb-6">
            You have 3 new job matches and 2 upcoming events. Let's accelerate
            your career journey!
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
            >
              View New Matches
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Complete Profile
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
          <div className="h-full w-full bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-emerald-600">{stat.change}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Job Recommendations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                AI-Powered Job Recommendations
              </CardTitle>
              <CardDescription>
                Personalized opportunities based on your skills and career goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobRecommendations.map((job, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      {job.match}% match
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.posted}
                    </span>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {job.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-emerald-600">
                        {job.salary}
                      </span>
                      <Button size="sm">Apply Now</Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                View All Job Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {event.attendees} attendees
                  </p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Spotlight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mentor Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    SC
                  </div>
                  <div>
                    <h4 className="font-medium">{mentorSpotlight.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {mentorSpotlight.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {mentorSpotlight.rating} ({mentorSpotlight.students}{" "}
                      students)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mentorSpotlight.expertise.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  Connect with Mentor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>JavaScript Fundamentals</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>React Development</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Career Skills</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>

              <Button variant="outline" size="sm" className="w-full">
                View Learning Path
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
