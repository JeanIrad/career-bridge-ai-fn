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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Star,
  MessageSquare,
  Download,
  Eye,
  Heart,
  GraduationCap,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

export function CandidatePool() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const candidates = [
    {
      id: 1,
      name: "Alex Thompson",
      title: "Computer Science Student",
      university: "MIT",
      graduationYear: "2024",
      location: "Boston, MA",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      skills: ["React", "Python", "Machine Learning", "AWS"],
      gpa: "3.8",
      experience: "2 internships",
      projects: 5,
      rating: 4.8,
      status: "available",
      appliedJobs: ["Senior Software Engineer"],
      saved: false,
      contacted: false,
      resumeUrl: "#",
    },
    {
      id: 2,
      name: "Sarah Chen",
      title: "Data Science Graduate",
      university: "Stanford University",
      graduationYear: "2023",
      location: "San Francisco, CA",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      skills: ["Python", "TensorFlow", "SQL", "Statistics"],
      gpa: "3.9",
      experience: "1 year",
      projects: 8,
      rating: 4.9,
      status: "employed",
      appliedJobs: ["Data Science Intern"],
      saved: true,
      contacted: true,
      resumeUrl: "#",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      title: "UX Design Student",
      university: "Carnegie Mellon",
      graduationYear: "2024",
      location: "Pittsburgh, PA",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      skills: ["Figma", "User Research", "Prototyping", "Adobe Creative Suite"],
      gpa: "3.7",
      experience: "3 internships",
      projects: 12,
      rating: 4.6,
      status: "available",
      appliedJobs: [],
      saved: false,
      contacted: false,
      resumeUrl: "#",
    },
    {
      id: 4,
      name: "Emily Johnson",
      title: "Marketing Graduate",
      university: "Northwestern",
      graduationYear: "2023",
      location: "Chicago, IL",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      skills: ["Digital Marketing", "Analytics", "Content Strategy", "SEO"],
      gpa: "3.6",
      experience: "2 years",
      projects: 6,
      rating: 4.4,
      status: "available",
      appliedJobs: ["Product Manager"],
      saved: true,
      contacted: false,
      resumeUrl: "#",
    },
  ];

  const stats = [
    {
      label: "Total Candidates",
      value: "1,247",
      change: "+89",
      icon: GraduationCap,
    },
    { label: "Available Now", value: "892", change: "+45", icon: Award },
    { label: "Saved Candidates", value: "23", change: "+5", icon: Heart },
    { label: "Contacted", value: "67", change: "+12", icon: MessageSquare },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill =
      !selectedSkill ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    const matchesLocation =
      !selectedLocation || candidate.location.includes(selectedLocation);

    return matchesSearch && matchesSkill && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "employed":
        return <Badge className="bg-blue-100 text-blue-800">Employed</Badge>;
      case "seeking":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Actively Seeking
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const savedCandidates = candidates.filter((c) => c.saved);
  const availableCandidates = candidates.filter(
    (c) => c.status === "available"
  );
  const appliedCandidates = candidates.filter((c) => c.appliedJobs.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Pool</h1>
          <p className="text-gray-600 mt-2">
            Discover and connect with talented students and graduates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Advanced Search
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
                  <span className="text-green-600">{stat.change}</span> this
                  month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Candidates ({candidates.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied ({appliedCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved ({savedCandidates.length})
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
                      placeholder="Search candidates by name, university, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Skills" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Skills</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Machine Learning">
                      Machine Learning
                    </SelectItem>
                    <SelectItem value="Figma">Figma</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="Boston">Boston, MA</SelectItem>
                    <SelectItem value="San Francisco">
                      San Francisco, CA
                    </SelectItem>
                    <SelectItem value="Pittsburgh">Pittsburgh, PA</SelectItem>
                    <SelectItem value="Chicago">Chicago, IL</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={candidate.avatar}
                          alt={candidate.name}
                        />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">
                          {candidate.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Heart
                          className={`h-4 w-4 ${candidate.saved ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {candidate.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      {candidate.university} • Class of{" "}
                      {candidate.graduationYear}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      {candidate.experience} • {candidate.projects} projects
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="font-medium">GPA:</span> {candidate.gpa}
                    </div>
                    {getStatusBadge(candidate.status)}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {candidate.appliedJobs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Applied to:</p>
                      {candidate.appliedJobs.map((job, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs mr-1"
                        >
                          {job}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Candidates</CardTitle>
              <CardDescription>
                Candidates currently seeking opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {availableCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={candidate.avatar}
                          alt={candidate.name}
                        />
                        <AvatarFallback>
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">
                          {candidate.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {candidate.university} • {candidate.location}
                      </div>
                      <Button size="sm">Contact</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applied" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applied Candidates</CardTitle>
              <CardDescription>
                Candidates who have applied to your job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appliedCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">
                            {candidate.title}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {candidate.appliedJobs.map((job, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {job}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Review Application
                        </Button>
                        <Button size="sm">Schedule Interview</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Candidates</CardTitle>
              <CardDescription>
                Candidates you've saved for future opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>
                            {candidate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{candidate.name}</h4>
                          <p className="text-sm text-gray-600">
                            {candidate.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {candidate.university}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Message
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
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
