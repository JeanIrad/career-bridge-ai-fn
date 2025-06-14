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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MapPin,
  Globe,
  Users,
  Calendar,
  Camera,
  Save,
  Eye,
  Star,
  Award,
  Briefcase,
  TrendingUp,
  X,
  Plus,
} from "lucide-react";

export function CompanyProfile() {
  const [benefits, setBenefits] = useState<string[]>([
    "Health Insurance",
    "401(k) Matching",
    "Flexible Work Hours",
    "Remote Work Options",
  ]);
  const [newBenefit, setNewBenefit] = useState("");

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter((benefit) => benefit !== benefitToRemove));
  };

  const companyStats = [
    { label: "Profile Views", value: "1,234", change: "+12%", icon: Eye },
    { label: "Job Applications", value: "456", change: "+8%", icon: Briefcase },
    { label: "Candidate Matches", value: "89", change: "+15%", icon: Users },
    { label: "Company Rating", value: "4.8", change: "+0.2", icon: Star },
  ];

  const recentActivity = [
    {
      action: "New job posting published",
      details: "Senior Software Engineer",
      time: "2 hours ago",
    },
    {
      action: "Profile viewed by candidate",
      details: "Alex Thompson",
      time: "4 hours ago",
    },
    {
      action: "Application received",
      details: "Frontend Developer position",
      time: "6 hours ago",
    },
    {
      action: "Company rating updated",
      details: "New review from employee",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your company information and employer brand
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Profile
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {companyStats.map((stat, index) => {
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

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="culture">Culture & Values</TabsTrigger>
          <TabsTrigger value="benefits">Benefits & Perks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input id="companyName" defaultValue="TechCorp Inc." />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Input id="industry" defaultValue="Technology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <select
                        id="companySize"
                        className="w-full p-2 border rounded-md"
                      >
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option selected>201-500 employees</option>
                        <option>501-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded Year</Label>
                      <Input id="founded" type="number" defaultValue="2015" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headquarters">Headquarters</Label>
                      <Input
                        id="headquarters"
                        defaultValue="San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://techcorp.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description *</Label>
                    <Textarea
                      id="description"
                      defaultValue="TechCorp is a leading technology company focused on building innovative software solutions that transform how businesses operate. We're passionate about creating products that make a real difference in people's lives."
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How candidates can reach your company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        defaultValue="careers@techcorp.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Office Address</Label>
                    <Textarea
                      id="address"
                      defaultValue="123 Tech Street, Suite 100, San Francisco, CA 94105"
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Logo</CardTitle>
                  <CardDescription>Upload your company logo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <Building className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Current Logo</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload New Logo
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completion</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Add company photos</span>
                      <Button size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Complete benefits section</span>
                      <Button size="sm" variant="outline">
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-gray-600">{activity.details}</p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Culture & Values</CardTitle>
              <CardDescription>
                Showcase what makes your company unique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  placeholder="Describe your company's mission and purpose..."
                  className="min-h-[100px]"
                  defaultValue="To empower businesses through innovative technology solutions that drive growth and efficiency."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="values">Core Values</Label>
                <Textarea
                  id="values"
                  placeholder="List your company's core values..."
                  className="min-h-[100px]"
                  defaultValue="Innovation, Integrity, Collaboration, Excellence, Customer Focus"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workEnvironment">Work Environment</Label>
                <Textarea
                  id="workEnvironment"
                  placeholder="Describe your work environment and culture..."
                  className="min-h-[120px]"
                  defaultValue="We foster a collaborative, inclusive environment where creativity thrives. Our open office design encourages communication, while quiet spaces support focused work."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diversity">Diversity & Inclusion</Label>
                <Textarea
                  id="diversity"
                  placeholder="Describe your commitment to diversity and inclusion..."
                  className="min-h-[100px]"
                  defaultValue="We believe diverse teams build better products. We're committed to creating an inclusive workplace where everyone can thrive."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Photos</CardTitle>
              <CardDescription>
                Add photos that showcase your workplace and culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Office Space</p>
                  <Button size="sm" className="mt-2">
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Team Photos</p>
                  <Button size="sm" className="mt-2">
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Events & Awards</p>
                  <Button size="sm" className="mt-2">
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
              <CardDescription>
                Highlight what you offer to attract top talent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Company Benefits</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                  />
                  <Button type="button" onClick={addBenefit}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {benefit}
                      <button onClick={() => removeBenefit(benefit)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="healthBenefits">Health & Wellness</Label>
                  <Textarea
                    id="healthBenefits"
                    placeholder="Describe health and wellness benefits..."
                    className="min-h-[100px]"
                    defaultValue="Comprehensive health, dental, and vision insurance. On-site gym and wellness programs."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOff">Time Off & Flexibility</Label>
                  <Textarea
                    id="timeOff"
                    placeholder="Describe time off and flexibility policies..."
                    className="min-h-[100px]"
                    defaultValue="Unlimited PTO, flexible work hours, and remote work options. Sabbatical program after 5 years."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financial">Financial Benefits</Label>
                  <Textarea
                    id="financial"
                    placeholder="Describe financial benefits and compensation..."
                    className="min-h-[100px]"
                    defaultValue="Competitive salary, equity participation, 401(k) with company matching, and annual bonuses."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="development">Professional Development</Label>
                  <Textarea
                    id="development"
                    placeholder="Describe learning and development opportunities..."
                    className="min-h-[100px]"
                    defaultValue="$2,000 annual learning budget, conference attendance, mentorship programs, and internal training."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Profile Performance
                </CardTitle>
                <CardDescription>
                  How your company profile is performing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Profile Views (30 days)</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Job Post Views</span>
                    <span className="font-medium">5,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Application Rate</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Candidate Engagement</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Company Rating
                </CardTitle>
                <CardDescription>
                  Feedback from candidates and employees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="flex justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on 127 reviews
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Work-Life Balance</span>
                    <span>4.9</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Company Culture</span>
                    <span>4.8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Career Growth</span>
                    <span>4.7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compensation</span>
                    <span>4.6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Demographics</CardTitle>
              <CardDescription>
                Insights about candidates viewing your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-3">Top Universities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>MIT</span>
                      <span>23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stanford</span>
                      <span>18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UC Berkeley</span>
                      <span>15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carnegie Mellon</span>
                      <span>12%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Top Skills</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>JavaScript</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Python</span>
                      <span>38%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>React</span>
                      <span>32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Machine Learning</span>
                      <span>28%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Experience Level</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entry Level</span>
                      <span>42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid Level</span>
                      <span>35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Senior Level</span>
                      <span>18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead/Principal</span>
                      <span>5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
