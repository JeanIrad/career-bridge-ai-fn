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
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  DollarSign,
  Heart,
  Bookmark,
  Star,
  Users,
} from "lucide-react";

export function StudentJobs() {
  const jobListings = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Internship",
      duration: "3 months",
      salary: "$25-30/hour",
      posted: "2 days ago",
      deadline: "2 weeks left",
      match: 92,
      description:
        "Join our engineering team to work on cutting-edge web applications using React, Node.js, and cloud technologies.",
      requirements: ["React", "JavaScript", "Node.js", "Git"],
      benefits: [
        "Health Insurance",
        "Flexible Hours",
        "Mentorship",
        "Remote Work",
      ],
      applicants: 78,
      saved: false,
      applied: false,
    },
    {
      id: 2,
      title: "Data Science Graduate Position",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "Full-time",
      duration: "Permanent",
      salary: "$95k-120k",
      posted: "1 week ago",
      deadline: "1 month left",
      match: 88,
      description:
        "Seeking a data scientist to join our analytics team working on machine learning models and data visualization.",
      requirements: ["Python", "SQL", "Machine Learning", "Statistics"],
      benefits: [
        "401k Match",
        "Health Insurance",
        "Stock Options",
        "Learning Budget",
      ],
      applicants: 156,
      saved: true,
      applied: false,
    },
    {
      id: 3,
      title: "UX Design Intern",
      company: "Creative Studio",
      location: "Remote",
      type: "Internship",
      duration: "6 months",
      salary: "$20-25/hour",
      posted: "3 days ago",
      deadline: "3 weeks left",
      match: 85,
      description:
        "Work with our design team to create user-centered experiences for mobile and web applications.",
      requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
      benefits: [
        "Remote Work",
        "Flexible Schedule",
        "Design Tools",
        "Portfolio Development",
      ],
      applicants: 45,
      saved: false,
      applied: true,
    },
    {
      id: 4,
      title: "Product Management Trainee",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Graduate Program",
      duration: "12 months",
      salary: "$70k-85k",
      posted: "5 days ago",
      deadline: "2 weeks left",
      match: 79,
      description:
        "Join our product management trainee program and learn to drive product strategy and development.",
      requirements: [
        "Business Analysis",
        "Communication",
        "Project Management",
        "Analytics",
      ],
      benefits: [
        "Career Development",
        "Mentorship",
        "Health Insurance",
        "Equity",
      ],
      applicants: 234,
      saved: false,
      applied: false,
    },
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-emerald-100 text-emerald-700";
    if (match >= 80) return "bg-blue-100 text-blue-700";
    if (match >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Search</h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
        <Button>
          <Bookmark className="w-4 h-4 mr-2" />
          Saved Jobs
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
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
                  Available Jobs
                </p>
                <p className="text-2xl font-bold">125</p>
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
                  Applications Sent
                </p>
                <p className="text-2xl font-bold">12</p>
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
                  Saved Jobs
                </p>
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">3</p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {jobListings.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge className={getMatchColor(job.match)}>
                        {job.match}% Match
                      </Badge>
                      {job.applied && (
                        <Badge variant="secondary">Applied</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 mb-2">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Heart
                      className={`w-4 h-4 ${job.saved ? "fill-current text-red-500" : ""}`}
                    />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bookmark
                      className={`w-4 h-4 ${job.saved ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {job.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((skill, index) => (
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
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Posted {job.posted}</span>
                  <span>{job.deadline}</span>
                  <span>{job.applicants} applicants</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" disabled={job.applied}>
                    {job.applied ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Jobs</Button>
      </div>
    </div>
  );
}
