import { getToken } from "./auth-utils";
import { API_URL } from "./config";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  interests?: string[];
  headline?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: any;
  visibility?: string;
  isPublic?: boolean;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  interests?: string[];
  headline?: string;
  bio?: string;
  socialLinks?: any;
  visibility?: string;
  isPublic?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

// ============= USER PROFILE MANAGEMENT =============

export const getCurrentUser = async (): Promise<{
  success: boolean;
  data: UserProfile;
}> => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user profile");
  }

  return response.json();
};

export const updateUserProfile = async (
  data: UpdateUserProfileData
): Promise<{
  success: boolean;
  message: string;
  data: UserProfile;
}> => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return response.json();
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await fetch(`${API_URL}/users/me/change-password`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to change password");
  }

  return response.json();
};

export const uploadAvatar = async (
  file: File
): Promise<{
  success: boolean;
  message: string;
  data: { avatar: string };
}> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(`${API_URL}/users/me/avatar`, {
    method: "POST",
    headers: getFileUploadHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload avatar");
  }

  return response.json();
};

export const uploadResume = async (
  file: File
): Promise<{
  success: boolean;
  message: string;
  data: { resume: string };
}> => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_URL}/users/me/resume`, {
    method: "POST",
    headers: getFileUploadHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload resume");
  }

  return response.json();
};

// ============= UTILITY FUNCTIONS =============

export const getGenderLabel = (gender: string): string => {
  const labels: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
  };
  return labels[gender] || gender;
};

export const getVisibilityLabel = (visibility: string): string => {
  const labels: Record<string, string> = {
    PUBLIC: "Public",
    CONNECTIONS: "Connections Only",
    PRIVATE: "Private",
  };
  return labels[visibility] || visibility;
};

export const getVisibilityDescription = (visibility: string): string => {
  const descriptions: Record<string, string> = {
    PUBLIC: "Visible to everyone",
    CONNECTIONS: "Visible to connections only",
    PRIVATE: "Only visible to you",
  };
  return descriptions[visibility] || "";
};

export const formatPhoneNumber = (phone: string): string => {
  // Basic phone number formatting
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
