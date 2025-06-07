"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar,
  Bookmark, 
  Filter,
  Building,
  GraduationCap,
  Star,
  ExternalLink,
  Award,
  Users
} from "lucide-react";

export function Internships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedField, setSelectedField] = useState("");

  const internships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      duration: "12 weeks",
      startDate: "June 2024",
      stipend: "$8,000/month",
      posted: "1 day ago",
      description: "Join our engineering team to work on cutting-edge projects that impact billions of users...",
      requirements: ["Computer Science", "Python/Java", "Data Structures", "Algorithms"],
      logo: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 98,
      saved: true,
      difficulty: "Competitive",
      applicants: 1200,
      spots: 50
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      duration: "10 weeks",
      startDate: "May 2024",
      stipend: "$7,500/month",
      posted: "3 days ago",
      description: "Work with our data science team to build ML models and analyze user behavior...",
      requirements: ["Statistics", "Python", "Machine Learning", "SQL"],
      logo: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 92,
      saved: false,
      difficulty: "Moderate",
      applicants: 800,
      spots: 25
    },
    {
      id: 3,
      title: "UX Design Intern",
      company: "Apple",
      location: "Cupertino, CA",
      duration: "12 weeks",
      startDate: "June 2024",
      stipend: "$7,000/month",
      posted: "5 days ago",
      description: "Design intuitive user experiences for our next-generation products...",
      requirements: ["Design Thinking", "Figma", "User Research", "Prototyping"],
      logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 87,
      saved: true,
      difficulty: "Competitive",
      applicants: 600,
      spots: 15
    },
    {
      id: 4,
      title: "Marketing Analytics Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      duration: "8 weeks",
      startDate: "July 2024",
      stipend: "$6,500/month",
      posted: "1 week ago",
      description: "Analyze marketing campaigns and user engagement across our platforms...",
      requirements: ["Marketing", "Analytics", "Excel", "SQL"],
      logo: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      match: 84,
      saved: false,
      difficulty: "Moderate",
      applicants: 450,
      spots: 20
    }
  ];

  const applications = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Stripe",
      status: "Interview Scheduled",
      appliedDate: "2024-02-15",
      nextStep: "Technical Interview - March 5, 2024",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "Product Management Intern",
      company: "Airbnb",
      status: "Under Review",
      appliedDate: "2024-02-10",
      nextStep: "Waiting for response",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      title: "Data Analyst Intern",
      company: "Netflix",
      status: "Rejected",
      appliedDate: "2024-02-01",
      nextStep: "Application closed",
      statusColor: "bg-red-100 text-red-800"
    }
  ];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = !selectedDuration || internship.duration.includes(selectedDuration);
    const matchesField = !selectedField || internship.requirements.some(req => 
      req.toLowerCase().includes(selectedField.toLowerCase())
    );
    
    return matchesSearch && matchesDuration && matchesField;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Internship Opportunities</h1>
        <p className="text-gray-600 mt-2">Launch your career with hands-on experience</p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Internships</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Internships</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search internships, companies, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Durations</SelectItem>
                    <SelectItem value="8">8 weeks</SelectItem>
                    <SelectItem value="10">10 weeks</SelectItem>
                    <SelectItem value="12">12 weeks</SelectItem>
                    <SelectItem value="16">16 weeks</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fields</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
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
              Showing {filteredInternships.length} of {internships.length} internships
            </p>
            <Select defaultValue="match">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="stipend">Highest Stipend</SelectItem>
                <SelectItem value="deadline">Application Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Internship Listings */}
          <div className="space-y-4">
            {filteredInternships.map((internship) => (
              <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <img 
                        src={internship.logo} 
                        alt={internship.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                              {internship.title}
                            </h3>
                            <p className="text-gray-600 font-medium">{internship.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {internship.match}% match
                            </Badge>
                            <Badge variant={internship.difficulty === 'Competitive' ? 'destructive' : 'secondary'}>
                              {internship.difficulty}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Bookmark className={`h-4 w-4 ${internship.saved ? 'fill-current text-blue-600' : ''}`} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {internship.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {internship.startDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {internship.stipend}
                          </div>
                        </div>

                        <p className="text-gray-700 mt-3 line-clamp-2">{internship.description}</p>

                        <div className="flex items-center gap-2 mt-3">
                          {internship.requirements.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button>Apply Now</Button>
                            <Button variant="outline">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {internship.applicants} applicants • {internship.spots} spots
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track your internship application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{app.title}</h4>
                      <p className="text-sm text-gray-600">{app.company}</p>
                      <p className="text-xs text-gray-500 mt-1">Applied: {app.appliedDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={app.statusColor}>{app.status}</Badge>
                      <p className="text-sm text-gray-600 mt-1">{app.nextStep}</p>
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
              <CardTitle>Saved Internships</CardTitle>
              <CardDescription>Your bookmarked opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {internships.filter(i => i.saved).map((internship) => (
                  <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={internship.logo} 
                        alt={internship.company}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{internship.title}</h4>
                        <p className="text-sm text-gray-600">{internship.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{internship.match}% match</Badge>
                      <Button size="sm">Apply</Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4 fill-current text-blue-600" />
                      </Button>
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