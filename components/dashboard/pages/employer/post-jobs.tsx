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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Save,
  Eye,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  X,
} from "lucide-react";

export function PostJobs() {
  const [jobType, setJobType] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const jobTemplates = [
    {
      title: "Software Engineer",
      type: "Full-time",
      category: "Engineering",
      description:
        "Join our engineering team to build scalable software solutions...",
    },
    {
      title: "Marketing Intern",
      type: "Internship",
      category: "Marketing",
      description:
        "Gain hands-on experience in digital marketing and brand management...",
    },
    {
      title: "Data Analyst",
      type: "Full-time",
      category: "Data Science",
      description:
        "Analyze data to drive business insights and decision making...",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600 mt-2">
            Create and publish job opportunities for students and alumni
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Details
              </CardTitle>
              <CardDescription>
                Basic information about the position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="co-op">Co-op</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="e.g. Engineering" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Requirements & Qualifications
              </CardTitle>
              <CardDescription>
                Skills and qualifications needed for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the required qualifications, experience, and skills..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred">Preferred Qualifications</Label>
                <Textarea
                  id="preferred"
                  placeholder="List nice-to-have qualifications and skills..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">
                        Entry Level (0-2 years)
                      </SelectItem>
                      <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                      <SelectItem value="senior">
                        Senior Level (5+ years)
                      </SelectItem>
                      <SelectItem value="lead">
                        Lead/Principal (8+ years)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associates">
                        Associate's Degree
                      </SelectItem>
                      <SelectItem value="bachelors">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation & Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Compensation & Benefits
              </CardTitle>
              <CardDescription>
                Salary range and benefits information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="e.g. 80000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="e.g. 120000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      <SelectItem value="cad">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  placeholder="Describe the benefits, perks, and compensation package..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label>Additional Benefits</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health" />
                    <Label htmlFor="health">Health Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="dental" />
                    <Label htmlFor="dental">Dental Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vision" />
                    <Label htmlFor="vision">Vision Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="retirement" />
                    <Label htmlFor="retirement">401(k) / Retirement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pto" />
                    <Label htmlFor="pto">Paid Time Off</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remote" />
                    <Label htmlFor="remote">Remote Work Options</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Settings
              </CardTitle>
              <CardDescription>
                Configure how applications are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">
                    Application Deadline
                  </Label>
                  <Input id="applicationDeadline" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Expected Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationInstructions">
                  Application Instructions
                </Label>
                <Textarea
                  id="applicationInstructions"
                  placeholder="Provide specific instructions for applicants..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label>Application Requirements</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resume" defaultChecked />
                    <Label htmlFor="resume">Resume Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coverLetter" />
                    <Label htmlFor="coverLetter">Cover Letter Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="portfolio" />
                    <Label htmlFor="portfolio">Portfolio Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="references" />
                    <Label htmlFor="references">References Required</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1">
              Publish Job
            </Button>
            <Button variant="outline" size="lg">
              Save as Draft
            </Button>
            <Button variant="outline" size="lg">
              Preview
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Posting Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Estimated Reach</span>
                <span className="font-medium">2,500+ students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Similar Role Applications</span>
                <span className="font-medium">45 avg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Time to Fill</span>
                <span className="font-medium">14 days avg</span>
              </div>
            </CardContent>
          </Card>

          {/* Job Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Job Templates</CardTitle>
              <CardDescription>Start with a pre-built template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-xs text-gray-600">
                      {template.type} • {template.category}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Posting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>Tip:</strong> Jobs with clear requirements get 40%
                  more qualified applications.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  <strong>Tip:</strong> Include salary ranges to attract more
                  candidates.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800">
                  <strong>Tip:</strong> Mention growth opportunities to appeal
                  to students.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
