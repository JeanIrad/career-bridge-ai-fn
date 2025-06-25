"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Users,
  Calendar,
  ExternalLink,
  Heart,
  Bookmark,
  Share2,
  Bot,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  BookOpen,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Star,
  Globe,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  workSchedule: string;
  salary: string;
  posted: string;
  deadline: string;
  match: number;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  saved: boolean;
  applied: boolean;
  companyLogo?: string;
  industry: string;
  experience: string;
  remote: boolean;
  companyInfo?: {
    size: string;
    founded: string;
    website: string;
    description: string;
    culture: string[];
    values: string[];
    perks: string[];
  };
  aiRecommendation?: {
    reasons: string[];
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    cultureMatch: number;
    salaryMatch: number;
    insights: string;
    strengthsAlignment: string[];
    skillGaps: string[];
    careerImpact: string;
    recommendationScore: number;
  };
  similarJobs?: {
    id: string;
    title: string;
    company: string;
    match: number;
  }[];
}

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobListing | null;
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  onShare: (jobId: string) => void;
}

export function JobDetailsDialog({
  open,
  onOpenChange,
  job,
  onSave,
  onApply,
  onShare,
}: JobDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!job) return null;

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (match >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (match >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-primary font-semibold text-xl">
                {job.company.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                <DialogDescription className="text-lg">
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {job.company} • {job.industry}
                  </div>
                </DialogDescription>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.type} • {job.workSchedule}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                  {job.remote && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      Remote
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {job.match && (
                <Badge
                  className={`${getMatchColor(job.match)} border text-sm px-3 py-1`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {job.match}% Match
                </Badge>
              )}
              {job.applied && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Applied
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger
              value="ai-insights"
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="similar">Similar Jobs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Stats */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Posted
                        </span>
                        <span className="text-sm font-medium">
                          {job.posted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Deadline
                        </span>
                        <span className="text-sm font-medium">
                          {job.deadline}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Applicants
                        </span>
                        <span className="text-sm font-medium">
                          {job.applicants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Experience
                        </span>
                        <span className="text-sm font-medium">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => onApply(job.id)}
                    disabled={job.applied}
                  >
                    {job.applied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onSave(job.id)}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${job.saved ? "fill-current" : ""}`}
                      />
                      {job.saved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onShare(job.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Job Description
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <div className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Benefits & Perks
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {job.benefits.map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="justify-start"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6 mt-6">
            {job.companyInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Company Size
                          </span>
                          <span className="font-medium">
                            {job.companyInfo.size}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Founded</span>
                          <span className="font-medium">
                            {job.companyInfo.founded}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Industry
                          </span>
                          <span className="font-medium">{job.industry}</span>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        About the Company
                      </h3>
                      <p className="text-muted-foreground">
                        {job.companyInfo.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Company Values</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.companyInfo.values.map((value, index) => (
                          <Badge key={index} variant="secondary">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">
                        Culture & Environment
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.companyInfo.culture.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Additional Perks</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {job.companyInfo.perks.map((perk, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Star className="w-3 h-3 text-yellow-500" />
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Company information not available
                </p>
              </div>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6 mt-6">
            {job.aiRecommendation ? (
              <div className="space-y-6">
                {/* Overall Recommendation Score */}
                <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Recommendation Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-purple-600">
                          {job.aiRecommendation.recommendationScore}/100
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Overall recommendation score based on your profile
                        </div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm">
                          {job.aiRecommendation.insights}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Match Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Skills & Experience Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Skills Match</span>
                            <span
                              className={getScoreColor(
                                job.aiRecommendation.skillsMatch
                              )}
                            >
                              {job.aiRecommendation.skillsMatch}%
                            </span>
                          </div>
                          <Progress
                            value={job.aiRecommendation.skillsMatch}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Experience Match</span>
                            <span
                              className={getScoreColor(
                                job.aiRecommendation.experienceMatch
                              )}
                            >
                              {job.aiRecommendation.experienceMatch}%
                            </span>
                          </div>
                          <Progress
                            value={job.aiRecommendation.experienceMatch}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Location Match</span>
                            <span
                              className={getScoreColor(
                                job.aiRecommendation.locationMatch
                              )}
                            >
                              {job.aiRecommendation.locationMatch}%
                            </span>
                          </div>
                          <Progress
                            value={job.aiRecommendation.locationMatch}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Culture Match</span>
                            <span
                              className={getScoreColor(
                                job.aiRecommendation.cultureMatch
                              )}
                            >
                              {job.aiRecommendation.cultureMatch}%
                            </span>
                          </div>
                          <Progress
                            value={job.aiRecommendation.cultureMatch}
                            className="h-2"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Salary Match</span>
                            <span
                              className={getScoreColor(
                                job.aiRecommendation.salaryMatch
                              )}
                            >
                              {job.aiRecommendation.salaryMatch}%
                            </span>
                          </div>
                          <Progress
                            value={job.aiRecommendation.salaryMatch}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Career Impact Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">
                                Career Impact
                              </h4>
                              <p className="text-sm text-blue-800 mt-1">
                                {job.aiRecommendation.careerImpact}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-600" />
                            Strengths Alignment
                          </h4>
                          <div className="space-y-1">
                            {job.aiRecommendation.strengthsAlignment.map(
                              (strength, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  {strength}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-yellow-600" />
                            Skill Gaps to Address
                          </h4>
                          <div className="space-y-1">
                            {job.aiRecommendation.skillGaps.map(
                              (gap, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <AlertCircle className="w-3 h-3 text-yellow-600" />
                                  {gap}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendation Reasons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Why This Job is Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.aiRecommendation.reasons.map((reason, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  AI insights not available for this job
                </p>
              </div>
            )}
          </TabsContent>

          {/* Similar Jobs Tab */}
          <TabsContent value="similar" className="space-y-4 mt-6">
            {job.similarJobs && job.similarJobs.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Similar Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.similarJobs.map((similarJob) => (
                    <Card
                      key={similarJob.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">
                                {similarJob.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {similarJob.company}
                              </p>
                            </div>
                            <Badge className={getMatchColor(similarJob.match)}>
                              {similarJob.match}%
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No similar jobs found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Posted {job.posted} • {job.applicants} applicants
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => onApply(job.id)} disabled={job.applied}>
              {job.applied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
