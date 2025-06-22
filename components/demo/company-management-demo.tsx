"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Shield,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";

export function CompanyManagementDemo() {
  const [activeTab, setActiveTab] = useState("overview");

  const mockCompanies = [
    {
      id: "1",
      name: "TechCorp Solutions",
      industry: "Technology",
      size: "100-500",
      isVerified: true,
      logo: null,
      completionScore: 95,
      documentsCount: 4,
      status: "verified",
    },
    {
      id: "2",
      name: "InnovateLab Inc",
      industry: "Software Development",
      size: "50-100",
      isVerified: false,
      logo: null,
      completionScore: 75,
      documentsCount: 2,
      status: "pending",
    },
    {
      id: "3",
      name: "DataFlow Analytics",
      industry: "Data Science",
      size: "20-50",
      isVerified: false,
      logo: null,
      completionScore: 60,
      documentsCount: 1,
      status: "incomplete",
    },
  ];

  const mockDocuments = [
    {
      id: "1",
      type: "BUSINESS_LICENSE",
      name: "Business License",
      fileName: "business_license_2024.pdf",
      status: "APPROVED",
      uploadedAt: "2024-01-15",
      required: true,
    },
    {
      id: "2",
      type: "COMPANY_REGISTRATION",
      name: "Company Registration",
      fileName: "company_registration.pdf",
      status: "APPROVED",
      uploadedAt: "2024-01-15",
      required: true,
    },
    {
      id: "3",
      type: "ID_DOCUMENT",
      name: "ID Document",
      fileName: "ceo_id_document.pdf",
      status: "PENDING",
      uploadedAt: "2024-01-16",
      required: true,
    },
    {
      id: "4",
      type: "COMPANY_LOGO",
      name: "Company Logo",
      fileName: "company_logo.png",
      status: "APPROVED",
      uploadedAt: "2024-01-14",
      required: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "incomplete":
        return (
          <Badge variant="outline">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Incomplete
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-600 text-xs">Approved</Badge>;
      case "PENDING":
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="text-xs">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Company Management System</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive solution for employer profile management with document
          verification, multi-company support, and admin approval workflow.
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <CardTitle>Multi-Company Management</CardTitle>
            <CardDescription>
              Employers can register and manage multiple companies with detailed
              profiles
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <CardTitle>Document Verification</CardTitle>
            <CardDescription>
              Secure document upload with admin review and approval process
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <CardTitle>Admin Approval</CardTitle>
            <CardDescription>
              Comprehensive admin dashboard for company verification and
              management
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Demo Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Demo</CardTitle>
          <CardDescription>
            Explore the company management features with this interactive demo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="companies">My Companies</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Company Information</span>
                        <Badge className="bg-green-600">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Required Documents</span>
                        <Badge variant="secondary">2 of 3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Admin Verification</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        75% Complete
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Companies</span>
                        <span className="font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Verified Companies</span>
                        <span className="font-semibold">1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Review</span>
                        <span className="font-semibold">2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Documents Uploaded</span>
                        <span className="font-semibold">7</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          TechCorp Solutions verified
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">
                          ID Document uploaded for InnovateLab Inc
                        </p>
                        <p className="text-xs text-muted-foreground">
                          1 day ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">
                          DataFlow Analytics awaiting documents
                        </p>
                        <p className="text-xs text-muted-foreground">
                          3 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="companies" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Companies</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </div>

              <div className="space-y-4">
                {mockCompanies.map((company) => (
                  <Card key={company.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                          {company.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold">
                              {company.name}
                            </h4>
                            {getStatusBadge(company.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {company.industry} • {company.size} employees
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${company.completionScore}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs">
                                {company.completionScore}%
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {company.documentsCount} documents
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Company Documents</h3>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <div className="space-y-4">
                {mockDocuments.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{document.name}</h4>
                              {document.required && (
                                <Badge variant="outline" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {document.fileName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getDocumentStatusBadge(document.status)}
                              <span className="text-xs text-muted-foreground">
                                Uploaded {document.uploadedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Document Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Business License</span>
                      <Badge className="bg-green-600">✓ Uploaded</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Company Registration</span>
                      <Badge className="bg-green-600">✓ Uploaded</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ID Document</span>
                      <Badge variant="secondary">⏳ Pending Review</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Company Logo</span>
                      <Badge variant="outline">Optional</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">3 companies</Badge>
                  <Badge variant="secondary">2 pending review</Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pending Verifications
                  </CardTitle>
                  <CardDescription>
                    Companies awaiting admin approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCompanies
                      .filter((c) => !c.isVerified)
                      .map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium">{company.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {company.industry} • {company.documentsCount}{" "}
                                documents
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Total Companies</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold">3</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Verified</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold">1</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="text-center">
                    <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-3xl font-bold">2</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Technical Features */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Key features and technologies used in this implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Backend Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Comprehensive company management API
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Document upload with Cloudinary integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Admin verification workflow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Multi-company support per employer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Role-based access control
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Bulk operations for admins
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Frontend Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Intuitive company profile management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Drag-and-drop document uploads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Real-time verification status
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Responsive design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Progress tracking and completion scores
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Admin dashboard for bulk operations
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
