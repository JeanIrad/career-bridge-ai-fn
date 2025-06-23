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
  User,
  Edit,
  Save,
  Camera,
  Upload,
  Shield,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Loader2,
  X,
  CheckCircle,
  AlertTriangle,
  Languages,
  Heart,
  Briefcase,
  GraduationCap,
  Building2,
} from "lucide-react";
import { EnhancedCountrySelect } from "@/components/ui/enhanced-country-select";
import { EnhancedPhoneInput } from "@/components/ui/enhanced-phone-input";
import {
  updateUserProfile,
  changePassword,
  uploadAvatar,
  getCurrentUser,
} from "@/lib/api-user-profile";
import { EmployerProfileEnhanced } from "./employer-profile-enhanced";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Hindi",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Turkish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
];

const INTERESTS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Human Resources",
  "Operations",
  "Consulting",
  "Real Estate",
  "Media & Entertainment",
  "Transportation",
  "Energy",
  "Agriculture",
  "Non-profit",
  "Government",
  "Startups",
  "Innovation",
  "Leadership",
  "Entrepreneurship",
  "Sustainability",
  "Digital Transformation",
];

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public", description: "Visible to everyone" },
  {
    value: "CONNECTIONS",
    label: "Connections",
    description: "Visible to connections only",
  },
  { value: "PRIVATE", label: "Private", description: "Only visible to you" },
];

