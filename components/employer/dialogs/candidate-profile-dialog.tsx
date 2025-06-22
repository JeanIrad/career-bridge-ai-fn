"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Download,
  Loader2,
} from "lucide-react";
import { getCandidateProfile } from "@/lib/api";
import { toast } from "sonner";
import { CandidateProfile } from "@/types/application-actions";

interface CandidateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
}

export function CandidateProfileDialog({
  open,
  onOpenChange,
  candidateId,
  candidateName,
}: CandidateProfileDialogProps) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && candidateId) {
      fetchProfile();
    }
  }, [open, candidateId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await getCandidateProfile(candidateId);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch candidate profile:", error);
      setError("Failed to load candidate profile");
      toast.error("Failed to load profile", {
        description: "Unable to fetch candidate details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleDownloadResume = () => {
    if (profile?.resumeUrl) {
      window.open(profile.resumeUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                Loading candidate profile...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Profile Unavailable
              </h3>
              <p className="text-muted-foreground mb-4">
                {error || "Unable to load candidate profile"}
              </p>
              <Button onClick={fetchProfile} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Candidate Profile
          </DialogTitle>
          <DialogDescription>
            Complete profile and background information for {candidateName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={profile.avatar}
                alt={`${profile.firstName} ${profile.lastName}`}
              />
              <AvatarFallback className="text-2xl font-bold">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              {profile.headline && (
                <p className="text-lg text-gray-600 mb-4">{profile.headline}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phoneNumber}
                  </div>
                )}
                {profile.university && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    {profile.university}
                  </div>
                )}
              </div>
              {profile.bio && (
                <p className="text-gray-700 mt-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {profile.resumeUrl && (
                <Button onClick={handleDownloadResume} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              {profile.linkedinUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(profile.linkedinUrl, "_blank")}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill.name}
                        {skill.endorsements && skill.endorsements > 0 && (
                          <span className="ml-1 text-xs">
                            ({skill.endorsements})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.major && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Major:</span>
                    <span className="font-medium">{profile.major}</span>
                  </div>
                )}
                {profile.graduationYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graduation:</span>
                    <span className="font-medium">
                      {profile.graduationYear}
                    </span>
                  </div>
                )}
                {profile.gpa && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GPA:</span>
                    <span className="font-medium">{profile.gpa}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">
                    {profile.experiences.length} roles
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <h3 className="font-semibold">
                        {edu.degree} in {edu.fieldOfStudy}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                      {edu.grade && (
                        <p className="text-sm text-muted-foreground">
                          Grade: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No education information available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.experiences.length > 0 ? (
                <div className="space-y-6">
                  {profile.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-2 border-green-200 pl-4"
                    >
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-green-600 font-medium">
                        {exp.company}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>
                          {formatDate(exp.startDate)} -{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </span>
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </div>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No work experience listed
                </p>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          {(profile.portfolioUrl || profile.githubUrl) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Links & Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.portfolioUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(profile.portfolioUrl, "_blank")
                      }
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Portfolio
                    </Button>
                  )}
                  {profile.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profile.githubUrl, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
