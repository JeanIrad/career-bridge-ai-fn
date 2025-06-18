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
  Building2,
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  TrendingUp,
  Briefcase,
  Award,
} from "lucide-react";

export function UniversityPartners() {
  const industryPartners = [
    {
      id: 1,
      name: "Google",
      industry: "Technology",
      location: "Mountain View, CA",
      partnerSince: "2018",
      relationship: "Premium Partner",
      contactPerson: "Sarah Chen",
      contactEmail: "sarah.chen@google.com",
      lastInteraction: "2 days ago",
      stats: {
        activeJobs: 12,
        studentsHired: 89,
        events: 8,
        satisfaction: 4.9,
      },
      programs: ["Software Engineering", "Data Science", "Product Management"],
    },
    {
      id: 2,
      name: "Microsoft",
      industry: "Technology",
      location: "Redmond, WA",
      partnerSince: "2019",
      relationship: "Premium Partner",
      contactPerson: "Michael Rodriguez",
      contactEmail: "michael.rodriguez@microsoft.com",
      lastInteraction: "1 week ago",
      stats: {
        activeJobs: 8,
        studentsHired: 67,
        events: 6,
        satisfaction: 4.8,
      },
      programs: ["Computer Science", "Engineering", "Business"],
    },
    {
      id: 3,
      name: "Tesla",
      industry: "Automotive/Energy",
      location: "Austin, TX",
      partnerSince: "2020",
      relationship: "Standard Partner",
      contactPerson: "Dr. Lisa Wang",
      contactEmail: "lisa.wang@tesla.com",
      lastInteraction: "3 days ago",
      stats: {
        activeJobs: 15,
        studentsHired: 45,
        events: 4,
        satisfaction: 4.7,
      },
      programs: ["Engineering", "Sustainable Energy", "AI/Robotics"],
    },
    {
      id: 4,
      name: "Goldman Sachs",
      industry: "Financial Services",
      location: "New York, NY",
      partnerSince: "2017",
      relationship: "Premium Partner",
      contactPerson: "James Thompson",
      contactEmail: "james.thompson@gs.com",
      lastInteraction: "5 days ago",
      stats: {
        activeJobs: 6,
        studentsHired: 34,
        events: 3,
        satisfaction: 4.6,
      },
      programs: ["Finance", "Economics", "Business Administration"],
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
          <h1 className="text-3xl font-bold">Industry Partners</h1>
          <p className="text-muted-foreground">
            Manage relationships with industry partners and track collaboration
            success
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
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
                <p className="text-2xl font-bold">127</p>
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
                  Active Job Postings
                </p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Students Placed
                </p>
                <p className="text-2xl font-bold">456</p>
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
                <p className="text-2xl font-bold">4.8</p>
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
              <CardTitle>Industry Partners</CardTitle>
              <CardDescription>
                Manage your industry partnerships and collaboration
                relationships
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {industryPartners.map((partner) => (
              <div
                key={partner.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-xl">
                          {partner.name}
                        </h3>
                        <Badge
                          className={getRelationshipColor(partner.relationship)}
                        >
                          {partner.relationship}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {partner.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {partner.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Partner since {partner.partnerSince}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {partner.stats.satisfaction}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Performance Stats</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Active Jobs:
                        </span>
                        <span className="font-medium">
                          {partner.stats.activeJobs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Students Hired:
                        </span>
                        <span className="font-medium">
                          {partner.stats.studentsHired}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Events:</span>
                        <span className="font-medium">
                          {partner.stats.events}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Contact:</span>{" "}
                        {partner.contactPerson}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {partner.contactEmail}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Last Contact:
                        </span>{" "}
                        {partner.lastInteraction}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Focus Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.programs.map((program, index) => (
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
                      Schedule Meeting
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
