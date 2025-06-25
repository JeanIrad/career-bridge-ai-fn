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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternships } from "@/hooks/use-internships";
import { toast } from "sonner";
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Star,
  Bookmark,
  GraduationCap,
  BookmarkCheck,
  Send,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import type { Internship, InternshipSearchFilters } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function StudentInternships() {
  const {
    internships,
    stats,
    loading,
    error,
    pagination,
    searchInternships,
    toggleSaveInternship,
    applyToInternship,
    companies,
    locations,
    types,
    loadStats,
  } = useInternships();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedCompensation, setSelectedCompensation] = useState("all");
  const [selectedGPA, setSelectedGPA] = useState("all");
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [housingProvided, setHousingProvided] = useState(false);
  const [mentorshipProvided, setMentorshipProvided] = useState(false);
  const [fullTimeConversion, setFullTimeConversion] = useState(false);
  const [minStipend, setMinStipend] = useState("");
  const [maxStipend, setMaxStipend] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Application dialog state
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Application form state
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = () => {
    const filters: InternshipSearchFilters = {
      search: searchQuery || undefined,
      locations: selectedLocation !== "all" ? [selectedLocation] : undefined,
      companies: selectedCompany !== "all" ? [selectedCompany] : undefined,
      duration: selectedDuration !== "all" ? selectedDuration : undefined,
      compensationType:
        selectedCompensation !== "all" ? selectedCompensation : undefined,
      minGpa: selectedGPA !== "all" ? parseFloat(selectedGPA) : undefined,
      graduationYear:
        selectedGradYear !== "all" ? parseInt(selectedGradYear) : undefined,
      majors: selectedMajor !== "all" ? [selectedMajor] : undefined,
      housingProvided: housingProvided || undefined,
      mentorshipProvided: mentorshipProvided || undefined,
      fullTimeConversion: fullTimeConversion || undefined,
      minStipend: minStipend ? parseFloat(minStipend) : undefined,
      maxStipend: maxStipend ? parseFloat(maxStipend) : undefined,
      offset: 0,
      limit: 10,
    };

    searchInternships(filters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedCompany("all");
    setSelectedDuration("all");
    setSelectedCompensation("all");
    setSelectedGPA("all");
    setSelectedGradYear("all");
    setSelectedMajor("all");
    setHousingProvided(false);
    setMentorshipProvided(false);
    setFullTimeConversion(false);
    setMinStipend("");
    setMaxStipend("");
    handleSearch();
  };

  const handleApply = async (internship: Internship) => {
    try {
      await applyToInternship(internship.id, {
        resumeUrl: "default-resume.pdf", // In a real app, this would come from user's profile
        coverLetter: `I am very interested in the ${internship.title} position at ${internship.company.name}.`,
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedInternship) return;

    setIsSubmitting(true);
    try {
      let resumeUrl = "";

      // If user uploaded a new resume file, upload it first
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        // In a real app, you'd upload to your file storage service
        // For now, we'll use a placeholder URL
        resumeUrl = `uploaded-resume-${Date.now()}.pdf`;
      }

      await applyToInternship(selectedInternship.id, {
        resumeUrl: resumeUrl || undefined,
        coverLetter: coverLetter || undefined,
      });

      // Close the dialog and reset form
      setShowApplicationDialog(false);
      setCoverLetter("");
      setResumeFile(null);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setResumeFile(file);
    }
  };

  const formatSalary = (salary: Internship["salary"]) => {
    if (!salary.min && !salary.max) return "Not specified";

    const formatAmount = (amount: number) => {
      if (salary.period === "hourly") {
        return `$${amount}/hr`;
      } else if (salary.period === "monthly") {
        return `$${amount.toLocaleString()}/mo`;
      } else {
        return `$${amount.toLocaleString()}`;
      }
    };

    if (salary.min && salary.max) {
      return `${formatAmount(salary.min)} - ${formatAmount(salary.max)}`;
    } else if (salary.min) {
      return `${formatAmount(salary.min)}+`;
    } else if (salary.max) {
      return `Up to ${formatAmount(salary.max)}`;
    }

    return "Not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (days: number) => {
    if (days < 0) return "text-red-600";
    if (days <= 7) return "text-orange-600";
    if (days <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getDurationDisplay = (duration: string, customDuration?: string) => {
    if (duration === "CUSTOM" && customDuration) {
      return customDuration;
    }

    const durationMap: Record<string, string> = {
      SUMMER: "10-12 weeks",
      SEMESTER: "16 weeks",
      QUARTER: "10 weeks",
      YEAR_ROUND: "12 months",
    };

    return durationMap[duration] || duration;
  };

  useEffect(() => {
    handleSearch();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Internships
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => handleSearch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internship Opportunities</h1>
          <p className="text-muted-foreground">
            Find summer internships and co-op programs from top companies
          </p>
        </div>
        <Button>
          <GraduationCap className="w-4 h-4 mr-2" />
          Application Tips
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships by company, role, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4 mt-4 pt-4 border-t">
              {/* First row - Basic filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location, index) => (
                        <SelectItem
                          key={`location-${index}-${location}`}
                          value={location}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company
                  </label>
                  <Select
                    value={selectedCompany}
                    onValueChange={setSelectedCompany}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Companies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map((company, index) => (
                        <SelectItem
                          key={`company-${index}-${company}`}
                          value={company}
                        >
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration
                  </label>
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Durations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      {types.map((type, index) => (
                        <SelectItem key={`type-${index}-${type}`} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Compensation
                  </label>
                  <Select
                    value={selectedCompensation}
                    onValueChange={setSelectedCompensation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="STIPEND">Stipend</SelectItem>
                      <SelectItem value="ACADEMIC_CREDIT">
                        Academic Credit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second row - Academic filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum GPA
                  </label>
                  <Select value={selectedGPA} onValueChange={setSelectedGPA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any GPA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any GPA</SelectItem>
                      <SelectItem value="2.0">2.0+</SelectItem>
                      <SelectItem value="2.5">2.5+</SelectItem>
                      <SelectItem value="3.0">3.0+</SelectItem>
                      <SelectItem value="3.2">3.2+</SelectItem>
                      <SelectItem value="3.5">3.5+</SelectItem>
                      <SelectItem value="3.7">3.7+</SelectItem>
                      <SelectItem value="3.8">3.8+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Graduation Year
                  </label>
                  <Select
                    value={selectedGradYear}
                    onValueChange={setSelectedGradYear}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Year</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Major
                  </label>
                  <Select
                    value={selectedMajor}
                    onValueChange={setSelectedMajor}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Major</SelectItem>
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Third row - Stipend range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Stipend ($/hour)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 15"
                    value={minStipend}
                    onChange={(e) => setMinStipend(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Stipend ($/hour)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 50"
                    value={maxStipend}
                    onChange={(e) => setMaxStipend(e.target.value)}
                  />
                </div>
              </div>

              {/* Fourth row - Benefits checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="housing"
                    checked={housingProvided}
                    onCheckedChange={(checked) =>
                      setHousingProvided(checked === true)
                    }
                  />
                  <label htmlFor="housing" className="text-sm font-medium">
                    Housing Provided
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mentorship"
                    checked={mentorshipProvided}
                    onCheckedChange={(checked) =>
                      setMentorshipProvided(checked === true)
                    }
                  />
                  <label htmlFor="mentorship" className="text-sm font-medium">
                    Mentorship Program
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fulltime"
                    checked={fullTimeConversion}
                    onCheckedChange={(checked) =>
                      setFullTimeConversion(checked === true)
                    }
                  />
                  <label htmlFor="fulltime" className="text-sm font-medium">
                    Full-time Conversion
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Internships
                  </p>
                  <p className="text-2xl font-bold">{stats.totalInternships}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Applications Sent
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.appliedInternships}
                  </p>
                </div>
                <Send className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Saved Internships
                  </p>
                  <p className="text-2xl font-bold">{stats.savedInternships}</p>
                </div>
                <Bookmark className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Interview Invites
                  </p>
                  <p className="text-2xl font-bold">{stats.interviewInvites}</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Internship Listings */}
      {!loading && (
        <div className="space-y-6">
          {internships.map((internship) => {
            const daysUntilDeadline = getDaysUntilDeadline(
              internship.applicationDeadline
            );

            return (
              <Card
                key={internship.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                        {internship.company.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {internship.title}
                          </h3>
                          {internship.fullTimeConversion && (
                            <Badge variant="secondary">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Full-time Conversion
                            </Badge>
                          )}
                          {internship.isApplied && (
                            <Badge variant="default">Applied</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1 mb-2">
                          <Building2 className="w-4 h-4" />
                          {internship.company.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {internship.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getDurationDisplay(
                              internship.duration,
                              internship.customDuration
                            )}
                          </span>
                          {internship.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Starts {formatDate(internship.startDate)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatSalary(internship.salary)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toggleSaveInternship(
                            internship.id,
                            internship.isSaved || false
                          )
                        }
                      >
                        {internship.isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {internship.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.eligibleMajors
                          .slice(0, 3)
                          .map((major, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {major}
                            </Badge>
                          ))}
                        {internship.eligibleMajors.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{internship.eligibleMajors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Perks & Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {internship.housingProvided && (
                          <Badge variant="outline" className="text-xs">
                            Housing
                          </Badge>
                        )}
                        {internship.mentorshipProvided && (
                          <Badge variant="outline" className="text-xs">
                            Mentorship
                          </Badge>
                        )}
                        {internship.trainingProvided && (
                          <Badge variant="outline" className="text-xs">
                            Training
                          </Badge>
                        )}
                        {internship.networkingEvents && (
                          <Badge variant="outline" className="text-xs">
                            Networking
                          </Badge>
                        )}
                        {internship.academicCredit && (
                          <Badge variant="outline" className="text-xs">
                            Academic Credit
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Posted {formatDate(internship.createdAt)}</span>
                      <span className={getDeadlineColor(daysUntilDeadline)}>
                        {daysUntilDeadline < 0
                          ? "Deadline passed"
                          : daysUntilDeadline === 0
                            ? "Due today"
                            : `${daysUntilDeadline} days left`}
                      </span>
                      {internship._count?.applications && (
                        <span>{internship._count.applications} applicants</span>
                      )}
                      {internship.returnOfferRate && (
                        <span className="text-green-600 font-medium">
                          {internship.returnOfferRate}% return offer rate
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInternship(internship);
                          setShowDetailsDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        disabled={internship.isApplied || daysUntilDeadline < 0}
                        onClick={() => {
                          setSelectedInternship(internship);
                          setShowApplicationDialog(true);
                          setCoverLetter(
                            `Dear ${internship.company.name} Hiring Team,\n\nI am writing to express my strong interest in the ${internship.title} internship position. As a ${selectedMajor !== "all" ? selectedMajor : "motivated"} student, I am excited about the opportunity to contribute to your team and gain valuable experience in the industry.\n\nI believe my skills and passion make me a strong candidate for this role, and I would welcome the opportunity to discuss how I can contribute to ${internship.company.name}'s continued success.\n\nThank you for your consideration.\n\nBest regards,`
                          );
                        }}
                      >
                        {internship.isApplied
                          ? "Applied"
                          : daysUntilDeadline < 0
                            ? "Deadline Passed"
                            : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && internships.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No internships found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedLocation("all");
              setSelectedCompany("all");
              setSelectedDuration("all");
              setSelectedCompensation("all");
              setSelectedGPA("all");
              setSelectedGradYear("all");
              setSelectedMajor("all");
              setHousingProvided(false);
              setMentorshipProvided(false);
              setFullTimeConversion(false);
              setMinStipend("");
              setMaxStipend("");
              handleSearch();
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More */}
      {!loading &&
        internships.length > 0 &&
        pagination.currentPage < pagination.pages && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => {
                const filters: InternshipSearchFilters = {
                  search: searchQuery || undefined,
                  locations:
                    selectedLocation !== "all" ? [selectedLocation] : undefined,
                  companies:
                    selectedCompany !== "all" ? [selectedCompany] : undefined,
                  duration:
                    selectedDuration !== "all" ? selectedDuration : undefined,
                  compensationType:
                    selectedCompensation !== "all"
                      ? selectedCompensation
                      : undefined,
                  minGpa:
                    selectedGPA !== "all" ? parseFloat(selectedGPA) : undefined,
                  graduationYear:
                    selectedGradYear !== "all"
                      ? parseInt(selectedGradYear)
                      : undefined,
                  majors: selectedMajor !== "all" ? [selectedMajor] : undefined,
                  housingProvided: housingProvided || undefined,
                  mentorshipProvided: mentorshipProvided || undefined,
                  fullTimeConversion: fullTimeConversion || undefined,
                  minStipend: minStipend ? parseFloat(minStipend) : undefined,
                  maxStipend: maxStipend ? parseFloat(maxStipend) : undefined,
                  offset: pagination.offset + pagination.limit,
                  limit: 10,
                };
                searchInternships(filters);
              }}
            >
              Load More Internships
            </Button>
          </div>
        )}

      {/* Detailed View Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                {selectedInternship?.company.name.charAt(0)}
              </div>
              {selectedInternship?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedInternship?.company.name} •{" "}
              {selectedInternship?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedInternship && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Position Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>
                        {getDurationDisplay(
                          selectedInternship.duration,
                          selectedInternship.customDuration
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Compensation:
                      </span>
                      <span>{formatSalary(selectedInternship.salary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span>
                        {selectedInternship.startDate
                          ? formatDate(selectedInternship.startDate)
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Application Deadline:
                      </span>
                      <span
                        className={getDeadlineColor(
                          getDaysUntilDeadline(
                            selectedInternship.applicationDeadline
                          )
                        )}
                      >
                        {formatDate(selectedInternship.applicationDeadline)}
                      </span>
                    </div>
                    {selectedInternship.gpaRequirement && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min GPA:</span>
                        <span>{selectedInternship.gpaRequirement}</span>
                      </div>
                    )}
                    {selectedInternship.graduationYear && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Target Graduation:
                        </span>
                        <span>{selectedInternship.graduationYear}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Program Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.housingProvided && (
                      <Badge variant="outline">Housing Provided</Badge>
                    )}
                    {selectedInternship.mentorshipProvided && (
                      <Badge variant="outline">Mentorship Program</Badge>
                    )}
                    {selectedInternship.trainingProvided && (
                      <Badge variant="outline">Training Program</Badge>
                    )}
                    {selectedInternship.networkingEvents && (
                      <Badge variant="outline">Networking Events</Badge>
                    )}
                    {selectedInternship.academicCredit && (
                      <Badge variant="outline">Academic Credit</Badge>
                    )}
                    {selectedInternship.fullTimeConversion && (
                      <Badge variant="outline">Full-time Conversion</Badge>
                    )}
                  </div>

                  {selectedInternship.returnOfferRate && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">
                          {selectedInternship.returnOfferRate}% Return Offer
                          Rate
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">About This Internship</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold mb-3">Requirements</h3>
                <div className="space-y-4">
                  {selectedInternship.eligibleMajors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Eligible Majors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInternship.eligibleMajors.map(
                          (major, index) => (
                            <Badge key={index} variant="secondary">
                              {major}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedInternship.preferredSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Preferred Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInternship.preferredSkills.map(
                          (skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedInternship.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Additional Requirements
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedInternship.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Requirements */}
              <div>
                <h3 className="font-semibold mb-3">Application Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={true} disabled />
                    <span>Resume/CV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={true} disabled />
                    <span>Cover Letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedInternship.portfolioRequired}
                      disabled
                    />
                    <span>
                      Portfolio{" "}
                      {selectedInternship.portfolioRequired
                        ? "(Required)"
                        : "(Optional)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedInternship.transcriptRequired}
                      disabled
                    />
                    <span>
                      Transcript{" "}
                      {selectedInternship.transcriptRequired
                        ? "(Required)"
                        : "(Optional)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  className="flex-1"
                  disabled={
                    selectedInternship.isApplied ||
                    getDaysUntilDeadline(
                      selectedInternship.applicationDeadline
                    ) < 0
                  }
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowApplicationDialog(true);
                    setCoverLetter(
                      `Dear ${selectedInternship.company.name} Hiring Team,\n\nI am writing to express my strong interest in the ${selectedInternship.title} internship position. As a motivated student, I am excited about the opportunity to contribute to your team and gain valuable experience in the industry.\n\nI believe my skills and passion make me a strong candidate for this role, and I would welcome the opportunity to discuss how I can contribute to ${selectedInternship.company.name}'s continued success.\n\nThank you for your consideration.\n\nBest regards,`
                    );
                  }}
                >
                  {selectedInternship.isApplied
                    ? "Already Applied"
                    : "Apply Now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toggleSaveInternship(
                      selectedInternship.id,
                      selectedInternship.isSaved || false
                    )
                  }
                >
                  {selectedInternship.isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog
        open={showApplicationDialog}
        onOpenChange={setShowApplicationDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedInternship?.title}</DialogTitle>
            <DialogDescription>
              {selectedInternship?.company.name} • Complete your application
              below
            </DialogDescription>
          </DialogHeader>

          {selectedInternship && (
            <div className="space-y-6">
              {/* Resume Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Resume/CV <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {resumeFile
                            ? resumeFile.name
                            : "Click to upload your resume"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF files only, max 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                {resumeFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    File uploaded successfully
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Write your cover letter here..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {coverLetter.length}/2000 characters
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Application Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Tailor your cover letter to this specific role and company
                  </li>
                  <li>
                    • Highlight relevant coursework, projects, or experience
                  </li>
                  <li>
                    • Show enthusiasm for the company's mission and values
                  </li>
                  <li>• Proofread your application before submitting</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowApplicationDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitApplication}
                  disabled={!coverLetter.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
