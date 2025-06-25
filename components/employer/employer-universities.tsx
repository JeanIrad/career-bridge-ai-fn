"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2,
  GraduationCap,
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Loader2,
  ExternalLink,
  School,
  Target,
  DollarSign,
  Handshake,
} from "lucide-react";
import {
  University,
  UniversityPartnership,
  CreatePartnershipData,
  searchUniversities,
  getUniversityById,
  createPartnership,
  getCompanyPartnerships,
  getPartnershipAnalytics,
  getUniversityRecommendations,
  PartnershipStatus,
  PartnershipPriority,
  PartnershipType,
  StudentYear,
  getPartnershipStatusLabel,
  getPartnershipStatusColor,
  getPartnershipPriorityLabel,
  getPartnershipTypeLabel,
  getStudentYearLabel,
} from "@/lib/api-university-partners";
import { getMyCompanies, Company } from "@/lib/api-companies";

export function EmployerUniversities() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [partnerships, setPartnerships] = useState<UniversityPartnership[]>([]);
  const [recommendations, setRecommendations] = useState<University[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  // Form state for creating partnership
  const [partnershipData, setPartnershipData] = useState<CreatePartnershipData>(
    {
      universityId: "",
      companyId: "",
      title: "",
      description: "",
      partnershipType: [],
      targetStudentYear: [],
      targetMajors: [],
      targetSkills: [],
      annualHiringGoal: 0,
      internshipGoal: 0,
      priority: PartnershipPriority.MEDIUM,
    }
  );

  useEffect(() => {
    if (user?.role === "EMPLOYER") {
      loadCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCompany) {
      loadPartnerships();
      loadAnalytics();
      loadRecommendations();
    }
  }, [selectedCompany]);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const result = await getMyCompanies();
      setCompanies(result.companies);
      if (result.companies.length > 0 && !selectedCompany) {
        setSelectedCompany(result.companies[0]);
      }
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPartnerships = async () => {
    if (!selectedCompany) return;

    try {
      const result = await getCompanyPartnerships(selectedCompany.id);
      setPartnerships(result.partnerships);
    } catch (error) {
      toast.error("Failed to load partnerships");
    }
  };

  const loadAnalytics = async () => {
    if (!selectedCompany) return;

    try {
      const result = await getPartnershipAnalytics(selectedCompany.id);
      setAnalytics(result);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const loadRecommendations = async () => {
    if (!selectedCompany) return;

    try {
      const result = await getUniversityRecommendations(selectedCompany.id);
      setRecommendations(result.data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  };

  const handleSearchUniversities = async () => {
    try {
      setIsLoading(true);
      const result = await searchUniversities({
        search: searchQuery,
        isPartnershipReady: true,
      });
      setUniversities(result.universities);
    } catch (error) {
      toast.error("Failed to search universities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePartnership = async () => {
    if (!selectedCompany || !selectedUniversity) return;

    try {
      setIsLoading(true);
      const partnership = await createPartnership({
        ...partnershipData,
        universityId: selectedUniversity.id,
        companyId: selectedCompany.id,
      });

      setPartnerships([partnership, ...partnerships]);
      setShowCreateDialog(false);
      setSelectedUniversity(null);
      setPartnershipData({
        universityId: "",
        companyId: "",
        title: "",
        description: "",
        partnershipType: [],
        targetStudentYear: [],
        targetMajors: [],
        targetSkills: [],
        annualHiringGoal: 0,
        internshipGoal: 0,
        priority: PartnershipPriority.MEDIUM,
      });
      toast.success("Partnership created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create partnership");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "EMPLOYER") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              This feature is only available to employers.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Companies</h3>
            <p className="text-muted-foreground">
              You need to create a company first to manage university
              partnerships.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Company</CardTitle>
          <CardDescription>
            Choose which company to manage university partnerships for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCompany?.id || undefined}
            onValueChange={(value) => {
              const company = companies.find((c) => c.id === value);
              if (company) setSelectedCompany(company);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {company.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCompany && (
        <>
          {/* Analytics Overview */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Handshake className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Partnerships
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.totalPartnerships}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Students Hired
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.totalStudentsHired}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Hiring Goal
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.totalHiringGoals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Top Tier Unis
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.topTierPartnerships}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* University Search & Partnership Creation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>University Partnerships</CardTitle>
                  <CardDescription>
                    Search and partner with universities to hire top talent
                  </CardDescription>
                </div>
                <Dialog
                  open={showCreateDialog}
                  onOpenChange={setShowCreateDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Partnership
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create University Partnership</DialogTitle>
                      <DialogDescription>
                        Search for universities and create a new partnership
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* University Search */}
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSearchUniversities();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSearchUniversities}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* University Results */}
                        {universities.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                            {universities.map((university) => (
                              <div
                                key={university.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                  selectedUniversity?.id === university.id
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-border hover:bg-accent"
                                }`}
                                onClick={() =>
                                  setSelectedUniversity(university)
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {university.logo ? (
                                      <img
                                        src={university.logo}
                                        alt={university.name}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      university.name.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">
                                      {university.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <MapPin className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">
                                        {university.city}, {university.country}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                      {university.studentCount && (
                                        <div className="flex items-center gap-1">
                                          <Users className="w-3 h-3 text-muted-foreground" />
                                          <span className="text-xs text-muted-foreground">
                                            {university.studentCount.toLocaleString()}{" "}
                                            students
                                          </span>
                                        </div>
                                      )}
                                      {university.worldRanking && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          #{university.worldRanking} World
                                        </Badge>
                                      )}
                                      {university.isTopTier && (
                                        <Badge
                                          variant="default"
                                          className="text-xs"
                                        >
                                          Top Tier
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendations */}
                        {recommendations.length > 0 &&
                          universities.length === 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium">
                                Recommended Universities
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                                {recommendations
                                  .slice(0, 6)
                                  .map((university) => (
                                    <div
                                      key={university.id}
                                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                        selectedUniversity?.id === university.id
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                          : "border-border hover:bg-accent"
                                      }`}
                                      onClick={() =>
                                        setSelectedUniversity(university)
                                      }
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                          {university.logo ? (
                                            <img
                                              src={university.logo}
                                              alt={university.name}
                                              className="w-full h-full object-cover rounded-lg"
                                            />
                                          ) : (
                                            university.name
                                              .charAt(0)
                                              .toUpperCase()
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-medium">
                                            {university.name}
                                          </h4>
                                          <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                              {university.city},{" "}
                                              {university.country}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-4 mt-2">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {university.recommendationScore}%
                                              Match
                                            </Badge>
                                            {university.worldRanking && (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                #{university.worldRanking} World
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Partnership Form */}
                      {selectedUniversity && (
                        <div className="space-y-4 border-t pt-4">
                          <h4 className="font-medium">
                            Partnership Details with {selectedUniversity.name}
                          </h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Partnership Title</Label>
                              <Input
                                id="title"
                                value={partnershipData.title}
                                onChange={(e) =>
                                  setPartnershipData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                                placeholder="e.g., Software Engineering Talent Pipeline"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="priority">Priority</Label>
                              <Select
                                value={partnershipData.priority}
                                onValueChange={(value: PartnershipPriority) =>
                                  setPartnershipData((prev) => ({
                                    ...prev,
                                    priority: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(PartnershipPriority).map(
                                    (priority) => (
                                      <SelectItem
                                        key={priority}
                                        value={priority}
                                      >
                                        {getPartnershipPriorityLabel(priority)}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={partnershipData.description}
                              onChange={(e) =>
                                setPartnershipData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Describe the partnership goals and benefits..."
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="annualHiringGoal">
                                Annual Hiring Goal
                              </Label>
                              <Input
                                id="annualHiringGoal"
                                type="number"
                                value={partnershipData.annualHiringGoal}
                                onChange={(e) =>
                                  setPartnershipData((prev) => ({
                                    ...prev,
                                    annualHiringGoal:
                                      parseInt(e.target.value) || 0,
                                  }))
                                }
                                placeholder="10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="internshipGoal">
                                Internship Goals
                              </Label>
                              <Input
                                id="internshipGoal"
                                type="number"
                                value={partnershipData.internshipGoal}
                                onChange={(e) =>
                                  setPartnershipData((prev) => ({
                                    ...prev,
                                    internshipGoal:
                                      parseInt(e.target.value) || 0,
                                  }))
                                }
                                placeholder="5"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowCreateDialog(false);
                                setSelectedUniversity(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCreatePartnership}
                              disabled={
                                isLoading ||
                                !partnershipData.title ||
                                !selectedUniversity
                              }
                            >
                              {isLoading && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              )}
                              Create Partnership
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {partnerships.length === 0 ? (
                <div className="text-center py-8">
                  <School className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No University Partnerships
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start building relationships with universities to access top
                    talent
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Partnership
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <Card
                      key={partnership.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">
                                {partnership.title}
                              </h4>
                              <Badge
                                variant={
                                  partnership.status ===
                                  PartnershipStatus.ACTIVE
                                    ? "default"
                                    : partnership.status ===
                                        PartnershipStatus.PENDING
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {getPartnershipStatusLabel(partnership.status)}
                              </Badge>
                              <Badge variant="outline">
                                {getPartnershipPriorityLabel(
                                  partnership.priority
                                )}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <GraduationCap className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                {partnership.university?.name}
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {partnership.university?.city},{" "}
                                {partnership.university?.country}
                              </span>
                            </div>

                            {partnership.description && (
                              <p className="text-muted-foreground mb-4">
                                {partnership.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                  {partnership.annualHiringGoal}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Hiring Goal
                                </div>
                              </div>
                              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {partnership.studentsHired}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Students Hired
                                </div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                  {partnership.internshipGoal}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Internship Goal
                                </div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                  {partnership.internsHired}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Interns Hired
                                </div>
                              </div>
                            </div>

                            {partnership.partnershipType.length > 0 && (
                              <div className="mt-4">
                                <div className="text-sm font-medium mb-2">
                                  Partnership Types:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {partnership.partnershipType.map((type) => (
                                    <Badge
                                      key={type}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {getPartnershipTypeLabel(type)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {partnership.university?.website && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  window.open(
                                    partnership.university?.website,
                                    "_blank"
                                  )
                                }
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
