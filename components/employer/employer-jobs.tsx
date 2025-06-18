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
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  MapPin,
  Users,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EmployerJobs() {
  const jobPostings = [
    {
      id: 1,
      title: "Software Engineering Intern - Summer 2024",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Internship",
      salary: "$25-30/hour",
      applications: 78,
      views: 456,
      status: "Active",
      posted: "2 weeks ago",
      expires: "4 weeks remaining",
      description:
        "Join our engineering team to work on cutting-edge web applications...",
    },
    {
      id: 2,
      title: "Data Science Graduate Position",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      salary: "$95k-120k",
      applications: 92,
      views: 623,
      status: "Active",
      posted: "1 week ago",
      expires: "7 weeks remaining",
      description: "Seeking a data scientist to join our analytics team...",
    },
    {
      id: 3,
      title: "Product Marketing Intern",
      department: "Marketing",
      location: "New York, NY",
      type: "Internship",
      salary: "$20-25/hour",
      applications: 45,
      views: 289,
      status: "Active",
      posted: "3 days ago",
      expires: "8 weeks remaining",
      description: "Help drive product marketing initiatives and campaigns...",
    },
    {
      id: 4,
      title: "UX Design Co-op",
      department: "Design",
      location: "Boston, MA",
      type: "Co-op",
      salary: "$22-28/hour",
      applications: 34,
      views: 178,
      status: "Draft",
      posted: "Not published",
      expires: "Not set",
      description:
        "Work with our design team to create user-centered experiences...",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Paused":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">
            Manage your job postings and track applications
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Postings
                </p>
                <p className="text-2xl font-bold">8</p>
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
                  Total Applications
                </p>
                <p className="text-2xl font-bold">324</p>
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
                  Total Views
                </p>
                <p className="text-2xl font-bold">1,546</p>
              </div>
              <Eye className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Applications
                </p>
                <p className="text-2xl font-bold">41</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Job Postings</CardTitle>
              <CardDescription>
                Manage and track your job postings performance
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-10 w-64" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobPostings.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Posting
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        View Applications
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Applications:</span>
                    <p className="font-semibold text-lg">{job.applications}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Views:</span>
                    <p className="font-semibold text-lg">{job.views}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conversion:</span>
                    <p className="font-semibold text-lg">
                      {Math.round((job.applications / job.views) * 100)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <p className="font-semibold text-sm">{job.expires}</p>
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
