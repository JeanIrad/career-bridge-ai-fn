"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Edit3,
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Key,
  Shield,
  Edit,
  Camera,
  Users,
  Activity,
  Lock,
  Bell,
  Database,
  Heart,
  Languages,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useCurrentUser,
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  useUserStats,
  useUploadResume,
  useUploadPortfolio,
  useUploadCoverLetter,
  useUserDocuments,
  useDeleteDocument,
  useUploadGuidelines,
  type UpdateProfileData,
  type ChangePasswordData,
  type UserProfile,
  type Document,
} from "@/lib/actions/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  headline: string;
  role: string;
  city: string;
  country: string;
  address: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  languages: string[];
  interests: string[];
  visibility: string;
  isPublic: boolean;
  avatar: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: boolean;
}

interface NotificationSettings {
  securityAlerts: boolean;
  systemUpdates: boolean;
  userActivity: boolean;
  performanceReports: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Brazil",
  "India",
  "China",
  "South Korea",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Austria",
  "Belgium",
  "Spain",
  "Italy",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Arabic",
  "Hindi",
  "Italian",
  "Dutch",
  "Swedish",
];

const INTERESTS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Project Management",
  "Sales",
  "Research",
  "Consulting",
  "Entrepreneurship",
];

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const changePasswordMutation = useChangePassword();
  const uploadResumeMutation = useUploadResume();
  const uploadPortfolioMutation = useUploadPortfolio();
  const uploadCoverLetterMutation = useUploadCoverLetter();
  const userDocumentsMutation = useUserDocuments();
  const deleteDocumentMutation = useDeleteDocument();
  const uploadGuidelinesMutation = useUploadGuidelines();

  const [profileData, setProfileData] = useState<AdminProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    headline: "",
    role: "",
    city: "",
    country: "",
    address: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    languages: [],
    interests: [],
    visibility: "PUBLIC",
    isPublic: true,
    avatar: "",
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: true,
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      securityAlerts: true,
      systemUpdates: true,
      userActivity: false,
      performanceReports: true,
      emailNotifications: true,
      pushNotifications: false,
    });

  // Load user data when currentUser is available
  React.useEffect(() => {
    if (currentUser) {
      const userData = currentUser;
      setUser(userData);
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        bio: userData.bio || "",
        headline: userData.headline || "",
        role:
          userData.role === "SUPER_ADMIN"
            ? "Super Administrator"
            : "Administrator",
        city: userData.city || "",
        country: userData.country || "",
        address: userData.address || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        nationality: userData.nationality || "",
        languages: userData.languages || [],
        interests: userData.interests || [],
        visibility: userData.visibility || "PUBLIC",
        isPublic: userData.isPublic !== undefined ? userData.isPublic : true,
        avatar: userData.avatar || "",
      });
    }
  }, [currentUser]);

  // Dynamic admin stats based on real data
  const adminStats = [
    {
      label: "Users Managed",
      value: statsLoading
        ? "..."
        : userStats?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "System Uptime",
      value: "99.9%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      label: "Active Sessions",
      value: statsLoading
        ? "..."
        : userStats?.activeUsers?.toLocaleString() || "0",
      icon: Globe,
      color: "text-purple-600",
    },
    {
      label: "Data Processed",
      value: "2.4 TB",
      icon: Database,
      color: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      action: "Profile Updated",
      details: "Updated personal information and contact details",
      timestamp: "Just now",
      type: "profile",
      status: "success",
    },
    {
      action: "Security Settings Modified",
      details: "Enabled two-factor authentication",
      timestamp: "2 hours ago",
      type: "security",
      status: "success",
    },
    {
      action: "User Account Verified",
      details: "Verified employer account for TechCorp Solutions",
      timestamp: "1 day ago",
      type: "user",
      status: "success",
    },
    {
      action: "System Monitoring",
      details: "Reviewed system performance metrics",
      timestamp: "2 days ago",
      type: "system",
      status: "success",
    },
  ];

  // Validation functions
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  const validateRequired = (value: string, fieldName: string) => {
    if (!value.trim()) {
      toast.error(`${fieldName} is required`);
      return false;
    }
    return true;
  };

  const validateProfileData = () => {
    if (!validateRequired(profileData.firstName, "First Name")) return false;
    if (!validateRequired(profileData.lastName, "Last Name")) return false;

    if (
      profileData.phoneNumber &&
      !validatePhoneNumber(profileData.phoneNumber)
    ) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (profileData.bio && profileData.bio.length > 500) {
      toast.error("Bio must be less than 500 characters");
      return false;
    }

    if (profileData.headline && profileData.headline.length > 100) {
      toast.error("Headline must be less than 100 characters");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    // Validate profile data before saving
    if (!validateProfileData()) {
      return;
    }

    try {
      const updateData: UpdateProfileData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        headline: profileData.headline,
        bio: profileData.bio,
        city: profileData.city,
        country: profileData.country,
        address: profileData.address,
        state: profileData.state,
        zipCode: profileData.zipCode,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        nationality: profileData.nationality,
        languages: profileData.languages,
        interests: profileData.interests,
        visibility: profileData.visibility,
        isPublic: profileData.isPublic,
      };

      await updateProfileMutation.mutateAsync(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    if (currentUser) {
      const userData = currentUser;
      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        bio: userData.bio || "",
        headline: userData.headline || "",
        role:
          userData.role === "SUPER_ADMIN"
            ? "Super Administrator"
            : "Administrator",
        city: userData.city || "",
        country: userData.country || "",
        address: userData.address || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        nationality: userData.nationality || "",
        languages: userData.languages || [],
        interests: userData.interests || [],
        visibility: userData.visibility || "PUBLIC",
        isPublic: userData.isPublic !== undefined ? userData.isPublic : true,
        avatar: userData.avatar || "",
      });
    }
    setIsEditing(false);
    toast.success("Changes cancelled");
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  // Enhanced avatar upload functionality
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateImageFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
      setShowAvatarModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAvatarFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const confirmAvatarUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatarMutation.mutateAsync(selectedFile);
      setShowAvatarModal(false);
      setPreviewImage(null);
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  const cancelAvatarUpload = () => {
    setShowAvatarModal(false);
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSecurityChange = (
    key: keyof SecuritySettings,
    value: boolean
  ) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
    toast.success(
      `${key.replace(/([A-Z])/g, " $1").toLowerCase()} has been ${value ? "enabled" : "disabled"}.`
    );
  };

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(
      `${key.replace(/([A-Z])/g, " $1").toLowerCase()} has been ${value ? "enabled" : "disabled"}.`
    );
  };

  const updateProfileField = (field: keyof AdminProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const addLanguage = (language: string) => {
    if (!profileData.languages.includes(language)) {
      updateProfileField("languages", [...profileData.languages, language]);
    }
  };

  const removeLanguage = (language: string) => {
    updateProfileField(
      "languages",
      profileData.languages.filter((l) => l !== language)
    );
  };

  const addInterest = (interest: string) => {
    if (!profileData.interests.includes(interest)) {
      updateProfileField("interests", [...profileData.interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    updateProfileField(
      "interests",
      profileData.interests.filter((i) => i !== interest)
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      case "error":
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
  };

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    try {
      const data: ChangePasswordData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword,
      };

      await changePasswordMutation.mutateAsync(data);
      setShowChangePasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileInput}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your administrator account and system preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            disabled={updateProfileMutation.isPending}
            className="min-w-[140px]"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
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
          {isEditing && (
            <Button
              onClick={handleCancelEdit}
              disabled={updateProfileMutation.isPending}
              variant="outline"
              className="min-w-[140px]"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Admin Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo & Name */}
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div
                    className={cn(
                      "relative rounded-full transition-all duration-200",
                      "border-2 border-dashed border-transparent",
                      dragActive && "border-blue-500 bg-blue-50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Avatar className="w-24 h-24 cursor-pointer transition-all duration-200 group-hover:ring-4 group-hover:ring-blue-500/20">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl font-bold">
                        {getInitials(
                          profileData.firstName,
                          profileData.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>

                    {/* Upload overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Upload className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">Upload</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera button */}
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                    variant="default"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAvatarMutation.isPending}
                  >
                    {uploadAvatarMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Drag and drop hint */}
                  {dragActive && (
                    <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-blue-500 rounded-full bg-blue-50/80 flex items-center justify-center">
                      <div className="text-blue-600 text-center">
                        <Upload className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-xs font-medium">
                          Drop image here
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={profileData.firstName}
                        onChange={(e) =>
                          updateProfileField("firstName", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={profileData.lastName}
                        onChange={(e) =>
                          updateProfileField("lastName", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Administrator Role</Label>
                      <Input
                        id="role"
                        value={profileData.role}
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        value={profileData.headline}
                        onChange={(e) =>
                          updateProfileField("headline", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="e.g., Senior System Administrator"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={true} // Email usually can't be changed
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={profileData.phoneNumber || ""}
                      onChange={(e) =>
                        updateProfileField("phoneNumber", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={profileData.country}
                    onValueChange={(value) =>
                      updateProfileField("country", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) =>
                        updateProfileField("city", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="San Francisco"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        updateProfileField("dateOfBirth", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) =>
                      updateProfileField("gender", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Languages
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.languages.map((language) => (
                    <Badge
                      key={language}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {language}
                      {isEditing && (
                        <button
                          onClick={() => removeLanguage(language)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Select onValueChange={addLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.filter(
                        (lang) => !profileData.languages.includes(lang)
                      ).map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Professional Interests
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(interest)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Select onValueChange={addInterest}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add an interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERESTS.filter(
                        (interest) => !profileData.interests.includes(interest)
                      ).map((interest) => (
                        <SelectItem key={interest} value={interest}>
                          {interest}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => updateProfileField("bio", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us about your professional background and expertise..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Alternative Upload Area */}
              {isEditing && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <div
                    className="cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Upload Profile Picture
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Drag and drop or click to browse
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base font-medium">
                  Privacy Settings
                </Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile information
                    </p>
                  </div>
                  <Select
                    value={profileData.visibility}
                    onValueChange={(value) =>
                      updateProfileField("visibility", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="CONNECTIONS">
                        Connections Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your profile to appear in search results
                    </p>
                  </div>
                  <Switch
                    checked={profileData.isPublic}
                    onCheckedChange={(value) =>
                      updateProfileField("isPublic", value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(value) =>
                      handleSecurityChange("twoFactorAuth", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Login Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(value) =>
                      handleSecurityChange("loginNotifications", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">
                      Session Timeout
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.sessionTimeout}
                    onCheckedChange={(value) =>
                      handleSecurityChange("sessionTimeout", value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Download Backup Codes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Critical security events and threats
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(value) =>
                    handleNotificationChange("securityAlerts", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    System Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Platform updates and maintenance notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(value) =>
                    handleNotificationChange("systemUpdates", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">User Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    New user registrations and account changes
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.userActivity}
                  onCheckedChange={(value) =>
                    handleNotificationChange("userActivity", value)
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Performance Reports
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly system performance summaries
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.performanceReports}
                  onCheckedChange={(value) =>
                    handleNotificationChange("performanceReports", value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Document Management
              </CardTitle>
              <CardDescription>
                Upload and manage your professional documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Resume Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadResumeMutation.mutate(file);
                      }
                    }}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload Resume</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (5MB max)
                      </p>
                    </div>
                    {uploadResumeMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </label>
                </div>

                {/* Portfolio Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.zip,.jpg,.png,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadPortfolioMutation.mutate(file);
                      }
                    }}
                    className="hidden"
                    id="portfolio-upload"
                  />
                  <label
                    htmlFor="portfolio-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload Portfolio</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, ZIP, Images (50MB max)
                      </p>
                    </div>
                    {uploadPortfolioMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </label>
                </div>

                {/* Cover Letter Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadCoverLetterMutation.mutate(file);
                      }
                    }}
                    className="hidden"
                    id="cover-letter-upload"
                  />
                  <label
                    htmlFor="cover-letter-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload Cover Letter</p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, TXT (10MB max)
                      </p>
                    </div>
                    {uploadCoverLetterMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </label>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Your Documents</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => userDocumentsMutation.refetch()}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {userDocumentsMutation.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : userDocumentsMutation.data?.documents?.length > 0 ? (
                  <div className="space-y-3">
                    {userDocumentsMutation.data.documents.map(
                      (doc: Document) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {doc.documentType === "RESUME" && (
                                <User className="w-5 h-5 text-gray-600" />
                              )}
                              {doc.documentType === "PORTFOLIO" && (
                                <Database className="w-5 h-5 text-gray-600" />
                              )}
                              {doc.documentType === "COVER_LETTER" && (
                                <Mail className="w-5 h-5 text-gray-600" />
                              )}
                              {doc.documentType === "PROFILE_PICTURE" && (
                                <Camera className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {doc.originalName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{doc.fileSizeMB} MB</span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    doc.uploadedAt
                                  ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <Badge
                                  variant={
                                    doc.verificationStatus === "APPROVED"
                                      ? "default"
                                      : doc.verificationStatus === "REJECTED"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {doc.verificationStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deleteDocumentMutation.mutate(doc.id)
                              }
                              disabled={deleteDocumentMutation.isPending}
                            >
                              {deleteDocumentMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                    <p className="text-xs">
                      Upload your first document using the buttons above
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Guidelines */}
              {uploadGuidelinesMutation.data && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">
                    Upload Guidelines
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      •{" "}
                      {
                        uploadGuidelinesMutation.data.guidelines.general
                          .maxFileSize
                      }
                    </p>
                    <p>
                      •{" "}
                      {
                        uploadGuidelinesMutation.data.guidelines.general
                          .securityNote
                      }
                    </p>
                    <p>
                      •{" "}
                      {
                        uploadGuidelinesMutation.data.guidelines.general
                          .verificationNote
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Statistics</CardTitle>
              <CardDescription>
                Your platform management metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Access Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Access Level</CardTitle>
              <CardDescription>
                Your current permissions and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-emerald-700 block">
                      {profileData.role}
                    </span>
                    <span className="text-sm text-emerald-600">
                      Full system access granted
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    "Full System Access",
                    "User Management",
                    "Security Controls",
                    "Data Management",
                    "System Configuration",
                    "Analytics & Reporting",
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <CardDescription>
                Your recent administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-primary pl-4 pb-4 relative"
                  >
                    <div className="absolute -left-1.5 top-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{activity.action}</h4>
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showChangePasswordModal && (
        <Dialog
          open={showChangePasswordModal}
          onOpenChange={() => setShowChangePasswordModal(false)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>Enter your new password</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-password" className="text-right">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  type="password"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Button type="submit" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <Dialog
          open={showAvatarModal}
          onOpenChange={() => setShowAvatarModal(false)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Update Profile Picture
              </DialogTitle>
              <DialogDescription>
                Preview and confirm your new profile picture
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Current vs New Preview */}
              <div className="flex items-center justify-center gap-8">
                {/* Current Avatar */}
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Current
                  </div>
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold">
                      {getInitials(profileData.firstName, profileData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Arrow */}
                <div className="text-muted-foreground">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* New Avatar Preview */}
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    New
                  </div>
                  {previewImage ? (
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">File Name:</span>
                    <span className="text-muted-foreground">
                      {selectedFile.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">File Size:</span>
                    <span className="text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">File Type:</span>
                    <span className="text-muted-foreground">
                      {selectedFile.type}
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                <div className="font-medium mb-1">Image Guidelines:</div>
                <ul className="space-y-1">
                  <li>• Supported formats: PNG, JPG, JPEG, GIF, WebP</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Recommended: Square images (1:1 ratio)</li>
                  <li>• Minimum resolution: 200x200 pixels</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={cancelAvatarUpload}>
                Cancel
              </Button>
              <Button
                onClick={confirmAvatarUpload}
                disabled={uploadAvatarMutation.isPending || !selectedFile}
              >
                {uploadAvatarMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
