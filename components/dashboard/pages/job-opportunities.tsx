"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Filter,
  Building,
  Users,
  Star,
  ExternalLink
} from "lucide-react";

export function JobOpportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      description: "We're looking for a passionate Frontend Developer to join our growing team...",
      requirements: ["React", "TypeScript", "Node.js", "AWS"],
      logo: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 95,
      saved: false
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "DataFlow Analytics",
      location: "Remote",
      type: "Full-time",
      salary: "$100k - $130k",
      posted: "1 week ago",
      description: "Join our data science team to build cutting-edge ML models...",
      requirements: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      logo: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 88,
      saved: true
    },
    {
      id: 3,
      title: "Product Manager",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110k - $140k",
      posted: "3 days ago",
      description: "Lead product strategy and development for our flagship platform...",
      requirements: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 82,
      saved: false
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$95k - $125k",
      posted: "5 days ago",
      description: "Help us scale our infrastructure and improve deployment processes...",
      requirements: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      logo: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 78,
      saved: false
    },
    {
      id: 5,
      title: "UX Designer",
      company: "Design Studio Pro",
      location: "Los Angeles, CA",
      type: "Contract",
      salary: "$80k - $100k",
      posted: "1 day ago",
      description: "Create beautiful and intuitive user experiences for our clients...",
      requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
      logo: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 85,
      saved: true
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
    const matchesType = !selectedType || job.type === selectedType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
        <p className="text-gray-600 mt-2">Discover your next career opportunity</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                <SelectItem value="New York">New York, NY</SelectItem>
                <SelectItem value="Austin">Austin, TX</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles, CA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} opportunities
        </p>
        <Select defaultValue="match">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
            <SelectItem value="company">Company A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={job.logo} 
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {job.match}% match
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Bookmark className={`h-4 w-4 ${job.saved ? 'fill-current text-blue-600' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>

                    <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                    <div className="flex items-center gap-2 mt-3">
                      {job.requirements.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <Button>Apply Now</Button>
                      <Button variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Similar Jobs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Opportunities
        </Button>
      </div>
    </div>
  );
}