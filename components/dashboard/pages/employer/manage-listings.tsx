"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  Download,
  Pause,
  Play,
  Copy,
} from "lucide-react";

export function ManageListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      status: "active",
      applications: 45,
      views: 234,
      posted: "2024-03-01",
      expires: "2024-04-01",
      featured: true,
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      type: "Internship",
      location: "Remote",
      salary: "$25/hour",
      status: "active",
      applications: 23,
      views: 156,
      posted: "2024-03-05",
      expires: "2024-04-05",
      featured: false,
    },
    {
      id: 3,
      title: "Product Manager",
      type: "Full-time",
      location: "New York, NY",
      salary: "$110k - $140k",
      status: "paused",
      applications: 67,
      views: 345,
      posted: "2024-02-28",
      expires: "2024-03-28",
      featured: false,
    },
    {
      id: 4,
      title: "Data Science Intern",
      type: "Internship",
      location: "Boston, MA",
      salary: "$30/hour",
      status: "draft",
      applications: 0,
      views: 0,
      posted: "2024-03-08",
      expires: "2024-04-08",
      featured: false,
    },
    {
      id: 5,
      title: "UX Designer",
      type: "Full-time",
      location: "Seattle, WA",
      salary: "$95k - $125k",
      status: "expired",
      applications: 89,
      views: 567,
      posted: "2024-02-01",
      expires: "2024-03-01",
      featured: true,
    },
  ];

  const stats = [
    { label: "Total Listings", value: "12", change: "+2", icon: Users },
    { label: "Active Jobs", value: "8", change: "+1", icon: Play },
    { label: "Total Applications", value: "234", change: "+45", icon: Users },
    { label: "This Month Views", value: "1,234", change: "+156", icon: Eye },
  ];

  const filteredListings = jobListings.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeListings = jobListings.filter((job) => job.status === "active");
  const draftListings = jobListings.filter((job) => job.status === "draft");
  const expiredListings = jobListings.filter((job) => job.status === "expired");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Job Listings
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your job postings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Listings ({jobListings.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({draftListings.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search job listings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Job Listings ({filteredListings.length})</CardTitle>
              <CardDescription>
                Manage all your job postings and track their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredListings.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.featured && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Featured
                            </Badge>
                          )}
                          {getStatusBadge(job.status)}
                          <Badge variant="outline">{job.type}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications} applications
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views} views
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Posted: {job.posted}</span>
                          <span>Expires: {job.expires}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        {job.status === "active" ? (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : job.status === "paused" ? (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Job Listings</CardTitle>
              <CardDescription>
                Currently published and accepting applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeListings.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">
                          {job.location} • {job.salary}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.applications} applications • {job.views} views
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          View Applications
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Draft Listings</CardTitle>
              <CardDescription>
                Unpublished job listings that need completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {draftListings.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">
                          {job.location} • {job.salary}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {job.posted}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm">Complete & Publish</Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expired Listings</CardTitle>
              <CardDescription>
                Job listings that have reached their expiration date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiredListings.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {job.location} • {job.salary}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expired: {job.expires} • {job.applications} total
                          applications
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Repost
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