interface UserProfile {
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

interface UpdateProfileData {
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

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function CompanyProfile() {
  return <EmployerProfileEnhanced />;
  const { user, refetch } = useCurrentUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form states
  const [editData, setEditData] = useState<UpdateProfileData>({});
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user?.role === "EMPLOYER") {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await getCurrentUser();
      setProfile(profileData.data);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (!profile) return;

    setEditData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      zipCode: profile.zipCode || "",
      country: profile.country || "",
      dateOfBirth: profile.dateOfBirth || "",
      gender: profile.gender || "",
      nationality: profile.nationality || "",
      languages: profile.languages || [],
      interests: profile.interests || [],
      headline: profile.headline || "",
      bio: profile.bio || "",
      socialLinks: profile.socialLinks || {},
      visibility: profile.visibility || "PUBLIC",
      isPublic: profile.isPublic ?? true,
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await updateUserProfile(editData);
      setProfile(updatedProfile.data);
      setIsEditing(false);
      setEditData({});
      await refetch();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      await changePassword(passwordData);
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      const result = await uploadAvatar(file);
      if (profile) {
        setProfile({ ...profile, avatar: result.data.avatar });
      }
      await refetch();
      toast.success("Profile picture updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getProfileCompletionScore = (): number => {
    if (!profile) return 0;

    const fields = [
      profile.firstName,
      profile.lastName,
      profile.phoneNumber,
      profile.headline,
      profile.bio,
      profile.city,
      profile.country,
      profile.avatar,
    ];

    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = editData.languages || [];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((l) => l !== language)
      : [...currentLanguages, language];

    setEditData((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = editData.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];

    setEditData((prev) => ({ ...prev, interests: updatedInterests }));
  };

  if (!user || user?.role !== "EMPLOYER") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            This page is only available to employers.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground">
            Unable to load your profile. Please try again.
          </p>
          <Button onClick={loadProfile} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personal Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAvatarUpload(file);
                      }
                    }}
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  {profile.headline && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.headline}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge
                      variant={profile.isVerified ? "default" : "secondary"}
                    >
                      {profile.isVerified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Unverified
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="w-full">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span className="font-medium">
                      {getProfileCompletionScore()}%
                    </span>
                  </div>
                  <Progress
                    value={getProfileCompletionScore()}
                    className="h-2"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 w-full text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">Employer</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact & Location</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Your personal details and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={
                          isEditing
                            ? editData.firstName || ""
                            : profile.firstName
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={
                          isEditing ? editData.lastName || "" : profile.lastName
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      placeholder="e.g., Senior Talent Acquisition Manager"
                      value={
                        isEditing
                          ? editData.headline || ""
                          : profile.headline || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          headline: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      placeholder="Tell us about yourself and your professional background..."
                      value={isEditing ? editData.bio || "" : profile.bio || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          isEditing
                            ? editData.dateOfBirth || ""
                            : profile.dateOfBirth || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select
                          value={editData.gender || ""}
                          onValueChange={(value) =>
                            setEditData((prev) => ({ ...prev, gender: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((gender) => (
                              <SelectItem
                                key={gender.value}
                                value={gender.value}
                              >
                                {gender.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={
                            GENDERS.find((g) => g.value === profile.gender)
                              ?.label || ""
                          }
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      placeholder="e.g., American, Canadian, British"
                      value={
                        isEditing
                          ? editData.nationality || ""
                          : profile.nationality || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          nationality: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Languages
                  </CardTitle>
                  <CardDescription>
                    Select the languages you speak
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                      {LANGUAGES.map((language) => (
                        <Button
                          key={language}
                          variant={
                            editData.languages?.includes(language)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleLanguageToggle(language)}
                        >
                          {language}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.languages && profile.languages.length > 0 ? (
                        profile.languages.map((language) => (
                          <Badge key={language} variant="secondary">
                            {language}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No languages specified
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Professional Interests
                  </CardTitle>
                  <CardDescription>
                    Select your areas of professional interest
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                      {INTERESTS.map((interest) => (
                        <Button
                          key={interest}
                          variant={
                            editData.interests?.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleInterestToggle(interest)}
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No interests specified
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Your contact details and location information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      {isEditing ? (
                        <EnhancedPhoneInput
                          value={editData.phoneNumber || ""}
                          onChange={(value) =>
                            setEditData((prev) => ({
                              ...prev,
                              phoneNumber: value,
                            }))
                          }
                        />
                      ) : (
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={profile.phoneNumber || ""}
                            disabled
                            className="pl-10"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={
                          isEditing
                            ? editData.address || ""
                            : profile.address || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={
                          isEditing ? editData.city || "" : profile.city || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="State or Province"
                        value={
                          isEditing ? editData.state || "" : profile.state || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="ZIP or Postal Code"
                        value={
                          isEditing
                            ? editData.zipCode || ""
                            : profile.zipCode || ""
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    {isEditing ? (
                      <EnhancedCountrySelect
                        value={editData.country || ""}
                        onChange={(value) =>
                          setEditData((prev) => ({ ...prev, country: value }))
                        }
                      />
                    ) : (
                      <Input value={profile.country || ""} disabled />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                  <CardDescription>
                    Connect your professional social media profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={
                        isEditing
                          ? editData.socialLinks?.linkedin || ""
                          : profile.socialLinks?.linkedin || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            linkedin: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourusername"
                      value={
                        isEditing
                          ? editData.socialLinks?.twitter || ""
                          : profile.socialLinks?.twitter || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            twitter: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={
                        isEditing
                          ? editData.socialLinks?.website || ""
                          : profile.socialLinks?.website || ""
                      }
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            website: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Visibility</CardTitle>
                  <CardDescription>
                    Control who can see your profile and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Profile Visibility</Label>
                    {isEditing ? (
                      <Select
                        value={editData.visibility || "PUBLIC"}
                        onValueChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            visibility: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VISIBILITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">
                                  {option.label}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {option.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">
                          {
                            VISIBILITY_OPTIONS.find(
                              (o) => o.value === profile.visibility
                            )?.label
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {
                            VISIBILITY_OPTIONS.find(
                              (o) => o.value === profile.visibility
                            )?.description
                          }
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Public Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow your profile to be discoverable in search results
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="isPublic" className="sr-only">
                        Public Profile
                      </Label>
                      <input
                        id="isPublic"
                        type="checkbox"
                        checked={
                          isEditing
                            ? (editData.isPublic ?? true)
                            : (profile.isPublic ?? true)
                        }
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            isPublic: e.target.checked,
                          }))
                        }
                        disabled={!isEditing}
                        className="rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Last changed:{" "}
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Dialog
                      open={showPasswordDialog}
                      onOpenChange={setShowPasswordDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new one.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showPasswordCurrent ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowPasswordCurrent(!showPasswordCurrent)
                                }
                              >
                                {showPasswordCurrent ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showPasswordNew ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowPasswordNew(!showPasswordNew)
                                }
                              >
                                {showPasswordNew ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showPasswordConfirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowPasswordConfirm(!showPasswordConfirm)
                                }
                              >
                                {showPasswordConfirm ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowPasswordDialog(false)}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleChangePassword}
                            disabled={
                              isLoading ||
                              !passwordData.currentPassword ||
                              !passwordData.newPassword ||
                              !passwordData.confirmPassword
                            }
                          >
                            {isLoading && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Change Password
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  </div>

                  <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      Account Security Tips
                    </h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>Use a strong, unique password</li>
                      <li>Enable two-factor authentication when available</li>
                      <li>Regularly review your account activity</li>
                      <li>Keep your contact information up to date</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
