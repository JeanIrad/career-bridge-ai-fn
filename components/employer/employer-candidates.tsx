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
  MapPin,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  Eye,
  MessageCircle,
} from "lucide-react";

export function EmployerCandidates() {
  const candidates = [
    {
      id: 1,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@stanford.edu",
      phone: "+1 (555) 123-4567",
      university: "Stanford University",
      major: "Computer Science",
      graduationYear: "2024",
      gpa: "3.8",
      location: "Palo Alto, CA",
      skills: ["React", "Python", "Machine Learning", "AWS"],
      experience: "2 internships",
      appliedFor: "Software Engineering Intern",
      applicationDate: "2024-03-10",
      status: "Interview Scheduled",
      rating: 4.8,
      notes: "Strong technical background, excellent communication skills",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@berkeley.edu",
      phone: "+1 (555) 234-5678",
      university: "UC Berkeley",
      major: "Data Science",
      graduationYear: "2025",
      gpa: "3.7",
      location: "Berkeley, CA",
      skills: ["SQL", "R", "Tableau", "Statistics"],
      experience: "1 internship",
      appliedFor: "Data Analyst Intern",
      applicationDate: "2024-03-08",
      status: "Under Review",
      rating: 4.5,
      notes: "Great analytical skills, needs more hands-on experience",
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@mit.edu",
      phone: "+1 (555) 345-6789",
      university: "MIT",
      major: "Design & Technology",
      graduationYear: "2024",
      gpa: "3.9",
      location: "Cambridge, MA",
      skills: ["Figma", "User Research", "Prototyping", "Adobe Creative"],
      experience: "3 internships",
      appliedFor: "UX Design Intern",
      applicationDate: "2024-03-05",
      status: "Offer Extended",
      rating: 4.9,
      notes: "Exceptional portfolio, strong design thinking",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-700";
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Offer Extended":
        return "bg-green-100 text-green-700";
      case "Rejected":
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
          <h1 className="text-3xl font-bold">Candidate Management</h1>
          <p className="text-muted-foreground">
            Review and manage job applicants and potential candidates
          </p>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Talent Pool
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Candidates
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
                  Interviews Scheduled
                </p>
                <p className="text-2xl font-bold">12</p>
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
                  Offers Extended
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Rating
                </p>
                <p className="text-2xl font-bold">4.6</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Candidates</CardTitle>
              <CardDescription>
                Review candidate profiles and manage applications
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
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
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-xl">
                          {candidate.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {candidate.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        Applied for: {candidate.appliedFor}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {candidate.university}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Class of {candidate.graduationYear}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Academic Info</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Major:</span>{" "}
                        {candidate.major}
                      </p>
                      <p>
                        <span className="text-muted-foreground">GPA:</span>{" "}
                        {candidate.gpa}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Experience:
                        </span>{" "}
                        {candidate.experience}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact Info</h4>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {candidate.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Application</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Applied:</span>{" "}
                        {candidate.applicationDate}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        {candidate.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {candidate.notes}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Schedule Interview
                    </Button>
                    <Button size="sm">Move to Next Stage</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
