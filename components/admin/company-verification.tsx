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
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText,
  ExternalLink,
  Download,
  User,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Loader2,
  MoreVertical,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import {
  Company,
  CompanyDocument,
  CompanyQuery,
  type CompanyVerification,
  BulkCompanyAction,
  getAllCompanies,
  getCompanyById,
  verifyCompany,
  bulkCompanyAction,
  getCompanyDocuments,
  getDocumentTypeLabel,
  getVerificationStatusLabel,
  getVerificationStatusColor,
} from "@/lib/api-companies";

export function CompanyVerification() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState<CompanyQuery>({
    search: "",
    verified: undefined,
    industry: "",
    city: "",
    country: "",
    page: 1,
    limit: 10,
  });

  // Verification form state
  const [verificationData, setVerificationData] = useState<CompanyVerification>(
    {
      isApproved: true,
      notes: "",
    }
  );

  useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
      loadCompanies();
    }
  }, [user, filters]);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const result = await getAllCompanies(filters);
      setCompanies(result.companies);
      setPagination(result.pagination);
    } catch (error: any) {
      toast.error(error.message || "Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanyDetails = async (companyId: string) => {
    try {
      const [company, docs] = await Promise.all([
        getCompanyById(companyId),
        getCompanyDocuments(companyId),
      ]);
      setSelectedCompany(company);
      setDocuments(docs);
      setShowCompanyDetails(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to load company details");
    }
  };

  const handleVerifyCompany = async () => {
    if (!selectedCompany) return;

    try {
      setIsLoading(true);
      const updatedCompany = await verifyCompany(
        selectedCompany.id,
        verificationData
      );

      // Update the company in the list
      setCompanies((prev) =>
        prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c))
      );
      setSelectedCompany(updatedCompany);
      setShowVerificationDialog(false);
      setVerificationData({ isApproved: true, notes: "" });

      toast.success(
        `Company ${verificationData.isApproved ? "approved" : "rejected"} successfully`
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to verify company");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCompanies.length === 0) {
      toast.error("Please select companies first");
      return;
    }

    try {
      setIsLoading(true);
      const bulkAction: BulkCompanyAction = {
        companyIds: selectedCompanies,
        action: action as any,
        notes: verificationData.notes,
      };

      const result = await bulkCompanyAction(bulkAction);

      // Refresh the companies list
      await loadCompanies();
      setSelectedCompanies([]);

      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Failed to perform bulk action");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (company: Company) => {
    if (company.isVerified) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }

    // Check if has required documents
    const requiredDocs = documents.filter((d) =>
      ["BUSINESS_LICENSE", "COMPANY_REGISTRATION", "ID_DOCUMENT"].includes(
        d.documentType
      )
    );

    if (requiredDocs.length < 3) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }

    const pendingDocs = requiredDocs.filter(
      (d) => d.verificationStatus === "PENDING"
    );
    if (pendingDocs.length > 0) {
      return <Clock className="w-4 h-4 text-blue-600" />;
    }

    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusText = (company: Company) => {
    if (company.isVerified) return "Verified";
    return "Pending Review";
  };

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            This page is only available to administrators.
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
          <h1 className="text-3xl font-bold">Company Verification</h1>
          <p className="text-muted-foreground">
            Review and approve company registrations and documents
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {companies.length} companies
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {companies.filter((c) => !c.isVerified).length} pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search companies..."
                  value={filters.search || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-status">Verification Status</Label>
              <Select
                value={
                  filters.verified === undefined
                    ? "all"
                    : filters.verified.toString()
                }
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    verified: value === "all" ? undefined : value === "true",
                    page: 1,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="Filter by industry..."
                value={filters.industry || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    industry: e.target.value,
                    page: 1,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Filter by city..."
                value={filters.city || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    city: e.target.value,
                    page: 1,
                  }))
                }
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCompanies.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-medium">
                {selectedCompanies.length} companies selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  disabled={isLoading}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve All
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("reject")}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCompanies([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle>Companies</CardTitle>
          <CardDescription>
            Click on a company to view details and verify documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
              <p className="text-muted-foreground">
                No companies match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => loadCompanyDetails(company.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setSelectedCompanies((prev) => [...prev, company.id]);
                      } else {
                        setSelectedCompanies((prev) =>
                          prev.filter((id) => id !== company.id)
                        );
                      }
                    }}
                    className="rounded"
                  />

                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{company.name}</h3>
                      {getStatusIcon(company)}
                      <Badge
                        variant={company.isVerified ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {getStatusText(company)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {company.industry} • {company.size} employees
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {company.owner?.firstName} {company.owner?.lastName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {company.owner?.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {company.locations?.[0]?.city},{" "}
                        {company.locations?.[0]?.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCompany(company);
                      setVerificationData({
                        isApproved: !company.isVerified,
                        notes: "",
                      });
                      setShowVerificationDialog(true);
                    }}
                  >
                    {company.isVerified ? "Revoke" : "Verify"}
                  </Button>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} companies
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: prev.page! - 1,
                        }))
                      }
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: prev.page! + 1,
                        }))
                      }
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      <Dialog open={showCompanyDetails} onOpenChange={setShowCompanyDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Review company information and documents for verification
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Company Information</TabsTrigger>
                <TabsTrigger value="documents">
                  Documents ({documents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Company Name
                      </Label>
                      <p className="text-sm">{selectedCompany.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Industry</Label>
                      <p className="text-sm">{selectedCompany.industry}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Company Size
                      </Label>
                      <p className="text-sm">
                        {selectedCompany.size} employees
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Founded</Label>
                      <p className="text-sm">
                        {selectedCompany.foundedYear || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Owner</Label>
                      <p className="text-sm">
                        {selectedCompany.owner?.firstName}{" "}
                        {selectedCompany.owner?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedCompany.owner?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Website</Label>
                      <p className="text-sm">
                        {selectedCompany.website ? (
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {selectedCompany.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm">
                        {selectedCompany.locations?.[0] ? (
                          <>
                            {selectedCompany.locations[0].address &&
                              `${selectedCompany.locations[0].address}, `}
                            {selectedCompany.locations[0].city},{" "}
                            {selectedCompany.locations[0].state &&
                              `${selectedCompany.locations[0].state}, `}
                            {selectedCompany.locations[0].country}
                          </>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedCompany.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">
                      {selectedCompany.description}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                    <p className="text-muted-foreground">
                      This company hasn't uploaded any documents yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {getDocumentTypeLabel(document.documentType)}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {document.originalName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  document.verificationStatus === "APPROVED"
                                    ? "default"
                                    : document.verificationStatus === "REJECTED"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {getVerificationStatusLabel(
                                  document.verificationStatus
                                )}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  document.uploadedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {document.verificationNotes && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Note: {document.verificationNotes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(document.cloudinaryUrl, "_blank")
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const link = window.document.createElement("a");
                              link.href = document.cloudinaryUrl;
                              link.download = document.originalName;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCompanyDetails(false)}
            >
              Close
            </Button>
            {selectedCompany && (
              <Button
                onClick={() => {
                  setVerificationData({
                    isApproved: !selectedCompany.isVerified,
                    notes: "",
                  });
                  setShowVerificationDialog(true);
                }}
              >
                {selectedCompany.isVerified
                  ? "Revoke Verification"
                  : "Verify Company"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationData.isApproved
                ? "Approve Company"
                : "Reject Company"}
            </DialogTitle>
            <DialogDescription>
              {verificationData.isApproved
                ? "This will mark the company as verified and approved for posting jobs."
                : "This will reject the company verification. Please provide a reason."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-notes">
                {verificationData.isApproved
                  ? "Approval Notes (Optional)"
                  : "Rejection Reason *"}
              </Label>
              <Textarea
                id="verification-notes"
                placeholder={
                  verificationData.isApproved
                    ? "Add any notes about the approval..."
                    : "Please explain why the company is being rejected..."
                }
                value={verificationData.notes}
                onChange={(e) =>
                  setVerificationData((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowVerificationDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyCompany}
              disabled={
                isLoading ||
                (!verificationData.isApproved &&
                  !verificationData.notes?.trim())
              }
              variant={verificationData.isApproved ? "default" : "destructive"}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {verificationData.isApproved
                ? "Approve Company"
                : "Reject Company"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
