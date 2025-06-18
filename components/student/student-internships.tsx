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
  Search,
  Filter,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Star,
  Bookmark,
  GraduationCap,
} from "lucide-react";

export function StudentInternships() {
  const internships = [
    {
      id: 1,
      title: "Summer Software Engineering Internship",
      company: "Google",
      location: "Mountain View, CA",
      duration: "12 weeks",
      startDate: "June 2024",
      salary: "$8,000/month",
      posted: "1 week ago",
      deadline: "3 weeks left",
      match: 95,
      description:
        "Work on large-scale distributed systems and contribute to products used by billions of users.",
      requirements: [
        "Computer Science",
        "Data Structures",
        "Algorithms",
        "Python/Java",
      ],
      perks: [
        "Housing Stipend",
        "Transportation",
        "Mentorship",
        "Full-time Conversion",
      ],
      applicants: 2500,
      acceptance: "2%",
      saved: true,
      applied: false,
    },
    {
      id: 2,
      title: "Data Science Internship",
      company: "Netflix",
      location: "Los Gatos, CA",
      duration: "10 weeks",
      startDate: "June 2024",
      salary: "$7,500/month",
      posted: "3 days ago",
      deadline: "1 month left",
      match: 89,
      description:
        "Analyze user behavior data and build machine learning models to improve content recommendations.",
      requirements: ["Statistics", "Python", "SQL", "Machine Learning"],
      perks: [
        "Netflix Subscription",
        "401k",
        "Health Benefits",
        "Gym Membership",
      ],
      applicants: 1800,
      acceptance: "3%",
      saved: false,
      applied: true,
    },
    {
      id: 3,
      title: "Product Design Internship",
      company: "Airbnb",
      location: "San Francisco, CA",
      duration: "12 weeks",
      startDate: "May 2024",
      salary: "$6,800/month",
      posted: "5 days ago",
      deadline: "2 weeks left",
      match: 82,
      description:
        "Design user experiences for millions of travelers and hosts on our platform.",
      requirements: [
        "Design Thinking",
        "Figma",
        "User Research",
        "Prototyping",
      ],
      perks: [
        "Travel Credits",
        "Design Tools",
        "Mentorship",
        "Portfolio Review",
      ],
      applicants: 950,
      acceptance: "4%",
      saved: false,
      applied: false,
    },
    {
      id: 4,
      title: "Finance Internship Program",
      company: "Goldman Sachs",
      location: "New York, NY",
      duration: "10 weeks",
      startDate: "June 2024",
      salary: "$85/hour",
      posted: "2 weeks ago",
      deadline: "1 week left",
      match: 76,
      description:
        "Gain exposure to investment banking, trading, and asset management divisions.",
      requirements: ["Finance", "Economics", "Excel", "Financial Modeling"],
      perks: [
        "Networking Events",
        "Training Program",
        "Full-time Offer",
        "Relocation Assistance",
      ],
      applicants: 3200,
      acceptance: "1.5%",
      saved: true,
      applied: false,
    },
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-emerald-100 text-emerald-700";
    if (match >= 80) return "bg-blue-100 text-blue-700";
    if (match >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getAcceptanceColor = (acceptance: string) => {
    const rate = parseFloat(acceptance);
    if (rate <= 2) return "text-red-600";
    if (rate <= 5) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internship Opportunities</h1>
          <p className="text-muted-foreground">
            Find summer internships and co-op programs from top companies
          </p>
        </div>
        <Button>
          <GraduationCap className="w-4 h-4 mr-2" />
          Application Tips
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships by company, role, or location..."
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
                  Available Internships
                </p>
                <p className="text-2xl font-bold">45</p>
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
                  Applications Sent
                </p>
                <p className="text-2xl font-bold">8</p>
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
                  Saved Internships
                </p>
                <p className="text-2xl font-bold">12</p>
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
                  Interview Invites
                </p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Internship Listings */}
      <div className="space-y-6">
        {internships.map((internship) => (
          <Card
            key={internship.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                    {internship.company.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">
                        {internship.title}
                      </h3>
                      <Badge className={getMatchColor(internship.match)}>
                        {internship.match}% Match
                      </Badge>
                      {internship.applied && (
                        <Badge variant="secondary">Applied</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 mb-2">
                      <Building2 className="w-4 h-4" />
                      {internship.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {internship.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {internship.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {internship.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {internship.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Bookmark
                      className={`w-4 h-4 ${internship.saved ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {internship.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.requirements.map((req, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Perks & Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.perks.map((perk, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Posted {internship.posted}</span>
                  <span>{internship.deadline}</span>
                  <span>
                    {internship.applicants.toLocaleString()} applicants
                  </span>
                  <span
                    className={`font-medium ${getAcceptanceColor(internship.acceptance)}`}
                  >
                    {internship.acceptance} acceptance rate
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" disabled={internship.applied}>
                    {internship.applied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Internships</Button>
      </div>
    </div>
  );
}
