"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  School,
  Users,
  Calendar,
  Target,
  Briefcase,
  GraduationCap,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Star,
} from "lucide-react";
import {
  UniversityPartnership,
  PartnershipStats,
  getPartnershipStats,
} from "@/lib/api-university-partners";

interface UniversityOverviewProps {
  partnership: UniversityPartnership;
}

export function UniversityOverview({ partnership }: UniversityOverviewProps) {
  const [stats, setStats] = useState<PartnershipStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    loadStats();
  }, [partnership.id]);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await getPartnershipStats(partnership.id);
      // Convert undefined dates to null to match PartnershipStats type
      setStats({
        ...data,
        lastEventDate: data.lastEventDate || null,
        lastVisitDate: data.lastVisitDate || null,
      });
    } catch (error) {
      toast.error("Failed to load partnership stats");
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Calculate progress percentages
  const getHiringProgress = () => {
    if (!partnership.hiringGoals) return 0;
    return Math.min(
      Math.round(((stats?.studentsHired || 0) / partnership.hiringGoals) * 100),
      100
    );
  };

  const getInternshipProgress = () => {
    if (!partnership.internshipGoals) return 0;
    return Math.min(
      Math.round(
        ((stats?.internsHired || 0) / partnership.internshipGoals) * 100
      ),
      100
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "EXPIRED":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "EXPIRED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Partnership Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {partnership.universityName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {partnership.universityName}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                    partnership.status
                  )}`}
                >
                  {getStatusIcon(partnership.status)}
                  {partnership.status.charAt(0).toUpperCase() +
                    partnership.status.slice(1).toLowerCase()}
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                {partnership.description || "No description provided"}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {partnership.startDate
                      ? new Date(partnership.startDate).toLocaleDateString()
                      : "Not started"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>{partnership.hiringGoals || 0} hiring goals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>
                    {partnership.internshipGoals || 0} internship goals
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Progress</CardTitle>
          <CardDescription>
            Track your hiring and internship goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hiring Goals Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Hiring Progress
              </Label>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{stats?.studentsHired || 0}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-medium">
                  {partnership.hiringGoals || 0}
                </span>
              </div>
            </div>
            <Progress value={getHiringProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {getHiringProgress()}% of hiring goals achieved
            </p>
          </div>

          {/* Internship Goals Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Internship Progress
              </Label>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{stats?.internsHired || 0}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-medium">
                  {partnership.internshipGoals || 0}
                </span>
              </div>
            </div>
            <Progress value={getInternshipProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {getInternshipProgress()}% of internship goals achieved
            </p>
          </div>

          {/* Event Engagement */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Engagement
              </Label>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{stats?.totalEvents || 0}</span>
                <span className="text-muted-foreground">events held</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <span className="text-muted-foreground">Upcoming Events:</span>
                <span className="font-medium">
                  {stats?.upcomingEvents || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <span className="text-muted-foreground">Planned Visits:</span>
                <span className="font-medium">
                  {stats?.upcomingVisits || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Analytics</CardTitle>
          <CardDescription>
            Detailed metrics and trends for this partnership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Type Distribution */}
          <div>
            <h4 className="font-medium mb-4">Event Distribution</h4>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(stats?.eventsByType || {}).map(
                ([type, count]) => (
                  <div key={type} className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {count}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {type
                        .split("_")
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recent Trends */}
          <div>
            <h4 className="font-medium mb-4">Recent Trends</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Event Growth
                  </span>
                  <Badge
                    variant={
                      (stats?.recentTrends?.eventGrowth || 0) >= 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {(stats?.recentTrends?.eventGrowth || 0) >= 0 ? "+" : ""}
                    {stats?.recentTrends?.eventGrowth || 0}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Last 3 months</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Attendee Growth
                  </span>
                  <Badge
                    variant={
                      (stats?.recentTrends?.attendeeGrowth || 0) >= 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {(stats?.recentTrends?.attendeeGrowth || 0) >= 0 ? "+" : ""}
                    {stats?.recentTrends?.attendeeGrowth || 0}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Average per event</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Satisfaction Trend
                  </span>
                  <Badge
                    variant={
                      (stats?.recentTrends?.satisfactionTrend || 0) >= 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {(stats?.recentTrends?.satisfactionTrend || 0) >= 0
                      ? "+"
                      : ""}
                    {stats?.recentTrends?.satisfactionTrend || 0}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Event satisfaction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div>
            <h4 className="font-medium mb-4">Engagement Metrics</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats?.totalAttendees || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats?.averageAttendance || 0}
                </div>
                <p className="text-sm text-muted-foreground">
                  Average Attendance
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats?.engagementRate || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats?.averageSatisfaction || 0}/5
                </div>
                <p className="text-sm text-muted-foreground">
                  Average Satisfaction
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.studentsHired || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Students Hired</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Briefcase className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.internsHired || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Interns Hired</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.upcomingEvents || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {isLoadingStats ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.upcomingVisits || 0
                )}
              </div>
              <p className="text-sm text-muted-foreground">Planned Visits</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Key contacts for this university partnership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {partnership.contactPerson || "No contact person set"}
                </p>
                <p className="text-xs text-muted-foreground">Primary Contact</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {partnership.contactEmail || "No email set"}
                </p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {partnership.contactPhone || "No phone set"}
                </p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partnership Details */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferred Majors</CardTitle>
            <CardDescription>
              Target academic programs for recruitment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {partnership.preferredMajors.length > 0 ? (
                partnership.preferredMajors.map((major, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>{major}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No preferred majors specified
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements & Benefits</CardTitle>
            <CardDescription>
              Partnership expectations and offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Requirements
                </h4>
                <div className="space-y-1">
                  {partnership.requirements.length > 0 ? (
                    partnership.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground"
                      >
                        • {req}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No requirements specified
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Benefits
                </h4>
                <div className="space-y-1">
                  {partnership.benefits.length > 0 ? (
                    partnership.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground"
                      >
                        • {benefit}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No benefits specified
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
