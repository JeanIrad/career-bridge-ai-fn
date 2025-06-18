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
  GraduationCap,
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  TrendingUp,
} from "lucide-react";

export function EmployerUniversities() {
  const universityPartners = [
    {
      id: 1,
      name: "Stanford University",
      location: "Stanford, CA",
      type: "Private Research University",
      students: 17249,
      partnerSince: "2018",
      relationship: "Premium Partner",
      contactPerson: "Dr. Sarah Chen",
      contactEmail: "sarah.chen@stanford.edu",
      lastInteraction: "2 days ago",
      stats: {
        applications: 89,
        hires: 12,
        events: 4,
        satisfaction: 4.8,
      },
      programs: ["Computer Science", "Engineering", "Business", "Data Science"],
    },
    {
      id: 2,
      name: "UC Berkeley",
      location: "Berkeley, CA",
      type: "Public Research University",
      students: 45057,
      partnerSince: "2019",
      relationship: "Standard Partner",
      contactPerson: "Prof. Michael Rodriguez",
      contactEmail: "michael.rodriguez@berkeley.edu",
      lastInteraction: "1 week ago",
      stats: {
        applications: 76,
        hires: 9,
        events: 3,
        satisfaction: 4.6,
      },
      programs: ["Engineering", "Computer Science", "Business Administration"],
    },
    {
      id: 3,
      name: "MIT",
      location: "Cambridge, MA",
      type: "Private Research University",
      students: 11934,
      partnerSince: "2020",
      relationship: "Premium Partner",
      contactPerson: "Dr. Lisa Wang",
      contactEmail: "lisa.wang@mit.edu",
      lastInteraction: "3 days ago",
      stats: {
        applications: 54,
        hires: 8,
        events: 5,
        satisfaction: 4.9,
      },
      programs: ["Computer Science", "Engineering", "AI/ML", "Robotics"],
    },
    {
      id: 4,
      name: "Caltech",
      location: "Pasadena, CA",
      type: "Private Research University",
      students: 2397,
      partnerSince: "2021",
      relationship: "Standard Partner",
      contactPerson: "Dr. James Thompson",
      contactEmail: "james.thompson@caltech.edu",
      lastInteraction: "5 days ago",
      stats: {
        applications: 43,
        hires: 6,
        events: 2,
        satisfaction: 4.7,
      },
      programs: ["Engineering", "Computer Science", "Physics", "Mathematics"],
    },
  ];

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "Premium Partner":
        return "bg-emerald-100 text-emerald-700";
      case "Standard Partner":
        return "bg-blue-100 text-blue-700";
      case "New Partner":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">University Partners</h1>
          <p className="text-muted-foreground">
            Manage relationships with university partners and track recruitment
            success
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add University Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Partners
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl font-bold">76,637</p>
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
                  Hires This Year
                </p>
                <p className="text-2xl font-bold">35</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Satisfaction
                </p>
                <p className="text-2xl font-bold">4.7</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>University Partners</CardTitle>
              <CardDescription>
                Manage your university partnerships and recruitment
                relationships
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {universityPartners.map((university) => (
              <div
                key={university.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                      {university.name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl">
                          {university.name}
                        </h3>
                        <Badge
                          className={getRelationshipColor(
                            university.relationship
                          )}
                        >
                          {university.relationship}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {university.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {university.students.toLocaleString()} students
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Partner since {university.partnerSince}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {university.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {university.stats.satisfaction}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Performance Stats</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Applications:
                        </span>
                        <span className="font-medium">
                          {university.stats.applications}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hires:</span>
                        <span className="font-medium">
                          {university.stats.hires}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Events:</span>
                        <span className="font-medium">
                          {university.stats.events}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Success Rate:
                        </span>
                        <span className="font-medium">
                          {Math.round(
                            (university.stats.hires /
                              university.stats.applications) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Contact:</span>{" "}
                        {university.contactPerson}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {university.contactEmail}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Last Contact:
                        </span>{" "}
                        {university.lastInteraction}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Key Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.programs.map((program, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {program}
                        </Badge>
                      ))}
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
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Schedule Visit
                    </Button>
                    <Button size="sm">Manage Partnership</Button>
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
