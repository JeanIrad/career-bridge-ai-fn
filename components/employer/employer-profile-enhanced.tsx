"use client";

import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
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
  Upload,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  ExternalLink,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
  CompanyDocument,
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadCompanyDocument,
  getCompanyDocuments,
  getDocumentTypeLabel,
  getVerificationStatusLabel,
  getVerificationStatusColor,
} from "@/lib/api-companies";
import { EmployerUniversities } from "./employer-universities";

const DOCUMENT_TYPES = [
  { value: "BUSINESS_LICENSE", label: "Business License", required: true },
  {
    value: "COMPANY_REGISTRATION",
    label: "Company Registration",
    required: true,
  },
  { value: "ID_DOCUMENT", label: "ID Document", required: true },
  { value: "COMPANY_LOGO", label: "Company Logo", required: false },
];

const COMPANY_TYPES = [
  "Private",
  "Public",
  "Non-profit",
  "Government",
  "Startup",
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Real Estate",
  "Media & Entertainment",
  "Transportation",
  "Energy",
  "Agriculture",
  "Other",
];

export function EmployerProfileEnhanced() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewCompanyDialog, setShowNewCompanyDialog] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(
    null
  );

  // Form states
  const [newCompanyData, setNewCompanyData] = useState<CreateCompanyData>({
    name: "",
    description: "",
    industry: "",
    size: "",
    city: "",
    country: "",
  });

  const [editData, setEditData] = useState<UpdateCompanyData>({});

  const handleCompanySelect = async (company: Company) => {
    // Clear documents before setting new company
    setDocuments([]);
    setSelectedCompany(company);

    // Only load documents if the company is not newly created
    if (
      !company.createdAt ||
      new Date(company.createdAt).getTime() !== new Date().getTime()
    ) {
      await loadDocuments(company.id);
    }
  };

  useEffect(() => {
    if (user?.role === "EMPLOYER") {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const result = await getMyCompanies();
      setCompanies(result.companies);
      if (result.companies.length > 0 && !selectedCompany) {
        handleCompanySelect(result.companies[0]); // Use handleCompanySelect instead of direct setState
      }
    } catch (error) {
      toast.error("Failed to load companies");
      console.error("Error loading companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async (companyId: string) => {
    try {
      setIsLoadingDocuments(true);
      const docs = await getCompanyDocuments(companyId);
      setDocuments(docs);
    } catch (error) {
      toast.error("Failed to load documents");
      console.error("Error loading documents:", error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleCreateCompany = async () => {
    try {
      setIsLoading(true);
      const company = await createCompany(newCompanyData);

      // Add the new company to the list
      setCompanies((prev) => [company, ...prev]);

      // Clear documents and select the new company without loading documents
      setDocuments([]);
      setSelectedCompany(company);

      setShowNewCompanyDialog(false);
      setNewCompanyData({
        name: "",
        description: "",
        industry: "",
        size: "",
        city: "",
        country: "",
      });
      toast.success("Company created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;

    try {
      setIsLoading(true);
      const updatedCompany = await updateCompany(selectedCompany.id, editData);
      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setSelectedCompany(updatedCompany);
      setIsEditing(false);
      setEditData({});
      toast.success("Company updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      setIsLoading(true);
      await deleteCompany(companyId);
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      if (selectedCompany?.id === companyId) {
        setSelectedCompany(companies.length > 1 ? companies[0] : null);
      }
      toast.success("Company deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (!selectedCompany) return;

    try {
      setUploadingDocument(documentType);
      const document = await uploadCompanyDocument(
        selectedCompany.id,
        file,
        documentType
      );
      setDocuments((prev) => [
        document,
        ...prev.filter((d) => d.documentType !== documentType),
      ]);
      toast.success("Document uploaded successfully");

      // If it's a logo, update the company data
      if (documentType === "COMPANY_LOGO") {
        setSelectedCompany((prev) =>
          prev ? { ...prev, logo: document.cloudinaryUrl } : null
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingDocument(null);
    }
  };

  const getCompanyCompletionScore = (company: Company): number => {
    const fields = [
      company.name,
      company.description,
      company.industry,
      company.size,
      company.website,
      company.email,
      company.phone,
      company.locations?.[0]?.address,
    ];
    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    const requiredDocs = documents.filter(
      (d) =>
        ["BUSINESS_LICENSE", "COMPANY_REGISTRATION", "ID_DOCUMENT"].includes(
          d.documentType
        ) && d.verificationStatus === "APPROVED"
    ).length;

    return Math.round(
      (filledFields / fields.length) * 60 + (requiredDocs / 3) * 40
    );
  };

  const getVerificationStatus = (company: Company) => {
    if (company.isVerified) return "verified";
    const requiredDocs = documents.filter((d) =>
      ["BUSINESS_LICENSE", "COMPANY_REGISTRATION", "ID_DOCUMENT"].includes(
        d.documentType
      )
    );
    if (requiredDocs.length < 3) return "incomplete";
    const pendingDocs = requiredDocs.filter(
      (d) => d.verificationStatus === "PENDING"
    );
    if (pendingDocs.length > 0) return "pending";
    const rejectedDocs = requiredDocs.filter(
      (d) => d.verificationStatus === "REJECTED"
    );
    if (rejectedDocs.length > 0) return "rejected";
    return "review";
  };

  const getDocumentCompletionScore = (docs: CompanyDocument[]): number => {
    const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
    const uploadedRequiredDocs = docs.filter((d) =>
      requiredDocs.some((rd) => rd.value === d.documentType)
    );
    return Math.round(
      (uploadedRequiredDocs.length / requiredDocs.length) * 100
    );
  };

  const getMissingRequiredDocuments = (docs: CompanyDocument[]): string[] => {
    const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
    return requiredDocs
      .filter((rd) => !docs.some((d) => d.documentType === rd.value))
      .map((d) => d.label);
  };

  if (!user || user.role !== "EMPLOYER") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            This page is only available to employers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Company Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your companies, upload documents, and track verification
            status
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={showNewCompanyDialog}
            onOpenChange={setShowNewCompanyDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Company</DialogTitle>
                <DialogDescription>
                  Add a new company to your profile. All companies require admin
                  approval.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-company-name">Company Name *</Label>
                    <Input
                      id="new-company-name"
                      value={newCompanyData.name}
                      onChange={(e) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-industry">Industry *</Label>
                    <Select
                      value={newCompanyData.industry}
                      onValueChange={(value) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          industry: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-size">Company Size *</Label>
                    <Select
                      value={newCompanyData.size}
                      onValueChange={(value) =>
                        setNewCompanyData((prev) => ({ ...prev, size: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size} employees
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-type">Company Type</Label>
                    <Select
                      value={newCompanyData.type || ""}
                      onValueChange={(value) =>
                        setNewCompanyData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={newCompanyData.description || ""}
                    onChange={(e) =>
                      setNewCompanyData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your company..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-website">Website</Label>
                    <Input
                      id="new-website"
                      value={newCompanyData.website || ""}
                      onChange={(e) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-founded">Founded Year</Label>
                    <Input
                      id="new-founded"
                      type="number"
                      value={newCompanyData.foundedYear || ""}
                      onChange={(e) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          foundedYear: parseInt(e.target.value),
                        }))
                      }
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-city">City *</Label>
                    <Input
                      id="new-city"
                      value={newCompanyData.city}
                      onChange={(e) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-country">Country *</Label>
                    <Input
                      id="new-country"
                      value={newCompanyData.country}
                      onChange={(e) =>
                        setNewCompanyData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewCompanyDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCompany}
                    disabled={
                      isLoading ||
                      !newCompanyData.name ||
                      !newCompanyData.industry ||
                      !newCompanyData.size ||
                      !newCompanyData.city ||
                      !newCompanyData.country
                    }
                  >
                    {isLoading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Create Company
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && companies.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Companies Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first company profile to start posting jobs and
              connecting with candidates.
            </p>
            <Button onClick={() => setShowNewCompanyDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Company
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Companies</CardTitle>
                <CardDescription>Select a company to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {companies.map((company) => {
                  const completionScore = getCompanyCompletionScore(company);
                  const verificationStatus = getVerificationStatus(company);

                  return (
                    <div
                      key={company.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCompany?.id === company.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border hover:bg-accent"
                      }`}
                      onClick={() => handleCompanySelect(company)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            company.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {company.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {company.industry}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress
                              value={completionScore}
                              className="flex-1 h-1"
                            />
                            <span className="text-xs text-muted-foreground">
                              {completionScore}%
                            </span>
                          </div>
                          <div className="mt-1">
                            {company.isVerified ? (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-600"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : verificationStatus === "pending" ? (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending Review
                              </Badge>
                            ) : verificationStatus === "rejected" ? (
                              <Badge variant="destructive" className="text-xs">
                                <XCircle className="w-3 h-3 mr-1" />
                                Rejected
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Incomplete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCompany && (
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Company Profile</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="universities">
                    University Partners
                  </TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  {/* Company Information */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Company Information</CardTitle>
                          <CardDescription>
                            Basic company details and description
                          </CardDescription>
                        </div>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          onClick={() => {
                            if (isEditing) {
                              handleUpdateCompany();
                            } else {
                              setIsEditing(true);
                              setEditData({
                                name: selectedCompany.name,
                                description: selectedCompany.description,
                                industry: selectedCompany.industry,
                                size: selectedCompany.size,
                                website: selectedCompany.website,
                                type: selectedCompany.type,
                                foundedYear: selectedCompany.foundedYear,
                                phone: selectedCompany.phone,
                                email: selectedCompany.email,
                                linkedIn: selectedCompany.linkedIn,
                                twitter: selectedCompany.twitter,
                                facebook: selectedCompany.facebook,
                              });
                            }
                          }}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
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
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Company Logo & Name */}
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                            {selectedCompany.logo ? (
                              <img
                                src={selectedCompany.logo}
                                alt={selectedCompany.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              selectedCompany.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          {isEditing && (
                            <Button
                              size="sm"
                              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                              onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement)
                                    .files?.[0];
                                  if (file) {
                                    handleDocumentUpload(file, "COMPANY_LOGO");
                                  }
                                };
                                input.click();
                              }}
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
                                value={
                                  isEditing
                                    ? editData.name || ""
                                    : selectedCompany.name
                                }
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="industry">Industry</Label>
                              {isEditing ? (
                                <Select
                                  value={editData.industry || ""}
                                  onValueChange={(value) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      industry: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {INDUSTRIES.map((industry) => (
                                      <SelectItem
                                        key={industry}
                                        value={industry}
                                      >
                                        {industry}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={selectedCompany.industry}
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company-size">Company Size</Label>
                              {isEditing ? (
                                <Select
                                  value={editData.size || ""}
                                  onValueChange={(value) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      size: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {COMPANY_SIZES.map((size) => (
                                      <SelectItem key={size} value={size}>
                                        {size} employees
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={`${selectedCompany.size} employees`}
                                  disabled
                                />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="founded">Founded</Label>
                              <Input
                                id="founded"
                                type="number"
                                value={
                                  isEditing
                                    ? editData.foundedYear || ""
                                    : selectedCompany.foundedYear || ""
                                }
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    foundedYear: parseInt(e.target.value),
                                  }))
                                }
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
                          value={
                            isEditing
                              ? editData.description || ""
                              : selectedCompany.description || ""
                          }
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="Describe your company..."
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={
                              isEditing
                                ? editData.website || ""
                                : selectedCompany.website || ""
                            }
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                website: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="https://company.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Company Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={
                              isEditing
                                ? editData.email || ""
                                : selectedCompany.email || ""
                            }
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            placeholder="contact@company.com"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      {selectedCompany.locations?.[0] && (
                        <div className="space-y-2">
                          <Label>Headquarters</Label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {selectedCompany.locations[0].address &&
                                `${selectedCompany.locations[0].address}, `}
                              {selectedCompany.locations[0].city},{" "}
                              {selectedCompany.locations[0].state &&
                                `${selectedCompany.locations[0].state}, `}
                              {selectedCompany.locations[0].country}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Verification Status */}
                      <div className="p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">
                                Verification Status
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Complete profile and upload required documents
                                for verification
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {getCompanyCompletionScore(selectedCompany)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Complete
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={getCompanyCompletionScore(selectedCompany)}
                          className="mt-3"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Company Documents</CardTitle>
                          <CardDescription>
                            Upload required documents for {selectedCompany.name}
                            's verification
                          </CardDescription>
                        </div>
                        <Dialog
                          open={showDocumentUpload}
                          onOpenChange={setShowDocumentUpload}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Upload Document for {selectedCompany.name}
                              </DialogTitle>
                              <DialogDescription>
                                Select the type of document you want to upload
                                for this company
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {DOCUMENT_TYPES.map((docType) => {
                                const existingDoc = documents.find(
                                  (d) => d.documentType === docType.value
                                );
                                const isUploading =
                                  uploadingDocument === docType.value;

                                return (
                                  <div
                                    key={docType.value}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-5 h-5 text-blue-600" />
                                      <div>
                                        <h4 className="font-medium">
                                          {docType.label}
                                          {docType.required && (
                                            <span className="text-red-500 ml-1">
                                              *
                                            </span>
                                          )}
                                        </h4>
                                        {existingDoc && (
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                              variant={
                                                existingDoc.verificationStatus ===
                                                "APPROVED"
                                                  ? "default"
                                                  : existingDoc.verificationStatus ===
                                                      "REJECTED"
                                                    ? "destructive"
                                                    : "secondary"
                                              }
                                              className="text-xs"
                                            >
                                              {getVerificationStatusLabel(
                                                existingDoc.verificationStatus
                                              )}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                              {new Date(
                                                existingDoc.uploadedAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {existingDoc && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            window.open(
                                              existingDoc.cloudinaryUrl,
                                              "_blank"
                                            )
                                          }
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          const input =
                                            document.createElement("input");
                                          input.type = "file";
                                          input.accept =
                                            docType.value === "COMPANY_LOGO"
                                              ? "image/*"
                                              : ".pdf,.jpg,.jpeg,.png";
                                          input.onchange = (e) => {
                                            const file = (
                                              e.target as HTMLInputElement
                                            ).files?.[0];
                                            if (file) {
                                              handleDocumentUpload(
                                                file,
                                                docType.value
                                              );
                                            }
                                          };
                                          input.click();
                                        }}
                                        disabled={isUploading}
                                      >
                                        {isUploading ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Upload className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Loading {selectedCompany.name}'s documents...
                            </p>
                          </div>
                        </div>
                      ) : documents.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Documents Uploaded for {selectedCompany.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Upload required documents to verify this company
                          </p>
                          <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                              Required Documents for Company Verification:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                              {DOCUMENT_TYPES.filter((d) => d.required).map(
                                (doc) => (
                                  <li key={doc.value}>{doc.label}</li>
                                )
                              )}
                            </ul>
                          </div>
                          <Button onClick={() => setShowDocumentUpload(true)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload First Document
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Document Verification Progress */}
                          <div className="p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                  <h4 className="font-medium">
                                    Document Verification Progress for{" "}
                                    {selectedCompany.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Upload all required documents for company
                                    verification
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {getDocumentCompletionScore(documents)}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Complete
                                </div>
                              </div>
                            </div>
                            <Progress
                              value={getDocumentCompletionScore(documents)}
                              className="mb-4"
                            />

                            {/* Missing Documents Warning */}
                            {getMissingRequiredDocuments(documents).length >
                              0 && (
                              <div className="p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                                <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                  Missing Required Documents for{" "}
                                  {selectedCompany.name}:
                                </h5>
                                <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300">
                                  {getMissingRequiredDocuments(documents).map(
                                    (doc) => (
                                      <li key={doc}>{doc}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Document List */}
                          <div className="space-y-4">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {getDocumentTypeLabel(doc.documentType)}
                                      {DOCUMENT_TYPES.find(
                                        (d) => d.value === doc.documentType
                                      )?.required && (
                                        <span className="text-red-500 ml-1">
                                          *
                                        </span>
                                      )}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {doc.originalName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant={
                                          doc.verificationStatus === "APPROVED"
                                            ? "default"
                                            : doc.verificationStatus ===
                                                "REJECTED"
                                              ? "destructive"
                                              : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {getVerificationStatusLabel(
                                          doc.verificationStatus
                                        )}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(
                                          doc.uploadedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {doc.verificationNotes && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Note: {doc.verificationNotes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open(doc.cloudinaryUrl, "_blank")
                                    }
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = doc.cloudinaryUrl;
                                      link.download = doc.originalName;
                                      link.click();
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="universities" className="space-y-6">
                  <EmployerUniversities />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Settings</CardTitle>
                      <CardDescription>
                        Manage company preferences and danger zone
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Recruitment Settings */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Recruitment Preferences</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Accept Unsolicited Applications</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow students to apply even without specific
                                job postings
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Campus Recruitment</Label>
                              <p className="text-sm text-muted-foreground">
                                Participate in university career fairs and
                                events
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Remote Work Options</Label>
                              <p className="text-sm text-muted-foreground">
                                Offer remote or hybrid work arrangements
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                        <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                          Danger Zone
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                          Once you delete a company, there is no going back.
                          Please be certain.
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Company
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the company "
                                {selectedCompany.name}" and remove all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCompany(selectedCompany.id)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Company
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
