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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Edit,
  Save,
  Globe,
  MapPin,
  Users,
  Calendar,
  Award,
  Star,
  Camera,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

export function EmployerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState([
    "Software Development",
    "Data Science",
    "Product Management",
    "UX Design",
  ]);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and recruitment preferences
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Company Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic company details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Logo & Name */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                    TC
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        defaultValue="TechCorp Solutions"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        defaultValue="Technology"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-size">Company Size</Label>
                      <Input
                        id="company-size"
                        defaultValue="1,000-5,000 employees"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Founded</Label>
                      <Input
                        id="founded"
                        defaultValue="2010"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="TechCorp Solutions is a leading technology company specializing in innovative software solutions for enterprise clients. We're passionate about creating cutting-edge products that solve real-world problems and drive digital transformation across industries."
                  disabled={!isEditing}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    defaultValue="https://techcorp.com"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input
                    id="headquarters"
                    defaultValue="San Francisco, CA"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Preferences</CardTitle>
              <CardDescription>
                Configure your hiring preferences and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hiring Focus Areas */}
              <div className="space-y-3">
                <Label>Hiring Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      {isEditing && (
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add focus area"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Recruitment Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accept Unsolicited Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to apply even without specific job postings
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campus Recruitment</Label>
                    <p className="text-sm text-muted-foreground">
                      Participate in university career fairs and events
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Remote Work Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer remote or hybrid work arrangements
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Profile Views
                </span>
                <span className="font-semibold">1,248</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Job Postings
                </span>
                <span className="font-semibold">8 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Applications
                </span>
                <span className="font-semibold">324 Total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hires Made
                </span>
                <span className="font-semibold">47 This Year</span>
              </div>
            </CardContent>
          </Card>

          {/* Company Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">
                  Based on 156 reviews
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Work-Life Balance</span>
                  <span>4.7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Career Growth</span>
                  <span>4.9</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Company Culture</span>
                  <span>4.8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Compensation</span>
                  <span>4.6</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Manage Team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Company Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
