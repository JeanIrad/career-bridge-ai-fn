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
  School,
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
  GraduationCap,
  Building2,
} from "lucide-react";
import { useState } from "react";

export function UniversityProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [programs, setPrograms] = useState([
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Data Science",
    "Design & Arts",
  ]);
  const [newProgram, setNewProgram] = useState("");

  const addProgram = () => {
    if (newProgram.trim() && !programs.includes(newProgram.trim())) {
      setPrograms([...programs, newProgram.trim()]);
      setNewProgram("");
    }
  };

  const removeProgram = (programToRemove: string) => {
    setPrograms(programs.filter((program) => program !== programToRemove));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">University Profile</h1>
          <p className="text-muted-foreground">
            Manage your university information and partnership preferences
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
        {/* University Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>University Information</CardTitle>
              <CardDescription>
                Basic university details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* University Logo & Name */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                    SU
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
                      <Label htmlFor="university-name">University Name</Label>
                      <Input
                        id="university-name"
                        defaultValue="Stanford University"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university-type">University Type</Label>
                      <Input
                        id="university-type"
                        defaultValue="Private Research University"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="established">Established</Label>
                      <Input
                        id="established"
                        defaultValue="1885"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accreditation">Accreditation</Label>
                      <Input
                        id="accreditation"
                        defaultValue="WASC, AACSB, ABET"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* University Description */}
              <div className="space-y-2">
                <Label htmlFor="description">University Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="Stanford University is a leading research university located in the heart of Silicon Valley. Known for academic excellence, innovation, and entrepreneurship, Stanford has been at the forefront of technological advancement and social impact for over a century."
                  disabled={!isEditing}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    defaultValue="https://stanford.edu"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    defaultValue="Stanford, CA 94305"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Programs</CardTitle>
              <CardDescription>
                Manage your university's academic offerings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Programs */}
              <div className="space-y-3">
                <Label>Academic Programs</Label>
                <div className="flex flex-wrap gap-2">
                  {programs.map((program, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {program}
                      {isEditing && (
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => removeProgram(program)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add academic program"
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addProgram()}
                    />
                    <Button onClick={addProgram} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Partnership Preferences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Industry Partnerships</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept partnership requests from industry employers
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Campus Recruitment</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employers to conduct on-campus recruitment
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!isEditing} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alumni Network Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable alumni to mentor current students
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
          {/* University Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">University Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Students
                </span>
                <span className="font-semibold">17,249</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Faculty Members
                </span>
                <span className="font-semibold">2,240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Industry Partners
                </span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Alumni Network
                </span>
                <span className="font-semibold">223,731</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Job Placement Rate
                </span>
                <span className="font-semibold">94%</span>
              </div>
            </CardContent>
          </Card>

          {/* University Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">University Rankings</CardTitle>
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
                <p className="text-2xl font-bold">#2</p>
                <p className="text-sm text-muted-foreground">
                  National University Ranking
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Academic Reputation</span>
                  <span>98/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Employer Reputation</span>
                  <span>96/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Research Impact</span>
                  <span>94/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Student Satisfaction</span>
                  <span>92/100</span>
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
                Manage Faculty
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Partner Directory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
