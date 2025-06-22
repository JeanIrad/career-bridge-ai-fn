import { getToken } from "./auth-utils";
import { API_URL } from "./config";

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry: string;
  size: string;
  type?: string;
  foundedYear?: number;
  specializations?: string[];
  phone?: string;
  email?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  isVerified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  locations?: CompanyLocation[];
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  documents?: CompanyDocument[];
  jobs?: any[];
  reviews?: any[];
  _count?: {
    jobs: number;
    experiences: number;
    reviews: number;
  };
}

export interface CompanyLocation {
  id: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  countryCode?: string;
  isHeadquarters: boolean;
  locationType?: string;
}

export interface CompanyDocument {
  id: string;
  documentType: string;
  originalName: string;
  cloudinaryUrl: string;
  verificationStatus: string;
  uploadedAt: string;
  verificationNotes?: string;
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  industry: string;
  size: string;
  website?: string;
  type?: string;
  foundedYear?: number;
  specializations?: string[];
  phone?: string;
  email?: string;
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  countryCode?: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {}

export interface CompanyQuery {
  search?: string;
  verified?: boolean;
  industry?: string;
  city?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface CompanyVerification {
  isApproved: boolean;
  notes?: string;
}

export interface BulkCompanyAction {
  companyIds: string[];
  action: "approve" | "reject" | "delete";
  notes?: string;
}

// Get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getFileUploadHeaders = () => {
  const token = getToken();
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ============= COMPANY MANAGEMENT =============

export const createCompany = async (
  data: CreateCompanyData
): Promise<Company> => {
  const response = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create company");
  }

  const result = await response.json();
  return result.data;
};

export const getMyCompanies = async (
  query?: CompanyQuery
): Promise<{
  companies: Company[];
  total: number;
  pagination: any;
}> => {
  const searchParams = new URLSearchParams();
  if (query?.search) searchParams.append("search", query.search);
  if (query?.verified !== undefined)
    searchParams.append("verified", query.verified.toString());
  if (query?.industry) searchParams.append("industry", query.industry);
  if (query?.city) searchParams.append("city", query.city);
  if (query?.country) searchParams.append("country", query.country);
  if (query?.page) searchParams.append("page", query.page.toString());
  if (query?.limit) searchParams.append("limit", query.limit.toString());

  const response = await fetch(
    `${API_URL}/companies/my-companies?${searchParams}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch companies");
  }

  return response.json();
};

export const getCompanyById = async (companyId: string): Promise<Company> => {
  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch company");
  }

  const result = await response.json();
  return result.data;
};

export const updateCompany = async (
  companyId: string,
  data: UpdateCompanyData
): Promise<Company> => {
  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update company");
  }

  const result = await response.json();
  return result.data;
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete company");
  }
};

// ============= DOCUMENT MANAGEMENT =============

export const getCompanyDocuments = async (
  companyId: string
): Promise<CompanyDocument[]> => {
  const response = await fetch(`${API_URL}/companies/${companyId}/documents`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch documents");
  }

  const result = await response.json();
  return result.data;
};

export const uploadCompanyDocument = async (
  companyId: string,
  file: File,
  documentType: string
): Promise<CompanyDocument> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const response = await fetch(
    `${API_URL}/companies/${companyId}/documents/upload`,
    {
      method: "POST",
      headers: getFileUploadHeaders(),
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload document");
  }

  const result = await response.json();
  return result.data;
};

// ============= ADMIN OPERATIONS =============

export const getAllCompanies = async (
  query?: CompanyQuery
): Promise<{
  companies: Company[];
  total: number;
  pagination: any;
}> => {
  const searchParams = new URLSearchParams();
  if (query?.search) searchParams.append("search", query.search);
  if (query?.verified !== undefined)
    searchParams.append("verified", query.verified.toString());
  if (query?.industry) searchParams.append("industry", query.industry);
  if (query?.city) searchParams.append("city", query.city);
  if (query?.country) searchParams.append("country", query.country);
  if (query?.page) searchParams.append("page", query.page.toString());
  if (query?.limit) searchParams.append("limit", query.limit.toString());

  const response = await fetch(`${API_URL}/companies?${searchParams}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch companies");
  }

  return response.json();
};

export const verifyCompany = async (
  companyId: string,
  verification: CompanyVerification
): Promise<Company> => {
  const response = await fetch(`${API_URL}/companies/${companyId}/verify`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(verification),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify company");
  }

  const result = await response.json();
  return result.data;
};

export const bulkCompanyAction = async (
  action: BulkCompanyAction
): Promise<any> => {
  const response = await fetch(`${API_URL}/companies/bulk-action`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(action),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to perform bulk action");
  }

  return response.json();
};

// ============= PUBLIC OPERATIONS =============

export const searchPublicCompanies = async (
  query?: CompanyQuery
): Promise<{
  companies: Company[];
  total: number;
  pagination: any;
}> => {
  const searchParams = new URLSearchParams();
  if (query?.search) searchParams.append("search", query.search);
  if (query?.industry) searchParams.append("industry", query.industry);
  if (query?.city) searchParams.append("city", query.city);
  if (query?.country) searchParams.append("country", query.country);
  if (query?.page) searchParams.append("page", query.page.toString());
  if (query?.limit) searchParams.append("limit", query.limit.toString());

  const response = await fetch(
    `${API_URL}/companies/public/search?${searchParams}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to search companies");
  }

  return response.json();
};

// ============= UTILITY FUNCTIONS =============

export const getDocumentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    BUSINESS_LICENSE: "Business License",
    COMPANY_REGISTRATION: "Company Registration",
    COMPANY_LOGO: "Company Logo",
    ID_DOCUMENT: "ID Document",
  };
  return labels[type] || type;
};

export const getVerificationStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    REQUIRES_RESUBMISSION: "Requires Resubmission",
  };
  return labels[status] || status;
};

export const getVerificationStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
    REQUIRES_RESUBMISSION: "orange",
  };
  return colors[status] || "gray";
};
