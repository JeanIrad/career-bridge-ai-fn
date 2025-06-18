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
  HandHeart,
  Search,
  Filter,
  Users,
  Building2,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  TrendingUp,
  Award,
  GraduationCap,
} from "lucide-react";

export function UniversityAlumni() {
  const alumni = [
    {
      id: 1,
      name: "Sarah Chen",
      graduationYear: "2018",
      degree: "MS Computer Science",
      currentRole: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      mentoring: true,
      studentsHelped: 23,
      lastActive: "2 days ago",
      expertise: [
        "Software Development",
        "Career Growth",
        "Technical Interviews",
      ],
      rating: 4.9,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      graduationYear: "2016",
      degree: "MBA",
      currentRole: "Product Manager",
      company: "Meta",
      location: "Menlo Park, CA",
      mentoring: true,
      studentsHelped: 18,
      lastActive: "1 week ago",
      expertise: ["Product Strategy", "Leadership", "Entrepreneurship"],
      rating: 4.8,
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      graduationYear: "2015",
      degree: "PhD Statistics",
      currentRole: "Data Science Director",
      company: "Netflix",
      location: "Los Gatos, CA",
      mentoring: false,
      studentsHelped: 0,
      lastActive: "1 month ago",
      expertise: ["Machine Learning", "Statistics", "Research"],
      rating: 4.7,
    },
    {
      id: 4,
      name: "James Park",
      graduationYear: "2019",
      degree: "BS Engineering",
      currentRole: "Startup Founder",
      company: "TechStart Inc.",
      location: "San Francisco, CA",
      mentoring: true,
      studentsHelped: 12,
      lastActive: "3 days ago",
      expertise: ["Entrepreneurship", "Fundraising", "Product Development"],
      rating: 4.6,
    },
  ];

  const alumniStats = [
    {
      label: "Total Alumni",
      value: "15,600+",
      change: "+234 new members",
      icon: GraduationCap,
    },
    {
      label: "Active Mentors",
      value: "1,247",
      change: "+89 this month",
      icon: HandHeart,
    },
    {
      label: "Students Helped",
      value: "3,456",
      change: "+156 this quarter",
      icon: Users,
    },
    {
      label: "Success Stories",
      value: "892",
      change: "+45 this month",
      icon: Award,
    },
  ];

  const mentorshipPrograms = [
    {
      program: "Career Mentorship",
      participants: 234,
      mentors: 89,
      satisfaction: 4.8,
      description: "One-on-one career guidance and professional development",
    },
    {
      program: "Industry Insights",
      participants: 156,
      mentors: 45,
      satisfaction: 4.7,
      description: "Industry-specific knowledge sharing and networking",
    },
    {
      program: "Entrepreneurship Track",
      participants: 78,
      mentors: 23,
      satisfaction: 4.9,
      description: "Startup guidance and business development support",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alumni Network</h1>
          <p className="text-muted-foreground">
            Manage alumni engagement and mentorship programs
          </p>
        </div>
        <Button>
          <HandHeart className="w-4 h-4 mr-2" />
          Invite Alumni
        </Button>
      </div>

      {/* Alumni Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alumniStats.map((stat, index) => (
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
        {/* Alumni Directory */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alumni Directory</CardTitle>
                  <CardDescription>
                    Connect with alumni and manage mentorship relationships
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alumni..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alumni.map((alum) => (
                  <div
                    key={alum.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                          {alum.name
                            .split(" ")
                            .map((n) => n.charAt(0))
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {alum.name}
                            </h3>
                            {alum.mentoring && (
                              <Badge className="bg-emerald-100 text-emerald-700">
                                Mentoring
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-1">
                            {alum.currentRole} at {alum.company}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              Class of {alum.graduationYear}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {alum.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{alum.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Education</h4>
                        <p className="text-sm text-muted-foreground">
                          {alum.degree}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Mentorship</h4>
                        <div className="text-sm">
                          {alum.mentoring ? (
                            <div>
                              <p className="font-semibold text-emerald-600">
                                {alum.studentsHelped} students helped
                              </p>
                              <p className="text-muted-foreground">
                                Last active: {alum.lastActive}
                              </p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              Not currently mentoring
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-1">
                          {alum.expertise.slice(0, 2).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {alum.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{alum.expertise.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {!alum.mentoring && (
                          <Button size="sm" variant="outline">
                            Invite to Mentor
                          </Button>
                        )}
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mentorship Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mentorship Programs</CardTitle>
              <CardDescription>
                Active alumni mentorship initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorshipPrograms.map((program, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{program.program}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{program.satisfaction}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {program.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Participants:
                        </span>
                        <p className="font-medium">{program.participants}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mentors:</span>
                        <p className="font-medium">{program.mentors}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Manage Program
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <HandHeart className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Event
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Newsletter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
